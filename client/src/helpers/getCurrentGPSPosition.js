export const getCurrentGPSPosition = ({
  onSuccess,
  onError,
  fallbackToGranada = false,
  enableHighAccuracy = true,
  timeout = 20000,
  maximumAge = 60000,
} = {}) => {
  if (!navigator.geolocation) {
    onError?.("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      onSuccess?.({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        heading: pos.coords.heading,
      });
    },
    (error) => {
      console.error("GPS error:", error);

      // Fallback to Granada
      if (fallbackToGranada && (error.code === 1 || error.code === 3)) {
        onSuccess?.({
          latitude: 37.1773,
          longitude: -3.5986,
          accuracy: null,
          heading: null,
        });
      } else {
        onError?.(error);
      }
    },
    {
      enableHighAccuracy,
      timeout,
      maximumAge,
    },
  );
};
