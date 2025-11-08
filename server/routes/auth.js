var express = require("express");
var router = express.Router();
const authControllers = require("../controllers/authControllers");

// ruta base http://localhost:3000/auth
router.post("/google", authControllers.authGoogle);
router.post("/apple", authControllers.authApple);

module.exports = router;
