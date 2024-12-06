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
exports.SpeakerController = void 0;
const speakerService_1 = require("../services/speakerService");
const speaker_types_1 = require("../types/speaker.types");
const speakerService = new speakerService_1.SpeakerService();
class SpeakerController {
    constructor() {
        this.createProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        status: 'error',
                        message: 'Not authenticated'
                    });
                    return;
                }
                const validatedData = speaker_types_1.createSpeakerProfileSchema.parse(req.body);
                const result = yield speakerService.createProfile(req.user.userId, validatedData);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
        this.updateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        status: 'error',
                        message: 'Not authenticated'
                    });
                    return;
                }
                const validatedData = speaker_types_1.updateSpeakerProfileSchema.parse(req.body);
                const result = yield speakerService.updateProfile(req.user.userId, validatedData);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        status: 'error',
                        message: 'Not authenticated'
                    });
                    return;
                }
                const result = yield speakerService.getProfile(req.user.userId);
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
}
exports.SpeakerController = SpeakerController;
