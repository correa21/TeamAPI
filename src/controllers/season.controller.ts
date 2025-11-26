import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreateSeasonDTO, UpdateSeasonDTO } from '../types/database.types';

export const getAllSeasons = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('season')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getSeasonById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('season').select('*').eq('id', id).single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Season not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createSeason = async (req: Request, res: Response) => {
    try {
        const seasonData: CreateSeasonDTO = req.body;
        const { data, error } = await supabase
            .from('season')
            .insert([seasonData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateSeason = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const seasonData: UpdateSeasonDTO = req.body;

        const { data, error } = await supabase
            .from('season')
            .update(seasonData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Season not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteSeason = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('season').delete().eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Season deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
