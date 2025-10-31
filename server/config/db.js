const mysql2 = require("mysql2");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

const sslOptions = isProd
  ? { minVersion: "TLSv1.2", rejectUnauthorized: true }
  : {
      ca: fs.readFileSync(path.resolve(__dirname, "tidb-ca.pem")),
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    }; // Locale: usa CA

const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  //TiDB Serverless:
  ssl: sslOptions,
});

// connection.connect((error) => {
//   if (error) {
//     throw error;
//   } else {
//     console.log("Conexión a bd correcta");
//   }
// });

connection.connect((err) => {
  if (err) {
    console.error("Error durante la conexión a la bd:", err);
    // NON fare throw qui: il server deve restare su per rispondere /health
    return;
  }
  console.log("Conexión a bd correcta");
});

module.exports = connection;
