import { z } from 'zod'

const createSpeakerProfileSchema = z.object({
    expertise: z.array(z.string()).min(1, "At least one expertise is required"),
    pricePerSession: z.number().positive("Price must be positive"),
    bio: z.string().optional()
})

const updateSpeakerProfileSchema = z.object({
    expertise: z.array(z.string()).min(1, "At least one expertise is required").optional(),
    pricePerSession: z.number().positive("Price must be positive").optional(),
    bio: z.string().optional()
})

export { createSpeakerProfileSchema, updateSpeakerProfileSchema }
