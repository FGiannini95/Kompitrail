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
router.get("/oneroute/:id", routesControllers.showOneRoute);
router.get(
  "/createdroutes-analytics/:id",
  routesControllers.showCreatedRoutesAnalytics
);
router.get(
  "/joinedroutes-analytics/:id",
  routesControllers.showJoineddRoutesAnalytics
);
router.put(
  "/editroute/:id",
  multerSingle("rutes"),
  routesControllers.editRoute
);
router.put("/deleteroute/:id", routesControllers.deleteRoute);
router.post("/join/:id", routesControllers.joinRoute);
router.delete("/leave/:id", routesControllers.leaveRoute);

module.exports = router;
