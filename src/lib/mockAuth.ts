/**
 * SWAGAT Mock JWT Authentication
 * Prototype-grade auth using localStorage + base64-encoded fake JWTs.
 * The app tries the real Go backend first; if offline, falls back to this.
 */

export type MockRole = 'applicant' | 'department_admin' | 'super_admin';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  role: MockRole;
  departmentId?: string;
  departmentName?: string;
  createdAt: string;
}

const USERS_KEY = 'swagat_mock_users';
const SESSION_KEY = 'swagat_session_v2';

// ── Token helpers ─────────────────────────────────────────────────────────────

function b64(obj: unknown): string {
  return btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function unb64(str: string): unknown {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '==='.slice((padded.length % 4));
  return JSON.parse(atob(padded + pad));
}

export function generateFakeToken(user: MockUser): string {
  const header = b64({ alg: 'HS256', typ: 'JWT' });
  const payload = b64({
    sub: user.id,
    email: user.email,
    name: user.name,
    mobile: user.mobile,
    role: user.role,
    departmentId: user.departmentId,
    departmentName: user.departmentName,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7-day expiry
  });
  const sig = b64(`swagat_mock_sig_${user.id}_${Date.now()}`);
  return `${header}.${payload}.${sig}`;
}

export function decodeToken(token: string): MockUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = unb64(parts[1]) as any;
    if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      mobile: payload.mobile,
      role: payload.role as MockRole,
      departmentId: payload.departmentId,
      departmentName: payload.departmentName,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// ── User store ────────────────────────────────────────────────────────────────

export function getMockUsers(): MockUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Seed default demo accounts the first time. */
export function seedDefaultUsers() {
  const existing = getMockUsers();
  if (existing.length > 0) return;
  const defaults: MockUser[] = [
    {
      id: 'usr-super-001',
      email: 'superadmin@swagat.gov.in',
      name: 'Super Admin',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-dept-001',
      email: 'officer@mpcb.gov.in',
      name: 'Dr. Suresh Patil',
      mobile: '+91 98201 11111',
      role: 'department_admin',
      departmentName: 'Maharashtra Pollution Control Board (MPCB)',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-dept-002',
      email: 'fire.officer@maharashtra.gov.in',
      name: 'Anil Kumar',
      mobile: '+91 98201 22222',
      role: 'department_admin',
      departmentName: 'Directorate of Fire Services',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-app-001',
      email: 'rajesh@apexind.in',
      name: 'Rajesh Sharma',
      mobile: '+91 98201 45678',
      role: 'applicant',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-app-002',
      email: 'priya.mehta@startup.in',
      name: 'Priya Mehta',
      mobile: '+91 99900 12345',
      role: 'applicant',
      createdAt: new Date().toISOString(),
    },
  ];
  saveMockUsers(defaults);
}

// ── Auth operations ───────────────────────────────────────────────────────────

export interface AuthSession {
  token: string;
  user: MockUser;
}

export function mockLogin(email: string, _password: string): AuthSession | null {
  seedDefaultUsers();
  const users = getMockUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  const token = generateFakeToken(user);
  const session: AuthSession = { token, user };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Also store in legacy keys so existing Go-backend helpers still work
  localStorage.setItem('swagat_auth_token', token);
  localStorage.setItem('swagat_auth_user', JSON.stringify({
    id: user.id,
    email: user.email,
    full_name: user.name,
    role: user.role,
  }));
  return session;
}

export function mockRegister(
  name: string,
  email: string,
  mobile: string,
  _password: string,
  role: MockRole = 'applicant',
): AuthSession {
  seedDefaultUsers();
  const users = getMockUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    // Return existing session rather than error
    const token = generateFakeToken(existing);
    const session: AuthSession = { token, user: existing };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  const newUser: MockUser = {
    id: `usr-${Date.now()}`,
    email,
    name,
    mobile,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveMockUsers(users);
  const token = generateFakeToken(newUser);
  const session: AuthSession = { token, user: newUser };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem('swagat_auth_token', token);
  localStorage.setItem('swagat_auth_user', JSON.stringify({
    id: newUser.id,
    email: newUser.email,
    full_name: newUser.name,
    role: newUser.role,
  }));
  return session;
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    const decoded = decodeToken(session.token);
    if (!decoded) { clearSession(); return null; }
    return session;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('swagat_auth_token');
  localStorage.removeItem('swagat_auth_user');
}

export function getAllMockUsers(): MockUser[] {
  seedDefaultUsers();
  return getMockUsers();
}

export function updateUserRole(userId: string, newRole: MockRole) {
  const users = getMockUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].role = newRole;
    saveMockUsers(users);
  }
}

export function deactivateUser(userId: string) {
  const users = getMockUsers().filter(u => u.id !== userId);
  saveMockUsers(users);
}
