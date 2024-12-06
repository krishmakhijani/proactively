import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SpeakerService {
    async createProfile(userId: string, profileData: {
        expertise: string[];
        pricePerSession: number;
        bio?: string;
    }) {
        try {
            const existingProfile = await prisma.speaker.findUnique({
                where: { userId }
            });

            if (existingProfile) {
                throw new Error('Speaker profile already exists');
            }

            const speaker = await prisma.speaker.create({
                data: {
                    ...profileData,
                    userId
                }
            });

            return {
                status: 'success',
                message: 'Speaker profile created successfully',
                data: speaker
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async updateProfile(userId: string, profileData: {
        expertise?: string[];
        pricePerSession?: number;
        bio?: string;
    }) {
        try {
            const existingProfile = await prisma.speaker.findUnique({
                where: { userId }
            });

            if (!existingProfile) {
                throw new Error('Speaker profile not found');
            }

            const updatedProfile = await prisma.speaker.update({
                where: { userId },
                data: profileData
            });

            return {
                status: 'success',
                message: 'Speaker profile updated successfully',
                data: updatedProfile
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getProfile(userId: string) {
        try {
            const profile = await prisma.speaker.findUnique({
                where: { userId },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });

            if (!profile) {
                throw new Error('Speaker profile not found');
            }

            return {
                status: 'success',
                data: profile
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
