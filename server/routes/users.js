var express = require("express");
var router = express.Router();
const usersControllers = require("../controllers/usersControllers");
//import multer

// ruta base http://localhost:3000/users
router.post("/createuser", usersControllers.createUser);
router.post("/loginuser", usersControllers.loginUser);
router.get("/oneuser/:id", usersControllers.oneUser);
router.put("/deleteuser/:id", usersControllers.deleteUser);

module.exports = router;
