"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.speakerAuth = void 0;
const speakerAuth = (req, res, next) => {
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
    }
    catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Authentication failed'
        });
    }
};
exports.speakerAuth = speakerAuth;
