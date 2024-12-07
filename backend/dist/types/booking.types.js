"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = void 0;
const zod_1 = require("zod");
const createBookingSchema = zod_1.z.object({
    timeSlotId: zod_1.z.string()
});
exports.createBookingSchema = createBookingSchema;
