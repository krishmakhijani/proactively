import { z } from 'zod'

const listSpeakersQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    expertise: z.string().optional(),
    date: z.string().optional()  
})

const generateTimeSlotsSchema = z.object({
    date: z.string()
})

export { listSpeakersQuerySchema, generateTimeSlotsSchema }
