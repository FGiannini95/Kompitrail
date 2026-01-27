const connection = require("../config/db");
const { connect } = require("../routes/motorbikes");
require("dotenv").config();
const path = require("path");
const Contract = require(
  path.resolve(__dirname, "../../shared/chat-contract/index"),
);
const { EVENTS } = Contract;
const getOrsRouteGeojson = require("../utils/orsRoute");
const translateText = require("../utils/translator");

class routesControllers {
  createRoute = async (req, res) => {
    const {
      user_id,
      starting_point_i18n,
      ending_point_i18n,
      starting_lat,
      starting_lng,
      ending_lat,
      ending_lng,
      date,
      level,
      suitable_motorbike_type,
      max_participants,
      route_description,
      is_verified,
      waypoints = [],
    } = JSON.parse(req.body.createRoute);

    // Validate i18n objects
    if (
      !starting_point_i18n ||
      typeof starting_point_i18n !== "object" ||
      Object.keys(starting_point_i18n).length === 0
    ) {
      return res.status(400).json({ error: "starting_point_i18n inválido" });
    }

    if (
      !ending_point_i18n ||
      typeof ending_point_i18n !== "object" ||
      !ending_point_i18n.es ||
      !ending_point_i18n.es.full
    ) {
      return res.status(400).json({ error: "ending_point_i18n inválido" });
    }

    // Basic input validation
    if (
      !user_id ||
      starting_lat == null ||
      starting_lat === "" ||
      starting_lng == null ||
      starting_lng === "" ||
      ending_lat == null ||
      ending_lat === "" ||
      ending_lng == null ||
      ending_lng === "" ||
      !date ||
      !level ||
      !max_participants ||
      !route_description
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    // Validate motorbikes
    if (
      !Array.isArray(suitable_motorbike_type) ||
      suitable_motorbike_type.filter((v) => v && v.trim() !== "").length === 0
    ) {
      return res.status(400).json({ error: "Tipo de moto requerido" });
    }

    // Validate coordinates
    if (
      isNaN(starting_lat) ||
      isNaN(starting_lng) ||
      isNaN(ending_lat) ||
      isNaN(ending_lng)
    ) {
      return res.status(400).json({ error: "Coordinadas incorrectas." });
    }

    // Validate waypoints
    if (waypoints.length > 10) {
      return res.status(400).json({ error: "Max paradas permitidas: 10" });
    }

    // Validate each waypoint shape if present
    for (const w of waypoints) {
      if (
        !w ||
        !w.label_i18n ||
        typeof w.label_i18n !== "object" ||
        w.lat == null ||
        w.lng == null ||
        w.position == null ||
        w.lat == "" ||
        w.lng == ""
      ) {
        return res.status(400).json({ error: "Waypoint incorecto" });
      }

      if (isNaN(w.lat) || isNaN(w.lng) || isNaN(w.position)) {
        return res
          .status(400)
          .json({ error: "Coordinadas del waypoint incorrectas" });
      }
    }

    // Validate waypoint positions
    const positions = new Set();

    for (const w of waypoints) {
      // Ensure integer (accept numeric strings too)
      const pos = Number(w.position);

      // Position must be a finite integer
      if (!Number.isFinite(pos) || !Number.isInteger(pos)) {
        return res
          .status(400)
          .json({ error: "La posizione del waypoint deve essere un numero." });
      }

      // range 0..9 (because max 10)
      if (pos < 0 || pos > 9) {
        return res
          .status(400)
          .json({ error: "Waypoint position out of range (0..9)" });
      }

      // Avoid duplicates
      if (positions.has(pos)) {
        return res
          .status(400)
          .json({ error: "Posizione del waypoint duplicada." });
      }

      positions.add(pos);
    }

    //Normalize motorbike types
    const motorbikeTypes = Array.isArray(suitable_motorbike_type)
      ? suitable_motorbike_type.filter((v) => v && v.trim() !== "").join(",")
      : suitable_motorbike_type;

    // NOTE: for now we pass NO waypoints to ORS.
    let routeGeometry;
    let computedDistance;
    let computedEstimatedTime;

    try {
      const start = { lat: Number(starting_lat), lng: Number(starting_lng) };
      const end = { lat: Number(ending_lat), lng: Number(ending_lng) };

      const waypointsForOrs = waypoints.map((w) => ({
        lat: w.lat,
        lng: w.lng,
      }));
      const orsResult = await getOrsRouteGeojson(start, end, waypointsForOrs);

      routeGeometry = JSON.stringify(orsResult.geometry);
      computedDistance = orsResult.distanceKm;
      computedEstimatedTime = orsResult.durationMinutes;
    } catch (err) {
      const status = err.status || err.response?.status || 500;

      console.error("createRoute ORS error:", {
        message: err.message,
        code: err.code,
        status,
      });

      return res.status(status).json({
        error: err.message || "Error al calcular la ruta",
      });
    }

    const startingPointI18nJson = JSON.stringify(starting_point_i18n);
    const endingPointI18nJson = JSON.stringify(ending_point_i18n);

    const sqlInsertRoute = `
      INSERT INTO route (
        user_id, 
        date, 
        starting_point_i18n,
        starting_lat,
        starting_lng,
        ending_point_i18n,
        ending_lat,
        ending_lng,
        level, 
        distance,
        is_verified, 
        suitable_motorbike_type, 
        estimated_time, 
        max_participants,
        route_description,
        route_geometry, 
        is_deleted
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    const routeParams = [
      user_id,
      date,
      startingPointI18nJson,
      Number(starting_lat),
      Number(starting_lng),
      endingPointI18nJson,
      Number(ending_lat),
      Number(ending_lng),
      level,
      computedDistance,
      is_verified || 0,
      motorbikeTypes,
      computedEstimatedTime,
      max_participants,
      route_description,
      routeGeometry,
    ];

    connection.getConnection((getConnErr, conn) => {
      if (getConnErr) {
        return res.status(500).json({ error: getConnErr });
      }

      conn.beginTransaction((txErr) => {
        if (txErr) {
          conn.release();
          return res.status(500).json({ error: txErr });
        }

        // Insert route
        conn.query(sqlInsertRoute, routeParams, (error, result) => {
          if (error) {
            return conn.rollback(() => {
              conn.release();
              return res.status(500).json({ error });
            });
          }

          const routeId = result.insertId;

          const insertWaypoints = () => {
            if (!waypoints.length) return createChatRoom();

            const sqlInsertWaypoints = `
              INSERT INTO 
                route_waypoint 
                (route_id, position, label_i18n, waypoint_lat, waypoint_lng) 
              VALUES ?
            `;

            const ordered = [...waypoints].sort(
              (a, b) => Number(a.position) - Number(b.position),
            );

            const values = ordered.map((w) => [
              routeId,
              Number(w.position),
              JSON.stringify(w.label_i18n),
              w.lat,
              w.lng,
            ]);

            conn.query(sqlInsertWaypoints, [values], (wpErr) => {
              if (wpErr) {
                return conn.rollback(() => {
                  conn.release();
                  return res.status(500).json({ error: wpErr });
                });
              }

              createChatRoom();
            });
          };

          const createChatRoom = () => {
            const sqlInsertChatRoom = `
          INSERT INTO chat_room (route_id, is_locked) VALUES (?, 0)
        `;

            conn.query(sqlInsertChatRoom, [routeId], (errorChat) => {
              if (errorChat) {
                return conn.rollback(() => {
                  conn.release();
                  return res.status(500).json({ error: errorChat });
                });
              }

              conn.commit((commitErr) => {
                if (commitErr) {
                  return conn.rollback(() => {
                    conn.release();
                    return res.status(500).json({ error: commitErr });
                  });
                }

                // Release connection before long async work.
                conn.release();

                selectAndReturn(routeId);
              });
            });
          };

          const selectAndReturn = (routeId) => {
            const sqlSelect = `
            SELECT 
              r.route_id, 
              r.user_id, 
              r.date, 
              r.created_at,
              r.starting_point_i18n,
              r.starting_lat,
              r.starting_lng,
              r.ending_point_i18n,
              r.ending_lat,
              r.ending_lng,
              r.level, 
              r.distance, 
              r.is_verified, 
              r.suitable_motorbike_type,
              r.estimated_time, 
              r.max_participants, 
              r.route_description,
              r.route_geometry, 
              r.is_deleted,
              u.name AS create_name,
              u.img  AS user_img
            FROM route r
              LEFT JOIN user u ON r.user_id = u.user_id
            WHERE r.route_id = ?
          `;

            const sqlSelectWaypoints = `
              SELECT position, label_i18n, waypoint_lat, waypoint_lng
              FROM route_waypoint
              WHERE route_id = ?
              ORDER BY position ASC
            `;

            connection.query(sqlSelect, [routeId], (error2, result2) => {
              if (error2) {
                return res.status(500).json({ error: error2 });
              }
              if (!result2 || result2.length === 0) {
                return res.status(404).json({ error: "Ruta no encontrada" });
              }

              const route = result2[0];
              // Parse i18n JSON back to objects
              try {
                route.starting_point_i18n =
                  typeof route.starting_point_i18n === "string"
                    ? JSON.parse(route.starting_point_i18n)
                    : route.starting_point_i18n;

                route.ending_point_i18n =
                  typeof route.ending_point_i18n === "string"
                    ? JSON.parse(route.ending_point_i18n)
                    : route.ending_point_i18n;
              } catch (parseErr) {
                console.error("Error parsing i18n JSON:", parseErr);
              }

              route.suitable_motorbike_type = (
                route.suitable_motorbike_type || ""
              )
                .split(",")
                .filter(Boolean);

              connection.query(
                sqlSelectWaypoints,
                [routeId],
                (wpErr, wpRows) => {
                  if (wpErr) {
                    return res.status(500).json({ error: wpErr });
                  }

                  // Parse label_i18n JSON for each waypoint
                  const waypoints = (wpRows || []).map((wp) => ({
                    position: wp.position,
                    label_i18n: wp.label_i18n
                      ? typeof wp.label_i18n === "string"
                        ? JSON.parse(wp.label_i18n)
                        : wp.label_i18n
                      : null,
                    lat: wp.waypoint_lat,
                    lng: wp.waypoint_lng,
                  }));

                  route.waypoints = waypoints;
                  return res.status(200).json(route);
                },
              );
            });
          };

          insertWaypoints();
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
      WHERE r.user_id = ? AND r.is_deleted = 0 AND r.date >= NOW()
      ORDER BY r.route_id DESC
    `;

    connection.query(sql, [user_id], (error, result) => {
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
          ORDER BY route_participant.joined_at ASC
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

        r.suitable_motorbike_type = (r.suitable_motorbike_type || "")
          .split(",")
          .filter(Boolean);

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

  editRoute = async (req, res) => {
    const {
      starting_point_i18n,
      ending_point_i18n,
      starting_lat,
      starting_lng,
      ending_lat,
      ending_lng,
      route_geometry,
      date,
      level,
      distance,
      is_verified,
      suitable_motorbike_type,
      estimated_time,
      max_participants,
      route_description,
      waypoints = [],
    } = JSON.parse(req.body.editRoute);

    const { id: route_id } = req.params;

    // Parse suitable_motorbike_type if it's array
    const motorbikeTypes = Array.isArray(suitable_motorbike_type)
      ? suitable_motorbike_type.join(",")
      : suitable_motorbike_type;

    // Stringify i18n objects
    const startingPointI18nJson = JSON.stringify(starting_point_i18n);
    const endingPointI18nJson = JSON.stringify(ending_point_i18n);

    // Recalculate route geometry, distance and time with updated waypoints
    let routeGeometry;
    let computedDistance;
    let computedEstimatedTime;

    try {
      const start = { lat: Number(starting_lat), lng: Number(starting_lng) };
      const end = { lat: Number(ending_lat), lng: Number(ending_lng) };

      // Convert waypoints to ORS format (only coordinates needed)
      const waypointsForOrs = waypoints.map((w) => ({
        lat: w.lat,
        lng: w.lng,
      }));

      // Calculate new route with current waypoints
      const orsResult = await getOrsRouteGeojson(start, end, waypointsForOrs);

      routeGeometry = JSON.stringify(orsResult.geometry);
      computedDistance = orsResult.distanceKm;
      computedEstimatedTime = orsResult.durationMinutes;
    } catch (err) {
      const status = err.status || err.response?.status || 500;

      console.error("editRoute ORS error:", {
        message: err.message,
        code: err.code,
        status,
      });

      return res.status(status).json({
        error: err.message || "Error al calcular la ruta",
      });
    }

    let sqlUpdateRoute = `
    UPDATE route SET 
      starting_point_i18n = ?,
      starting_lat = ?,
      starting_lng = ?,
      ending_point_i18n = ?,
      ending_lat = ?,
      ending_lng = ?,
      route_geometry = ?,
      date = ?, 
      level = ?,  
      distance = ?,  
      is_verified = ?, 
      suitable_motorbike_type = ?,  
      estimated_time = ?, 
      max_participants = ?, 
      route_description = ?
    WHERE route_id = ? AND is_deleted = 0
  `;

    // Use computed values instead of old frontend values
    // This ensures route data reflects the current waypoints configuration
    const routeParams = [
      startingPointI18nJson,
      starting_lat,
      starting_lng,
      endingPointI18nJson,
      ending_lat,
      ending_lng,
      routeGeometry, // ← Newly calculated geometry
      date,
      level,
      computedDistance, // ← Newly calculated distance
      is_verified,
      motorbikeTypes,
      computedEstimatedTime, // ← Newly calculated time
      max_participants,
      route_description,
      route_id,
    ];

    connection.query(sqlUpdateRoute, routeParams, (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }

      // Clean existing waypoints and insert new ones
      // This handles add, remove, and reorder operations
      const deleteWaypoints = `DELETE FROM route_waypoint WHERE route_id = ?`;

      connection.query(deleteWaypoints, [route_id], (delErr) => {
        if (delErr) {
          return res.status(400).json({ err: delErr });
        }

        // If no waypoints, route update is complete
        if (waypoints.length === 0) {
          return res.status(200).json({ message: "Ruta modificada", result });
        }

        // Insert updated waypoints with correct positions
        const sqlInsertWaypoints = `
       INSERT INTO route_waypoint
        (route_id, position, label_i18n, waypoint_lat, waypoint_lng)
        VALUES ?  
      `;

        const values = waypoints.map((w) => [
          route_id,
          w.position,
          JSON.stringify(w.label_i18n),
          w.lat,
          w.lng,
        ]);

        connection.query(sqlInsertWaypoints, [values], (wpErr) => {
          if (wpErr) return res.status(400).json({ err: wpErr });
          return res.status(200).json({ message: "Ruta modificada", result });
        });
      });
    });
  };

  showOneRoute = (req, res) => {
    const { id: route_id } = req.params;
    const sql = `
      SELECT
        r.*,
        creator_user.name     AS create_name,
        creator_user.lastname AS create_lastname,
        creator_user.img      AS user_img,
        GROUP_CONCAT(
          DISTINCT CONCAT(
            rp.user_id, ':',
            COALESCE(participant_user.name, ''), ':',
            COALESCE(participant_user.img, '')
          )
          ORDER BY rp.joined_at ASC
          SEPARATOR '|'
        ) AS participants_raw
      FROM route r
      LEFT JOIN \`user\` AS creator_user
        ON creator_user.user_id = r.user_id
      LEFT JOIN route_participant rp
        ON rp.route_id = r.route_id
      LEFT JOIN \`user\` AS participant_user
        ON participant_user.user_id = rp.user_id
      WHERE r.route_id = ? AND r.is_deleted = 0
      GROUP BY r.route_id
      LIMIT 1
    `;

    connection.query(sql, [route_id], (err, rows) => {
      if (err) {
        console.error("showOneRoute DB error:", err);
        return res.status(500).json({ error: err.message });
      }
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "Ruta no encontrada" });
      }

      const r = rows[0];

      // Convert "12:Marco|27:Anna" -> [{ user_id:12, name:"Marco" }, { user_id:27, name:"Anna" }]
      const participants = (r.participants_raw || "")
        .split("|")
        .filter(Boolean)
        .map((triple) => {
          const parts = triple.split(":");
          const uid = Number(parts.shift());
          const name = parts.shift() || "";
          const img = parts.join(":") || "";
          return { user_id: uid, name, img };
        });

      r.suitable_motorbike_type = (r.suitable_motorbike_type || "")
        .split(",")
        .filter(Boolean);

      const sqlSelectWaypoints = `
        SELECT position, label_i18n, waypoint_lat, waypoint_lng
        FROM route_waypoint
        WHERE route_id = ?
        ORDER BY position ASC
      `;

      connection.query(sqlSelectWaypoints, [route_id], (wpErr, wpRows) => {
        if (wpErr) {
          return res.status(500).json({ error: wpErr });
        }

        // Use safe parsing for waypoints
        const waypoints = (wpRows || []).map((wp) => ({
          position: wp.position,
          label_i18n:
            wp.label_i18n && typeof wp.label_i18n === "string"
              ? JSON.parse(wp.label_i18n)
              : wp.label_i18n,
          lat: wp.waypoint_lat,
          lng: wp.waypoint_lng,
        }));

        const { participants_raw, ...rest } = r;

        return res.status(200).json({
          ...rest,
          participants,
          waypoints,
        });
      });
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
          },
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
    let checkDateSql = `SELECT date from route where route_id = "${route_id}"`;
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
              },
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
            },
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

