import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreatePlayerDTO, UpdatePlayerDTO } from '../types/database.types';

export const getAllPlayers = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('player')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPlayerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('player')
            .select('*')
            .eq('id', id)
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

export const getPlayersByTeam = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const { data, error } = await supabase
            .from('player')
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
        const { data, error } = await supabase
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

        const { data, error } = await supabase
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
        const { error } = await supabase
            .from('player')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Player deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
