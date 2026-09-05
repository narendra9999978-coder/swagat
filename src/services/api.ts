/**
 * SWAGAT Backend API Client Service Layer
 * Connects frontend React components to the SWAGAT Go/Gin REST API.
 * All calls try real backend first; on failure they return mock fallback data.
 */

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
  const url = `${API_BASE_URL}${cleanEndpoint}`;

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
}

// Check Backend Health
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/healthz`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch { return false; }
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

const MOCK_TREES: Record<string, Record<string, TreeNodeAPI[]>> = {
  'business_registration': {
    root: [
      { id: 'br-q1', label: 'What type of legal entity will be registered?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'br-q1': [
      { id: 'br-o1', label: 'Private Limited Company (Pvt Ltd)', node_type: 'option', is_leaf: true, sort_order: 0 },
      { id: 'br-o2', label: 'Limited Liability Partnership (LLP)', node_type: 'option', is_leaf: true, sort_order: 1 },
      { id: 'br-o3', label: 'Proprietorship / Sole Trader', node_type: 'option', is_leaf: true, sort_order: 2 },
      { id: 'br-o4', label: 'Partnership Firm', node_type: 'option', is_leaf: true, sort_order: 3 },
      { id: 'br-o5', label: 'Public Limited Company (Ltd)', node_type: 'option', is_leaf: true, sort_order: 4 },
    ],
  },
  'business_activity': {
    root: [
      { id: 'ba-q1', label: 'What is the primary business activity scale?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'ba-q1': [
      { id: 'ba-o1', label: 'Micro (Investment < ₹1 Crore)', node_type: 'option', is_leaf: false, sort_order: 0 },
      { id: 'ba-o2', label: 'Small (Investment ₹1 Cr – ₹10 Cr)', node_type: 'option', is_leaf: false, sort_order: 1 },
      { id: 'ba-o3', label: 'Medium (Investment ₹10 Cr – ₹50 Cr)', node_type: 'option', is_leaf: false, sort_order: 2 },
      { id: 'ba-o4', label: 'Large (Investment > ₹50 Crore)', node_type: 'option', is_leaf: false, sort_order: 3 },
    ],
    'ba-o1': [
      { id: 'ba-q2a', label: 'Will you employ workers at the facility?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'ba-q2a': [
      { id: 'ba-o2a1', label: 'Yes, 1 to 10 workers', node_type: 'option', is_leaf: true, sort_order: 0 },
      { id: 'ba-o2a2', label: 'No workers / fully automated', node_type: 'option', is_leaf: true, sort_order: 1 },
    ],
    'ba-o2': [
      { id: 'ba-q2b', label: 'Does the business involve hazardous materials or chemicals?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'ba-q2b': [
      { id: 'ba-o2b1', label: 'Yes, Schedule 1 chemicals listed under EPA', node_type: 'option', is_leaf: true, sort_order: 0 },
      { id: 'ba-o2b2', label: 'No hazardous materials', node_type: 'option', is_leaf: true, sort_order: 1 },
    ],
    'ba-o3': [
      { id: 'ba-q2c', label: 'Does the business involve hazardous materials or chemicals?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'ba-q2c': [
      { id: 'ba-o2c1', label: 'Yes, Schedule 1/2 chemicals', node_type: 'option', is_leaf: true, sort_order: 0 },
      { id: 'ba-o2c2', label: 'Standard industrial solvents', node_type: 'option', is_leaf: true, sort_order: 1 },
      { id: 'ba-o2c3', label: 'No hazardous materials', node_type: 'option', is_leaf: true, sort_order: 2 },
    ],
    'ba-o4': [
      { id: 'ba-q2d', label: 'Does the project generate industrial effluents?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'ba-q2d': [
      { id: 'ba-o2d1', label: 'Yes, requires ETP / ZLD plant', node_type: 'option', is_leaf: true, sort_order: 0 },
      { id: 'ba-o2d2', label: 'Minimal effluents (dry process)', node_type: 'option', is_leaf: true, sort_order: 1 },
    ],
  },
  'foreign_investment': {
    root: [
      { id: 'fi-q1', label: 'Does the project involve Foreign Direct Investment (FDI)?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'fi-q1': [
      { id: 'fi-o1', label: 'No — 100% Domestic Capital', node_type: 'option', is_leaf: true, sort_order: 0 },
      { id: 'fi-o2', label: 'Yes — FDI is involved', node_type: 'option', is_leaf: false, sort_order: 1 },
    ],
    'fi-o2': [
      { id: 'fi-q2', label: 'What percentage of equity is from foreign investors?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'fi-q2': [
      { id: 'fi-o2a', label: 'Less than 26% (Minority stake)', node_type: 'option', is_leaf: true, sort_order: 0 },
      { id: 'fi-o2b', label: '26% to 74%', node_type: 'option', is_leaf: true, sort_order: 1 },
      { id: 'fi-o2c', label: '75% to 100% (FDI-dominant)', node_type: 'option', is_leaf: true, sort_order: 2 },
    ],
  },
  'project_land': {
    root: [
      { id: 'pl-q1', label: 'What is the land acquisition / site type?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'pl-q1': [
      { id: 'pl-o1', label: 'Government allocated (MIDC / SIDCO / State Industrial Estate)', node_type: 'option', is_leaf: true, sort_order: 0 },
      { id: 'pl-o2', label: 'Privately owned land (to be purchased)', node_type: 'option', is_leaf: false, sort_order: 1 },
      { id: 'pl-o3', label: 'Leased commercial / industrial premises', node_type: 'option', is_leaf: true, sort_order: 2 },
    ],
    'pl-o2': [
      { id: 'pl-q2', label: 'Is the land already converted for non-agricultural (industrial) use?', node_type: 'question', is_leaf: false, sort_order: 0 },
    ],
    'pl-q2': [
      { id: 'pl-o2a', label: 'Yes — NA conversion order already obtained', node_type: 'option', is_leaf: true, sort_order: 0 },
      { id: 'pl-o2b', label: 'No — conversion application in process', node_type: 'option', is_leaf: true, sort_order: 1 },
    ],
  },
};

function getMockNodeChildren(nodeId: string, step: string): TreeNodeAPI[] {
  const stepTree = MOCK_TREES[step];
  if (!stepTree) return [];
  return stepTree[nodeId] || [];
}

function getMockRootNode(step: string): TreeNodeAPI[] {
  return getMockNodeChildren('root', step);
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

const MOCK_DEPT_QUEUE = [
  {
    id: 'bnd-q1',
    application_id: 'app-mh-78942',
    applicant_name: 'Rajesh Sharma',
    company_name: 'Apex Precision Engineering Pvt Ltd',
    business_type: 'General Manufacturing',
    submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    sla_deadline: new Date(Date.now() + 1 * 86400000).toISOString(),
    sla_hours: 72,
    status: 'in_review',
    documents: [
      { id: 'adoc-1', document_type_name: 'EIA Report', is_mandatory: true, status: 'pending_review', applicant_name: 'Rajesh Sharma', company_name: 'Apex Precision Engineering Pvt Ltd', uploaded_at: new Date().toISOString(), file_url: '#' },
      { id: 'adoc-2', document_type_name: 'ETP Scheme Blueprint', is_mandatory: true, status: 'pending_review', uploaded_at: new Date().toISOString(), file_url: '#' },
    ],
  },
  {
    id: 'bnd-q2',
    application_id: 'app-mh-65412',
    applicant_name: 'Priya Mehta',
    company_name: 'GreenTech Ventures LLP',
    business_type: 'Renewable Energy',
    submitted_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    sla_deadline: new Date(Date.now() - 1 * 86400000).toISOString(),
    sla_hours: 96,
    status: 'breached',
    documents: [
      { id: 'adoc-3', document_type_name: 'Land Possession Certificate', is_mandatory: true, status: 'pending_review', uploaded_at: new Date().toISOString(), file_url: '#' },
    ],
  },
];

// ── Applicant API ─────────────────────────────────────────────────────────────

export const applicantApi = {
  getBusinessTypes: async (): Promise<BusinessTypeAPI[]> => {
    try { return await request<BusinessTypeAPI[]>('/apply/business-types'); }
    catch { return MOCK_BUSINESS_TYPES; }
  },

  getNodeChildren: async (nodeId: string, step: string): Promise<TreeNodeAPI[]> => {
    try { return await request<TreeNodeAPI[]>(`/apply/nodes/${nodeId}/children?step=${step}`); }
    catch { return getMockNodeChildren(nodeId, step); }
  },

  getRootNodes: async (businessTypeId: string, step: string): Promise<TreeNodeAPI[]> => {
    try { return await request<TreeNodeAPI[]>(`/apply/walk?business_type_id=${businessTypeId}&step=${step}`); }
    catch { return getMockRootNode(step); }
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
