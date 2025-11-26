import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load test environment
dotenv.config({ path: '.env.test' });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

export const testSupabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

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
export async function createTestTeam(name?: string, region = 'Test Region') {
    const timestamp = Date.now();
    const teamName = name || `Test Team ${timestamp}`;

    const { data, error } = await testSupabase
        .from('team')
        .insert({ name: teamName, region })
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
        email: `test${timestamp}@gmail.com`,
        password: 'hashedPasswordPlaceholder', // Placeholder since auth is handled separately
        federation_id: parseInt(timestamp.toString().slice(-6)),
        eligibility: true,
        ...overrides
    };

    // Create a fresh client with service key to ensure RLS bypass
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const { data, error } = await serviceClient
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
    const userEmail = email || `test${timestamp}@gmail.com`;

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

/**
 * Create a full admin user flow and return token
 */
export async function createTestAdmin() {
    const timestamp = Date.now();
    const email = `admin${timestamp}@test.com`;
    const password = 'adminpass123';

    // 1. Create Auth User
    const user = await createTestAuthUser(email, password);
    if (!user) throw new Error('Failed to create auth user');

    // 2. Create Team (for player)
    const team = await createTestTeam(`Admin Team ${timestamp}`);

    // 3. Create Player linked to Auth User
    const player = await createTestPlayer(team.id, {
        auth_user_id: user.id,
        email: email,
        player_name: `Admin User ${timestamp}`
    });

    // 4. Create Admin Record
    // Use a fresh service client for admin insertion as well
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const { error: adminError } = await serviceClient
        .from('admin')
        .insert({
            player_id: player.id,
            role: 'superuser'
        });

    if (adminError) throw adminError;

    // 5. Get Token
    const token = await getAuthToken(email, password);

    return { user, player, token };
}
