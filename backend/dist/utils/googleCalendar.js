"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarService = void 0;
const googleapis_1 = require("googleapis");
class GoogleCalendarService {
    constructor() {
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);
        this.oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });
    }
    createCalendarEvent(_a) {
        return __awaiter(this, arguments, void 0, function* ({ summary, description, startTime, endTime, attendees }) {
            try {
                const calendar = googleapis_1.google.calendar({ version: 'v3', auth: this.oauth2Client });
                const event = {
                    summary,
                    description,
                    start: {
                        dateTime: startTime.toISOString(),
                        timeZone: 'Asia/Kolkata',
                    },
                    end: {
                        dateTime: endTime.toISOString(),
                        timeZone: 'Asia/Kolkata',
                    },
                    attendees,
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: 'email', minutes: 24 * 60 },
                            { method: 'popup', minutes: 30 },
                        ],
                    },
                    conferenceData: {
                        createRequest: {
                            requestId: Math.random().toString(),
                            conferenceSolutionKey: { type: 'hangoutsMeet' }
                        }
                    }
                };
                const response = yield calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: event,
                    conferenceDataVersion: 1,
                });
                return response.data;
            }
            catch (error) {
                console.error('Error creating calendar event:', error);
                throw error;
            }
        });
    }
}
exports.GoogleCalendarService = GoogleCalendarService;
