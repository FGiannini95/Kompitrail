var express = require("express");
var router = express.Router();
const trailsControllers = require("../controllers/trailsController");

// ruta base http://localhost:3000/trails
router.post("createtrail", trailsControllers.createTrail);

module.exports = router;
