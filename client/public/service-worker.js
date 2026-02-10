// Minimal service worker for PWA installability. This file does NOT provide offline support or caching.
// It enables the browser to recognize the app as a PWA & it handles push notifications for route reminders

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

// Listen for push notifications from backend
self.addEventListener("push", (event) => {
  // Check if notification has data
  if (!event.data) {
    console.log("[SW] Push event but no data received");
    return;
  }

  try {
    // Parse notification data from backend
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "/icons/icona_192.png",
      badge: "/icons/icona_192.png",
      tag: "kompitrail-route-reminder",
      data: data.data || {},
      requireInteraction: true, // Notification stays until user interacts
      actions: [
        {
          action: "view",
          title: data.buttonText,
        },
      ],
    };

    // Show the notification popup
    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (error) {
    console.error("[SW] Error parsing push notification data:", error);

    // Fallback notification if data parsing fails
    event.waitUntil(
      self.registration.showNotification("Kompitrail", {
        body: "Tienes una nueva notificación",
        icon: "/icons/icona_192.png",
        badge: "/icons/icona_192.png",
      }),
    );
  }
});

// Handle when user clicks on notification
self.addEventListener("notificationclick", (event) => {
  // Close the notification popup
  event.notification.close();

  // Get route ID from notification data
  const routeId = event.notification.data?.routeId;

  const targetUrl = routeId ? `/route/${routeId}` : "/route";

  // Try to focus existing app window, or open new one
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Look for existing Kompitrail window
        for (let client of clientList) {
          if (client.url.includes(self.location.origin)) {
            // Focus existing window and navigate to route
            client.focus();
            if (client.navigate && routeId) {
              client.navigate(targetUrl);
            }
            return;
          }
        }

        // No existing window found, open new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      }),
  );
});
