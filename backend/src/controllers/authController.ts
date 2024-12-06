import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { signupSchema, verifyOtpSchema , loginSchema } from '../types/user.types';

const authService = new AuthService();

export class AuthController {
    async signup(req: Request, res: Response) {
        try {
            const validatedData = signupSchema.parse(req.body);
            const result = await authService.signup(validatedData);
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await authService.login(validatedData);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async verifyOTP(req: Request, res: Response) {
        try {
            const validatedData = verifyOtpSchema.parse(req.body);
            const result = await authService.verifyOTP(validatedData.email, validatedData.otp);
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
}
