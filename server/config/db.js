const mysql2 = require("mysql2");
require("dotenv").config();

const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  //TiDB Serverless:
  ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
});

connection.connect((error) => {
  if (error) {
    throw error;
  } else {
    console.log("Conexión a bd correcta");
  }
});

module.exports = connection;
