import { PrismaClient } from '@prisma/client';
import { addHours, startOfDay, endOfDay, isValid, parseISO } from 'date-fns';

const prisma = new PrismaClient();

export class SpeakerListingService {
    private validateDate(date: string): boolean {
        try {
            const parsedDate = parseISO(date);
            return isValid(parsedDate);
        } catch {
            return false;
        }
    }

    async listSpeakers(query: {
        page?: string;
        limit?: string;
        expertise?: string;
        date?: string;
    }) {
        try {
            if (query.date && !this.validateDate(query.date)) {
                throw new Error('Invalid date format. Use YYYY-MM-DD format');
            }

            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;
            const skip = (page - 1) * limit;

            const where = {
                ...(query.expertise && {
                    expertise: {
                        has: query.expertise
                    }
                })
            };

            const speakers = await prisma.speaker.findMany({
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
                                gte: startOfDay(new Date(query.date)),
                                lt: endOfDay(new Date(query.date))
                            },
                            isBooked: false
                        }
                    } : false
                },
                skip,
                take: limit
            });

            const total = await prisma.speaker.count({ where });

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
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async generateTimeSlots(speakerId: string, date: string) {
        try {
            if (!this.validateDate(date)) {
                throw new Error('Invalid date format. Use YYYY-MM-DD format');
            }

            const speaker = await prisma.speaker.findUnique({
                where: { id: speakerId }
            });

            if (!speaker) {
                throw new Error('Speaker not found');
            }

            const existingSlots = await prisma.timeSlot.findFirst({
                where: {
                    speakerId,
                    startTime: {
                        gte: startOfDay(new Date(date)),
                        lt: endOfDay(new Date(date))
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

            await prisma.timeSlot.createMany({ data: slots });

            return {
                status: 'success',
                message: 'Time slots generated successfully',
                data: { date, totalSlots: slots.length }
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
