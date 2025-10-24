/*Purpose: provide a "connection-like" adapter backed by a MySQL pool.
It preserves the callback signature: connection.query(sql[, params], cb)
so I keep the same structure in the controller and I can switch by changing only the import*/

const mysql2 = require("mysql2/promise");

let pool;

/** Lazily create a singleton pool (one per process). */
function getPool() {
  if (!pool) {
    pool = mysql2.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
    console.log("MySql pool created");
  }
  return pool;
}

function escape(value) {
  // Use the non-promise variant just for escaping.
  const mysqlSync = require("mysql2");
  return mysqlSync.escape(value);
}

// Run a query with the same callback shape as mysql2's classic connection
function query(sql, paramsOrCb, maybeCb) {
  const pool = getPool();

  // Normalize to (params, cb)
  let params, cb;
  if (typeof paramsOrCb === "function") {
    (params = []), (cb = paramsOrCb);
  } else {
    (params = paramsOrCb || []), (cb = maybeCb);
  }

  pool
    .query(sql, params)
    .then(([rows, fields]) => cb(null, rows, fields))
    .catch((err) => cb(err));
}

module.exports = { query, escape };
