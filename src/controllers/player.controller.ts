import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreatePlayerDTO, UpdatePlayerDTO } from '../types/database.types';

export const getAllPlayers = async (req: Request, res: Response) => {
    try {
        const { data, error } = await (req.supabase || supabase)
            .from('roster_view')
            .select('*')
            .order('player_name', { ascending: true });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPlayerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Try to get from roster_view first (public info)
        let { data, error } = await (req.supabase || supabase)
            .from('roster_view')
            .select('*')
            .eq('player_id', id) // Note: view uses player_id, not id
            .single();

        // If not found in view (maybe not eligible?), or if we need full details for admin/owner
        // we might try the player table if the user is authenticated.
        // However, for a general getById, the view is safer.

        // If we really need to support "Admin viewing full profile" via this same endpoint,
        // we could try the player table if the view returns null, OR just stick to the view for consistency.
        // Given the schema, let's stick to the view for the public ID lookup.

        if (error || !data) {
            // Fallback: If user is admin/owner, they might want the full record from 'player' table
            // But 'player' table RLS might block it if not owner/admin.
            const { data: fullData, error: fullError } = await (req.supabase || supabase)
                .from('player')
                .select('*')
                .eq('id', id)
                .single();

            if (!fullError && fullData) {
                data = fullData;
                error = null;
            }
        }

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Player not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPlayersByTeam = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const { data, error } = await (req.supabase || supabase)
            .from('roster_view')
            .select('*')
            .eq('team_id', teamId)
            .order('player_name', { ascending: true });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createPlayer = async (req: Request, res: Response) => {
    try {
        const playerData: CreatePlayerDTO = req.body;
        const { data, error } = await (req.supabase || supabase)
            .from('player')
            .insert([playerData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updatePlayer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const playerData: UpdatePlayerDTO = req.body;

        const { data, error } = await (req.supabase || supabase)
            .from('player')
            .update(playerData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Player not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePlayer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await (req.supabase || supabase).from('player').delete().eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Player deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
