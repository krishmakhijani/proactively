import { Request, Response, NextFunction } from 'express';

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== 'USER') {
            res.status(403).json({
                status: 'error',
                message: 'Access denied. Only users can book sessions'
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
