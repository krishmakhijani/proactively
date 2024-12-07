import express from 'express';
import { BookingController } from '../controllers/bookingController';
import { auth } from '../middleware/auth';
import { userAuth } from '../middleware/userAuth';

const router = express.Router();
const bookingController = new BookingController();

router.post('/', auth, userAuth, bookingController.createBooking);
router.get('/my-bookings', auth, userAuth, bookingController.getUserBookings);

export default router;
