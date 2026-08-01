import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const appUrl = import.meta.env.VITE_APP_URL?.trim().replace(/\/$/, '');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const getAppBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '[::1]'
    ) {
      return origin;
    }
  }
  return appUrl || (typeof window !== 'undefined' ? window.location.origin : '');
};

export const getAuthCallbackUrl = () => `${getAppBaseUrl()}/auth/callback`;

export const supabase = isSupabaseConfigured
	? createClient(supabaseUrl, supabaseAnonKey)
	: null;