// Get the initials from the name and lastname, both in uppercase
export const getInitials = (name, lastname) => {
  const firstLetterName = name?.charAt(0).toUpperCase() || "";
  const firstLetterLastName = lastname?.charAt(0).toUpperCase() || "";

  return `${firstLetterName}${firstLetterLastName}`;
};

// Capitalize the first letter of a given string
export const capitalizeFirstLetter = (string) => {
  if (typeof string !== "string") return "";
  if (!string) return "";

  return string
    .split(" ") // preserve all spaces (no trim, no collapse)
    .map((word) =>
      word
        .split("-")
        .map((part) =>
          part
            ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            : part,
        )
        .join("-"),
    )
    .join(" ");
};

// Capitalize the first letter of both the name and the lastname
export const capitalizeFullName = (name, lastname) => {
  const capitalizedName = capitalizeFirstLetter(name);
  const capitalizedLastName = capitalizeFirstLetter(lastname);

  return `${capitalizedName} ${capitalizedLastName}`;
};

export const formatDateTime = (
  input,
  { locale = "es-ES", timeZone = "Europe/London" } = {},
) => {
  const d = input instanceof Date ? input : new Date(input);

  // Guard invalid dates (undefined, null, "", bad ISO, etc.)
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    return {
      date_dd_mm_yyyy: "",
      time_hh_mm: "",
      weekday: "",
      isValid: false,
    };
  }

  const date_dd_mm_yyyy = new globalThis.Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(d);

  const time_hh_mm = new globalThis.Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(d);

  const weekday = new globalThis.Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone,
  }).format(d);

  return { date_dd_mm_yyyy, time_hh_mm, weekday, isValid: true };
};

export const toMySQLDateTime = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Always formats minutes as HH:MM
export const formatMinutesToHHMM = (minutes) => {
  if (!Number.isFinite(minutes)) return "00:00";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
