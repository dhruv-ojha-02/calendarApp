import {
  events,
  addEventModal,
  eventDetailsModal,
  eventForm,
  prevButton,
  nextButton,
  editButton,
  cancelButton,
  closeButton,
  deleteButton,
  viewButton,
  updateCalendarView,
} from "../config.js";

let weekTitleElement = document.getElementById("weekTitleElement");
let weekdaysContainer = document.getElementById("weekdays");
let slotsContainer = document.getElementById("weekSlots");

viewButton.value = "week";

// Gets the first day of the week
function getWeekStart(date) {
  const dayInWeek = date.getDay();
  const difference = date.getDate() - dayInWeek;
  return new Date(date.getFullYear(), date.getMonth(), difference);
}

let currWeekStart = getWeekStart(new Date());

// Opens the event modal to add event
function handleOpenEventModal(slotTime, eventId) {
  cancelButton.onclick = () => {
    handleClose();
  };
  let formattedTime = slotTime + ":00";
  document.getElementById("eventTime").value = formattedTime;

  addEventModal.style.display = "flex";
  eventForm.onsubmit = (evt) => {
    evt.preventDefault();
    handleSave(evt, slotTime, eventId);
  };
}

// Save the user's event to local storage
function handleSave(evt, slotTime, eventId) {
  evt.preventDefault();

  cancelButton.onclick = () => {
    handleClose();
  };

  let eventTitle = document.getElementById("eventTitle").value;
  let eventTime = document.getElementById("eventTime").value;
  let eventEndTime = document.getElementById("eventEndTime").value;
  let eventAttendees = document.getElementById("eventAttendees").value;
  if (
    eventTitle &&
    eventTime &&
    eventEndTime &&
    eventAttendees &&
    eventEndTime > eventTime
  ) {
    let newEvent = {
      id: new Date().toLocaleString(),
      eventDate: eventId,
      startTime: eventTime,
      title: eventTitle,
      endTime: eventEndTime,
      attendees: eventAttendees,
    };
    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    handleClose();
  } else {
    alert(`Please set a valid end time.`);
  }
}

// Displays the existing event's details
function displayEventDetails(evtIdx, evt) {
  eventDetailsModal.style.display = "flex";
  closeButton.onclick = () => {
    handleClose();
  };
  editButton.addEventListener("click", () => {
    handleEdit(evtIdx, evt);
  });
  deleteButton.addEventListener("click", () => {
    handleDelete(evtIdx, evt);
  });

  const titleDetail = document.getElementById("titleDetail");
  const timeDetail = document.getElementById("timeDetail");
  const endTimeDetail = document.getElementById("endTimeDetail");
  const attendeesDetail = document.getElementById("attendeesDetail");

  titleDetail.textContent = `Title: ${evt.title}`;
  timeDetail.textContent = `Start Time: ${evt.startTime}`;
  endTimeDetail.textContent = `End Time: ${evt.endTime}`;
  attendeesDetail.textContent = `Attendees: ${evt.attendees}`;
}
// Edits the existing event
function handleEdit(evtIdx, evt) {
  let eventToEdit = events.find((event) => event.id === evtIdx);

  if (eventToEdit) {
    document.getElementById("eventTitle").value = eventToEdit.title;
    document.getElementById("eventTime").value = eventToEdit.startTime;
    document.getElementById("eventEndTime").value = eventToEdit.endTime;
    document.getElementById("eventAttendees").value = eventToEdit.attendees;
    eventDetailsModal.style.display = "none";
    addEventModal.style.display = "flex";

    eventForm.onsubmit = (e) => {
      e.preventDefault();
      eventToEdit.title = document.getElementById("eventTitle").value;
      eventToEdit.startTime = document.getElementById("eventTime").value;
      eventToEdit.endTime = document.getElementById("eventEndTime").value;
      eventToEdit.attendees = document.getElementById("eventAttendees").value;
      localStorage.setItem("events", JSON.stringify(events));
      handleClose();
    };
  }
}

// Deletes the existing event
function handleDelete(evtIdx, evt) {
  let index = events.findIndex((event) => event.id === evtIdx);
  if (index !== -1) {
    events.splice(index, 1); //.splice(index,no of items to remove, 1st item to add,2nd item to add,...)
    localStorage.setItem("events", JSON.stringify(events));
    handleClose();
  }
}

// Closes the event Modal
function handleClose() {
  addEventModal.style.display = "none";
  eventDetailsModal.style.display = "none";

  // value reset to default
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventTime").value = null;
  document.getElementById("eventEndTime").value = null;
  document.getElementById("eventAttendees").value = "";
  renderCalendar(currWeekStart);
}

