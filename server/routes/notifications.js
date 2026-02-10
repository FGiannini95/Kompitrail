var express = require("express");
var router = express.Router();
const notificationsController = require("../controllers/notificationsController");

// ruta base http://localhost:3000/notifications
router.post("/subscribe", notificationsController.subscribe);
router.post("/unsubscribe", notificationsController.unsubscribe);

module.exports = router;
