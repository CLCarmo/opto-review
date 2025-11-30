// backend/db.js
const { Pool } = require('pg');

// DIAGNÓSTICO: Vamos ver no log do Railway o que está acontecendo
console.log("🔄 Tentando conectar ao Banco de Dados...");
console.log("📍 URL da Variável:", process.env.DATABASE_URL ? "Encontrada" : "NÃO ENCONTRADA (Usando fallback?)");

// Configuração que aceita TANTO a String  QUANTO as variáveis soltas (PGHOST, PGUSER, etc.)
// O Railway fornece as variáveis PG* automaticamente, então isso é o mais seguro.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false
  }
});

// Tratamento de erro de conexão
pool.on('error', (err, client) => {
  console.error('❌ Erro CRÍTICO no Pool do PostgreSQL:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};