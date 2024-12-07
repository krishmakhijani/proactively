import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOTP, sendVerificationEmail } from './mailService';

const prisma = new PrismaClient();

export class AuthService {
    async login(credentials: { email: string; password: string }) {
        try {
            const user = await prisma.user.findUnique({
                where: { email: credentials.email }
            });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            if (!user.isVerified) {
                throw new Error('Please verify your email first');
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email,role: user.role },
                process.env.JWT_SECRET!
            );

            return {
                status: 'success',
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        isVerified: user.isVerified
                    }
                }
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async signup(userData: any) {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email }
            });

            if (existingUser) {
                throw new Error('Email already registered');
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

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
                process.env.JWT_SECRET!
            );

            return {
                status: 'success',
                message: 'Signup successful! Please check your email for OTP verification.',
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        isVerified: user.isVerified
                    }
                }
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async verifyOTP(email: string, otp: string) {
        try {
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
                status: 'success',
                message: 'Email verified successfully',
                data: {
                    user: {
                        id: verifiedUser.id,
                        email: verifiedUser.email,
                        isVerified: verifiedUser.isVerified
                    }
                }
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
