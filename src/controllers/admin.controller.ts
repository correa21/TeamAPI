import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreateAdminDTO, UpdateAdminDTO } from '../types/database.types';

export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('admin')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAdminByPlayerId = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params;
        const { data, error } = await supabase
            .from('admin')
            .select('*')
            .eq('player_id', playerId)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const adminData: CreateAdminDTO = req.body;
        const { data, error } = await supabase.from('admin').insert([adminData]).select().single();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const adminData: UpdateAdminDTO = req.body;

        const { data, error } = await supabase
            .from('admin')
            .update(adminData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('admin').delete().eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Admin deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
