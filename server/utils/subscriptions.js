// backend/utils/subscriptionsHelper.js
const fs = require("fs");
const path = require("path");

const SUBSCRIPTIONS_FILE = path.join(__dirname, "../data/subscriptions.json");

// Load all subscriptions from file
const loadSubscriptions = () => {
  try {
    const data = fs.readFileSync(SUBSCRIPTIONS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create empty structure
    return { subscriptions: [] };
  }
};

// Save subscriptions to file
const saveSubscriptions = (data) => {
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(data, null, 2));
};

module.exports = { loadSubscriptions, saveSubscriptions };
