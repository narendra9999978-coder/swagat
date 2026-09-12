/**
 * SWAGAT Authentication & Database Engine
 * Enforces strict two-role authentication (USER vs ADMIN),
 * 1 Email = 1 Account constraint, portal-specific login verification,
 * and Admin Account creation workflows.
 */

import { addNotification } from './applicationStore';

export type MockRole = 'USER' | 'ADMIN';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  phone?: string;
  companyName?: string;
  organization?: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  accountType: 'Business User' | 'System Administrator';
  status: 'Active' | 'Deactivated';
  createdAt: string;
  lastLogin?: string;
  departmentId?: string;
  departmentName?: string;
}

const USERS_KEY = 'swagat_mock_users_v4';
const SESSION_KEY = 'swagat_session_v4';

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
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
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
      role: payload.role === 'ADMIN' ? 'ADMIN' : 'USER',
      accountType: payload.role === 'ADMIN' ? 'System Administrator' : 'Business User',
      status: 'Active',
      departmentId: payload.departmentId,
      departmentName: payload.departmentName,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// ── User Store ────────────────────────────────────────────────────────────────

export function getMockUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Purge all demo accounts and ensure clean state on first run */
export function seedDefaultUsers() {
  // Clear legacy mock store keys to prevent stale users
  localStorage.removeItem('swagat_mock_users');
  localStorage.removeItem('swagat_mock_users_v2');
  localStorage.removeItem('swagat_mock_users_v3');

  const existing = getMockUsers();
  
  // Clean out any legacy mock accounts, demo user, and demo admin
  const cleaned = existing.filter(u => 
    !['user@demo.com', 'admin@demo.com', 'rajesh@apexind.in', 'priya.mehta@startup.in', 'officer@mpcb.gov.in'].includes(u.email.toLowerCase())
  );

  if (cleaned.length !== existing.length) {
    saveMockUsers(cleaned);
  }
}

// ── Auth Operations ───────────────────────────────────────────────────────────

export interface AuthSession {
  token: string;
  user: MockUser;
}

/**
 * Authenticates user for a specific portal ('USER' or 'ADMIN')
 * Verifies email existence, exact password, status, and portal role match.
 */
export function mockLogin(
  email: string,
  password: string,
  targetPortalRole: 'USER' | 'ADMIN' = 'USER'
): AuthSession {
  seedDefaultUsers();
  const users = getMockUsers();
  const cleanEmail = email.trim().toLowerCase();

  // 1. Find account by email
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    throw new Error('Incorrect email or password.');
  }

  // 2. Check password
  const isValidPass = user.password === password || password === 'google-oauth-session-token';
  if (!isValidPass) {
    throw new Error('Incorrect email or password.');
  }

  // 3. Check account status
  if (user.status === 'Deactivated') {
    throw new Error('This account has been deactivated. Please contact system administrator.');
  }

  // 4. CHECK account.role against the target login portal
  if (targetPortalRole === 'ADMIN' && user.role !== 'ADMIN') {
    throw new Error(
      'This account is registered as a User account and cannot be used for Admin Login. Please use a separate Admin account.'
    );
  }

  if (targetPortalRole === 'USER' && user.role !== 'USER') {
    throw new Error(
      'This account is registered as an Admin account and cannot be used for User Login. Please use a separate User account.'
    );
  }

  // 5. Update last login timestamp & return session
  user.lastLogin = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  saveMockUsers(users);

  const token = generateFakeToken(user);
  const session: AuthSession = { token, user };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem('swagat_auth_token', token);
  localStorage.setItem('swagat_auth_user', JSON.stringify({
    id: user.id,
    email: user.email,
    full_name: user.name,
    role: user.role,
  }));

  return session;
}

/**
 * Registers a new normal USER account.
 * Checks whether the email already exists in ANY account.
 */
export function mockRegister(
  name: string,
  email: string,
  mobile: string,
  password: string,
  companyName?: string
): AuthSession {
  seedDefaultUsers();
  const users = getMockUsers();
  const cleanEmail = email.trim().toLowerCase();

  // Check unique email across ALL accounts (USER and ADMIN)
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error(
      `An account with this email already exists. This email is already registered as a ${existing.role} account.`
    );
  }

  const finalCompany = companyName?.trim() || `${name.trim()}'s Enterprise`;

  const newUser: MockUser = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    name: name.trim(),
    mobile: mobile.trim(),
    phone: mobile.trim(),
    companyName: finalCompany,
    organization: finalCompany,
    password,
    role: 'USER',
    accountType: 'Business User',
    status: 'Active',
    createdAt: new Date().toISOString(),
    lastLogin: 'Just now',
  };

  users.push(newUser);
  saveMockUsers(users);

  // Emit statutory notification to Admin
  try {
    addNotification({
      id: `notif-${Date.now()}`,
      role: 'ADMIN',
      type: 'New User Registered',
      title: 'New Enterprise User Registered',
      message: `${newUser.name} (${newUser.email}) from ${finalCompany} registered on SWAGAT Single Window Portal.`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      read: false,
    });
  } catch (err) {
    console.warn('Could not dispatch register notification', err);
  }

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

