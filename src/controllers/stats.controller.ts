import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreateStatsDTO, UpdateStatsDTO } from '../types/database.types';

export const getAllStats = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('stats')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getStatsByPlayerId = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params;
        const { data, error } = await supabase
            .from('stats')
            .select('*')
            .eq('player_id', playerId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getStatsBySeasonId = async (req: Request, res: Response) => {
    try {
        const { seasonId } = req.params;
        const { data, error } = await supabase
            .from('stats')
            .select('*')
            .eq('season_id', seasonId)
            .order('points', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getStatsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('stats')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Stats not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createStats = async (req: Request, res: Response) => {
    try {
        const statsData: CreateStatsDTO = req.body;
        const { data, error } = await supabase
            .from('stats')
            .insert([statsData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateStats = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const statsData: UpdateStatsDTO = req.body;

        const { data, error } = await supabase
            .from('stats')
            .update(statsData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Stats not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteStats = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('stats')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Stats deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
