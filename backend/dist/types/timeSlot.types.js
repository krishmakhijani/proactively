"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTimeSlotsSchema = exports.listSpeakersQuerySchema = void 0;
const zod_1 = require("zod");
const listSpeakersQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    expertise: zod_1.z.string().optional(),
    date: zod_1.z.string().optional()
});
exports.listSpeakersQuerySchema = listSpeakersQuerySchema;
const generateTimeSlotsSchema = zod_1.z.object({
    date: zod_1.z.string()
});
exports.generateTimeSlotsSchema = generateTimeSlotsSchema;
