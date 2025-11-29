// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const app = express();
const bcrypt = require('bcrypt'); 
const saltRounds = 10;
const PORT = process.env.PORT || 8080;

// LIBERA GERAL O CORS (Resolve o erro de bloqueio da Vercel)
app.use(cors());
app.use(express.json());

// Rota Raiz
app.get('/', (req, res) => {
  res.send('<h1>🚀 Servidor do OPTO Review está no ar!</h1>');
});

// --- ROTA DE PRODUTOS ---
app.get('/api/produtos', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         p.id_produto, p.nome, p.modelo, p.descricao, p.especificacoes, p.imagem_url,
         c.nome AS categoria, f.nome AS fabricante,
         COALESCE(
            (SELECT MIN(pr.preco) FROM precos pr WHERE pr.id_produto = p.id_produto),
            p.price_low
         ) AS price_low
       FROM produtos p
       LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
       LEFT JOIN fabricantes f ON p.id_fabricante = f.id_fabricante`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

// --- ROTA DE CATEGORIAS ---
app.get('/api/categorias', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categorias ORDER BY nome ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).json({ error: 'Erro no banco.' });
  }
});

// --- ROTA DE PRODUTO ÚNICO ---
app.get('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const productQuery = `
      SELECT p.*, (p.score_desempenho_normalizado / 20.0) AS rating, 
      c.nome AS categoria, f.nome AS fabricante
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN fabricantes f ON p.id_fabricante = f.id_fabricante
      WHERE p.id_produto = $1;
    `;
    const productResult = await db.query(productQuery, [id]);
    if (productResult.rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });

    const produto = productResult.rows[0];
    const pricesQuery = `SELECT * FROM precos WHERE id_produto = $1 ORDER BY preco ASC`;
    const pricesResult = await db.query(pricesQuery, [id]);
    produto.ofertas = pricesResult.rows;
    res.json(produto);
  } catch (err) {
    console.error(`Erro ao buscar produto ${id}:`, err);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});

// --- ROTA DE GLOSSÁRIO ---
app.get('/api/glossario', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM glossario ORDER BY termo ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro glossário:', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// --- ROTA DE REGISTO ---
app.post('/api/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Dados incompletos.' });

  try {
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    const newUser = await db.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id_usuario, nome, email",
      [nome, email, senhaHash]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'E-mail já cadastrado.' });
    res.status(500).json({ error: 'Erro ao registrar.' });
  }
});

// --- ROTA DE LOGIN ---
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const user = result.rows[0];
    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const { senha_hash, ...userData } = user;
    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login.' });
  }
});

// --- ROTA DETALHES DE MÚLTIPLOS PRODUTOS (Favoritos) ---
app.post('/api/produtos/detalhes', async (req, res) => {
  const { ids } = req.body;
  if (!ids || ids.length === 0) return res.json([]);
  try {
    const query = "SELECT * FROM produtos WHERE id_produto = ANY($1::int[])";
    const result = await db.query(query, [ids]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar detalhes.' });
  }
});

// --- ROTAS DE FAVORITOS ---
app.get('/api/favoritos/:id_usuario', async (req, res) => {
  try {
    const result = await db.query("SELECT id_produto FROM usuario_favoritos WHERE id_usuario = $1", [req.params.id_usuario]);
    res.json(result.rows.map(r => r.id_produto));
  } catch (err) { res.status(500).json({error: 'Erro favs'}); }
});

app.post('/api/favoritos', async (req, res) => {
  const { id_usuario, id_produto } = req.body;
  try {
    await db.query("INSERT INTO usuario_favoritos (id_usuario, id_produto) VALUES ($1, $2)", [id_usuario, id_produto]);
    res.status(201).json({msg: 'Ok'});
  } catch (err) { res.status(500).json({error: 'Erro ao favoritar'}); }
});

app.delete('/api/favoritos', async (req, res) => {
  const { id_usuario, id_produto } = req.body;
  try {
    await db.query("DELETE FROM usuario_favoritos WHERE id_usuario = $1 AND id_produto = $2", [id_usuario, id_produto]);
    res.status(200).json({msg: 'Removido'});
  } catch (err) { res.status(500).json({error: 'Erro ao remover'}); }
});

// --- ROTA DUMMY DO SCRAPER (Para não quebrar o botão do front) ---
app.post('/api/admin/atualizar-precos', (req, res) => {
    res.json({ message: "Scraper rodando em processo externo (Python)." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});