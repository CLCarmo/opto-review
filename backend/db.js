// backend/db.js
const { Pool } = require('pg');

// Configuração correta para o Railway (Produção) e Local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para conectar no Railway
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};