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
router.get("/showallroutesoneuser/:id", routesControllers.showAllRoutesOneUser);
router.get("/showallroutes", routesControllers.showAllRoutes);
router.get(
  "/createdroutes-analytics/:id",
  routesControllers.showCreatedRoutesAnalytics
);
router.put(
  "/editroute/:id",
  multerSingle("rutes"),
  routesControllers.editRoute
);
router.put("/deleteroute/:id", routesControllers.deleteRoute);

module.exports = router;
