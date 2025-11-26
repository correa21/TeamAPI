import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables (URL, SERVICE_KEY, or ANON_KEY).');
}

/**
 * ADMIN CLIENT
 * Uses the Service Key. Bypasses ALL RLS.
 * Use this ONLY for Registration/Login/System tasks.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * AUTHENTICATED CLIENT HELPER
 * Creates a temporary client scoped to the user's JWT.
 * Ensures RLS policies are applied.
 */
export const createAuthClient = (jwt: string) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    });
};

/**
 * PUBLIC CLIENT
 * Uses the Anon Key. Subject to RLS.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
