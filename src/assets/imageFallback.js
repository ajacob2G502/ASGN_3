import fallback from "./cover-fallback.svg";

// use as <img onError={handleImageError} />
export const handleImageError = (e) => {
  e.currentTarget.onerror = null; // avoid an infinite loop
  e.currentTarget.src = fallback;
};
