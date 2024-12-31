const connection = require("../config/db");
require("dotenv").config();

class routesControllers {
  createRoute = (req, res) => {
    console.log("hola en create rutes");
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
    } = JSON.parse(req.body.createRoute);
    console.log(req.body);
    let sql = `INSERT INTO route (user_id, route_name, starting_point, ending_point, date, level, distances, is_verified, suitable_motorbike_type, estimated_time, participants, route_description, is_deleted) VALUE ('${user_id}', '${route_name}', '${starting_point}', '${ending_point}', '2024-11-18 09:00:00', '${level}', '${distance}', '0', '${suitable_motorbike_type}', '${estimated_time}','${participants}', '${route_description}', 0 )`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };
}

module.exports = new routesControllers();
