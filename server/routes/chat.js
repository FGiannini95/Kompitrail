var express = require("express");
var router = express.Router();
const chatControllers = require("../controllers/chatControllers");

// ruta base http://localhost:3000/chat
router.get("rooms", chatControllers.listUserRooms);

module.exports = router;
