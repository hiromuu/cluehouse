const CALENDAR_ID = 'hiroshimanclue.house@gmail.com';
const API_KEY = 'AIzaSyC0d713QgJF4rPowAHS_bG45Prhmg7-Wzk';

async function fetchCalendarEvents(date) {
    const timeMin = new Date(date).toISOString();
    const timeMax = new Date(date);
    timeMax.setDate(timeMax.getDate() + 1);
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax.toISOString()}`);
    const data = await response.json();
    return data.items;
}

document.getElementById('reservation-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const date = e.target.date.value;
    const startTime = e.target.startTime.value;
    const endTime = e.target.endTime.value;
    const people = e.target.people.value;

    const events = await fetchCalendarEvents(date);
    const isAvailable = !events.some(event => {
        const eventStartTime = new Date(event.start.dateTime).getHours();
        const eventEndTime = new Date(event.end.dateTime).getHours();
        const selectedStartTime = new Date(`${date}T${startTime}`).getHours();
        const selectedEndTime = new Date(`${date}T${endTime}`).getHours();
        return (eventStartTime < selectedEndTime && selectedStartTime < eventEndTime);
    });

    if (isAvailable) {
        const event = {
            date,
            startTime,
            endTime,
            people
        };

        // サーバーサイドのAPIを呼び出す
        const response = await fetch('http://localhost:3000/addEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });
        const result = await response.json();

        if (result.success) {
            alert('予約が完了しました！');
        } else {
            alert('エラーが発生しました。再試行してください。');
        }
    } else {
        alert('選択された時間はすでに予約されています。');
    }
});
