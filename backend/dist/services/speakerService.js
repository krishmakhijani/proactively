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
exports.SpeakerService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SpeakerService {
    createProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingProfile = yield prisma.speaker.findUnique({
                    where: { userId }
                });
                if (existingProfile) {
                    throw new Error('Speaker profile already exists');
                }
                const speaker = yield prisma.speaker.create({
                    data: Object.assign(Object.assign({}, profileData), { userId })
                });
                return {
                    status: 'success',
                    message: 'Speaker profile created successfully',
                    data: speaker
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    updateProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingProfile = yield prisma.speaker.findUnique({
                    where: { userId }
                });
                if (!existingProfile) {
                    throw new Error('Speaker profile not found');
                }
                const updatedProfile = yield prisma.speaker.update({
                    where: { userId },
                    data: profileData
                });
                return {
                    status: 'success',
                    message: 'Speaker profile updated successfully',
                    data: updatedProfile
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield prisma.speaker.findUnique({
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.SpeakerService = SpeakerService;
