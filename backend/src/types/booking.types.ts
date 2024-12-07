import { z } from 'zod'


const createBookingSchema = z.object({
    timeSlotId: z.string()
})

export { createBookingSchema }
