// backend/db.js
const { Pool } = require('pg');

// DEBUG: Vamos ver o que está chegando aqui
console.log("--- DEBUG CONEXÃO ---");
console.log("DATABASE_URL existe?", !!process.env.DATABASE_URL); // Retorna true ou false
console.log("Valor (início):", process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + "..." : "INDEFINIDO");
console.log("---------------------");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};