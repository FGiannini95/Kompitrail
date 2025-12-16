const fs = require("fs");
const path = require("path");

// 1) Load local .env (dev)
require("dotenv").config();

// 2) Optionally load a shared env if present (prod-safe, but no hardcoding)
const sharedEnv =
  process.env.SHARED_ENV_PATH || "/var/www/kompitrail/shared/backend.env";
if (fs.existsSync(sharedEnv)) {
  require("dotenv").config({ path: sharedEnv });
}

const mysql2 = require("mysql2");

/** Single MySQL connection using env vars. */
const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Conexión a bd correcta");
});

module.exports = connection;
