import { PrismaClient, Prisma, Booking, User, TimeSlot, Speaker } from '@prisma/client';
import { startOfDay, endOfDay, format } from 'date-fns';
import { sendEmail } from './mailService';
import { bookingEmailTemplates } from '../utils/emailTemplates';

const prisma = new PrismaClient();

type BookingWithRelations = Prisma.BookingGetPayload<{
    include: {
        timeSlot: {
            include: {
                speaker: {
                    include: {
                        user: {
                            select: {
                                firstName: true;
                                lastName: true;
                                email: true;
                            };
                        };
                    };
                };
            };
        };
        user: {
            select: {
                firstName: true;
                lastName: true;
                email: true;
            };
        };
    };
}>;

export class BookingService {
    async createBooking(userId: string, timeSlotId: string) {
        try {
            return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                // First, check if time slot exists and get its date
                const timeSlot = await tx.timeSlot.findUnique({
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

                const existingBooking = await tx.booking.findFirst({
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
                        `You already have a booking on ${format(existingBooking.timeSlot.startTime, 'MMMM do, yyyy')} at ${format(existingBooking.timeSlot.startTime, 'h:mm a')}`
                    );
                }

                const user = await tx.user.findUnique({
                    where: { id: userId },
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                });

                if (!user) {
                    throw new Error('User not found');
                }

                const booking = await tx.booking.create({
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

                await tx.timeSlot.update({
                    where: { id: timeSlotId },
                    data: { isBooked: true }
                });

                const emailData = {
                    date: format(booking.timeSlot.startTime, 'MMMM do, yyyy'),
                    startTime: format(booking.timeSlot.startTime, 'h:mm a'),
                    endTime: format(booking.timeSlot.endTime, 'h:mm a'),
                    userName: `${booking.user.firstName} ${booking.user.lastName}`,
                    speakerName: `${booking.timeSlot.speaker.user.firstName} ${booking.timeSlot.speaker.user.lastName}`
                };

                Promise.all([
                    sendEmail(
                        booking.user.email,
                        bookingEmailTemplates.userBookingConfirmation(emailData).subject,
                        bookingEmailTemplates.userBookingConfirmation(emailData).html
                    ),
                    sendEmail(
                        booking.timeSlot.speaker.user.email,
                        bookingEmailTemplates.speakerBookingNotification(emailData).subject,
                        bookingEmailTemplates.speakerBookingNotification(emailData).html
                    )
                ]).catch(error => {
                    console.error('Email notification failed:', error);
                });

                return {
                    status: 'success',
                    message: 'Booking created successfully and notifications sent',
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
            const bookings: BookingWithRelations[] = await prisma.booking.findMany({
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
            const bookings: BookingWithRelations[] = await prisma.booking.findMany({
                where: {
                    timeSlot: {
                        speakerId
                    }
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
