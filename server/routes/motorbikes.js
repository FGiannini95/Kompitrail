var express = require("express");
var router = express.Router();
const motorbikeControllers = require("../controllers/motorbikesControllers");
const usersControllers = require("../controllers/usersControllers");
const motorbikesControllers = require("../controllers/motorbikesControllers");
//import multer

//ruta base http://localhost:3000/motorbikes
router.post("/createmotorbike", motorbikesControllers.createMotorbike);

module.exports = router;
