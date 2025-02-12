let weekTitleElement = document.getElementById("weekTitleElement");
let weekdaysContainer = document.getElementById("weekdays");
let slotsContainer = document.getElementById("weekSlots");
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];
const addEventModal = document.getElementById("addEventModal");
const eventDetailsModal = document.getElementById("eventDetailsModal");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const editButton = document.getElementById("edit");
const saveButton = document.getElementById("save");
const cancelButton = document.getElementById("cancel");
const closeButton = document.getElementById("close");
const deleteButton = document.getElementById("delete");
const viewButton = document.getElementById("view");
viewButton.value = "week";

let currWeekStart = getWeekStart(new Date());

function getWeekStart(date) {
  const dayInWeek = date.getDay();
  const difference = date.getDate() - dayInWeek;
  return new Date(date.setDate(difference));
}

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
  renderCalendar(currWeekStart);
}

function handleNextWeek() {
  currWeekStart.setDate(currWeekStart.getDate() + 7);
  renderCalendar(new Date(currWeekStart));
}

function handlePrevWeek() {
  currWeekStart.setDate(currWeekStart.getDate() - 7);
  renderCalendar(new Date(currWeekStart));
}

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

function renderEvents(weekStart) {
  let weeklyEvents = events.filter((evt) => {
    let [day, month, year] = evt.eventDate.split("/").map(Number);
    let evtDateObj = new Date(year, month - 1, day);

    return (
      evtDateObj >= weekStart &&
      evtDateObj <= new Date(weekStart.getTime() + 6 * 86400000)
    );
  });

  weeklyEvents.forEach((evt) => {
    const [hourStr] = evt.startTime.split(":");
    const hour = parseInt(hourStr);
    const paddedHour = hour < 10 ? `0${hour}` : `${hour}`;

    let [day, month, year] = evt.eventDate.split("/").map(Number);
    let evtDateObj = new Date(year, month - 1, day);
    let evtDateStr = `${evtDateObj.getDate()}/${
      evtDateObj.getMonth() + 1
    }/${evtDateObj.getFullYear()}`;

    document
      .querySelectorAll(`.childSlot[hour='${paddedHour}']`)
      .forEach((childSlot) => {
        let childDateStr = childSlot.getAttribute("date"); // Ensure this attribute is set when creating `childSlot`

        if (childDateStr === evtDateStr) {
          const eventContainer = childSlot.querySelector(
            ".weekEventsContainer"
          );

          if (eventContainer) {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("eventDivWeekView");
            eventDiv.textContent = `Title: ${evt.title}\nAttendees: ${evt.attendees}`;
            eventDiv.addEventListener("click", () => {
              displayEventDetails(evt.id, evt);
            });

            eventContainer.appendChild(eventDiv);
          }
        }
      });
  });
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
prevButton.addEventListener("click", handlePrevWeek);
nextButton.addEventListener("click", handleNextWeek);
viewButton.addEventListener("change", updateCalendarView);
renderCalendar(currWeekStart);
