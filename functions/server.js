const express = require('express');
const bodyParser = require('body-parser');
const {google} = require('googleapis');
const SERVICE_ACCOUNT = require('../original-mesh-395605-a28a7f1165d1.json');

const app = express();
const CALENDAR_ID = 'hiroshimanclue.house@gmail.com';

app.use(bodyParser.json());

app.post('/addEvent', async (req, res) => {
    const {date, startTime, endTime, people} = req.body;

    const jwtClient = new google.auth.JWT(
        SERVICE_ACCOUNT.client_email,
        null,
        SERVICE_ACCOUNT.private_key,
        ['https://www.googleapis.com/auth/calendar']
    );

    jwtClient.authorize((err, tokens) => {
        if (err) {
            res.status(500).json({success: false, message: err.message});
            return;
        }

        const calendar = google.calendar({version: 'v3', auth: jwtClient});
        const event = {
            'summary': '施設予約',
            'description': `人数: ${people}`,
            'start': {
                'dateTime': `${date}T${startTime}:00`,
                'timeZone': 'Asia/Tokyo'
            },
            'end': {
                'dateTime': `${date}T${endTime}:00`,
                'timeZone': 'Asia/Tokyo'
            }
        };

        calendar.events.insert({
            auth: jwtClient,
            calendarId: CALENDAR_ID,
            resource: event
        }, (err, event) => {
            if (err) {
                res.status(500).json({success: false, message: err.message});
                return;
            }
            res.json({success: true});
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
