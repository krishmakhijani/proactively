"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const speakerController_1 = require("../controllers/speakerController");
const auth_1 = require("../middleware/auth");
const speakerAuth_1 = require("../middleware/speakerAuth");
const router = express_1.default.Router();
const speakerController = new speakerController_1.SpeakerController();
router.post('/profile', auth_1.auth, speakerAuth_1.speakerAuth, speakerController.createProfile);
router.put('/profile', auth_1.auth, speakerAuth_1.speakerAuth, speakerController.updateProfile);
router.get('/profile', auth_1.auth, speakerAuth_1.speakerAuth, speakerController.getProfile);
exports.default = router;
