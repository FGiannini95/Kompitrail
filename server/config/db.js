const mysql2 = require("mysql2");

// Load environment variables. In development: load from .env using dotenv. In production: rely ONLY on systemd EnvironmentFile
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Create a MySQL connection pool, mandatory in production to avoid random disconnects
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  // Pool settings for production stability
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Prevent desconection
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Quick health check at startup
pool.query("SELECT 1", (err) => {
  if (err) {
    console.error("DB pool initial check failed:", err);
  } else {
    console.log("DB pool ready");
  }
});

module.exports = pool;
