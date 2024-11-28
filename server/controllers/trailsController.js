const connection = require("../config/db");
require("dotenv").config();

class trailsControllers {
  createTrail = (req, res) => {
    console.log("hola de createTrail");
  };
}

module.exports = new trailsControllers();
