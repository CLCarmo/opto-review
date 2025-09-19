// backend/server.js

const express = require('express');
const cors = require('cors');
const db = require('./db'); // Importa nossa configuração do banco de dados

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares para permitir requisições de outras origens (CORS) e para entender JSON
app.use(cors());
app.use(express.json());

// Rota Raiz (Página de Teste)
app.get('/', (req, res) => {
  res.send('<h1>🚀 Servidor do OPTO Review está no ar!</h1>');
});

// Rota de Produtos - Buscando do Banco de Dados
app.get('/api/produtos', async (req, res) => {
  try {
    // Comando SQL para buscar os produtos e juntar com os nomes das categorias e fabricantes
    const result = await db.query(
      `SELECT 
         p.id_produto,
         p.nome,
         p.modelo,
         p.descricao,
         p.especificacoes,
         c.nome AS categoria,
         f.nome AS fabricante
       FROM produtos p
       LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
       LEFT JOIN fabricantes f ON p.id_fabricante = f.id_fabricante`
    );
    // Retorna as linhas encontradas como resposta JSON
    res.json(result.rows);
  } catch (err) {
    // Em caso de erro, loga no console e envia uma resposta de erro 500
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos no banco de dados.' });
  }
});

// NOVO ENDPOINT: Rota para buscar todas as categorias
app.get('/api/categorias', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categorias ORDER BY nome ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).json({ error: 'Erro ao buscar categorias no banco de dados.' });
  }
});

// Inicia o servidor e o faz "escutar" por requisições na porta definida
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend do OPTO Review está no ar em http://localhost:${PORT}`);
});