export const normalizeMotorbikeName = (value) => {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
};
