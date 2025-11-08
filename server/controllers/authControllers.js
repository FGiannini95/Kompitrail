const conenction = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class authControllers {
  authGoogle = (req, res) => {
    console.log("hi from google auth");
  };

  authApple = (req, res) => {
    console.log("hi from apple auth");
  };
}

module.exports = new authControllers();
