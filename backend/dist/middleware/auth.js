"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};
exports.auth = auth;
