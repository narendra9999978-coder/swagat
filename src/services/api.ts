/**
 * SWAGAT Backend API Client Service Layer
 * Connects frontend React components to the SWAGAT Go/Gin REST API.
 * All calls try real backend first; on failure they return mock fallback data.
 */

import { getSectorRootQuestion, SECTOR_TREES, normalizeSectorCode } from '../data/sectorDecisionTrees';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

// Local Storage Keys
const TOKEN_KEY = 'swagat_auth_token';
const USER_KEY  = 'swagat_auth_user';

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

// Token helper utilities
export const getStoredToken = (): string | null => localStorage.getItem(TOKEN_KEY);

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
  try { return JSON.parse(data); } catch { return null; }
};

// Generic fetch wrapper with automatic Bearer token injection
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorMessage = `HTTP Error ${res.status}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch { errorMessage = res.statusText || errorMessage; }
      throw new Error(errorMessage);
    }
    return await res.json() as T;
  } catch (err: any) {
    // If local/relative path fetch failed, attempt direct Render backend fallback
    if (!API_BASE_URL && !url.startsWith('http')) {
      try {
        const directRes = await fetch(`https://swagat-backend.onrender.com${cleanEndpoint}`, { ...options, headers });
        if (directRes.ok) {
          return await directRes.json() as T;
        }
      } catch {}
    }
    throw err;
  }
}

// Check Backend Health & Database Connectivity
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const target = API_BASE_URL ? `${API_BASE_URL}/healthz` : '/healthz';
    const res = await fetch(target);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'ok') return true;
    }
  } catch {}

  // Fallback to direct Render healthz check
  try {
    const res2 = await fetch('https://swagat-backend.onrender.com/healthz');
    if (res2.ok) {
      const d2 = await res2.json();
      return d2.status === 'ok';
    }
  } catch {}

  return false;
};

// ============================================================
// 1. AUTHENTICATION APIs
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
      body: JSON.stringify({ email, password, full_name: fullName, role }),
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

  googleAuth: async (
    email: string,
    fullName: string,
    role: 'applicant' | 'super_admin' | 'USER' | 'ADMIN' = 'applicant'
  ): Promise<AuthResponse> => {
    const normalizedRole = (role === 'ADMIN' || role === 'super_admin') ? 'super_admin' : 'applicant';
    const res = await request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ email, full_name: fullName, role: normalizedRole }),
    });
    const user: AuthUser = res.user || {
      id: res.user_id || 'usr-default',
      email,
      full_name: fullName,
      role: normalizedRole,
    };
    setStoredAuth(res.token, user);
    return { ...res, user };
  },

  logout: () => clearStoredAuth(),
};

// ============================================================
// 2. APPLICANT APIs
// ============================================================

