import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import Modal from "react-modal";

import "./Calendar.css";

const Calendar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDateClick = (info) => {
    const events =
      info.dayEl && info.dayEl.fcSegs
        ? info.dayEl.fcSegs.map((seg) => seg.event)
        : [];
    setSelectedDateEvents(events.map((event) => event.title));

    // クリックされた日付に移動
    info.view.calendar.gotoDate(info.dateStr);

    // dayビューに変更
    info.view.calendar.changeView("timeGridDay");
  };

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    const rect = info.jsEvent.currentTarget.getBoundingClientRect();
    setPopupPosition({ x: rect.left, y: rect.top });
    setSelectedEvent(info.event);
    setShowPopup(true);
  };

  const getEventColor = (eventTitle) => {
    if (eventTitle.startsWith("飛び込みOK")) {
      return { backgroundColor: "blue", textColor: "white" }; // 飛び込みOKの場合は背景色を緑色、文字色を白に
    } else if (eventTitle.startsWith("飛び込みNG")) {
      return { backgroundColor: "red", textColor: "white" }; // 飛び込みNGの場合は背景色を赤色、文字色を白に
    }
    return {}; // デフォルトの色設定
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          googleCalendarPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        // eventContent={renderEventContent}
        eventDidMount={(info) => {
          const colors = getEventColor(info.event.title);
          if (colors.backgroundColor) {
            info.el.style.backgroundColor = colors.backgroundColor;
          }
          if (colors.textColor) {
            info.el.style.color = colors.textColor;
          }
        }}
        googleCalendarApiKey="AIzaSyC0d713QgJF4rPowAHS_bG45Prhmg7-Wzk"
        events={{
          googleCalendarId: "hiroshimanclue.house@gmail.com",
          eventDataTransform: (eventData) => {
            return {
              ...eventData,
              color: eventData.color,
              backgroundColor: eventData.backgroundColor,
              borderColor: eventData.borderColor,
            };
          },
        }}
        height="auto"
        selectable={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        slotDuration="00:30:00"
        scrollTime="00:00:00"
        allDaySlot={false}
      />
      {showPopup && selectedEvent && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "10px",
            transform: "translate(-50%, -50%)",
            maxHeight: "80vh", // 画面の高さの80%を最大高さとして設定
            overflowY: "auto", // 縦方向のオーバーフローをスクロールに設定
            width: "80%", // 幅も80%に設定して、内容が折り返されるようにします
            boxSizing: "border-box", // paddingとborderを含めてサイズを計算
          }}
        >
          <h2>{selectedEvent.title}</h2>
          <p>{selectedEvent.extendedProps.description}</p>
          <button onClick={() => setShowPopup(false)}>閉じる</button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