  calculateMetrics = async (req, res) => {
    try {
      const { start, end, waypoints = [] } = req.body;

      const orsResult = await getOrsRouteGeojson(start, end, waypoints);

      return res.json({
        distanceKm: orsResult.distanceKm,
        durationMinutes: orsResult.durationMinutes,
        geometry: orsResult.geometry,
      });
    } catch (err) {
      const status = err.status || err.response?.status || 500;

      console.error("calculateMetrics error:", {
        message: err.message,
        code: err.code,
        status,
      });

      return res.status(status).json({
        error: err.message || "Error al calcular la ruta",
      });
    }
  };

  translateDescription = async (req, res) => {
    try {
      const { text, targetLang } = req.body;

      if (!text || !targetLang) {
        return res.status(400).json({ error: "Texto e idioma obligatorios" });
      }
      // DeepL auto-detects source language when sourceLang is null
      const translatedText = await translateText(text, null, targetLang);

      res.json({
        translatedText: translatedText || text,
        originalText: text,
      });
    } catch (error) {
      console.error("Error en la tradución:", error);
      res.status(500).json({
        error: "Error en la tradución",
        translatedText: req.body.text, // fallback to original text
      });
    }
  };

  calculateGeocoding = async (req, res) => {
    try {
      const { query, language = es } = req.body;

      // Basic validation
      if (!query || typeof query !== "string") {
        return res.status(400).json({
          error: "Query de búsqueda requerido",
        });
      }

      const searchQuery = query.trim();

      // Minimum length check
      if (searchQuery.length < 2) {
        return res.status(400).json({
          error: "Query debe tener al menos 2 caracteres",
        });
      }

      // Max length check to prevent abuse
      if (searchQuery.length > 100) {
        return res.status(400).json({
          error: "Query demasiado largo",
        });
      }

      const ORS_API_KEY = process.env.ORS_API_KEY;

      if (!ORS_API_KEY) {
        console.error("ORS API key not configured");
        return res.status(500).json({
          error: "Servicio temporalmente no disponible",
        });
      }

      // Build ORS geocoding URL
      const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(
        searchQuery,
      )}&size=5&lang=${language}`;

      // Call ORS Geocoding API
      const response = await fetch(url);

      if (!response.ok) {
        const status = response.status;
        console.error(`ORS Geocoding error: ${status}`);

        // Handle different error types
        if (status === 429) {
          return res.status(429).json({
            error: "Demasiadas búsquedas, intenta más tarde",
          });
        }

        return res.status(500).json({
          error: "Error en el servicio de búsqueda",
        });
      }

      const data = await response.json();

      // Parse and format results
      const results =
        data.features?.map((feature) => ({
          name: feature.properties.name,
          displayName: feature.properties.label,
          lat: feature.geometry.coordinates[1], // ORS returns [lng, lat]
          lng: feature.geometry.coordinates[0], // Convert to [lat, lng]
          confidence: feature.properties.confidence,
          layer: feature.properties.layer, // locality, region, etc.
        })) || [];

      // Sort by relevance: localities first, then by confidence
      const sortedResults = results.sort((a, b) => {
        // Prioritize localities over regions
        if (a.layer === "locality" && b.layer !== "locality") return -1;
        if (b.layer === "locality" && a.layer !== "locality") return 1;

        // Then sort by confidence (higher first)
        return (b.confidence || 0) - (a.confidence || 0);
      });

      return res.status(200).json({
        results: sortedResults,
        query: searchQuery,
        total: sortedResults.length,
      });
    } catch (err) {
      console.error("Geocoding controller error:", {
        message: err.message,
        stack: err.stack,
      });

      return res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  };

  navigationRoutes = (req, res) => {
    console.log("🚀 Navigation route called");
    console.log("📍 Request body:", JSON.stringify(req.body, null, 2));
    console.log("🔧 Method:", req.method);

    // Basic response for now
    res.json({
      message: "Navigation endpoint working",
      received: req.body,
    });
  };
}

module.exports = new routesControllers();
