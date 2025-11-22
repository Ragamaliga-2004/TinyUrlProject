// src/db.js
const { Pool } = require('pg');
require('dotenv').config();

let pool;

// Prefer DATABASE_URL if provided (common for Railway and other cloud DBs)
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Many hosted Postgres providers (including Railway) expect SSL
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // Fallback to individual PG* env vars
  pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
  });
}

// Optional: log unexpected errors on idle clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
});

// Helper function so the rest of the app can just call db.query(...)
const query = (text, params) => {
  return pool.query(text, params);
};

// Optional: small health check function (we can use later in /healthz)
async function checkDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    return result.rows[0].now;
  } catch (err) {
    console.error('Database connection check failed', err);
    throw err;
  }
}

module.exports = {
  pool,
  query,
  checkDatabaseConnection,
};
