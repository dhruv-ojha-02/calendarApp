let currMonth = new Date().getMonth();
let currYear = new Date().getFullYear();
let monthYearElement = document.getElementById("month-year");
let datesContainer = document.getElementById("dates");
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];
const addEventModal = document.getElementById("addEventModal");
const eventDetailsModalContainer = document.getElementById(
  "eventDetailsModalContainer"
);
const eventForm = document.getElementById("eventForm");
const eventDetailsForm = document.getElementById("eventDetailsModal");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const saveButton = document.getElementById("save");
const editButton = document.getElementById("edit");
const cancelButton = document.getElementById("cancel");
const closeButton = document.getElementById("close");
const deleteButton = document.getElementById("delete");
const viewButton = document.getElementById("view");

viewButton.value = "month";

function updateCalendarView() {
  let view = viewButton.value;
  if (view === "month") {
    // window.location.href = "month.html";
    window.location.href = "/month/month.html";
  } else if (view === "week") {
    window.location.href = "/week/week.html";
  } else if (view === "day") {
    window.location.href = "/day/day.html";
  }
}

function handleOpenEventModal(eventId) {
  // eventForm.onsubmit = (evt) => {
  //   evt.preventDefault();
  //   handleSave(evt, eventId);
  // };

  cancelButton.onclick = () => {
    handleClose();
  };
  addEventModal.style.display = "flex";

  eventForm.onsubmit = (evt) => {
    evt.preventDefault();
    handleSave(evt, eventId);
  };
}

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
      // id: Date.now(),
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
  // editButton.onclick = () => {
  //   handleEdit(evtIdx, evt);
  // };
  // deleteButton.onclick = () => {
  //   handleDelete(evtIdx, evt);
  // };
  const titleDetail = document.getElementById("titleDetail");
  const timeDetail = document.getElementById("timeDetail");
  const endTimeDetail = document.getElementById("endTimeDetail");
  const attendeesDetail = document.getElementById("attendeesDetail");

  titleDetail.textContent = `Title: ${evt.title}`;
  timeDetail.textContent = `Start Time: ${evt.startTime}`;
  endTimeDetail.textContent = `End Time: ${evt.endTime}`;
  attendeesDetail.textContent = `Attendees: ${evt.attendees}`;
}

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

function handleDelete(evtIdx, evt) {
  let index = events.findIndex((event) => event.id === evtIdx);
  if (index !== -1) {
    events.splice(index, 1); //.splice(index,no of items to remove, 1st item to add,2nd item to add,...)
    localStorage.setItem("events", JSON.stringify(events));
    handleClose();
  }
}

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

function handlePrevMonth() {
  currMonth--;
  if (currMonth < 0) {
    currMonth = 11;
    currYear--;
  }
  renderCalendar(currMonth, currYear);
}

function handleNextMonth() {
  currMonth++;
  if (currMonth > 11) {
    currMonth = 0;
    currYear++;
  }
  renderCalendar(currMonth, currYear);
}

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

prevButton.addEventListener("click", handlePrevMonth);
nextButton.addEventListener("click", handleNextMonth);
viewButton.addEventListener("change", updateCalendarView);
renderCalendar(currMonth, currYear);
