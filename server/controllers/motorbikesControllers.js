// const { response } = require("express");
const connection = require("../config/db.pool");
require("dotenv").config();

class motorbikesControllers {
  createMotorbike = (req, res) => {
    const { user_id, brand, model } = JSON.parse(req.body.createMotorbike);
    const img = req.file ? req.file.filename : "default.png";
    let sql = `INSERT INTO motorbike (user_id, motorbike_brand, motorbike_model, img, is_deleted)
    VALUES ('${user_id}', '${brand}', '${model}', '${img}', false)`;

    connection.query(sql, (error, result) => {
      if (error) {
        return res.status(500).json({ error });
      }

      let sqlSelect = `SELECT motorbike_id, user_id, motorbike_brand, motorbike_model, img FROM motorbike where motorbike_id = ?`;

      connection.query(sqlSelect, [result.insertId], (error2, result2) => {
        if (error2) {
          return res.status(500).json({ error2 });
        }
        if (!result2 || result2.length === 0) {
          return res.status(404).json({ error: "Moto no encontrada" });
        }
        return res.status(200).json(result2[0]);
      });
    });
  };

  showAllMotorbikes = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `SELECT * FROM motorbike WHERE user_id = '${user_id}' AND is_deleted = 0`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  showOneMotorbike = (req, res) => {
    const { id: motorbike_id } = req.params;
    let sql = `SELECT * FROM motorbike WHERE motorbike_id = "${motorbike_id}" and is_deleted = 0`;
    connection.query(sql, (err, result) => {
      err ? res.status(400).json({ err }) : res.status(200).json(result[0]);
    });
  };

  editMotorbike = (req, res) => {
    const { brand, model } = JSON.parse(req.body.editMotorbike);
    const { id: motorbike_id } = req.params;

    // We have to ensure that the img field is not overwritten with "default.png" if a new image is not uploaded
    let sql = `SELECT img FROM motorbike WHERE motorbike_id = "${motorbike_id}" AND is_deleted = 0`;
    connection.query(sql, (err, rows) => {
      if (err) {
        return res.status(400).json({ err });
      }

      const currentImg = rows.length > 0 ? rows[0].img : "default.png";
      const img = req.file ? req.file.filename : currentImg;

      let sqlUpdate = `UPDATE motorbike SET motorbike_brand = "${brand}", motorbike_model = "${model}", img = "${img}" WHERE motorbike_id = "${motorbike_id}" AND is_deleted = 0`;
      connection.query(sqlUpdate, (err, result) => {
        err
          ? res.status(400).json({ err })
          : res.status(200).json({ message: "Moto modificada", result });
      });
    });
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

  showMotorbikesAnalytics = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `SELECT (SELECT COUNT(*) FROM motorbike WHERE user_id = "${user_id}" AND is_deleted = 0) AS total_motorbikes`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };
}

module.exports = new motorbikesControllers();
