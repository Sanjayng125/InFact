import { createClient } from "@supabase/supabase-js";

export const createServerClient = () =>
    createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    );

export const createAdminClient = () =>
    createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
