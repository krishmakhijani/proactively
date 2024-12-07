"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const bookingService_1 = require("../services/bookingService");
const booking_types_1 = require("../types/booking.types");
const bookingService = new bookingService_1.BookingService();
class BookingController {
    constructor() {
        this.createBooking = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = booking_types_1.createBookingSchema.parse(req.body);
                const result = yield bookingService.createBooking(req.user.userId, validatedData.timeSlotId);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
        this.getUserBookings = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield bookingService.getUserBookings(req.user.userId);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
}
exports.BookingController = BookingController;
