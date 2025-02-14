let currMonth = new Date().getMonth();
let currYear = new Date().getFullYear();
let monthYearElement = document.getElementById("month-year");
let datesContainer = document.getElementById("dates");

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

viewButton.value = "month";

// Opens the event modal to add event
function handleOpenEventModal(eventId) {
  cancelButton.onclick = () => {
    handleClose();
  };
  addEventModal.style.display = "flex";
  eventForm.onsubmit = (evt) => {
    evt.preventDefault();
    handleSave(evt, eventId);
  };
}

// Save the user's event to local storage
function handleSave(evt, eventId) {
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
  renderCalendar(currMonth, currYear);
}

// Render the previous month in the Calendar
function handlePrevMonth() {
  currMonth--;
  if (currMonth < 0) {
    currMonth = 11;
    currYear--;
  }
  renderCalendar(currMonth, currYear);
}

// Render the next month in the Calendar
function handleNextMonth() {
  currMonth++;
  if (currMonth > 11) {
    currMonth = 0;
    currYear++;
  }
  renderCalendar(currMonth, currYear);
}

// Displays the existing events in the corresponding Calendar view
function renderEvents() {
  events.forEach((evt) => {
    let eventDiv = document.createElement("div");
    eventDiv.classList.add("eventDiv");
    eventDiv.textContent = `${evt.title} (${evt.startTime} - ${evt.endTime})`;
    const [dateStr, hourStr] = evt.eventDate.split(" ");
    const dateDetails = dateStr.split("/");
    let eventDay = dateDetails[0];
    let eventMonth = dateDetails[1];
    let eventYear = dateDetails[2];
    let eventsContainer = document.querySelector(
      `.eventsContainer[date="${eventDay}/${eventMonth}/${eventYear}"]`
    );
    if (eventsContainer) {
      eventsContainer.appendChild(eventDiv);
    }
    eventDiv.addEventListener("click", () => {
      displayEventDetails(evt.id, evt);
    });
  });
}

// Populates the calendar grid with empty cells for the given month
function populateCalendar(firstDayInMonth, totalDaysInMonths, month, year) {
  for (let i = 0; i < firstDayInMonth; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("emptyCell");
    datesContainer.appendChild(emptyCell);
  }
  for (let i = 1; i <= totalDaysInMonths; i++) {
    const dateCell = document.createElement("div");
    dateCell.classList.add("dateCell");
    const dateText = document.createElement("div");
    dateText.classList.add("dateText");
    dateText.textContent = i;
    const eventsContainer = document.createElement("div");
    eventsContainer.classList.add("eventsContainer");
    eventsContainer.setAttribute("date", `${i}/${month + 1}/${year}`);
    dateCell.appendChild(dateText);
    dateCell.appendChild(eventsContainer);
    // Highlights the current date
    if (
      i === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      dateCell.classList.add("current-date");
      dateText.classList.add("current-dateText");
    }
    dateCell.addEventListener("click", (e) => {
      handleOpenEventModal(`${i}/${month + 1}/${year}`);
    });
    datesContainer.appendChild(dateCell);
  }
  renderEvents();
}

// Generates the calendar layout for the given month and year
function renderCalendar(month, year) {
  let totalDaysInMonths = new Date(year, month + 1, 0).getDate();
  let firstDayInMonth = new Date(year, month, 1).getDay();

  monthYearElement.innerText = `${new Date(year, month).toLocaleString(
    "en-us",
    { month: "long", year: "numeric" }
  )}`;

  datesContainer.innerHTML = "";
  populateCalendar(firstDayInMonth, totalDaysInMonths, month, year);
}

// Adding event listener
prevButton.addEventListener("click", handlePrevMonth);
nextButton.addEventListener("click", handleNextMonth);
viewButton.addEventListener("change", updateCalendarView);

// Generates the initial calendar for the current month and year
renderCalendar(currMonth, currYear);
