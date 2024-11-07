// const { response } = require("express");
const connection = require("../config/db");
require("dotenv").config();

class motorbikesControllers {
  createMotorbike = (req, res) => {
    console.log("hola");
    let sql = `SELECT * FROM motorbike WHERE user_id = '${user_id}'`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };
}

module.exports = new motorbikesControllers();
