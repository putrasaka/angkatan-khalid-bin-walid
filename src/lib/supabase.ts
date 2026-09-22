import { createClient } from '@supabase/supabase-js';

// @ts-ignore - Vite import.meta.env is provided at build time
const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
// @ts-ignore
const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const isSupabaseConfigured = !!supabase;
