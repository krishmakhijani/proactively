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
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const user_types_1 = require("../types/user.types");
const authService = new authService_1.AuthService();
class AuthController {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = user_types_1.signupSchema.parse(req.body);
                const result = yield authService.signup(validatedData);
                res.status(201).json({
                    status: 'success',
                    data: result
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = user_types_1.loginSchema.parse(req.body);
                const result = yield authService.login(validatedData);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
    verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = user_types_1.verifyOtpSchema.parse(req.body);
                const result = yield authService.verifyOTP(validatedData.email, validatedData.otp);
                res.status(200).json({
                    status: 'success',
                    data: result
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
}
exports.AuthController = AuthController;
