import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                status: 'error',
                message: 'Authorization header is missing'
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                status: 'error',
                message: 'Token is missing'
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            email: string;
            role?: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};
