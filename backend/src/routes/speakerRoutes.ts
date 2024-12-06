import express from 'express';
import { SpeakerController } from '../controllers/speakerController';
import { auth } from '../middleware/auth';
import { speakerAuth } from '../middleware/speakerAuth';

const router = express.Router();
const speakerController = new SpeakerController();

router.post('/profile', auth, speakerAuth, speakerController.createProfile);
router.put('/profile', auth, speakerAuth, speakerController.updateProfile);
router.get('/profile', auth, speakerAuth, speakerController.getProfile);

export default router;
