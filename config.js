export let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

export const addEventModal = document.getElementById("addEventModal");
export const eventDetailsModal = document.getElementById("eventDetailsModal");
export const eventForm = document.getElementById("eventForm");
export const prevButton = document.getElementById("prev");
export const nextButton = document.getElementById("next");
export const saveButton = document.getElementById("save");
export const editButton = document.getElementById("edit");
export const cancelButton = document.getElementById("cancel");
export const closeButton = document.getElementById("close");
export const deleteButton = document.getElementById("delete");
export const viewButton = document.getElementById("view");

// Changes the calendar view to month, week and day
export function updateCalendarView() {
  let view = viewButton.value;
  if (view === "month") {
    window.location.href = "/month/month.html";
  } else if (view === "week") {
    window.location.href = "/week/week.html";
  } else if (view === "day") {
    window.location.href = "/day/day.html";
  }
}
