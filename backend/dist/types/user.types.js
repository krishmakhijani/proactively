"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.verifyOtpSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
const signupSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['USER', 'SPEAKER'])
});
exports.signupSchema = signupSchema;
const verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    otp: zod_1.z.string().length(6, 'OTP must be 6 characters')
});
exports.verifyOtpSchema = verifyOtpSchema;
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
exports.loginSchema = loginSchema;
