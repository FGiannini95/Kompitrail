// const { response } = require("express");
const connection = require("../config/db");
require("dotenv").config();

class motorbikesControllers {
  createMotorbike = (req, res) => {
    console.log("req.body", req.body);
    const { user_id, motorbike_brand, motorbike_model } = JSON.parse(
      req.body.createMotorbike
    );
    const img = req.file ? req.file.filename : "default.png";
    let sql = `INSERT INTO motorbike (user_id, motorbike_brand, motorbike_model, img, is_deleted)
    VALUES ('${user_id}', '${motorbike_brand}', '${motorbike_model}', '${img}', false)`;
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

  //no se si se necesita el ID (user o motorbike)
  editMotorbike = (req, res) => {
    console.log("Hola from edit");
    //LEFT JOIN WITH USER TABLE
    let sql = `UPDATE user SET motorbike_brand = "${motorbike_brand}", motorbike_model = "${motorbike_model}", img = "${img}" WHERE motorbike_id = ${motorbike_id}`;
  };

  //no se si se necesita el ID (user o motorbike)
  deleteMotorbike = (req, res) => {
    console.log("hola from deleteMotorbike");
    let sql = `UPDATE motorbike SET is_deleted = 1 WHERE user_id = "${user_id}"`;
    connection.query(sql, (err, result) => {
      err
        ? res.status(400).json({ err })
        : res.status(200).json({ message: "Usuario eliminado", result });
    });
  };
}

module.exports = new motorbikesControllers();
