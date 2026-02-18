const connection = require("../config/db");

const {
  loadSubscriptions,
  saveSubscriptions,
} = require("../utils/subscriptions");
const jwt = require("jsonwebtoken");
const { sendNotificationToUser } = require("../utils/pushService");
const {
  isRouteAlreadySent,
  markRouteAsSent,
} = require("../utils/notificationTracker");

class notificationsController {
  subscribe = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.SECRET);
      const userId = decoded.user.user_id;

      const { subscription, language } = req.body;

      // Load current subscriptions from JSON file
      const data = loadSubscriptions();

      // Remove old subscription for this user (prevent duplicates)
      data.subscriptions = data.subscriptions.filter(
        (sub) => sub.userId !== userId,
      );

      // Add new subscription
      data.subscriptions.push({
        userId: userId,
        subscription: subscription,
        enabled: true,
        language: language || "es",
        createdAt: new Date().toISOString(),
      });

      // Save to file
      saveSubscriptions(data);

      res.json({
        success: true,
        message: "Push subscription enabled successfully",
        totalSubscriptions: data.subscriptions.length,
      });
    } catch (error) {
      console.error("Subscribe error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  unsubscribe = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.SECRET);
      const userId = decoded.user.user_id;

      // Load current subscriptions from JSON file
      const data = loadSubscriptions();

      // Remove subscription for this user
      const initialLength = data.subscriptions.length;
      data.subscriptions = data.subscriptions.filter(
        (sub) => sub.userId !== userId,
      );
      const removedCount = initialLength - data.subscriptions.length;

      // Save updated subscriptions back to file
      saveSubscriptions(data);

      res.json({
        success: true,
        message: "Push notifications disabled successfully",
        userId: userId,
        removedCount: removedCount,
        totalSubscriptions: data.subscriptions.length,
      });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  sendRouteReminders = async (req, res) => {
    console.log("🔄 Checking for routes needing notifications...");

    // Get current time and calculate time window (20-30 minutes from now)
    const now = new Date();
    const timeMin = new Date(now.getTime() + 1 * 60 * 1000);
    const timeMax = new Date(now.getTime() + 60 * 60 * 1000);

    const upcomingRoutes = `
      SELECT route_id, user_id, date, starting_point_i18n, ending_point_i18n, 
            starting_lat, starting_lng, ending_lat, ending_lng
      FROM route
      WHERE date BETWEEN ? AND ?
      AND is_deleted = false
    `;

    connection.query(upcomingRoutes, [timeMin, timeMax], (err, routes) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      console.log(`📅 Found ${routes.length} routes in 25-30 min window`);

      if (routes.length === 0) {
        return res.json({ message: "No routes found", routesFound: 0 });
      }

      let routesProcessed = 0;
      let totalNotificationsSent = 0;
      let processedCount = 0;

      // Helper function to send final response
      const checkAndRespond = () => {
        return res.json({
          success: true,
          message: "Route reminders processed successfully",
          routesFound: routes.length,
          routesProcessed: routesProcessed,
          notificationsSent: totalNotificationsSent,
        });
      };

      // Define participants query
      const participantsQuery = `
        SELECT user_id FROM (
          SELECT user_id FROM route WHERE route_id = ?
          UNION 
          SELECT user_id FROM route_participant WHERE route_id = ?
        ) participants
      `;

      routes.forEach((route) => {
        console.log(`🔍 Processing route ${route.route_id}`); // ← ADD

        if (isRouteAlreadySent(route.route_id)) {
          console.log(`⏭️ Route ${route.route_id} already sent, skipping`); // ← ADD
          processedCount++;
          if (processedCount === routes.length) checkAndRespond();
          return;
        }

        console.log(`📤 Starting to process route ${route.route_id}`); // ← ADD

        connection.query(
          participantsQuery,
          [route.route_id, route.route_id],
          async (err2, participants) => {
            if (err2) {
              console.log(
                `❌ Error getting participants for route ${route.route_id}:`,
                err2,
              ); // ← ADD
              processedCount++;
              if (processedCount === routes.length) checkAndRespond();
              return;
            }

            console.log(
              `👥 Found ${participants.length} participants for route ${route.route_id}:`,
              participants,
            ); // ← ADD

            // Send notifications to all participants
            for (const participant of participants) {
              console.log(
                `📱 Sending notification to user ${participant.user_id} for route ${route.route_id}`,
              ); // ← ADD

              const result = await sendNotificationToUser(
                participant.user_id,
                route,
                "es",
              );

              console.log(
                `📋 Notification result for user ${participant.user_id}:`,
                result,
              ); // ← ADD

              if (result.success) {
                totalNotificationsSent++;
              }
            }

            // Mark as sent to prevent duplicates
            markRouteAsSent(route.route_id);
            routesProcessed++;
            processedCount++;

            console.log(
              `✅ Notifications sent to ${participants.length} users for route ${route.route_id}`,
            );

            if (processedCount === routes.length) checkAndRespond();
          },
        );
      });
    });
  };
}

module.exports = new notificationsController();
