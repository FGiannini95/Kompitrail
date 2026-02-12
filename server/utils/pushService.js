const webpush = require("web-push");
const { loadSubscriptions } = require("../utils/subscriptions");

// Configure VAPID details for authentication with FCM/Mozilla servers
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// Create message
const createNotificationPayload = (routeData) => {
  return JSON.stringify({
    title: "Kompitrail",
    body: "Tu ruta empieza en 30 minutos. ¡Prepárate!",
    buttonText: "Visualizar ruta",
    data: {
      routeId: routeData.routeId || routeData.id,
    },
  });
};

// Send push notification to specific user
const sendNotificationToUser = async (userId, routeData) => {
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
    const payload = createNotificationPayload(routeData);

    // Step 4: Send push notification via web-push library
    const response = await webpush.sendNotification(
      userSubscription.subscription,
      payload,
    );

    return {
      success: true,
      message: "Notification sent successfully",
      userId: userId,
      statusCode: response.statusCode,
    };
  } catch (error) {
    console.error(
      `Error sending notification to user ${userId}:`,
      error.message,
    );
    return {
      success: false,
      error: `${error.name}: ${error.message}`,
      statusCode: error.statusCode,
      userId: userId,
    };
  }
};

module.exports = { sendNotificationToUser };
