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

        // Return the freshly created route (joined with creator name for convenience)
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
                u.name AS create_name,
                u.img  AS user_img
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

  showOneRoute = (req, res) => {
    const { id: route_id } = req.params;
    let sql = `SELECT * FROM route WHERE route_id ='${route_id}' AND is_deleted = 0`;
    connection.query(sql, (err, result) => {
      err ? res.status(400).json({ err }) : res.status(200).json(result[0]);
    });
  };

  deleteRoute = (req, res) => {
    const { id: route_id } = req.params;
    const { user_id } = req.body; // Must be the route creator

    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id" });
    }

    const sql = `
    UPDATE route
    SET is_deleted = 1
    WHERE route_id = ?
      AND user_id = ?
      AND date >= NOW()
      AND is_deleted = 0
  `;

    connection.query(sql, [route_id, user_id], (err, deleteResult) => {
      if (err) {
        return res.status(400).json({ err });
      }

      if (!deleteResult || deleteResult.affectedRows === 0) {
        return res
          .status(403)
          .json({ message: "La ruta no puede ser eliminada" });
      }

      // Fetch creator's display name for the system message
      const userSql = `SELECT name FROM user WHERE user_id = ? LIMIT 1`;

      connection.query(userSql, [user_id], (userError, userResult) => {
        const displayName =
          !userError && userResult?.[0]?.name
            ? String(userResult[0].name)
            : "Un usuario";

        const systemMessageText = `${displayName} ha eliminado la ruta`;
        const createdAt = new Date();
        const messageId = `sys-${Date.now()}-route-deleted`;

        // Save system msg in the db
        const insertMessageSql = `
        INSERT INTO chat_message (chat_room_id, user_id, body, is_system, created_at)
        SELECT chat_room_id, ?, ?, 1, ?
        FROM chat_room
        WHERE route_id = ?
      `;

        connection.query(
          insertMessageSql,
          [user_id, systemMessageText, createdAt, route_id],
          (msgErr, msgResult) => {
            if (msgErr) {
              console.error("Error saving system message:", msgErr);
            }

            try {
              io.to(route_id).emit(EVENTS.S2C.MESSAGE_NEW, {
                chatId: route_id,
                message: {
                  id: msgErr ? messageId : msgResult.insertId,
                  chatId: route_id,
                  userId: "system",
                  text: systemMessageText,
                  createdAt: createdAt.toISOString(),
                },
              });
            } catch (_) {
              // Ignore it
            }

            return res
              .status(200)
              .json({ message: "Ruta eliminada", deleteResult });
          }
        );
      });
    });
  };

  joinRoute = (req, res) => {
    const { id: route_id } = req.params; // route id from URL (room name)
    const { user_id } = req.body; // who is joining

    // Access Socket.io instance
    const io = req.app.get("io");

    // Check if the route is passed
    let checkDateSql = `SELECT date from ROUTE where route_id = "${route_id}"`;
    connection.query(checkDateSql, (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }
      const routeDate = new Date(result[0].date);
      const now = new Date();

      if (!routeDate || routeDate < now) {
        return res.status(400).json({ message: "Ruta ya pasada" });
      }

      // Avoid duplicate entry error
      let checkSql = `SELECT * FROM route_participant WHERE user_id = "${user_id}" AND route_id = "${route_id}"`;

      connection.query(checkSql, (err2, result2) => {
        if (err2) {
          return res.status(400).json({ err: err2 });
        }

        // If user is already enrolled, return error
        if (result2.length > 0) {
          return res.status(409).json({
            error: "Usuario ya inscrito",
          });
        }

        // If not enrolled, proceed with INSERT
        let insertSql = `INSERT INTO route_participant (user_id, route_id) VALUES ("${user_id}", "${route_id}")`;

        connection.query(insertSql, (err3, insertRes) => {
          if (err3) {
            return res.status(400).json({ err: err3 });
          }

          // Fetch user display name for the system message
          const userSql = `SELECT name FROM user WHERE user_id='${user_id}' LIMIT 1`;

          connection.query(userSql, (userError, userResult) => {
            const displayName =
              !userError && userResult?.[0]?.name
                ? String(userResult[0].name)
                : "Un usuario";

            const systemMessageText = `${displayName} ha entrado en el chat`;
            const createdAt = new Date();

            // Save system msg in the db
            const insertMessageSql = `
              INSERT INTO chat_message (chat_room_id, user_id, body, is_system, created_at)
              SELECT chat_room_id, ?, ?, 1, ?
              FROM chat_room
              WHERE route_id = ?
            `;

            connection.query(
              insertMessageSql,
              [user_id, systemMessageText, createdAt, route_id],
              (msgErr, msgResult) => {
                if (msgErr) {
                  console.error("Error saving system message", msgErr);
                }

                const messageId = msgErr
                  ? `sys-${Date.now()}-join`
                  : msgResult.insertId;

                const payload = {
                  chatId: route_id,
                  message: {
                    id: messageId,
                    chatId: route_id,
                    userId: "system",
                    text: systemMessageText,
                    createdAt: createdAt.toISOString(),
                  },
                };
                // Broadcast a system line to everyone in this chat room (route_id)
                io.to(route_id).emit(EVENTS.S2C.MESSAGE_NEW, payload);
              }
            );

            res.status(201).json({
              message: "Inscripción completada",
              route_participant_id: insertRes.insertId,
            });
          });
        });
      });
    });
  };

  leaveRoute = (req, res) => {
    const { id: route_id } = req.params; // room name = route_id
    const { user_id } = req.body;

    const io = req.app.get("io");

    // Check if the route is passed
    let checkDateSql = `SELECT date FROM route WHERE route_id = ?`;
    connection.query(checkDateSql, [route_id], (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ message: "Ruta no encontrada" });
      }

      const routeDate = new Date(result[0].date);
      const now = new Date();

      if (!routeDate || routeDate < now) {
        return res.status(400).json({ message: "Ruta already expired" });
      }

      let sql = `DELETE FROM route_participant WHERE user_id = ? AND route_id = ?`;
      connection.query(sql, [user_id, route_id], (err2, deleteResult) => {
        if (err2) {
          return res.status(400).json({ err: err2 });
        }

        // Fetch display name to compose the system line
        const userSql = `SELECT name FROM user WHERE user_id = ? LIMIT 1`;

        connection.query(userSql, [user_id], (userError, userResult) => {
          const displayName =
            !userError && userResult?.[0]?.name
              ? String(userResult[0].name)
              : "Un usuario";

          const systemMessageText = `${displayName} ha abandonado el chat`;
          const createdAt = new Date();
          const messageId = `sys-${Date.now()}-leave`;

          // Save system msg in the db
          const insertMessageSql = `
          INSERT INTO chat_message (chat_room_id, user_id, body, is_system, created_at)
          SELECT chat_room_id, ?, ?, 1, ?
          FROM chat_room
          WHERE route_id = ?
        `;

          connection.query(
            insertMessageSql,
            [user_id, systemMessageText, createdAt, route_id],
            (msgErr, msgResult) => {
              if (msgErr) {
                console.error("Error saving system message:", msgErr);
              }

              const payload = {
                chatId: route_id,
                message: {
                  id: msgErr ? messageId : msgResult.insertId,
                  chatId: route_id,
                  userId: "system",
                  text: systemMessageText,
                  createdAt: createdAt.toISOString(),
                },
              };

              // Broadcast a system line to everyone currently in the room
              io.to(route_id).emit(EVENTS.S2C.MESSAGE_NEW, payload);

              return res
                .status(200)
                .json({ message: "Inscripción cancelada", deleteResult });
            }
          );
        });
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
