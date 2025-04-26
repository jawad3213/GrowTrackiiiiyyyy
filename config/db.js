require("dotenv").config();
const { Pool } = require("pg");

let pool;

if (process.env.MODE === "cloud") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log("🌐 Connexion à la base de données Cloud (Neon)...");
} else {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false
  });
  console.log("💻 Connexion à la base de données Locale...");
}

module.exports = pool;
