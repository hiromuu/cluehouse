import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import Modal from "react-modal";

import "./Calendar.css";

const Calendar = () => {
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
    info.jsEvent.preventDefault(); // グーグルカレンダーに飛ばないようにする
    // クリックされたイベントの日付に移動
    // info.view.calendar.gotoDate(info.event.start);
    // dayビューに変更
    // info.view.calendar.changeView("timeGridDay");
    setSelectedEvent(info.event);
    setModalIsOpen(true);
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
      {/* {selectedEvent && (
        // <Modal
        //   isOpen={modalIsOpen}
        //   onRequestClose={() => setModalIsOpen(false)}
        //   contentLabel="Event Details"
        //   style={{
        //     overlay: {
        //       pointerEvents: "none",
        //     },
        //     content: {
        //       zIndex: -11,
        //       pointerEvents: "auto",
        //       top: "50%",
        //       left: "50%",
        //       right: "auto",
        //       bottom: "auto",
        //       transform: "translate(-50%, -50%)",
        //       padding: "20px",
        //       backgroundColor: selectedEvent
        //         ? getEventColor(selectedEvent.title).backgroundColor
        //         : "white", // ポップアップの背景色をイベントの色に設定
        //       color: selectedEvent
        //         ? getEventColor(selectedEvent.title).textColor
        //         : "black", // ポップアップの文字色をイベントの文字色に設定
        //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 影を追加
        //       border: "none",
        //       borderRadius: "8px",
        //       overflowY: "auto", // コンテンツが多い場合にスクロール可能にする
        //     },
        //   }}
        // >
        //   <div onClick={(e) => e.stopPropagation()}>
        //     <h2>{selectedEvent.title}</h2>
        //     <p>{selectedEvent.extendedProps.description}</p>
        //     <button
        //       onClick={() => setModalIsOpen(false)}
        //       style={{
        //         position: "absolute",
        //         top: "10px",
        //         right: "10px",
        //         background: "red",
        //         color: "white",
        //         border: "none",
        //         borderRadius: "50%",
        //         width: "30px",
        //         height: "30px",
        //         textAlign: "center",
        //         lineHeight: "30px",
        //         cursor: "pointer",
        //       }}
        //     >
        //       閉
        //     </button>
        //   </div>
        // </Modal>
      )} */}
    </div>
  );
};

export default Calendar;
