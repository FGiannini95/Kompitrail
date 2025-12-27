var express = require("express");
var router = express.Router();
const chatBotControllers = require("../controllers/chatBotControllers");

// ruta base http://localhost:3000/chatbot
router.post("/", chatBotControllers.handleChatRequest);

module.exports = router;