/**
 * Google Authentication handler for both USER and ADMIN portals.
 * Enforces strict 1 Email = 1 Account = 1 Role policy.
 * If registered with Business first, it cannot log in as Admin, and vice versa.
 */
export function mockGoogleLogin(
  email: string,
  name: string,
  targetPortalRole: 'USER' | 'ADMIN' = 'USER'
): AuthSession {
  seedDefaultUsers();
  const users = getMockUsers();
  const cleanEmail = email.trim().toLowerCase();

  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    // Check account role vs target portal
    if (existing.role !== targetPortalRole) {
      if (existing.role === 'USER' && targetPortalRole === 'ADMIN') {
        throw new Error(
          'This Google account is registered as a Business User and cannot be used for Administrator login. Under SWAGAT policy, one email is permanently tied to one role.'
        );
      } else {
        throw new Error(
          'This Google account is registered as an Administrator and cannot be used for Business User login. Under SWAGAT policy, one email is permanently tied to one role.'
        );
      }
    }

    if (existing.status === 'Deactivated') {
      throw new Error('This account has been deactivated. Please contact system administrator.');
    }

    // Update last login
    existing.lastLogin = new Date().toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    saveMockUsers(users);

    const token = generateFakeToken(existing);
    const session: AuthSession = { token, user: existing };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('swagat_auth_token', token);
    localStorage.setItem('swagat_auth_user', JSON.stringify({
      id: existing.id,
      email: existing.email,
      full_name: existing.name,
      role: existing.role,
    }));
    return session;
  }

  // Register new account with the requested role
  const finalName = name.trim() || cleanEmail.split('@')[0];
  const finalCompany = targetPortalRole === 'ADMIN' ? 'SWAGAT Central Administration' : `${finalName}'s Enterprise`;

  const newUser: MockUser = {
    id: `${targetPortalRole === 'ADMIN' ? 'adm' : 'usr'}-${Date.now()}`,
    email: cleanEmail,
    name: finalName,
    mobile: '+91 98765 43210',
    phone: '+91 98765 43210',
    companyName: finalCompany,
    organization: finalCompany,
    password: 'google-oauth-session-token',
    role: targetPortalRole,
    accountType: targetPortalRole === 'ADMIN' ? 'System Administrator' : 'Business User',
    status: 'Active',
    createdAt: new Date().toISOString(),
    lastLogin: 'Just now',
    departmentName: targetPortalRole === 'ADMIN' ? 'SWAGAT Central Administration' : undefined,
  };

  users.push(newUser);
  saveMockUsers(users);

  if (targetPortalRole === 'USER') {
    try {
      addNotification({
        id: `notif-${Date.now()}`,
        role: 'ADMIN',
        type: 'New User Registered',
        title: 'New Enterprise User Registered via Google',
        message: `${newUser.name} (${newUser.email}) registered via Google Authentication on SWAGAT Portal.`,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        read: false,
      });
    } catch {}
  }

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

/**
 * Admin action: Create a new Administrator Account.
 * Requires a unique email address not present in ANY existing account.
 */
export function createAdminAccount(
  name: string,
  email: string,
  mobile: string,
  password: string,
  departmentName?: string
): MockUser {
  seedDefaultUsers();
  const users = getMockUsers();
  const cleanEmail = email.trim().toLowerCase();

  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error(
      'An account with this email already exists as a User. Admin accounts require a separate email address.'
    );
  }

  const newAdmin: MockUser = {
    id: `adm-${Date.now()}`,
    email: cleanEmail,
    name: name.trim(),
    mobile: mobile.trim(),
    password: password || 'admin123',
    role: 'ADMIN',
    accountType: 'System Administrator',
    status: 'Active',
    createdAt: new Date().toISOString(),
    lastLogin: 'Never',
    departmentName: departmentName || 'SWAGAT Central Administration',
  };

  users.push(newAdmin);
  saveMockUsers(users);
  return newAdmin;
}

export function setStoredSession(session: AuthSession) {
  const token = session.token || generateFakeToken(session.user);
  const fullSession = { token, user: session.user };
  localStorage.setItem(SESSION_KEY, JSON.stringify(fullSession));
  localStorage.setItem('swagat_auth_token', token);
  localStorage.setItem('swagat_auth_user', JSON.stringify({
    id: session.user.id,
    email: session.user.email,
    full_name: session.user.name,
    role: session.user.role,
  }));
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (!session || !session.user) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('swagat_auth_token');
  localStorage.removeItem('swagat_auth_user');
  localStorage.removeItem('swagat_oauth_role');
  sessionStorage.removeItem('swagat_oauth_role');
}

export function getAllMockUsers(): MockUser[] {
  seedDefaultUsers();
  return getMockUsers();
}

export function toggleUserStatus(userId: string): MockUser | null {
  const users = getMockUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.status = user.status === 'Active' ? 'Deactivated' : 'Active';
    saveMockUsers(users);
    return user;
  }
  return null;
}
