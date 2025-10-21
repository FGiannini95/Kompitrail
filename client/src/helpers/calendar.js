const isIOS = () => {
  const userAgent = navigator.userAgent || "";
  return /iPad|iPhone|iPod/i.test(userAgent); // Return true if contains any of this words in insensitive way
};

// Format to UTC. Google Calendar expects "YYYYMMDDTHHMMSSZ"
const formatAsUTC = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
};

const buildGoogleCalendarURL = ({ title, start, end }) => {
  const dates = `${formatAsUTC(start)}/${formatAsUTC(end)}`;
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
  });
  return `https://www.google.com/calendar/render?${q.toString()}`;
};

const buildICS = ({ title, start, end }) => {
  const pad = (n) => String(n).padStart(2, "0");
  const local = (d) =>
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds());

  const dtstamp = local(new Date());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ruta.app//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@ruta.app`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${local(start)}`,
    `DTEND:${local(end)}`,
    `SUMMARY:${title}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ]
    .filter(Boolean)
    .join("\r\n");
};

// Open an .ics file in the browser.
const openICSFile = (icsContent, filename = "event.ics") => {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const openCalendar = ({
  starting_point,
  ending_point,
  estimated_time,
  dateISO,
}) => {
  //Build start date from ISO
  const start = new Date(dateISO);

  // Compute end time in hours
  const end = new Date(
    start.getTime() + Number(estimated_time) * 60 * 60 * 1000
  );

  const title = `Ruta ${starting_point} - ${ending_point}`;

  // Branch by device
  if (isIOS()) {
    // Apple calendar via ICS
    const ics = buildICS({ title, start, end });
    const safeName = title.replace(/[^\w-]+/g, "_");
    openICSFile(ics, `${safeName}.ics`);
  } else {
    // Google calendar via URL
    const url = buildGoogleCalendarURL({ title, start, end });
    window.open(url, "_blank", "noopener,noreferrer");
  }
};
