import React from "react";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "mapbox-gl/dist/mapbox-gl.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register the service worker in production
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {})
      .catch((error) => {
        console.error("[SW] Registration failed:", error);
      });
  });
}