// Renders the next week in the Calendar
function handleNextWeek() {
  currWeekStart.setDate(currWeekStart.getDate() + 7);
  renderCalendar(new Date(currWeekStart));
}

// Renders the previous week in the Calendar
function handlePrevWeek() {
  currWeekStart.setDate(currWeekStart.getDate() - 7);
  renderCalendar(new Date(currWeekStart));
}

// Displays the existing events in the corresponding Calendar view
// function renderEvents(weekStart) {
//   let weeklyEvents = events.filter((evt) => {
//     let [day, month, year] = evt.eventDate.split("/").map(Number);
//     let evtDateObj = new Date(year, month - 1, day);
//     return (
//       evtDateObj >= weekStart &&
//       evtDateObj <= new Date(weekStart.getTime() + 6 * 86400000)
//     );
//   });

//   // track positions for overlapping events
//   let eventPositions = {};

//   weeklyEvents.forEach((evt) => {
//     const [startHour, startMinute] = evt.startTime.split(":").map(Number);
//     const [endHour, endMinute] = evt.endTime.split(":").map(Number);
//     let evtDateStr = evt.eventDate.trim();

//     // Calculate total event duration
//     let eventDurationMinutes =
//       (endHour - startHour) * 60 + (endMinute - startMinute);

//     // Calculate height of the event block (each hour 45px)
//     let height = (eventDurationMinutes / 60) * 45;
//     let topOffset = (startMinute / 60) * 45;

//     // Handling Overlapping Events
//     // unique key to track overlapping events based on start hour and same date
//     let eventKey = `${startHour}_${evtDateStr}`;

//     if (!eventPositions[eventKey]) {
//       eventPositions[eventKey] = [];
//     }

//     let eventIndex = eventPositions[eventKey].length;
//     eventPositions[eventKey].push(evt);
//     let eventWidth = 95 / eventPositions[eventKey].length; //95% width is alloted
//     let leftOffset = eventIndex * eventWidth;

//     // Finding the particular childslot for an event
//     let targetSlot = document.querySelector(
//       `.childSlot[hour='${
//         startHour < 10 ? "0" : ""
//       }${startHour}'][date='${evtDateStr}']`
//     );

//     if (targetSlot) {
//       const eventContainer = targetSlot.querySelector(".weekEventsContainer");
//       if (eventContainer) {
//         const eventDiv = document.createElement("div");
//         eventDiv.classList.add("eventDivWeekView");
//         eventDiv.textContent = `Title: ${evt.title}\nAttendees: ${evt.attendees}`;
//         eventDiv.style.top = `${topOffset}px`;
//         eventDiv.style.height = `${height}px`;
//         eventDiv.style.width = `${eventWidth}%`;
//         eventDiv.style.left = `${leftOffset}%`;

//         // adding event listener for the event
//         eventDiv.addEventListener("click", () => {
//           displayEventDetails(evt.id, evt);
//         });
//         eventContainer.appendChild(eventDiv);
//       }
//     }
//   });
// }

// Filters events to get only those in the current week
function getWeeklyEvents(weekStart) {
  return events.filter((evt) => {
    let [day, month, year] = evt.eventDate.split("/").map(Number);
    let evtDateObj = new Date(year, month - 1, day);
    return (
      evtDateObj >= weekStart &&
      evtDateObj <= new Date(weekStart.getTime() + 6 * 86400000)
    );
  });
}

// Calculates the dimensions and position for an event, handling overlaps
function getEventStyle(evt, eventPositions) {
  const [startHour, startMinute] = evt.startTime.split(":").map(Number);
  const [endHour, endMinute] = evt.endTime.split(":").map(Number);
  let evtDateStr = evt.eventDate.trim();

  // Calculate event duration in minutes
  let eventDurationMinutes =
    (endHour - startHour) * 60 + (endMinute - startMinute);

  // Determine height (45px represents one hour)
  let height = (eventDurationMinutes / 60) * 45;
  let topOffset = (startMinute / 60) * 45;

  // Handle overlapping events based on startHour and date
  let eventKey = `${startHour}_${evtDateStr}`;
  if (!eventPositions[eventKey]) {
    eventPositions[eventKey] = [];
  }
  let eventIndex = eventPositions[eventKey].length;
  eventPositions[eventKey].push(evt);
  let eventWidth = 95 / eventPositions[eventKey].length; // using 95% of available width
  let leftOffset = eventIndex * eventWidth;

  return { startHour, topOffset, height, eventWidth, leftOffset, evtDateStr };
}

