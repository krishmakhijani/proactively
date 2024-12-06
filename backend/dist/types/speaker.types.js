"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpeakerProfileSchema = exports.createSpeakerProfileSchema = void 0;
const zod_1 = require("zod");
const createSpeakerProfileSchema = zod_1.z.object({
    expertise: zod_1.z.array(zod_1.z.string()).min(1, "At least one expertise is required"),
    pricePerSession: zod_1.z.number().positive("Price must be positive"),
    bio: zod_1.z.string().optional()
});
exports.createSpeakerProfileSchema = createSpeakerProfileSchema;
const updateSpeakerProfileSchema = zod_1.z.object({
    expertise: zod_1.z.array(zod_1.z.string()).min(1, "At least one expertise is required").optional(),
    pricePerSession: zod_1.z.number().positive("Price must be positive").optional(),
    bio: zod_1.z.string().optional()
});
exports.updateSpeakerProfileSchema = updateSpeakerProfileSchema;
