export const getLocalStorage = (item) => {
  return localStorage.getItem(item);
};

export const saveLocalStorage = (item, data) => {
  return localStorage.setItem(item, data);
};

export const delLocalStorage = (item) => {
  return localStorage.removeItem(item);
};
