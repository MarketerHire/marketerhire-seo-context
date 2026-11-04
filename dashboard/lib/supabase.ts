import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// Server-side client (uses SUPABASE_SERVICE_KEY)
// Use in API route handlers that need write access.
// ============================================================

let _serverClient: SupabaseClient | null = null;

export function createServerClient(): SupabaseClient {
  if (_serverClient) return _serverClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY env vars"
    );
  }

  _serverClient = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  return _serverClient;
}

// ============================================================
// Browser-side client (uses NEXT_PUBLIC_SUPABASE_ANON_KEY)
// Use in client components for read-only access.
// ============================================================

let _browserClient: SupabaseClient | null = null;

export function createBrowserClient(): SupabaseClient {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars"
    );
  }

  _browserClient = createClient(url, anonKey, {
    auth: { persistSession: false },
  });

  return _browserClient;
}
