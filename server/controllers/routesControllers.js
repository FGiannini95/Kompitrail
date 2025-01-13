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
    console.log(req.body.createRoute);

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

    let sql = `INSERT INTO route (
  user_id, route_name, date, starting_point, ending_point, level, distance, is_verified, suitable_motorbike_type, estimated_time, participants, route_description, is_deleted
) 
VALUES (
  '${user_id}', 
  '${route_name}',
  '${date}',
  '${starting_point}', 
  '${ending_point}',
 '${level}',
  '${distance}', 
  '1',
 '${suitable_motorbike_type}', 
  '${estimated_time}',
  '${participants}', 
'${route_description}',  '0'
);`;
    connection.query(sql, (error, result) => {
      error ? res.status(500).json({ error }) : res.status(200).json(result);
    });
  };
}

module.exports = new routesControllers();
