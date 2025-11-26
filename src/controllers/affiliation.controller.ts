import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreateAffiliationsDTO, UpdateAffiliationsDTO } from '../types/database.types';

export const getAllAffiliations = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('affiliations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAffiliationByPlayerId = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params;
        const { data, error } = await supabase
            .from('affiliations')
            .select('*')
            .eq('player_id', playerId)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Affiliation not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createAffiliation = async (req: Request, res: Response) => {
    try {
        const affiliationData: CreateAffiliationsDTO = req.body;
        const { data, error } = await supabase
            .from('affiliations')
            .insert([affiliationData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateAffiliation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const affiliationData: UpdateAffiliationsDTO = req.body;

        const { data, error } = await supabase
            .from('affiliations')
            .update(affiliationData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Affiliation not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteAffiliation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('affiliations').delete().eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Affiliation deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
