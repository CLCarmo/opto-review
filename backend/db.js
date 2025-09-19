// backend/db.js
const { Pool } = require('pg');

// ======================================================================
// SOLUÇÃO DEFINITIVA: Limpa a variável de ambiente "fantasma"
// Esta linha verifica se process.env.PGPASSWORD existe e, se existir,
// a apaga da memória ANTES que o driver do banco de dados a leia.
if (process.env.PGPASSWORD) {
  console.log('Variável de ambiente PGPASSWORD "fantasma" encontrada. Limpando...');
  delete process.env.PGPASSWORD;
}
// ======================================================================

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'opto_review_db',
  password: '123', // A senha nova que definimos no pgAdmin
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};