// const { response } = require("express");
const connection = require("../config/db");
require("dotenv").config();

class motorbikesControllers {
  createMotorbike = (req, res) => {
    console.log("hola createMotorbike");
    let sql = `INSERT INTO motorbike (motorbike_id, user_id, motorbike_brand, motorbike_model, img) VALUES ('${motorbike_id}', '${user_id}', '${motorbike_brand}', '${motorbike_model}', 'default.png')`;
    if (req.file !== undefined) {
      let img = req.file.filename;
      sql = `INSERT INTO motorbike (motorbike_id, user_id, motorbike_brand, motorbike_model, img) VALUES ('${motorbike_id}', '${user_id}', '${motorbike_brand}', '${motorbike_model}', '${img}')`;
    }
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  showAllMotorbikes = (req, res) => {
    console.log("Hola hola");
    let sql = `SELECT * FROM motorbike WHERE user_id = '${user_id}'`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  editMotorbike = (req, res) => {
    console.log("Hola from edit");
    //LEFT JOIN WITH USER TABLE
    let sql = `UPDATE user SET motorbike_brand = "${motorbike_brand}", motorbike_model = "${motorbike_model}", img = "${img}" WHERE motorbike_id = ${motorbike_id}`;
  };
}

module.exports = new motorbikesControllers();
