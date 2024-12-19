export const getInitials = (name, lastname) => {
  const firstLetterName = name?.charAt(0).toUpperCase() || "";
  const firstLetterLastName = lastname?.charAt(0).toUpperCase() || "";

  return `${firstLetterName}${firstLetterLastName}`;
};
