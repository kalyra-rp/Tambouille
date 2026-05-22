import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase centralisé pour Tambouille.
 *
 * Variables d'environnement attendues (voir .env.local.example) :
 *  - NEXT_PUBLIC_SUPABASE_URL        (exposable côté client)
 *  - NEXT_PUBLIC_SUPABASE_ANON_KEY   (exposable côté client)
 *  - SUPABASE_SERVICE_ROLE_KEY       (STRICTEMENT serveur)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variables Supabase manquantes : définis NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local",
  );
}

/** Client public (anon) — utilisable côté navigateur et côté serveur. */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Client admin (service_role) — STRICTEMENT serveur.
 * Ne JAMAIS l'importer dans un composant client.
 * Utilisé pour les opérations qui contournent RLS (seed, scripts, jobs).
 */
export function createAdminClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error(
      "createAdminClient() ne doit jamais être appelé côté navigateur — fuite de la service_role key.",
    );
  }
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquante dans l'environnement serveur.",
    );
  }
  return createClient(supabaseUrl!, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
