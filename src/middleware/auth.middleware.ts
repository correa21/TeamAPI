import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Missing or invalid authorization header'
            });
        }

        const token = authHeader.substring(7);

        // Verify the JWT token with Supabase
        const {
            data: { user },
            error
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        // Attach user to request object
        (req as any).user = user;

        next();
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Optional: Admin role check middleware
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        // Check if user is an admin
        const { data, error } = await supabase
            .from('admin')
            .select('*')
            .eq('player_id', user.id)
            .single();

        if (error || !data) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden: Admin access required'
            });
        }

        next();
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
