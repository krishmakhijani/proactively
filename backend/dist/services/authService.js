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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailService_1 = require("./mailService");
const prisma = new client_1.PrismaClient();
class AuthService {
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({
                    where: { email: credentials.email }
                });
                if (!user) {
                    throw new Error('Invalid credentials');
                }
                if (!user.isVerified) {
                    throw new Error('Please verify your email first');
                }
                const isPasswordValid = yield bcrypt_1.default.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid credentials');
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET);
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield prisma.user.findUnique({
                    where: { email: userData.email }
                });
                if (existingUser) {
                    throw new Error('Email already registered');
                }
                const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
                const otp = (0, mailService_1.generateOTP)();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                const user = yield prisma.user.create({
                    data: Object.assign(Object.assign({}, userData), { password: hashedPassword, otp,
                        otpExpiry })
                });
                yield (0, mailService_1.sendVerificationEmail)(user.email, otp);
                const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({
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
                const verifiedUser = yield prisma.user.update({
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.AuthService = AuthService;
