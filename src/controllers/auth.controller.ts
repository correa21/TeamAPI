import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreatePlayerDTO } from '../types/database.types';

/**
 * Register a new user with Supabase Auth and create associated player record
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, ...playerData } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // 1. Create Supabase Auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    player_name: playerData.player_name
                }
            }
        });

        if (authError) {
            return res.status(400).json({
                success: false,
                error: authError.message
            });
        }

        if (!authData.user) {
            return res.status(500).json({
                success: false,
                error: 'User creation failed'
            });
        }

        // 2. Create player record linked to auth user
        const { data: player, error: playerError } = await supabase
            .from('player')
            .insert([
                {
                    ...playerData,
                    email,
                    auth_user_id: authData.user.id,
                    password: 'MANAGED_BY_SUPABASE_AUTH' // Not used, managed by Supabase
                }
            ])
            .select()
            .single();

        if (playerError) {
            // Rollback: delete the auth user if player creation fails
            await supabase.auth.admin.deleteUser(authData.user.id);
            return res.status(400).json({
                success: false,
                error: playerError.message
            });
        }

        res.status(201).json({
            success: true,
            data: {
                user: authData.user,
                player,
                session: authData.session,
                message: 'Registration successful! Please check your email to verify your account.'
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Login with email and password
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({
                success: false,
                error: error.message
            });
        }

        // Get associated player info
        const { data: player } = await supabase
            .from('player')
            .select('*')
            .eq('auth_user_id', data.user.id)
            .single();

        res.json({
            success: true,
            data: {
                user: data.user,
                player,
                session: data.session,
                token: data.session.access_token
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Logout current user
 */
export const logout = async (req: Request, res: Response) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Get current user info
 */
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
        }

        // Get associated player info
        const { data: player } = await supabase
            .from('player')
            .select('*')
            .eq('auth_user_id', user.id)
            .single();

        res.json({
            success: true,
            data: {
                user,
                player
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Request password reset
 */
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/reset-password'
        });

        if (error) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        res.json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
