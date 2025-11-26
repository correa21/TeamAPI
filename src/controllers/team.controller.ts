import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreateTeamDTO, UpdateTeamDTO } from '../types/database.types';

export const getAllTeams = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('team')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getTeamById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('team')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            // If no rows found, Supabase returns a PGRST116 error
            if (error.code === 'PGRST116') {
                return res.status(404).json({ success: false, error: 'Team not found' });
            }
            // Handle other database errors
            return res.status(500).json({ success: false, error: error.message });
        }
        if (!data) {
            // Handle not-found without throwing
            return res.status(404).json({ success: false, error: 'Team not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createTeam = async (req: Request, res: Response) => {
    try {
        const teamData: CreateTeamDTO = req.body;

        // Basic validation for missing fields (assuming 'name' is required)
        if (!teamData.name) {
            return res.status(400).json({ success: false, error: 'Team name is required' });
        }

        const { data, error } = await supabase
            .from('team')
            .insert([teamData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teamData: UpdateTeamDTO = req.body;

        const { data, error } = await supabase
            .from('team')
            .update(teamData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Team not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('team')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Team deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
