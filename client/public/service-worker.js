// Minimal service worker for PWA installability
// This file does NOT provide offline support or caching.
// It only enables the browser to recognize the app as a PWA.

// Called when the service worker is first installed
self.addEventListener("install", (event) => {
  // Skip waiting ensures the SW activates faster (optional)
  self.skipWaiting();
  console.log("[SW] Service worker installed");
});

// Called when the service worker becomes active
self.addEventListener("activate", (event) => {
  // Claim clients ensures the SW controls the page immediately
  self.clients.claim();
  console.log("[SW] Service worker activated");
});

// We DO NOT intercept fetch requests.
self.addEventListener("fetch", (event) => {
  // Intentionally left empty
});
