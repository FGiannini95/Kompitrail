var express = require("express");
var router = express.Router();
const usersControllers = require("../controllers/usersControllers");
const multerSingle = require("../middleware/multerSingle");

// ruta base http://localhost:3000/users
router.post("/createuser", usersControllers.createUser);
router.post("/loginuser", usersControllers.loginUser);
router.get("/oneuser/:id", usersControllers.oneUser);
router.put("/deleteuser/:id", usersControllers.deleteUser);
router.put("/editpassword/:id", usersControllers.editPassword);
router.get("/oneuser/:id", usersControllers.showOneUser);
router.put("/edituser/:id", multerSingle("users"), usersControllers.editUser);

module.exports = router;
