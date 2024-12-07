"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauth2Client = exports.googleConfig = void 0;
const google_auth_library_1 = require("google-auth-library");
if (!process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URI ||
    !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('Missing Google Calendar credentials in environment variables');
}
exports.googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN
};
exports.oauth2Client = new google_auth_library_1.OAuth2Client(exports.googleConfig.clientId, exports.googleConfig.clientSecret, exports.googleConfig.redirectUri);
exports.oauth2Client.setCredentials({
    refresh_token: exports.googleConfig.refreshToken
});
