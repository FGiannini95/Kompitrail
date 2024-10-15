var express = require("express");
var router = express.Router();
const usersControllers = require("../controllers/usersControllers");
//import multer

// ruta base http://localhost:3000/users
router.post("/createuser", usersControllers.createUser);
router.post("/loginuser", usersControllers.loginUser);

module.exports = router;
