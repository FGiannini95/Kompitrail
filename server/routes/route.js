var express = require("express");
var router = express.Router();
const routesControllers = require("../controllers/routesControllers");
//import multer

// ruta base http://localhost:3000/routes
router.post("/createroute", routesControllers.createRoute);

module.exports = router;
