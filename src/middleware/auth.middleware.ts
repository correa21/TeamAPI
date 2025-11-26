import { Request, Response, NextFunction } from 'express';
import { createAuthClient } from '../config/supabase';

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

        // Create scoped client
        const scopedClient = createAuthClient(token);

        // Verify token
        const {
            data: { user },
            error
        } = await scopedClient.auth.getUser();

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        // Attach to request
        req.supabase = scopedClient;
        req.user = user;

        next();
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        // Check if user is an admin using database function
        const { data: isAdmin, error } = await req.supabase.rpc('is_admin');

        if (error || !isAdmin) {
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
