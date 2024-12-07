"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const userAuth_1 = require("../middleware/userAuth");
const router = express_1.default.Router();
const bookingController = new bookingController_1.BookingController();
router.post('/', auth_1.auth, userAuth_1.userAuth, bookingController.createBooking);
router.get('/my-bookings', auth_1.auth, userAuth_1.userAuth, bookingController.getUserBookings);
exports.default = router;
