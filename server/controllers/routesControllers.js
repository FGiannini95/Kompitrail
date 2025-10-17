const connection = require("../config/db");
const { connect } = require("../routes/motorbikes");
require("dotenv").config();

class routesControllers {
  createRoute = (req, res) => {
    const {
      user_id,
      starting_point,
      ending_point,
      date,
      level,
      distance,
      suitable_motorbike_type,
      estimated_time,
      max_participants,
      route_description,
      is_verified,
    } = JSON.parse(req.body.createRoute);

    if (
      !user_id ||
      !starting_point ||
      !ending_point ||
      !date ||
      !level ||
      !distance ||
      !suitable_motorbike_type ||
      !estimated_time ||
      !max_participants ||
      !route_description
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const sql = `
    INSERT INTO route (
      user_id, date, starting_point, ending_point, level, distance,
      is_verified, suitable_motorbike_type, estimated_time, max_participants,
      route_description, is_deleted
    )
    VALUES (
      '${user_id}',
      '${date}',
      '${starting_point}',
      '${ending_point}',
      '${level}',
      '${distance}',
      '${is_verified}',
      '${suitable_motorbike_type}',
      '${estimated_time}',
      '${max_participants}',
      '${route_description}',
      '0'
    );
  `;

    connection.query(sql, (error, result) => {
      if (error) {
        return res.status(500).json({ error });
      }

      const sqlSelect = `
      SELECT 
        r.route_id, 
        r.user_id, 
        r.date, 
        r.starting_point, 
        r.ending_point,
        r.level, 
        r.distance, 
        r.is_verified, 
        r.suitable_motorbike_type,
        r.estimated_time, 
        r.max_participants, 
        r.route_description, 
        r.is_deleted,
        u.name,
        u.lastname
      FROM route r
      LEFT JOIN user u ON r.user_id = u.user_id
      WHERE r.route_id = ?
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
    const sql = `
    SELECT
      r.*,
      u.name AS create_name, 
      u.lastname AS create_lastname 
    FROM route r
    LEFT JOIN \`user\` u ON u.user_id = r.user_id
    WHERE r.user_id = '${user_id}' AND r.is_deleted = 0
    ORDER BY r.route_id DESC
  `;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  showAllRoutes = (req, res) => {
    const sql = `
    SELECT
      r.*,
      u.name AS create_name, 
      u.lastname AS create_lastname   
    FROM route r
    LEFT JOIN \`user\` u ON u.user_id = r.user_id
    WHERE r.is_deleted = 0
    ORDER BY r.route_id DESC
  `;
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
      starting_point,
      ending_point,
      date,
      level,
      distance,
      is_verified,
      suitable_motorbike_type,
      estimated_time,
      max_participants,
      route_description,
    } = JSON.parse(req.body.editRoute);
    const { id: route_id } = req.params;
    let sql = `UPDATE route SET 
      starting_point = '${starting_point}', 
      ending_point = '${ending_point}',
      date = '${date}', 
      level = '${level}', 
      distance = '${distance}', 
      is_verified='${is_verified}', 
      suitable_motorbike_type='${suitable_motorbike_type}', 
      estimated_time='${estimated_time}', 
      max_participants='${max_participants}', 
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

  joinRoute = (req, res) => {
    const { id: route_id } = req.params;
    const { user_id } = req.body;

    // Avoid duplicate entry error
    let checkSql = `SELECT * FROM route_participant WHERE user_id = '${user_id}' AND route_id = '${route_id}'`;

    connection.query(checkSql, (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }

      // If user is already enrolled, return error
      if (result.length > 0) {
        return res.status(409).json({
          error: "Usuario ya inscrito",
        });
      }

      // If not enrolled, proceed with INSERT
      let sql = `INSERT INTO route_participant (user_id, route_id) VALUES ('${user_id}', '${route_id}')`;

      connection.query(sql, (err, result) => {
        if (err) {
          return res.status(400).json({ err });
        }

        res.status(201).json({
          message: "Inscripción completada",
          route_participant_id: result.insertId,
        });
      });
    });
  };
}

module.exports = new routesControllers();
