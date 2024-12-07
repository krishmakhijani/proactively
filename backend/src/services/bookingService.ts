import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

export class BookingService {
    async createBooking(userId: string, timeSlotId: string) {
        try {
            return await prisma.$transaction(async (prisma) => {

                const timeSlot = await prisma.timeSlot.findUnique({
                    where: { id: timeSlotId },
                    include: {
                        speaker: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                });

                if (!timeSlot) {
                    throw new Error('Time slot not found');
                }

                if (timeSlot.isBooked) {
                    throw new Error('Time slot is already booked');
                }


                if (timeSlot.startTime < new Date()) {
                    throw new Error('Cannot book past time slots');
                }


                const existingBooking = await prisma.booking.findFirst({
                    where: {
                        userId,
                        timeSlot: {
                            startTime: {
                                gte: startOfDay(timeSlot.startTime),
                                lt: endOfDay(timeSlot.startTime)
                            }
                        }
                    },
                    include: {
                        timeSlot: true
                    }
                });

                if (existingBooking) {
                    throw new Error(
                        `You already have a booking on ${existingBooking.timeSlot.startTime.toLocaleDateString()} at ${existingBooking.timeSlot.startTime.toLocaleTimeString()}`
                    );
                }


                const booking = await prisma.booking.create({
                    data: {
                        userId,
                        timeSlotId,
                    },
                    include: {
                        timeSlot: {
                            include: {
                                speaker: {
                                    include: {
                                        user: {
                                            select: {
                                                firstName: true,
                                                lastName: true,
                                                email: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                });


                await prisma.timeSlot.update({
                    where: { id: timeSlotId },
                    data: { isBooked: true }
                });

                return {
                    status: 'success',
                    message: 'Booking created successfully',
                    data: {
                        id: booking.id,
                        startTime: booking.timeSlot.startTime,
                        endTime: booking.timeSlot.endTime,
                        speaker: {
                            firstName: booking.timeSlot.speaker.user.firstName,
                            lastName: booking.timeSlot.speaker.user.lastName,
                            email: booking.timeSlot.speaker.user.email
                        },
                        user: {
                            firstName: booking.user.firstName,
                            lastName: booking.user.lastName,
                            email: booking.user.email
                        },
                        createdAt: booking.timeSlot.createdAt
                    }
                };
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getUserBookings(userId: string) {
        try {
            const bookings = await prisma.booking.findMany({
                where: { userId },
                include: {
                    timeSlot: {
                        include: {
                            speaker: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return {
                status: 'success',
                data: bookings.map(booking => ({
                    id: booking.id,
                    startTime: booking.timeSlot.startTime,
                    endTime: booking.timeSlot.endTime,
                    speaker: {
                        firstName: booking.timeSlot.speaker.user.firstName,
                        lastName: booking.timeSlot.speaker.user.lastName,
                        email: booking.timeSlot.speaker.user.email
                    },
                    user: {
                        firstName: booking.user.firstName,
                        lastName: booking.user.lastName,
                        email: booking.user.email
                    },
                    createdAt: booking.createdAt
                }))
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getSpeakerBookings(speakerId: string) {
        try {
            const bookings = await prisma.booking.findMany({
                where: {
                    timeSlot: {
                        speakerId
                    }
                },
                include: {
                    timeSlot: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    timeSlot: {
                        startTime: 'asc'
                    }
                }
            });

            return {
                status: 'success',
                data: bookings.map(booking => ({
                    id: booking.id,
                    startTime: booking.timeSlot.startTime,
                    endTime: booking.timeSlot.endTime,
                    user: {
                        firstName: booking.user.firstName,
                        lastName: booking.user.lastName,
                        email: booking.user.email
                    },
                    createdAt: booking.createdAt
                }))
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getBookingById(bookingId: string, userId: string) {
        try {
            const booking = await prisma.booking.findFirst({
                where: {
                    id: bookingId,
                    OR: [
                        { userId },
                        {
                            timeSlot: {
                                speaker: {
                                    userId
                                }
                            }
                        }
                    ]
                },
                include: {
                    timeSlot: {
                        include: {
                            speaker: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });

            if (!booking) {
                throw new Error('Booking not found or access denied');
            }

            return {
                status: 'success',
                data: {
                    id: booking.id,
                    startTime: booking.timeSlot.startTime,
                    endTime: booking.timeSlot.endTime,
                    speaker: {
                        firstName: booking.timeSlot.speaker.user.firstName,
                        lastName: booking.timeSlot.speaker.user.lastName,
                        email: booking.timeSlot.speaker.user.email
                    },
                    user: {
                        firstName: booking.user.firstName,
                        lastName: booking.user.lastName,
                        email: booking.user.email
                    },
                    createdAt: booking.createdAt
                }
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
