// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // requis pour Neon
  },
});

// Tester la connexion au démarrage
pool.connect()
  .then(client => {
    console.log('✅ Connexion à la base PostgreSQL réussie !');
    client.release();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base PostgreSQL :', err.message);
  });

module.exports = {pool};
