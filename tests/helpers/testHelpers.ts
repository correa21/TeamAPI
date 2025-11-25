import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load test environment
dotenv.config({ path: '.env.test' });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

export const testSupabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Clean up test data from database
 */
export async function cleanupTestData() {
    try {
        // Delete in reverse order of dependencies
        await testSupabase.from('stats').delete().neq('id', 0);
        await testSupabase.from('admin').delete().neq('id', 0);
        await testSupabase.from('payments').delete().neq('id', 0);
        await testSupabase.from('affiliations').delete().neq('id', 0);
        await testSupabase.from('player_number').delete().neq('id', 0);
        await testSupabase.from('player').delete().neq('id', 0);
        await testSupabase.from('team').delete().neq('id', 0);
        await testSupabase.from('season').delete().neq('id', 0);
    } catch (error) {
        console.error('Error cleaning up test data:', error);
    }
}

/**
 * Create test team
 */
export async function createTestTeam(name = 'Test Team', region = 'Test Region') {
    const { data, error } = await testSupabase
        .from('team')
        .insert({ name, region })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Create test player
 */
export async function createTestPlayer(teamId: string, overrides: any = {}) {
    const timestamp = Date.now();
    const defaultPlayer = {
        team_id: teamId,
        player_name: `Test Player ${timestamp}`,
        date_of_birth: '1995-01-01',
        curp: `TEST${timestamp.toString().slice(-12)}`,
        email: `test${timestamp}@example.com`,
        federation_id: parseInt(timestamp.toString().slice(-6)),
        eligibility: true,
        ...overrides
    };

    const { data, error } = await testSupabase
        .from('player')
        .insert(defaultPlayer)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Create test season
 */
export async function createTestSeason(name?: string, modality = '15s') {
    const timestamp = Date.now();
    const seasonName = name || `Test Season ${timestamp}`;

    const { data, error } = await testSupabase
        .from('season')
        .insert({ name: seasonName, modality })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Create authenticated test user via Supabase Auth
 */
export async function createTestAuthUser(email?: string, password = 'testpass123') {
    const timestamp = Date.now();
    const userEmail = email || `test${timestamp}@example.com`;

    const { data, error } = await testSupabase.auth.admin.createUser({
        email: userEmail,
        password: password,
        email_confirm: true
    });

    if (error) throw error;
    return data.user;
}

/**
 * Get auth token for test user
 */
export async function getAuthToken(email: string, password: string) {
    const { data, error } = await testSupabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data.session?.access_token;
}

/**
 * Delete auth user
 */
export async function deleteAuthUser(userId: string) {
    const { error } = await testSupabase.auth.admin.deleteUser(userId);
    if (error) console.error('Error deleting auth user:', error);
}
