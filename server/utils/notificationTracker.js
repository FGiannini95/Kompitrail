const fs = require("fs");
const path = require("path");

const templatesPath = path.join(__dirname, "../data/sent_notifications.json");

// Load notification templates (JSON file → JavaScript object)
const loadSentNotifications = () => {
  try {
    if (!fs.existsSync(templatesPath)) {
      return { sent: [] };
    }

    const data = fs.readFileSync(templatesPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading sent notifications:", error);
    return { sent: [] };
  }
};

// Save tracking data (JavaScript object → JSON file)
const saveSentNotifications = (data) => {
  try {
    fs.writeFileSync(templatesPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving notification", error);
  }
};

// Check if route already processed
const isRouteAlreadySent = (routeId) => {
  const data = loadSentNotifications();
  return data.sent.some((item) => item.route_id === routeId);
};

// Mark route as sent
const markRouteAsSent = (routeId) => {
  const data = loadSentNotifications();
  data.sent.push({
    route_id: routeId,
    sent_at: new Date().toISOString(),
  });
  // Cleanup old entries (older than 24 hours)
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  data.sent = data.sent.filter((item) => new Date(item.sent_at) > cutoff);

  saveSentNotifications(data);
};

module.exports = {
  isRouteAlreadySent,
  markRouteAsSent,
};
