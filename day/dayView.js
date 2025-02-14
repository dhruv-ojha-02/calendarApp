let dateTitleElement = document.getElementById("dateTitleElement");
let slotsContainer = document.getElementById("slots");
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];
const addEventModal = document.getElementById("addEventModal");
const eventDetailsModal = document.getElementById("eventDetailsModal");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const saveButton = document.getElementById("save");
const editButton = document.getElementById("edit");
const eventForm = document.getElementById("eventForm");
const cancelButton = document.getElementById("cancel");
const closeButton = document.getElementById("close");
const deleteButton = document.getElementById("delete");
const viewButton = document.getElementById("view");
viewButton.value = "day";

let currDate = new Date().getDate();
let currMonth = new Date().getMonth();
let currYear = new Date().getFullYear();

function updateCalendarView() {
  let view = viewButton.value;
  if (view === "month") {
    window.location.href = "/month/month.html";
  } else if (view === "week") {
    window.location.href = "/week/week.html";
  } else if (view === "day") {
    window.location.href = "/day/day.html";
  }
}

function handleOpenEventModal(slotTime, eventId) {
  console.log(eventId);

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
  renderCalendar(currDate, currMonth, currYear);
}

function handleNextDay() {
  let currentDateObj = new Date(currYear, currMonth, currDate);
  currentDateObj.setDate(currentDateObj.getDate() + 1);

  currDate = currentDateObj.getDate();
  currMonth = currentDateObj.getMonth();
  currYear = currentDateObj.getFullYear();

  renderCalendar(currDate, currMonth, currYear);
}

function handlePrevDay() {
  let currentDateObj = new Date(currYear, currMonth, currDate);
  currentDateObj.setDate(currentDateObj.getDate() - 1);

  currDate = currentDateObj.getDate();
  currMonth = currentDateObj.getMonth();
  currYear = currentDateObj.getFullYear();

  renderCalendar(currDate, currMonth, currYear);
}

function populateCalendar(date, month, year) {
  for (let i = 0; i < 24; i++) {
    const slotCellContainer = document.createElement("div");
    slotCellContainer.classList.add("slotCellContainer");
    const slotCell = document.createElement("div");
    slotCell.classList.add("slotCell");
    const formattedHour = i < 10 ? `0${i}` : `${i}`;
    slotCell.setAttribute("hour", formattedHour);
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "AM" : "PM";
    const slotLabel = document.createElement("div");
    slotLabel.classList.add("slotLabel");
    slotLabel.setAttribute("hour", formattedHour);
    slotLabel.textContent = `${hour} ${period}`;
    const eventsContainer = document.createElement("div");
    eventsContainer.classList.add("dayEventsContainer");
    eventsContainer.setAttribute("hour", formattedHour);
    slotCell.appendChild(eventsContainer);
    slotCellContainer.appendChild(slotCell);
    slotCellContainer.appendChild(slotLabel);
    slotsContainer.appendChild(slotCellContainer);
    slotCell.addEventListener("click", () => {
      handleOpenEventModal(formattedHour, `${date}/${month + 1}/${year}`);
    });
  }
  renderEvents(date, month, year);
}

function renderEvents(date, month, year) {
  let currentDateStr = `${date}/${month + 1}/${year}`;
  let todaysEvents = events.filter((evt) => evt.eventDate === currentDateStr);
  todaysEvents.forEach((evt) => {
    const [hourStr, minuteStr] = evt.startTime.split(":");
    const hour = parseInt(hourStr);
    const paddedHour = hour < 10 ? `0${hour}` : `${hour}`;

    const eventContainer = document.querySelector(
      `.dayEventsContainer[hour='${paddedHour}']`
    );
    if (eventContainer) {
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("eventDivDayView");
      eventDiv.textContent = `Title: ${evt.title}\nAttendees: ${evt.attendees}`;
      eventDiv.addEventListener("click", () => {
        displayEventDetails(evt.id, evt);
      });
      eventContainer.appendChild(eventDiv);
    }
  });
}

function renderCalendar(date, month, year) {
  dateTitleElement.innerText = new Date(year, month, date).toLocaleString(
    "en-us",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  slotsContainer.innerHTML = "";

  populateCalendar(date, month, year);
}

prevButton.addEventListener("click", handlePrevDay);
nextButton.addEventListener("click", handleNextDay);
viewButton.addEventListener("change", updateCalendarView);
renderCalendar(currDate, currMonth, currYear);
