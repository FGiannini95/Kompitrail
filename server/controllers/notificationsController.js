const {
  loadSubscriptions,
  saveSubscriptions,
} = require("../utils/subscriptions");
const jwt = require("jsonwebtoken");

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

      const { subscription } = req.body;

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
}

module.exports = new notificationsController();
