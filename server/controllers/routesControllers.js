const connection = require("../config/db");
const { connect } = require("../routes/motorbikes");
require("dotenv").config();

class routesControllers {
  createRoute = (req, res) => {
    const {
      user_id,
      route_name,
      starting_point,
      ending_point,
      date,
      level,
      distance,
      suitable_motorbike_type,
      estimated_time,
      participants,
      route_description,
      is_verified,
    } = JSON.parse(req.body.createRoute);

    if (
      !user_id ||
      !route_name ||
      !starting_point ||
      !ending_point ||
      !date ||
      !level ||
      !distance ||
      !suitable_motorbike_type ||
      !estimated_time ||
      !participants ||
      !route_description
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const sql = `
    INSERT INTO route (
      user_id, route_name, date, starting_point, ending_point, level, distance,
      is_verified, suitable_motorbike_type, estimated_time, participants,
      route_description, is_deleted
    )
    VALUES (
      '${user_id}',
      '${route_name}',
      '${date}',
      '${starting_point}',
      '${ending_point}',
      '${level}',
      '${distance}',
      '${is_verified}',
      '${suitable_motorbike_type}',
      '${estimated_time}',
      '${participants}',
      '${route_description}',
      '0'
    );
  `;

    connection.query(sql, (error, result) => {
      if (error) {
        return res.status(500).json({ error });
      }

      const sqlSelect = `
      SELECT route_id, user_id, route_name, \`date\`, starting_point, ending_point,
             level, distance, is_verified, suitable_motorbike_type,
             estimated_time, participants, route_description, is_deleted
      FROM route
      WHERE route_id = ?
    `;

      connection.query(sqlSelect, [result.insertId], (error2, result2) => {
        if (error2) {
          return res.status(500).json({ error: error2 });
        }
        if (!result2 || result2.length === 0) {
          return res.status(404).json({ error: "Ruta no encontrada" });
        }
        return res.status(200).json(result2[0]);
      });
    });
  };

  showAllRoutesOneUser = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `SELECT * FROM route WHERE user_id = '${user_id}' AND is_deleted = 0 ORDER BY route_id DESC`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  showAllRoutes = (req, res) => {
    let sql = `SELECT * FROM route WHERE is_deleted = 0 ORDER BY route_id DESC`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  showCreatedRoutesAnalytics = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `SELECT (SELECT COUNT(*) FROM route WHERE user_id ="${user_id}" and is_deleted = 0) AS total_createdroutes`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  editRoute = (req, res) => {
    const {
      route_name,
      starting_point,
      ending_point,
      level,
      distance,
      is_verified,
      suitable_motorbike_type,
      estimated_time,
      participants,
      route_description,
    } = JSON.parse(req.body.editRoute);
    const { id: route_id } = req.params;
    let sql = `UPDATE route SET 
      route_name = '${route_name}', 
      starting_point = '${starting_point}', 
      ending_point = '${ending_point}', 
      level = '${level}', 
      distance = '${distance}', 
      is_verified='${is_verified}', 
      suitable_motorbike_type='${suitable_motorbike_type}', 
      estimated_time='${estimated_time}', 
      participants='${participants}', 
      route_description='${route_description}' 
      WHERE route_id = '${route_id}' AND is_deleted = 0`;
    connection.query(sql, (err, result) => {
      err
        ? res.status(400).json({ err })
        : res.status(200).json({ message: "Ruta modificada", result });
    });
  };

  deleteRoute = (req, res) => {
    const { id: route_id } = req.params;
    let sql = `UPDATE route SET is_deleted = 1 where route_id = "${route_id}"`;
    connection.query(sql, (err, result) => {
      err
        ? res.status(400).json({ err })
        : res.status(200).json({ message: "Ruta eliminada", result });
    });
  };

  showOneRoute = (req, res) => {
    const { id: route_id } = req.params;
    let sql = `SELECT * FROM route WHERE route_id ='${route_id}' AND is_deleted = 0`;
    connection.query(sql, (err, result) => {
      err ? res.status(400).json({ err }) : res.status(200).json(result[0]);
    });
  };
}

module.exports = new routesControllers();
