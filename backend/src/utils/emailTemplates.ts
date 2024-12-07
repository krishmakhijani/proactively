export const bookingEmailTemplates = {
    userBookingConfirmation: (data: {
        userName: string;
        speakerName: string;
        date: string;
        startTime: string;
        endTime: string;
    }) => {
        return {
            subject: 'Booking Confirmation',
            html: `
                <h1>Booking Confirmed!</h1>
                <p>Dear ${data.userName},</p>
                <p>Your session has been successfully booked with ${data.speakerName}.</p>
                <p>Details:</p>
                <ul>
                    <li>Date: ${data.date}</li>
                    <li>Time: ${data.startTime} - ${data.endTime}</li>
                </ul>
                <p>Please make sure to be on time for your session.</p>
                <p>Best regards,<br>Team</p>
            `
        };
    },

    speakerBookingNotification: (data: {
        speakerName: string;
        userName: string;
        date: string;
        startTime: string;
        endTime: string;
    }) => {
        return {
            subject: 'New Session Booking',
            html: `
                <h1>New Booking Alert!</h1>
                <p>Dear ${data.speakerName},</p>
                <p>You have a new session booking from ${data.userName}.</p>
                <p>Details:</p>
                <ul>
                    <li>Date: ${data.date}</li>
                    <li>Time: ${data.startTime} - ${data.endTime}</li>
                </ul>
                <p>Please be prepared for the session.</p>
                <p>Best regards,<br>Team</p>
            `
        };
    }
};
