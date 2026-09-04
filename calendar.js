const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

let currentDate = new Date(2026, 8, 1);
let eventos = {};

fetch("eventos.json")
  .then(response => response.json())
  .then(data => {
    eventos = data;
    renderCalendar();
  })
  .catch(error => {
    console.error("Error cargando eventos:", error);
    renderCalendar();
  });

function formatDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day";
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayBox = document.createElement("div");
    dayBox.className = "day";

    const number = document.createElement("div");
    number.className = "day-number";
    number.textContent = day;

    dayBox.appendChild(number);

    const key = formatDateKey(year, month, day);
    const dayEvents = eventos[key] || [];

    dayEvents.forEach(evento => {
      const eventDiv = document.createElement("div");
      eventDiv.className = `event ${evento.color}`;

      const titulo = document.createElement("strong");
      titulo.textContent = evento.titulo;

      eventDiv.appendChild(titulo);

      if (evento.descripcion) {
        const descripcion = document.createElement("div");
        descripcion.textContent = evento.descripcion;
        eventDiv.appendChild(descripcion);
      }

      dayBox.appendChild(eventDiv);
    });

    calendar.appendChild(dayBox);
  }
}

document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});
