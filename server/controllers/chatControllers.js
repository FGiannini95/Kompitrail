const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class chatControllers {
  listUserRooms = (req, res) => {
    // Prefer authenticated user (prod), fallback to query param (local/dev)
    const userId = req.user?.user_id ?? req.query.user_id;

    if (!userId) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const sql = `
      SELECT
        r.route_id,
        r.starting_point,
        r.ending_point,
        r.date,
        last.chat_message_id,
        last.user_id,
        last.body,
        last.is_system,
        last.created_at,
        COALESCE(last.created_at, r.date) AS last_activity
      FROM route_participant rp
      INNER JOIN route r
        ON r.route_id = rp.route_id
       AND r.is_deleted = 0
      INNER JOIN chat_room cr
        ON cr.route_id = r.route_id
      LEFT JOIN (
        SELECT
          msg.chat_message_id,
          msg.chat_room_id,
          msg.user_id,
          msg.body,
          msg.is_system,
          msg.created_at
        FROM chat_message AS msg
        INNER JOIN (
          SELECT chat_room_id, MAX(chat_message_id) AS max_id
          FROM chat_message
          GROUP BY chat_room_id
        ) AS latest_per_room
          ON latest_per_room.chat_room_id = msg.chat_room_id
         AND latest_per_room.max_id = msg.chat_message_id
      ) AS last
        ON last.chat_room_id = cr.chat_room_id
      WHERE rp.user_id = ?
      ORDER BY last_activity DESC
    `;

    connection.query(sql, [userId], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      // Shape the response to the client's need
      const result = (rows || []).map((r) => ({
        route_id: r.route_id,
        starting_point: r.starting_point,
        ending_point: r.ending_point,
        route_date: r.date,
        lastMessage: r.chat_message_id
          ? {
              id: r.last_message_id,
              userId: r.user_id,
              text: r.body,
              isSystem: Boolean(r.last_is_system),
              createdAt: r.last_created_at,
            }
          : null,
        lastActivity: r.last_activity,
      }));

      return res.status(200).json(result);
    });
  };
}

module.exports = new chatControllers();
