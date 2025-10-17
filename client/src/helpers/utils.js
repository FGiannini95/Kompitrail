// Get the initials from the name and lastname, both in uppercase
export const getInitials = (name, lastname) => {
  const firstLetterName = name?.charAt(0).toUpperCase() || "";
  const firstLetterLastName = lastname?.charAt(0).toUpperCase() || "";

  return `${firstLetterName}${firstLetterLastName}`;
};

// Capitalize the first letter of a given string
export const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Capitalize the first letter of both the name and the lastname
export const capitalizeFullName = (name, lastname) => {
  const capitalizedName = capitalizeFirstLetter(name);
  const capitalizedLastName = capitalizeFirstLetter(lastname);

  return `${capitalizedName} ${capitalizedLastName}`;
};

export const formatDateTime = (iso) => {
  const d = new Date(iso);

  const date_dd_mm_yyyy = new globalThis.Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(d);

  const time_hh_mm = new globalThis.Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Madrid",
  }).format(d);

  const weekday = new globalThis.Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    timeZone: "Europe/Madrid",
  }).format(d);

  return { date_dd_mm_yyyy, time_hh_mm, weekday };
};

export const toMySQLDateTime = (value, timeZone = "Europe/Madrid") =>
  new Date(value).toLocaleString("sv-SE", { timeZone, hour12: false });
