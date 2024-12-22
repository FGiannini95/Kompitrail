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
