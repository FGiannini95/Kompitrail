var express = require("express");
var router = express.Router();
const routesControllers = require("../controllers/routesControllers");
const multerSingle = require("../middleware/multerSingle");
// ruta base http://localhost:3000/routes
router.post(
  "/createroute",
  multerSingle("routes"),
  routesControllers.createRoute
);

module.exports = router;
