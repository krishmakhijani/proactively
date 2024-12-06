"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const speakerListingController_1 = require("../controllers/speakerListingController");
const auth_1 = require("../middleware/auth");
const speakerAuth_1 = require("../middleware/speakerAuth");
const router = express_1.default.Router();
const speakerListingController = new speakerListingController_1.SpeakerListingController();
router.get('/', speakerListingController.listSpeakers);
router.post('/:speakerId/time-slots', auth_1.auth, speakerAuth_1.speakerAuth, speakerListingController.generateTimeSlots);
exports.default = router;
