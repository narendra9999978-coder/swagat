import { createClient } from '@supabase/supabase-js';

// Supabase project connection parameters
export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vdcuqhwpnerguygvgdhv.supabase.co';
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Initialize client with fallback placeholder key if not provided in env
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'
);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder');
};

/**
 * Initiates Google OAuth through Supabase Auth.
 * If Supabase client has a configured public anon key and Google provider is active,
 * this redirects to accounts.google.com.
 */
export const signInWithGoogleOAuth = async (role: 'investor' | 'officer' | 'super_admin' = 'investor') => {
  localStorage.setItem('swagat_oauth_role', role);

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  }
  
  // Returns null when Google OAuth is in demo/simulation mode
  return null;
};
