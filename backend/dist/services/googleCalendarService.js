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
const googleCalendar_1 = require("../config/googleCalendar");
class GoogleCalendarService {
    constructor() {
        this.calendar = googleapis_1.google.calendar({ version: 'v3', auth: googleCalendar_1.oauth2Client });
    }
    createEvent(eventInput) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const event = yield this.calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: {
                        summary: eventInput.summary,
                        description: eventInput.description,
                        start: {
                            dateTime: eventInput.startTime.toISOString(),
                            timeZone: 'Asia/Kolkata',
                        },
                        end: {
                            dateTime: eventInput.endTime.toISOString(),
                            timeZone: 'Asia/Kolkata',
                        },
                        attendees: eventInput.attendees,
                        conferenceData: {
                            createRequest: {
                                requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
                                conferenceSolutionKey: { type: 'hangoutsMeet' }
                            }
                        },
                        reminders: {
                            useDefault: false,
                            overrides: [
                                { method: 'email', minutes: 24 * 60 },
                                { method: 'popup', minutes: 30 }
                            ]
                        }
                    },
                    conferenceDataVersion: 1
                });
                if (!event.data.id || !event.data.summary || !event.data.description ||
                    !((_a = event.data.start) === null || _a === void 0 ? void 0 : _a.dateTime) || !((_b = event.data.end) === null || _b === void 0 ? void 0 : _b.dateTime)) {
                    throw new Error('Invalid event data received from Google Calendar');
                }
                return {
                    id: event.data.id,
                    summary: event.data.summary,
                    description: event.data.description,
                    startTime: event.data.start.dateTime,
                    endTime: event.data.end.dateTime,
                    meetLink: event.data.hangoutLink || '',
                    attendees: event.data.attendees || []
                };
            }
            catch (error) {
                console.error('Failed to create calendar event:', error);
                throw new Error('Failed to create calendar event');
            }
        });
    }
}
exports.GoogleCalendarService = GoogleCalendarService;
