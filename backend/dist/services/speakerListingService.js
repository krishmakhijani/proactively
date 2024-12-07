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
exports.SpeakerListingService = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
class SpeakerListingService {
    validateDate(date) {
        try {
            const parsedDate = (0, date_fns_1.parseISO)(date);
            return (0, date_fns_1.isValid)(parsedDate);
        }
        catch (_a) {
            return false;
        }
    }
    listSpeakers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (query.date && !this.validateDate(query.date)) {
                    throw new Error('Invalid date format. Use YYYY-MM-DD format');
                }
                const page = Number(query.page) || 1;
                const limit = Number(query.limit) || 10;
                const skip = (page - 1) * limit;
                const where = Object.assign({}, (query.expertise && {
                    expertise: {
                        has: query.expertise
                    }
                }));
                const speakers = yield prisma.speaker.findMany({
                    where,
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        },
                        timeSlots: query.date ? {
                            where: {
                                startTime: {
                                    gte: (0, date_fns_1.startOfDay)(new Date(query.date)),
                                    lt: (0, date_fns_1.endOfDay)(new Date(query.date))
                                },
                                isBooked: false
                            }
                        } : false
                    },
                    skip,
                    take: limit
                });
                const total = yield prisma.speaker.count({ where });
                return {
                    status: 'success',
                    data: {
                        speakers,
                        pagination: {
                            currentPage: page,
                            pageSize: limit,
                            total,
                            totalPages: Math.ceil(total / limit)
                        }
                    }
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    generateTimeSlots(speakerId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.validateDate(date)) {
                    throw new Error('Invalid date format. Use YYYY-MM-DD format');
                }
                const speaker = yield prisma.speaker.findUnique({
                    where: { id: speakerId }
                });
                if (!speaker) {
                    throw new Error('Speaker not found');
                }
                const existingSlots = yield prisma.timeSlot.findFirst({
                    where: {
                        speakerId,
                        startTime: {
                            gte: (0, date_fns_1.startOfDay)(new Date(date)),
                            lt: (0, date_fns_1.endOfDay)(new Date(date))
                        }
                    }
                });
                if (existingSlots) {
                    throw new Error('Time slots already exist for this date');
                }
                const slots = [];
                const baseDate = new Date(date);
                for (let hour = 9; hour < 16; hour++) {
                    const startTime = new Date(baseDate.setHours(hour, 0, 0, 0));
                    const endTime = new Date(baseDate.setHours(hour + 1, 0, 0, 0));
                    slots.push({
                        startTime,
                        endTime,
                        speakerId,
                        isBooked: false
                    });
                }
                yield prisma.timeSlot.createMany({ data: slots });
                return {
                    status: 'success',
                    message: 'Time slots generated successfully',
                    data: { date, totalSlots: slots.length }
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.SpeakerListingService = SpeakerListingService;
