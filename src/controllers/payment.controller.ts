import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreatePaymentsDTO, UpdatePaymentsDTO } from '../types/database.types';

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPaymentByPlayerId = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params;
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('player_id', playerId)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Payment record not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPlayersWithDebt = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('debt', true)
            .order('total_debt', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createPayment = async (req: Request, res: Response) => {
    try {
        const paymentData: CreatePaymentsDTO = req.body;
        const { data, error } = await supabase
            .from('payments')
            .insert([paymentData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updatePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const paymentData: UpdatePaymentsDTO = req.body;

        const { data, error } = await supabase
            .from('payments')
            .update(paymentData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ success: false, error: 'Payment record not found' });
        }

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('payments').delete().eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Payment record deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
