import { Request, Response } from 'express';
import { SpeakerService } from '../services/speakerService';
import { createSpeakerProfileSchema, updateSpeakerProfileSchema } from '../types/speaker.types';

const speakerService = new SpeakerService();

export class SpeakerController {
    createProfile = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    status: 'error',
                    message: 'Not authenticated'
                });
                return;
            }

            const validatedData = createSpeakerProfileSchema.parse(req.body);
            const result = await speakerService.createProfile(req.user.userId, validatedData);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    };

    updateProfile = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    status: 'error',
                    message: 'Not authenticated'
                });
                return;
            }

            const validatedData = updateSpeakerProfileSchema.parse(req.body);
            const result = await speakerService.updateProfile(req.user.userId, validatedData);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    };

    getProfile = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    status: 'error',
                    message: 'Not authenticated'
                });
                return;
            }

            const result = await speakerService.getProfile(req.user.userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    };
}
