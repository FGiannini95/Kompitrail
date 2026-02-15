const fs = require("fs");
const path = require("path");

const webpush = require("web-push");
const { loadSubscriptions } = require("../utils/subscriptions");

// Configure VAPID details for authentication with FCM/Mozilla servers
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// Load notification templates
const loadNotificationTemplates = () => {
  try {
    const templatesPath = path.join(
      __dirname,
      "../data/notification_templates.json",
    );
    const data = fs.readFileSync(templatesPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading notification templates:", error);
    return null;
  }
};

const getPointLabel = (point, currentLang, type = "full") => {
  if (!point?.i18n) return "";

  const langData = point.i18n[currentLang] || point.i18n.es || {};
  return type === "short" ? langData.short : langData.full;
};

// Create notification payload
const createNotificationPayload = (routeData, userLanguage = "es") => {
  const templates = loadNotificationTemplates();
  const template =
    templates.route_reminder[userLanguage] || templates.route_reminder["es"];

  // Get translated place names
  const startingLabel = getPointLabel(
    { i18n: routeData.starting_point_i18n },
    userLanguage,
    "short",
  );
  const endingLabel = getPointLabel(
    { i18n: routeData.ending_point_i18n },
    userLanguage,
    "short",
  );

  // Replace placeholders
  const body = template.body
    .replace("{startingPoint}", startingLabel)
    .replace("{endingPoint}", endingLabel);

  return JSON.stringify({
    title: template.title,
    body: body,
    buttonText: template.buttonText,
    data: { routeId: routeData.route_id },
  });
};

// Send push notification to specific user
const sendNotificationToUser = async (
  userId,
  routeData,
  userLanguage = "es",
) => {
  try {
    // Load current subscriptions from JSON file
    const subscriptionsData = loadSubscriptions();

    // Find subscription for specific user
    const userSubscription = subscriptionsData.subscriptions.find(
      (sub) => sub.userId === userId && sub.enabled,
    );

    if (!userSubscription) {
      return {
        success: false,
        error: "User not subscribed or subscription disabled",
      };
    }

    // Create notification payload
    const payload = createNotificationPayload(routeData, userLanguage);

    console.log(
      `🚀 Sending to FCM endpoint: ${userSubscription.subscription.endpoint}`,
    );
    console.log("📦 Payload:", payload);

    // Step 4: Send push notification via web-push library
    const response = await webpush.sendNotification(
      userSubscription.subscription,
      payload,
    );

    console.log(`✅ FCM Response Status: ${response.statusCode}`);
    console.log("📊 FCM Response Headers:", response.headers);

    return {
      success: true,
      message: "Notification sent successfully",
      userId: userId,
      language: userLanguage,
      statusCode: response.statusCode,
    };
  } catch (error) {
    console.error("FCM Error Details:", {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      body: error.body,
    });
    return {
      success: false,
      error: `${error.name}: ${error.message}`,
      statusCode: error.statusCode,
      userId: userId,
    };
  }
};

module.exports = { sendNotificationToUser };
