const connection = require("../config/db");
const { connect } = require("../routes/motorbikes");
require("dotenv").config();
const path = require("path");
const Contract = require(path.resolve(
  __dirname,
  "../../shared/chat-contract/index"
));
const { EVENTS } = Contract;

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

    const sqlInsertRoute = `
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

    connection.query(sqlInsertRoute, (error, result) => {
      if (error) {
        return res.status(500).json({ error });
      }

      const routeId = result.insertId;

      // Create also a chat_room, 1:1 with route
      const sqlInsertChatRoom = `INSERT INTO chat_room (route_id, is_locked) VALUES ('${routeId}', 0)`;

      connection.query(sqlInsertChatRoom, (errorChat) => {
        if (errorChat) {
          console.error(
            "Failed to create chat_room from route",
            routeId,
            errorChat
          );
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

        connection.query(sqlSelect, [routeId], (error2, result2) => {
          if (error2) {
            return res.status(500).json({ error: error2 });
          }
          if (!result2 || result2.length === 0) {
            return res.status(404).json({ error: "Ruta no encontrada" });
          }
          return res.status(200).json(result2[0]);
        });
      });
    });
  };

  showAllRoutesOneUser = (req, res) => {
    const { id: user_id } = req.params;
    const sql = `
    SELECT
      r.*,
      u.name AS create_name, 
      u.lastname AS create_lastname,
      u.img AS user_img 
    FROM route r
    LEFT JOIN \`user\` u ON u.user_id = r.user_id
    WHERE r.user_id = '${user_id}' AND r.is_deleted = 0 AND r.date >= NOW()
    ORDER BY r.route_id DESC
  `;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  showAllRoutes = (req, res) => {
    const sql = `
    SELECT
      route.*,
      creator_user.name     AS create_name,
      creator_user.lastname AS create_lastname,
      creator_user.img      AS user_img,
      GROUP_CONCAT(
          DISTINCT CONCAT(
          route_participant.user_id, ':',
          COALESCE(participant_user.name, ''), ':',
          COALESCE(participant_user.img, '')
        )
        SEPARATOR '|'
      ) AS participants_raw
    FROM route
    LEFT JOIN \`user\` AS creator_user
           ON creator_user.user_id = route.user_id
    LEFT JOIN route_participant
           ON route_participant.route_id = route.route_id
    LEFT JOIN \`user\` AS participant_user
           ON participant_user.user_id = route_participant.user_id
    WHERE route.is_deleted = 0
    GROUP BY route.route_id
    ORDER BY route.route_id DESC
  `;
    connection.query(sql, (error, rows) => {
      if (error) return res.status(500).json({ error });

      // Convert "12:Marco|27:Anna" -> [{ user_id:12, name:"Marco" }, { user_id:27, name:"Anna" }]
      const data = rows.map((r) => {
        const participants = (r.participants_raw || "")
          .split("|")
          .filter(Boolean) // Empty string filtered out
          .map((triple) => {
            const parts = triple.split(":");
            const uid = Number(parts.shift()); // first field
            const name = parts.shift() || ""; // second field
            const img = parts.join(":") || ""; // everything else
            return { user_id: Number(uid), name, img };
          });
        const { participants_raw, ...rest } = r;
        return { ...rest, participants };
      });

      return res.status(200).json(data);
    });
  };

  showCreatedRoutesAnalytics = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `SELECT (SELECT COUNT(*) FROM route WHERE user_id ="${user_id}" and is_deleted = 0) AS total_createdroutes`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };

  showJoineddRoutesAnalytics = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `
      SELECT COUNT(*) AS total_joinedroutes
      FROM route_participant
        JOIN route ON route_participant.route_id = route.route_id
      WHERE route_participant.user_id = "${user_id}"
      AND route.date < NOW()
      AND route.is_deleted = 0
    `;
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

    let sql = `UPDATE route SET is_deleted = 1 WHERE route_id = "${route_id}" AND date >= NOW()`;
    connection.query(sql, (err, deleteResult) => {
      err
        ? res.status(400).json({ err })
        : res.status(200).json({ message: "Ruta eliminada", deleteResult });
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

    // Check if the route is passed
    let checkDateSql = `SELECT date from ROUTE where route_id = "${route_id}"`;
    connection.query(checkDateSql, (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }
      const routeDate = new Date(result[0].date);
      const now = new Date();

      if (routeDate < now) {
        return res.status(400).json({ message: "Ruta ya pasada" });
      }

      // Avoid duplicate entry error
      let checkSql = `SELECT * FROM route_participant WHERE user_id = "${user_id}" AND route_id = "${route_id}"`;

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
        let sql = `INSERT INTO route_participant (user_id, route_id) VALUES ("${user_id}", "${route_id}")`;

        connection.query(sql, (err, deleteResult) => {
          if (err) {
            return res.status(400).json({ err });
          }

          res.status(201).json({
            message: "Inscripción completada",
            route_participant_id: deleteResult.insertId,
          });
        });
      });
    });
  };

  leaveRoute = (req, res) => {
    const { id: route_id } = req.params;
    const { user_id } = req.body;

    // Check if the route is passed
    let checkDateSql = `SELECT date from ROUTE where route_id = "${route_id}"`;
    connection.query(checkDateSql, (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }
      const routeDate = new Date(result[0].date);
      const now = new Date();

      if (routeDate < now) {
        return res.status(400).json({ message: "Rute already expired" });
      }

      let sql = `DELETE FROM route_participant WHERE user_id = '${user_id}' AND route_id = '${route_id}';`;
      connection.query(sql, (err, deleteResult) => {
        err
          ? res.status(400).json({ err })
          : res
              .status(200)
              .json({ message: "Inscripción cancelada", deleteResult });
      });
    });
  };

  getFrequentCompanions = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `
      SELECT 
        companion_id as user_id,
        u.name,
        u.img,
        COUNT(*) as shared_routes
      FROM (
        
        /* ============================================
          CASE 1: I'm the CREATOR of the route. Get PARTICIPANTS as companions
          ============================================ */
        SELECT 
          rp.user_id as companion_id, 
          r.route_id
        FROM route r
        JOIN route_participant rp ON r.route_id = rp.route_id
        WHERE r.user_id = '${user_id}'
          AND r.date < NOW()
          AND r.is_deleted = 0
          AND rp.user_id != '${user_id}'
        
        UNION ALL
        
        /* ============================================
          CASE 2: I'm a PARTICIPANT of the route. Get the CREATOR as a companion
          ============================================ */
        SELECT 
          r.user_id as companion_id, 
          r.route_id
        FROM route r
        JOIN route_participant rp ON r.route_id = rp.route_id
        WHERE rp.user_id = '${user_id}'
          AND r.date < NOW()
          AND r.is_deleted = 0
          AND r.user_id != '${user_id}'
        
        UNION ALL
        
        /* ============================================
          CASE 3: I'm a PARTICIPANT of the route. Get OTHER PARTICIPANTS as companions
          ============================================ */
        SELECT 
          rp2.user_id as companion_id, 
          r.route_id
        FROM route r
        JOIN route_participant rp ON r.route_id = rp.route_id
        JOIN route_participant rp2 ON r.route_id = rp2.route_id
        WHERE rp.user_id = '${user_id}'
          AND r.date < NOW()
          AND r.is_deleted = 0
          AND rp2.user_id != '${user_id}'
          AND rp2.user_id != r.user_id
          
      ) as companions
      /* Join user to fetch display info */
      JOIN user u ON companions.companion_id = u.user_id

      /* Group and count */
      GROUP BY companion_id, u.name, u.img

      /* Minimum 2 shared routes */
      HAVING COUNT(*) >= 2

      /* Order by most shared routes */
      ORDER BY shared_routes DESC;
    `;

    connection.query(sql, (err, result) => {
      err ? res.status(400).json({ err }) : res.status(200).json(result);
    });
  };
}

module.exports = new routesControllers();
