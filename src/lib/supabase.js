import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const looksLikeValidSupabaseUrl = (value) => {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
};

export const supabaseConfigError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to your Vite environment variables.'
    : !looksLikeValidSupabaseUrl(supabaseUrl)
      ? 'VITE_SUPABASE_URL is invalid. Expected format: https://<project-ref>.supabase.co'
      : null;

if (supabaseConfigError) {
  // Keep app rendering, but avoid network calls to invalid hosts.
  console.warn(`Supabase config error: ${supabaseConfigError}`);
}

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);