const connection = require("../config/db");
const {
  loadSubscriptions,
  saveSubscriptions,
} = require("../utils/subscriptions");
const webpush = require("web-push");
const jwt = require("jsonwebtoken");

class notificationsController {
  subscribe = async (req, res) => {
    try {
      // Skip JWT for testing
      const userId = 1; // Hardcoded
      const { subscription } = req.body;

      console.log("User ID:", userId);
      console.log("Subscription received:", subscription);

      // Load current subscriptions from JSON file
      const data = loadSubscriptions();
      console.log("Current subscriptions count:", data.subscriptions.length);

      // Remove old subscription for this user (prevent duplicates)
      data.subscriptions = data.subscriptions.filter(
        (sub) => sub.userId !== userId,
      );

      // Add new subscription
      data.subscriptions.push({
        userId: userId,
        subscription: subscription,
        enabled: true,
        createdAt: new Date().toISOString(),
      });

      // Save to file
      saveSubscriptions(data);
      console.log(
        "Subscription saved! Total subscriptions:",
        data.subscriptions.length,
      );

      res.json({
        success: true,
        message: "Push subscription test successful!",
        totalSubscriptions: data.subscriptions.length,
      });
    } catch (error) {
      console.error("Subscribe error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  unsubscribe = async (req, res) => {};
}

module.exports = new notificationsController();
