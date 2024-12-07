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
exports.BookingService = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const mailService_1 = require("./mailService");
const emailTemplates_1 = require("../utils/emailTemplates");
const prisma = new client_1.PrismaClient();
class BookingService {
    createBooking(userId, timeSlotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // First, check if time slot exists and get its date
                    const timeSlot = yield tx.timeSlot.findUnique({
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
                    const existingBooking = yield tx.booking.findFirst({
                        where: {
                            userId,
                            timeSlot: {
                                startTime: {
                                    gte: (0, date_fns_1.startOfDay)(timeSlot.startTime),
                                    lt: (0, date_fns_1.endOfDay)(timeSlot.startTime)
                                }
                            }
                        },
                        include: {
                            timeSlot: true
                        }
                    });
                    if (existingBooking) {
                        throw new Error(`You already have a booking on ${(0, date_fns_1.format)(existingBooking.timeSlot.startTime, 'MMMM do, yyyy')} at ${(0, date_fns_1.format)(existingBooking.timeSlot.startTime, 'h:mm a')}`);
                    }
                    const user = yield tx.user.findUnique({
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
                    const booking = yield tx.booking.create({
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
                    yield tx.timeSlot.update({
                        where: { id: timeSlotId },
                        data: { isBooked: true }
                    });
                    const emailData = {
                        date: (0, date_fns_1.format)(booking.timeSlot.startTime, 'MMMM do, yyyy'),
                        startTime: (0, date_fns_1.format)(booking.timeSlot.startTime, 'h:mm a'),
                        endTime: (0, date_fns_1.format)(booking.timeSlot.endTime, 'h:mm a'),
                        userName: `${booking.user.firstName} ${booking.user.lastName}`,
                        speakerName: `${booking.timeSlot.speaker.user.firstName} ${booking.timeSlot.speaker.user.lastName}`
                    };
                    Promise.all([
                        (0, mailService_1.sendEmail)(booking.user.email, emailTemplates_1.bookingEmailTemplates.userBookingConfirmation(emailData).subject, emailTemplates_1.bookingEmailTemplates.userBookingConfirmation(emailData).html),
                        (0, mailService_1.sendEmail)(booking.timeSlot.speaker.user.email, emailTemplates_1.bookingEmailTemplates.speakerBookingNotification(emailData).subject, emailTemplates_1.bookingEmailTemplates.speakerBookingNotification(emailData).html)
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
                }));
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getUserBookings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield prisma.booking.findMany({
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getSpeakerBookings(speakerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield prisma.booking.findMany({
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getBookingById(bookingId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield prisma.booking.findFirst({
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.BookingService = BookingService;