// Renders a single event div in the correct slot based on computed styles
function renderEvent(evt, styleProps) {
  const { startHour, topOffset, height, eventWidth, leftOffset, evtDateStr } =
    styleProps;

  // Find the specific child slot using hour and date
  let targetSlot = document.querySelector(
    `.childSlot[hour='${
      startHour < 10 ? "0" : ""
    }${startHour}'][date='${evtDateStr}']`
  );
  if (targetSlot) {
    const eventContainer = targetSlot.querySelector(".weekEventsContainer");
    if (eventContainer) {
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("eventDivWeekView");
      eventDiv.textContent = `Title: ${evt.title}\nAttendees: ${evt.attendees}`;
      eventDiv.style.top = `${topOffset}px`;
      eventDiv.style.height = `${height}px`;
      eventDiv.style.width = `${eventWidth}%`;
      eventDiv.style.left = `${leftOffset}%`;

      // adding event listener for each event
      eventDiv.addEventListener("click", () => {
        displayEventDetails(evt.id, evt);
      });

      eventContainer.appendChild(eventDiv);
    }
  }
}

// Displays the existing events in the corresponding Calendar view
function renderEvents(weekStart) {
  let weeklyEvents = getWeeklyEvents(weekStart);
  let eventPositions = {}; // Object to track overlapping events

  weeklyEvents.forEach((evt) => {
    const styleProps = getEventStyle(evt, eventPositions);
    renderEvent(evt, styleProps);
  });
}

// Populates the calendar grid with empty cells for the given week
function populateCalendar(weekStart) {
  slotsContainer.innerHTML = "";

  for (let i = 0; i < 24; i++) {
    const slotCellContainer = document.createElement("div");
    slotCellContainer.classList.add("slotCellContainer");
    const slotCell = document.createElement("div");
    slotCell.classList.add("weekSlotCell");
    const formattedHour = i < 10 ? `0${i}` : `${i}`;
    const hour12 = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "AM" : "PM";
    const slotLabel = document.createElement("div");
    slotLabel.textContent = `${hour12} ${period}`;
    slotLabel.classList.add("slotLabel");
    slotLabel.setAttribute("hour", formattedHour);

    for (let j = 0; j < 7; j++) {
      let currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + j);
      let dateStr = `${currentDay.getDate()}/${
        currentDay.getMonth() + 1
      }/${currentDay.getFullYear()}`;

      const childSlot = document.createElement("div");
      childSlot.classList.add("childSlot");
      childSlot.setAttribute("hour", formattedHour);
      childSlot.setAttribute("date", dateStr);
      const eventsContainer = document.createElement("div");
      eventsContainer.classList.add("weekEventsContainer");
      eventsContainer.setAttribute("hour", formattedHour);
      childSlot.appendChild(eventsContainer);

      childSlot.addEventListener("click", () => {
        handleOpenEventModal(formattedHour, dateStr);
      });
      slotCell.appendChild(childSlot);
    }
    slotCellContainer.appendChild(slotCell);
    slotCellContainer.appendChild(slotLabel);
    slotsContainer.appendChild(slotCellContainer);
  }
  renderEvents(weekStart);
}

// Generates the calendar layout for the given week
function renderCalendar(weekStart) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekdaysContainer.innerHTML = "";
  slotsContainer.innerHTML = "";

  const days = [];
  for (let i = 0; i < 7; i++) {
    const currDay = new Date(weekStart);
    currDay.setDate(weekStart.getDate() + i);
    days.push(currDay);
  }

  days.forEach((day) => {
    const weekCell = document.createElement("div");
    if (
      day.getDate() === new Date().getDate() &&
      day.getMonth() === new Date().getMonth() &&
      day.getFullYear() === new Date().getFullYear()
    ) {
      weekCell.classList.add("todayInWeek");
    }
    weekCell.textContent = day.toLocaleString("en-us", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    weekdaysContainer.appendChild(weekCell);
  });

  weekTitleElement.textContent = `${weekStart.toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  })} - ${weekEnd.toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  })}`;

  populateCalendar(weekStart);
}

// Adding event listeners
prevButton.addEventListener("click", handlePrevWeek);
nextButton.addEventListener("click", handleNextWeek);
viewButton.addEventListener("change", updateCalendarView);

// Generates the initial calendar for the current month and year
renderCalendar(currWeekStart);
