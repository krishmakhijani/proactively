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
exports.SpeakerListingController = void 0;
const speakerListingService_1 = require("../services/speakerListingService");
const timeSlot_types_1 = require("../types/timeSlot.types");
const speakerListingService = new speakerListingService_1.SpeakerListingService();
class SpeakerListingController {
    constructor() {
        this.listSpeakers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = timeSlot_types_1.listSpeakersQuerySchema.parse(req.query);
                const result = yield speakerListingService.listSpeakers(validatedData);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
        this.generateTimeSlots = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    throw new Error('Unauthorized');
                }
                const validatedData = timeSlot_types_1.generateTimeSlotsSchema.parse(req.body);
                const result = yield speakerListingService.generateTimeSlots(req.params.speakerId, validatedData.date);
                res.status(201).json(result);
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
exports.SpeakerListingController = SpeakerListingController;
