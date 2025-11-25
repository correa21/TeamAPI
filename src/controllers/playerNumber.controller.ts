import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreatePlayerNumberDTO, UpdatePlayerNumberDTO } from '../types/database.types';

export const getAllPlayerNumbers = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('player_number')
            .select('*')
            .order('player_number', { ascending: true });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPlayerNumberByPlayerId = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params;
        const { data, error } = await supabase
            .from('player_number')
            .select('*')
            .eq('player_id', playerId)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Player number not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createPlayerNumber = async (req: Request, res: Response) => {
    try {
        const playerNumberData: CreatePlayerNumberDTO = req.body;
        const { data, error } = await supabase
            .from('player_number')
            .insert([playerNumberData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updatePlayerNumber = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const playerNumberData: UpdatePlayerNumberDTO = req.body;

        const { data, error } = await supabase
            .from('player_number')
            .update(playerNumberData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Player number not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePlayerNumber = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('player_number')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Player number deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
