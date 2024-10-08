const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class usersControllers {
  createUser = (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Error al hacer el registro",
      });
    }
  };
}

module.exports = new usersControllers();
