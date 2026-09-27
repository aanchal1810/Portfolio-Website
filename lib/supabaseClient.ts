import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the SECRET key (sb_secret_..., shown next to the
// publishable key in Settings > API Keys) so API routes can write to the
// `flowers` table and the `flower-images` storage bucket regardless of
// row-level-security policies. Never import this file from client components,
// and never use the publishable key here - it's the wrong privilege level.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_SECRET_KEY must be set (see README-garden.md)"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false },
});
