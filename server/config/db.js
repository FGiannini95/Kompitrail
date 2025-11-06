require("dotenv").config();
const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (error) {
    throw error;
  } else {
    console.log("Conexión a bd correcta");
  }
});

module.exports = connection;
