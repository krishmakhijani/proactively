import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOTP, sendVerificationEmail } from './mailService';

const prisma = new PrismaClient();

export class AuthService {
    async signup(userData: any) {
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new Error('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                otp,
                otpExpiry
            }
        });

        await sendVerificationEmail(user.email, otp);

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isVerified: user.isVerified
            }
        };
    }

    async verifyOTP(email: string, otp: string) {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.isVerified) {
            throw new Error('User already verified');
        }

        if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            throw new Error('Invalid or expired OTP');
        }

        const verifiedUser = await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null
            }
        });

        return {
            message: 'Email verified successfully',
            user: {
                id: verifiedUser.id,
                email: verifiedUser.email,
                isVerified: verifiedUser.isVerified
            }
        };
    }
}
