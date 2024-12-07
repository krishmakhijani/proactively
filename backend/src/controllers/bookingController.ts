import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { createBookingSchema } from '../types/booking.types';

const bookingService = new BookingService();

export class BookingController {
    createBooking = async (req: Request, res: Response) => {
        try {
            const validatedData = createBookingSchema.parse(req.body);
            const result = await bookingService.createBooking(
                req.user!.userId,
                validatedData.timeSlotId
            );
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    };

    getUserBookings = async (req: Request, res: Response) => {
        try {
            const result = await bookingService.getUserBookings(req.user!.userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    };
}
