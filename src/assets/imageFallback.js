import fallback from "./cover-fallback.svg";

export const handleImageError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = fallback;
};
