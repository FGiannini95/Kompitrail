var express = require("express");
var router = express.Router();
const routesControllers = require("../controllers/routesControllers");
const multerSingle = require("../middleware/multerSingle");
const {
  heavyApiLimit,
  moderateApiLimit,
  lightApiLimit,
} = require("../utils/rateLimiters");

// ruta base http://localhost:3000/routes
router.post(
  "/createroute",
  moderateApiLimit,
  multerSingle("routes"),
  routesControllers.createRoute,
);
router.get(
  "/showallroutesoneuser/:id",
  lightApiLimit,
  routesControllers.showAllRoutesOneUser,
);
router.get("/showallroutes", lightApiLimit, routesControllers.showAllRoutes);
router.get("/oneroute/:id", lightApiLimit, routesControllers.showOneRoute);
router.get(
  "/createdroutes-analytics/:id",
  routesControllers.showCreatedRoutesAnalytics,
);
router.get(
  "/joinedroutes-analytics/:id",
  routesControllers.showJoineddRoutesAnalytics,
);
router.put(
  "/editroute/:id",
  moderateApiLimit,
  multerSingle("rutes"),
  routesControllers.editRoute,
);
router.put("/deleteroute/:id", routesControllers.deleteRoute);
router.post("/join/:id", routesControllers.joinRoute);
router.delete("/leave/:id", routesControllers.leaveRoute);
router.get("/frequent-companions/:id", routesControllers.getFrequentCompanions);
router.post("/metrics", heavyApiLimit, routesControllers.calculateMetrics);
router.post("/translatedescription", routesControllers.translateDescription);
router.post("/geocoding", heavyApiLimit, routesControllers.calculateGeocoding);
router.post("/navigation", routesControllers.navigationRoutes);

module.exports = router;
