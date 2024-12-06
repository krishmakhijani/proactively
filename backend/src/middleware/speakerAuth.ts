import { Request, Response, NextFunction } from 'express';

export const speakerAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Not authenticated'
            });
            return;
        }

        if (req.user.role !== 'SPEAKER') {
            res.status(403).json({
                status: 'error',
                message: 'Access denied. Only speakers can access this route'
            });
            return;
        }

        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Authentication failed'
        });
    }
};
