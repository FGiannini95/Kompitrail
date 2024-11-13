// const { response } = require("express");
const connection = require("../config/db");
require("dotenv").config();

class motorbikesControllers {
  createMotorbike = (req, res) => {
    const { user_id, brand, model } = JSON.parse(req.body.createMotorbike);
    const img = req.file ? req.file.filename : "default.png";
    let sql = `INSERT INTO motorbike (user_id, motorbike_brand, motorbike_model, img, is_deleted)
    VALUES ('${user_id}', '${brand}', '${model}', '${img}', false)`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  showAllMotorbikes = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `SELECT * FROM motorbike WHERE user_id = '${user_id}' and is_deleted = 0`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  //no se si se necesita el ID (user o motorbike)
  editMotorbike = (req, res) => {
    console.log("Hola from edit");
    //LEFT JOIN WITH USER TABLE
    let sql = `UPDATE user SET motorbike_brand = "${motorbike_brand}", motorbike_model = "${motorbike_model}", img = "${img}" WHERE motorbike_id = ${motorbike_id}`;
  };

  deleteMotorbike = (req, res) => {
    const { id: motorbike_id } = req.params;
    let sql = `UPDATE motorbike SET is_deleted = 1 WHERE motorbike_id = "${motorbike_id}"`;
    connection.query(sql, (err, result) => {
      err
        ? res.status(400).json({ err })
        : res.status(200).json({ message: "Moto eliminada", result });
    });
  };
}

module.exports = new motorbikesControllers();
