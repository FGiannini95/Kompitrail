var express = require("express");
var router = express.Router();
const routesControllers = require("../controllers/routesControllers");
//import multer

// ruta base http://localhost:3000/rutes
router.post("createroute", routesControllers.createRoutes);

module.exports = router;
