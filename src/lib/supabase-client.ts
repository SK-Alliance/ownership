import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Client-side Supabase client using anon key (safe for browser)
export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';