export interface BusinessTypeAPI {
  id: string;
  name: string;
  code?: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface TreeNodeAPI {
  id: string;
  label: string;
  node_type: 'question' | 'option';
  is_leaf: boolean;
  sort_order: number;
  step?: string;
}

export interface ApplicationDraftResponse {
  id: string;
  applicant_id: string;
  business_type_id: string;
  status: 'in_progress' | 'submitted' | 'dispatched' | 'completed';
  created_at: string;
  submitted_at?: string;
}

export interface ChecklistDocumentAPI {
  id: string;
  application_id: string;
  document_type_name: string;
  department_name: string;
  is_mandatory: boolean;
  file_url?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'expired' | 'waiting_on_dependency';
  reused_from_vault: boolean;
}

export interface BundleStatusAPI {
  id: string;
  department_id: string;
  department_name: string;
  status: 'pending' | 'in_review' | 'approved' | 'deemed_approved' | 'breached';
  dispatched_at?: string;
  sla_deadline?: string;
  sla_hours: number;
  reassigned_count: number;
  documents: ChecklistDocumentAPI[];
}

export interface ApplicationStatusResponseAPI {
  application: {
    id: string;
    status: string;
    business_type_name?: string;
    created_at: string;
    submitted_at?: string;
  };
  bundles: BundleStatusAPI[];
}

// Mock fallback data ──────────────────────────────────────────────────────────

const MOCK_BUSINESS_TYPES: BusinessTypeAPI[] = [
  { id: 'bt-hotel', name: 'Hotel & Hospitality', code: 'HOTEL', description: 'Hotels, resorts, restaurants, tourism lodges' },
  { id: 'bt-petro', name: 'Petroleum & Fuel Retail', code: 'PETRO', description: 'Retail outlets, fuel stations, LPG storage, refineries' },
  { id: 'bt-leather', name: 'Leather & Footwear', code: 'LEATHER', description: 'Tanneries, leather goods, footwear manufacturing' },
  { id: 'bt-food', name: 'Food Processing & Packaging', code: 'FOOD', description: 'Agro-processing, dairy, beverage, cold storage' },
  { id: 'bt-mfg', name: 'General Manufacturing', code: 'MFG', description: 'Engineering, fabrication, auto parts, assembly' },
  { id: 'bt-it', name: 'IT / Software Services', code: 'IT_ITES', description: 'Tech parks, software development, data centres' },
  { id: 'bt-pharma', name: 'Pharmaceutical & Life Sciences', code: 'PHARMA', description: 'Bulk drugs, formulations, medical devices' },
  { id: 'bt-re', name: 'Renewable Energy', code: 'RENEWABLE', description: 'Solar farms, wind power, biomass plants' },
  { id: 'bt-textile', name: 'Textile & Apparel', code: 'TEXTILE', description: 'Spinning, weaving, dyeing, garment export' },
  { id: 'bt-mining', name: 'Mining & Minerals', code: 'MINING', description: 'Quarrying, mineral extraction, processing' },
];

export function getMockRootNode(businessTypeIdOrStep: string, step?: string): TreeNodeAPI[] {
  const actualStep = step || (['business_registration', 'business_activity', 'foreign_investment', 'project_land'].includes(businessTypeIdOrStep) ? businessTypeIdOrStep : 'business_registration');
  const sectorCode = normalizeSectorCode(step ? businessTypeIdOrStep : 'HOTEL');
  const q = getSectorRootQuestion(sectorCode, actualStep as any);
  if (!q) return [];

  const nodes: TreeNodeAPI[] = [
    { id: q.id, label: q.question, node_type: 'question', is_leaf: false, sort_order: 0 }
  ];

  (q.options || []).forEach((opt, idx) => {
    nodes.push({
      id: opt.id,
      label: opt.label,
      node_type: 'option',
      is_leaf: opt.isLeaf,
      sort_order: idx + 1,
    });
  });

  return nodes;
}

export function getMockNodeChildren(nodeId: string, step: string, businessTypeId?: string): TreeNodeAPI[] {
  const sectorCode = normalizeSectorCode(businessTypeId || 'HOTEL');
  const tree = SECTOR_TREES[sectorCode] || SECTOR_TREES.HOTEL;
  const questions = tree.steps[step as any] || [];

  // 1. Check if nodeId is an option
  for (const q of questions) {
    const opt = q.options.find(o => o.id === nodeId);
    if (opt) {
      if (opt.isLeaf || !opt.nextQuestionId) {
        return [];
      }
      const nextQ = questions.find(item => item.id === opt.nextQuestionId);
      if (nextQ) {
        return [
          { id: nextQ.id, label: nextQ.question, node_type: 'question', is_leaf: false, sort_order: 0 },
          ...nextQ.options.map((o, idx) => ({
            id: o.id,
            label: o.label,
            node_type: 'option' as const,
            is_leaf: o.isLeaf,
            sort_order: idx + 1,
          }))
        ];
      }
    }
  }

  // 2. Check if nodeId is a question ID directly
  const directQ = questions.find(q => q.id === nodeId);
  if (directQ) {
    return directQ.options.map((o, idx) => ({
      id: o.id,
      label: o.label,
      node_type: 'option' as const,
      is_leaf: o.isLeaf,
      sort_order: idx + 1,
    }));
  }

  // 3. Fallback to root question
  return getMockRootNode(sectorCode, step);
}

const MOCK_CHECKLIST: ChecklistDocumentAPI[] = [
  { id: 'cdoc-1', application_id: 'app-mock', document_type_name: 'Certificate of Incorporation / MOA + AOA', department_name: 'Ministry of Corporate Affairs', is_mandatory: true, status: 'pending_review', reused_from_vault: false },
  { id: 'cdoc-2', application_id: 'app-mock', document_type_name: 'PAN Card (Entity)', department_name: 'Income Tax Department', is_mandatory: true, status: 'approved', reused_from_vault: true, file_url: '#vault' },
  { id: 'cdoc-3', application_id: 'app-mock', document_type_name: 'GST Registration Certificate', department_name: 'GST Council / CBIC', is_mandatory: true, status: 'approved', reused_from_vault: true, file_url: '#vault' },
  { id: 'cdoc-4', application_id: 'app-mock', document_type_name: 'Environmental Impact Assessment (EIA) Report', department_name: 'State Pollution Control Board', is_mandatory: true, status: 'pending_review', reused_from_vault: false },
  { id: 'cdoc-5', application_id: 'app-mock', document_type_name: 'Factory / Plant Layout Blueprint', department_name: 'Directorate of Industrial Safety & Health', is_mandatory: true, status: 'pending_review', reused_from_vault: false },
  { id: 'cdoc-6', application_id: 'app-mock', document_type_name: 'Chartered Engineer Structural Certificate', department_name: 'Directorate of Industrial Safety & Health', is_mandatory: false, status: 'pending_review', reused_from_vault: false },
  { id: 'cdoc-7', application_id: 'app-mock', document_type_name: 'Land Title / Possession Letter / Lease Deed', department_name: 'Revenue & Land Records Dept', is_mandatory: true, status: 'pending_review', reused_from_vault: false },
  { id: 'cdoc-8', application_id: 'app-mock', document_type_name: 'Fire Safety Undertaking Form', department_name: 'Directorate of Fire Services', is_mandatory: true, status: 'pending_review', reused_from_vault: false },
];

function getMockStatusResponse(appId: string): ApplicationStatusResponseAPI {
  const now = Date.now();
  return {
    application: {
      id: appId,
      status: 'dispatched',
      business_type_name: 'General Manufacturing',
      created_at: new Date(now - 3600000).toISOString(),
      submitted_at: new Date(now - 1800000).toISOString(),
    },
    bundles: [
      {
        id: 'bnd-1',
        department_id: 'dept-mpcb',
        department_name: 'Pollution Control Board',
        status: 'in_review',
        dispatched_at: new Date(now - 1800000).toISOString(),
        sla_deadline: new Date(now + 72 * 3600000 - 1800000).toISOString(),
        sla_hours: 72,
        reassigned_count: 0,
        documents: [],
      },
      {
        id: 'bnd-2',
        department_id: 'dept-fire',
        department_name: 'Fire Services',
        status: 'pending',
        dispatched_at: new Date(now - 1800000).toISOString(),
        sla_deadline: new Date(now + 48 * 3600000 - 1800000).toISOString(),
        sla_hours: 48,
        reassigned_count: 0,
        documents: [],
      },
      {
        id: 'bnd-3',
        department_id: 'dept-dish',
        department_name: 'Industrial Safety & Health',
        status: 'approved',
        dispatched_at: new Date(now - 3600000).toISOString(),
        sla_deadline: new Date(now + 24 * 3600000).toISOString(),
        sla_hours: 24,
        reassigned_count: 0,
        documents: [],
      },
      {
        id: 'bnd-4',
        department_id: 'dept-revenue',
        department_name: 'Revenue & Land Records',
        status: 'breached',
        dispatched_at: new Date(now - 48 * 3600000).toISOString(),
        sla_deadline: new Date(now - 12 * 3600000).toISOString(),
        sla_hours: 36,
        reassigned_count: 1,
        documents: [],
      },
    ],
  };
}

const MOCK_DEPT_QUEUE: any[] = [];

// ── Applicant API ─────────────────────────────────────────────────────────────

export const applicantApi = {
  getBusinessTypes: async (): Promise<BusinessTypeAPI[]> => {
    try { return await request<BusinessTypeAPI[]>('/apply/business-types'); }
    catch { return MOCK_BUSINESS_TYPES; }
  },

  getNodeChildren: async (nodeId: string, step: string, businessTypeId?: string): Promise<TreeNodeAPI[]> => {
    try {
      const res = await request<any>(`/apply/walk?node_id=${nodeId}&step=${step}`);
      const list: TreeNodeAPI[] = Array.isArray(res) ? res : res?.children || [];
      if (list.length > 0) return list;
      return getMockNodeChildren(nodeId, step, businessTypeId);
    } catch {
      return getMockNodeChildren(nodeId, step, businessTypeId);
    }
  },

  getRootNodes: async (businessTypeId: string, step: string): Promise<TreeNodeAPI[]> => {
    try {
      const res = await request<any>(`/apply/walk?business_type_id=${businessTypeId}&step=${step}`);
      const list: TreeNodeAPI[] = Array.isArray(res) ? res : res?.children || [];
      if (list.length > 0) return list;
      return getMockRootNode(businessTypeId, step);
    } catch {
      return getMockRootNode(businessTypeId, step);
    }
  },

  createDraft: async (businessTypeId: string): Promise<ApplicationDraftResponse> => {
    try {
      return await request<ApplicationDraftResponse>('/apply/applications', {
        method: 'POST',
        body: JSON.stringify({ business_type_id: businessTypeId }),
      });
    } catch {
      return {
        id: `app-mock-${Date.now()}`,
        applicant_id: 'usr-mock',
        business_type_id: businessTypeId,
        status: 'in_progress',
        created_at: new Date().toISOString(),
      };
    }
  },

  getChecklist: async (applicationId: string): Promise<ChecklistDocumentAPI[]> => {
    try { return await request<ChecklistDocumentAPI[]>(`/apply/applications/${applicationId}/checklist`); }
    catch { return MOCK_CHECKLIST.map(d => ({ ...d, application_id: applicationId })); }
  },

  uploadDocument: async (appDocId: string, file: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('app_doc_id', appDocId);
      const token = getStoredToken();
      const res = await fetch(`${API_BASE_URL}/apply/documents/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      return await res.json();
    } catch {
      return { id: appDocId, status: 'pending_review', file_url: URL.createObjectURL(file) };
    }
  },

  submitApplication: async (applicationId: string): Promise<any> => {
    try {
      return await request<any>(`/apply/applications/${applicationId}/submit`, { method: 'POST' });
    } catch {
      return { success: true, message: 'Application submitted (mock)' };
    }
  },

  getStatus: async (applicationId: string): Promise<ApplicationStatusResponseAPI> => {
    try { return await request<ApplicationStatusResponseAPI>(`/apply/applications/${applicationId}/status`); }
    catch { return getMockStatusResponse(applicationId); }
  },
};

// ── Department Admin API ──────────────────────────────────────────────────────

export const deptAdminApi = {
  getQueue: async (): Promise<any[]> => {
    try { return await request<any[]>('/department-admin/queue'); }
    catch { return MOCK_DEPT_QUEUE; }
  },

  approveDocument: async (docId: string): Promise<any> => {
    try {
      return await request<any>(`/department-admin/documents/${docId}/approve`, { method: 'POST' });
    } catch {
      return { success: true };
    }
  },

  rejectDocument: async (docId: string, reason: string): Promise<any> => {
    try {
      return await request<any>(`/department-admin/documents/${docId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    } catch {
      return { success: true };
    }
  },
};

// ── Super Admin API ───────────────────────────────────────────────────────────

export interface DepartmentAPI {
  id: string;
  name: string;
  sla_hours: number;
  admin_count?: number;
}

export const superAdminApi = {
  getBusinessTypes: async (): Promise<BusinessTypeAPI[]> => {
    try { return await request<BusinessTypeAPI[]>('/admin/business-types'); }
    catch { return MOCK_BUSINESS_TYPES; }
  },

  createBusinessType: async (input: string | { name: string; code?: string; description?: string; icon?: string; is_active?: boolean }): Promise<BusinessTypeAPI> => {
    const name = typeof input === 'string' ? input : input.name;
    const payload = typeof input === 'string' ? { name } : input;
    try {
      return await request<BusinessTypeAPI>('/admin/business-types', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return {
        id: `bt-${Date.now()}`,
        name,
        code: typeof input === 'object' ? input.code : undefined,
        description: typeof input === 'object' ? input.description : undefined,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }
  },

  importTree: async (businessTypeId: string, jsonFileOrData: File | any): Promise<any> => {
    try {
      if (jsonFileOrData instanceof File) {
        const formData = new FormData();
        formData.append('file', jsonFileOrData);
        const token = getStoredToken();
        const res = await fetch(`${API_BASE_URL}/admin/business-types/${businessTypeId}/import`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (!res.ok) throw new Error('Import failed');
        return await res.json();
      } else {
        return await request<any>(`/admin/business-types/${businessTypeId}/import`, {
          method: 'POST',
          body: JSON.stringify(jsonFileOrData),
        });
      }
    } catch {
      if (jsonFileOrData instanceof File) {
        const text = await jsonFileOrData.text().catch(() => '{}');
        try { return { success: true, preview: JSON.parse(text) }; }
        catch { return { success: true, preview: null }; }
      }
      return { success: true, preview: jsonFileOrData };
    }
  },

  getDepartments: async (): Promise<DepartmentAPI[]> => {
    try { return await request<DepartmentAPI[]>('/admin/departments'); }
    catch {
      return [
        { id: 'dept-mpcb', name: 'Pollution Control Board', sla_hours: 72, admin_count: 2 },
        { id: 'dept-fire', name: 'Directorate of Fire Services', sla_hours: 48, admin_count: 1 },
        { id: 'dept-dish', name: 'Industrial Safety & Health', sla_hours: 60, admin_count: 0 },
        { id: 'dept-rev', name: 'Revenue & Land Records', sla_hours: 96, admin_count: 1 },
        { id: 'dept-labour', name: 'Labour Commissioner Office', sla_hours: 48, admin_count: 0 },
      ];
    }
  },

  createDepartment: async (nameOrDept: string | { name: string; code?: string; ministry?: string; default_sla_hours?: number; email?: string }, slaHours?: number): Promise<DepartmentAPI> => {
    const name = typeof nameOrDept === 'string' ? nameOrDept : nameOrDept.name;
    const hours = typeof nameOrDept === 'string' ? (slaHours || 48) : (nameOrDept.default_sla_hours || 48);
    try {
      return await request<DepartmentAPI>('/admin/departments', {
        method: 'POST',
        body: JSON.stringify(typeof nameOrDept === 'string' ? { name, sla_hours: hours } : nameOrDept),
      });
    } catch {
      return { id: `dept-${Date.now()}`, name, sla_hours: hours, admin_count: 0 };
    }
  },
};
