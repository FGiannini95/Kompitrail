const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class chatControllers {
  listUserRooms = (req, res) => {
    const userId = req.user?.user_id ?? req.query.user_id;
    if (!userId) return res.status(400).json({ error: "Missing user_id" });

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
    FROM route r
    INNER JOIN chat_room cr
      ON cr.route_id = r.route_id
    LEFT JOIN route_participant rp
      ON rp.route_id = r.route_id
    AND rp.user_id = ?
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
    WHERE r.is_deleted = 0
      AND (rp.user_id IS NOT NULL OR r.user_id = ?)
    ORDER BY
      CASE WHEN last.created_at IS NULL THEN 1 ELSE 0 END ASC,      -- with messages first
      CASE WHEN last.created_at IS NULL THEN DATE(r.date) END DESC, -- no-msg: newer day first
      CASE WHEN last.created_at IS NULL THEN TIME(r.date) END ASC,  -- no-msg same day: earliest time first
      last.created_at DESC,                                         -- with-msg: newest message first
      r.route_id DESC;   
    `;

    connection.query(sql, [userId, userId], (err, rows) => {
      if (err) return res.status(500).json({ error: "Internal server error" });

      const result = (rows || []).map((r) => ({
        route_id: r.route_id,
        starting_point: r.starting_point,
        ending_point: r.ending_point,
        route_date: r.date,
        lastMessage: r.last_message_id
          ? {
              id: r.last_message_id,
              userId: r.last_user_id,
              text: r.last_body,
              isSystem: Boolean(r.last_is_system),
              createdAt: r.last_created_at,
            }
          : null,
        lastActivity: r.last_activity,
      }));

      return res.status(200).json(result);
    });
  };

  getChatMessages = (req, res) => {
    const { id: route_id } = req.params; // route id from URL (room name)
    const { user_id } = req.query; // who is asking for messages

    // Verify the user has access to the chat: either participant or creator
    const checkAccessSql = `
      SELECT 1
      FROM route_participant
      WHERE route_id = ? AND user_id = ?
      UNION
      SELECT 1
      FROM route
      WHERE route_id = ? and user_id = ?
    `;

    connection.query(
      checkAccessSql,
      [route_id, user_id, route_id, user_id],
      (err, accessResult) => {
        if (err || !accessResult || accessResult.length == 0) {
          return res.status(403).json({ message: "Accesso denegado" });
        }

        // Restore all messages order by date
        const sql = `
          SELECT
            cm.chat_message_id AS id,
            cm.user_id AS userId,
            cm.body AS text,
            cm.is_system AS isSystem,
            cm.created_at AS createdAt
          FROM chat_message cm
          INNER JOIN chat_room cr ON cm.chat_room_id = cr.chat_room_id
          WHERE cr.route_id = ?
          ORDER BY cm.created_at ASC
        `;

        connection.query(sql, [route_id], (err2, messages) => {
          if (err2) {
            return res.status(400).json({ err: err2 });
          }
          return res.status(200).json({ messages: messages || [] });
        });
      }
    );
  };
}

module.exports = new chatControllers();
