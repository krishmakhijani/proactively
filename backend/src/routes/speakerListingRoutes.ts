import express from 'express';
import { SpeakerListingController } from '../controllers/speakerListingController';
import { auth } from '../middleware/auth';
import { speakerAuth } from '../middleware/speakerAuth';

const router = express.Router();
const speakerListingController = new SpeakerListingController();

router.get('/', speakerListingController.listSpeakers);

router.post(
    '/:speakerId/time-slots',
    auth,
    speakerAuth,
    speakerListingController.generateTimeSlots
);

export default router;
