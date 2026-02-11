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
    console.log(`📤 Attempting to send notification to user ${userId}`);
    // Load current subscriptions from JSON file
    const subscriptionsData = loadSubscriptions();

    // Find subscription for specific user
    const userSubscription = subscriptionsData.subcriptions.find(
      (sub) => sub.userId === userId && sub.enabled,
    );

    if (!userSubscription) {
      return {
        success: false,
        error: "User not subscribed or subscription disabled",
      };
    }
    console.log(`Found subscription for user ${userId}`);

    // Create notification payload
    const payload = createNotificationPayload(routeData);
    console.log(`📝 Notification payload created`);

    // Step 4: Send push notification via web-push library
    console.log(`🚀 Sending push notification...`);
    const response = await webpush.sendNotification(
      userSubscription.subscription,
      payload,
    );

    console.log(`✅ Notification sent successfully to user ${userId}`);
    console.log(`📊 Response status: ${response.statusCode}`);

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
  }
};

module.exports = { sendNotificationToUser };
