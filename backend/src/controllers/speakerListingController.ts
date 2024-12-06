import { Request, Response } from 'express';
import { SpeakerListingService } from '../services/speakerListingService';
import { listSpeakersQuerySchema, generateTimeSlotsSchema } from '../types/timeSlot.types';

const speakerListingService = new SpeakerListingService();

export class SpeakerListingController {
    listSpeakers = async (req: Request, res: Response) => {
        try {
            const validatedData = listSpeakersQuerySchema.parse(req.query);
            const result = await speakerListingService.listSpeakers(validatedData);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    };

    generateTimeSlots = async (req: Request, res: Response) => {
        try {
            if (!req.user?.userId) {
                throw new Error('Unauthorized');
            }

            const validatedData = generateTimeSlotsSchema.parse(req.body);
            const result = await speakerListingService.generateTimeSlots(
                req.params.speakerId,
                validatedData.date
            );
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    };
}
