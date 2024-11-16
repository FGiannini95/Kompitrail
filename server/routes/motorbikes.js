var express = require("express");
var router = express.Router();
const motorbikesControllers = require("../controllers/motorbikesControllers");
const multerSingle = require("../middleware/multerSingle");

//ruta base http://localhost:3000/motorbikes
router.post(
  "/createmotorbike",
  multerSingle("motorbikes"),
  motorbikesControllers.createMotorbike
);
router.get("/showallmotorbikes/:id", motorbikesControllers.showAllMotorbikes);
router.get("/onemotorbike/:id", motorbikesControllers.showOneMotorbike);
router.put(
  "/editmotorbike/:id",
  multerSingle("motorbikes"),
  motorbikesControllers.editMotorbike
);
router.put("/deletemotorbike/:id", motorbikesControllers.deleteMotorbike);

module.exports = router;
