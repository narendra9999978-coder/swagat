/**
 * SWAGAT Backend API Client Service Layer
 * Connects frontend React components to the SWAGAT Go/Gin REST API on :8080
 */

const API_BASE_URL = '/api'; // Proxied via Vite dev server to http://localhost:8080

// Local Storage Keys
const TOKEN_KEY = 'swagat_auth_token';
const USER_KEY = 'swagat_auth_user';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'applicant' | 'department_admin' | 'super_admin';
}

export interface AuthResponse {
  token: string;
  user_id?: string;
  role?: string;
  user?: AuthUser;
}

export interface BusinessType {
  id: string;
  name: string;
  created_at?: string;
}

export interface Department {
  id: string;
  name: string;
  sla_hours: number;
}

export interface StartApplicationPayload {
  business_type_id: string;
  pan?: string;
  entity_name?: string;
}

export interface ApplicationResponse {
  id: string;
  applicant_id: string;
  business_type_id: string;
  status: 'in_progress' | 'submitted' | 'dispatched' | 'completed';
  created_at: string;
  submitted_at?: string;
}

export interface ChecklistDocument {
  id: string;
  application_id: string;
  document_type_name: string;
  department_name: string;
  is_mandatory: boolean;
  file_url?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'expired' | 'waiting_on_dependency';
  reused_from_vault: boolean;
}

export interface BundleStatus {
  id: string;
  department_name: string;
  status: 'pending' | 'in_review' | 'approved' | 'deemed_approved' | 'breached';
  dispatched_at?: string;
  sla_deadline?: string;
  reassigned_count: number;
  documents: ChecklistDocument[];
}

export interface ApplicationStatusResponse {
  application: ApplicationResponse;
  bundles: BundleStatus[];
}

// Token helper utilities
export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredAuth = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// Generic fetch wrapper with automatic Bearer token injection
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove leading slash if present to avoid double slashes with proxy
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMessage = `HTTP Error ${res.status}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Fallback to status text
        errorMessage = res.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await res.json() as T;
  } catch (err: any) {
    console.warn(`[SWAGAT API] Call to ${endpoint} failed:`, err.message);
    throw err;
  }
}

// Check Backend Health
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch('/healthz');
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
};

// ============================================================
// 1. AUTHENTICATION APIS
// ============================================================
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const user: AuthUser = res.user || {
      id: res.user_id || 'usr-default',
      email,
      full_name: email.split('@')[0],
      role: (res.role as any) || 'applicant',
    };
    setStoredAuth(res.token, user);
    return { ...res, user };
  },

  register: async (
    email: string,
    password: string,
    fullName: string,
    role: 'applicant' | 'department_admin' | 'super_admin' = 'applicant'
  ): Promise<AuthResponse> => {
    const res = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        role,
      }),
    });
    const user: AuthUser = res.user || {
      id: res.user_id || 'usr-default',
      email,
      full_name: fullName,
      role,
    };
    setStoredAuth(res.token, user);
    return { ...res, user };
  },

  logout: () => {
    clearStoredAuth();
  },
};

// ============================================================
// 2. APPLICANT APIS
// ============================================================
export const applicantApi = {
  // Read available business types
  getBusinessTypes: async (): Promise<BusinessType[]> => {
    return request<BusinessType[]>('/apply/business-types');
  },

  // Start new application
  startApplication: async (payload: StartApplicationPayload): Promise<ApplicationResponse> => {
    return request<ApplicationResponse>('/apply/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Walk a step in the tree
  walkStep: async (businessTypeId: string, step: string) => {
    return request<any>(`/apply/walk?business_type_id=${businessTypeId}&step=${step}`);
  },

  // Submit answer for a leaf node
  answerLeaf: async (applicationId: string, step: string, leafNodeId: string, pathNodeIds: string[]) => {
    return request<any>('/apply/answer', {
      method: 'POST',
      body: JSON.stringify({
        application_id: applicationId,
        step,
        leaf_node_id: leafNodeId,
        path_node_ids: pathNodeIds,
      }),
    });
  },

  // Build checklist of required documents (with Once-Only vault indicators)
  getChecklist: async (applicationId: string): Promise<ChecklistDocument[]> => {
    return request<ChecklistDocument[]>(`/apply/applications/${applicationId}/checklist`);
  },

  // Upload document file
  uploadDocument: async (appDocId: string, fileUrl: string): Promise<any> => {
    return request<any>(`/apply/documents/${appDocId}/upload`, {
      method: 'POST',
      body: JSON.stringify({ file_url: fileUrl }),
    });
  },

  // Submit complete application for parallel departmental dispatch
  submitApplication: async (applicationId: string): Promise<any> => {
    return request<any>(`/apply/applications/${applicationId}/submit`, {
      method: 'POST',
    });
  },

  // Real-time SLA Status Dashboard
  getStatus: async (applicationId: string): Promise<ApplicationStatusResponse> => {
    return request<ApplicationStatusResponse>(`/apply/applications/${applicationId}/status`);
  },
};

// ============================================================
// 3. DEPARTMENT ADMIN APIS
// ============================================================
export const deptAdminApi = {
  getQueue: async (): Promise<any[]> => {
    return request<any[]>('/dept/queue');
  },

  approveDocument: async (appDocId: string): Promise<any> => {
    return request<any>(`/dept/documents/${appDocId}/approve`, {
      method: 'POST',
    });
  },

  rejectDocument: async (appDocId: string, reason: string): Promise<any> => {
    return request<any>(`/dept/documents/${appDocId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  reuploadDocument: async (appDocId: string, fileUrl: string): Promise<any> => {
    return request<any>(`/dept/documents/${appDocId}/reupload`, {
      method: 'POST',
      body: JSON.stringify({ file_url: fileUrl }),
    });
  },
};

// ============================================================
// 4. SUPER ADMIN APIS
// ============================================================
export const adminApi = {
  getDepartments: async (): Promise<Department[]> => {
    return request<Department[]>('/admin/departments');
  },

  createDepartment: async (name: string, slaHours: number): Promise<Department> => {
    return request<Department>('/admin/departments', {
      method: 'POST',
      body: JSON.stringify({ name, sla_hours: slaHours }),
    });
  },

  getBusinessTypes: async (): Promise<BusinessType[]> => {
    return request<BusinessType[]>('/admin/business-types');
  },

  createBusinessType: async (name: string): Promise<BusinessType> => {
    return request<BusinessType>('/admin/business-types', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
};
