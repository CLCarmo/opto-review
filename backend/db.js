// backend/db.js
const { Pool } = require('pg');

// Configuração para usar a Variável de Ambiente do Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Obrigatório para funcionar no Railway
  }
});

// Evento para monitorar erros inesperados no pool
pool.on('error', (err, client) => {
  console.error('Erro inesperado no cliente do pool', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};