import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();

router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOTP);

export default router;
