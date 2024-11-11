var express = require("express");
var router = express.Router();
const motorbikesControllers = require("../controllers/motorbikesControllers");
const multerSingle = require("../middleware/multerSingle");
const usersControllers = require("../controllers/usersControllers");

//ruta base http://localhost:3000/motorbikes
router.post(
  "/createmotorbike",
  multerSingle("motorbikes"),
  motorbikesControllers.createMotorbike
);
router.get("/showallmotorbikes", motorbikesControllers.showAllMotorbikes);
router.put(
  "/editmotorbike",
  multerSingle("motorbikes"),
  motorbikesControllers.editMotorbike
);
router.put("/deletemotorbike", motorbikesControllers.deleteMotorbike);

module.exports = router;
