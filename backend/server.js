// backend/server.js

const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const app = express();
const bcrypt = require('bcrypt'); 
const saltRounds = 10;
const PORT = process.env.PORT || 8080;

// Middlewares para permitir requisições de outras origens (CORS) e para entender JSON
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());

// Rota Raiz (Página de Teste)
app.get('/', (req, res) => {
  res.send('<h1>🚀 Servidor do OPTO Review está no ar!</h1>');
});

// Rota de Produtos - Buscando do Banco de Dados
app.get('/api/produtos', async (req, res) => {
  try {
    // Comando SQL ATUALIZADO para buscar tudo o que precisamos
    const result = await db.query(
      `SELECT 
         p.id_produto,
         p.nome,
         p.modelo,
         p.descricao,
         p.especificacoes,
         p.imagem_url, -- ESSENCIAL: Adicionado a imagem
         c.nome AS categoria,
         f.nome AS fabricante,
         -- Sub-query para buscar o menor preço na tabela 'precos'
         (SELECT MIN(pr.preco) 
          FROM precos pr 
          WHERE pr.id_produto = p.id_produto) AS price_low
       FROM produtos p
       LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
       LEFT JOIN fabricantes f ON p.id_fabricante = f.id_fabricante`
    );
    
    // Retorna as linhas encontradas como resposta JSON
    res.json(result.rows);

  } catch (err) {
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

// ROTA PARA BUSCAR UM ÚNICO PRODUTO PELO ID
app.get('/api/produtos/:id', async (req, res) => {
  const { id } = req.params; // Este é o id_produto

  try {
    // Query 1: Buscar os detalhes principais do produto
    const productQuery = `
      SELECT 
        p.id_produto,
        p.nome,
        p.modelo,
        p.descricao,
        p.especificacoes,
        p.imagem_url,
        -- Converte o score 0-100 para uma nota 0-5 (ex: 85 -> 4.3)
        (p.score_desempenho_normalizado / 20.0) AS rating, 
        c.nome AS categoria,
        f.nome AS fabricante
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN fabricantes f ON p.id_fabricante = f.id_fabricante
      WHERE p.id_produto = $1;
    `;
    
    const productResult = await db.query(productQuery, [id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const produto = productResult.rows[0];

    // Query 2: Buscar todos os preços associados a esse produto
    const pricesQuery = `
      SELECT nome_loja, preco, url_produto, data_ultima_verificacao
      FROM precos
      WHERE id_produto = $1
      ORDER BY preco ASC; -- Ordena do mais barato para o mais caro
    `;
    
    const pricesResult = await db.query(pricesQuery, [id]);
    
    // Adiciona o array de preços (ofertas) ao objeto do produto
    produto.ofertas = pricesResult.rows;

    // Retorna o objeto completo
    res.json(produto);

  } catch (err) {
    console.error(`Erro ao buscar produto com ID ${id}:`, err);
    res.status(500).json({ error: 'Erro ao buscar dados do produto no banco de dados.' });
  }
});
app.get('/api/glossario', async (req, res) => {
  try {
    // Busca todos os termos da nova tabela, em ordem alfabética
    const result = await db.query(
      'SELECT * FROM glossario ORDER BY termo ASC'
    );
    
    // Retorna as linhas encontradas como resposta JSON
    res.json(result.rows);

  } catch (err) {
    console.error('Erro ao buscar termos do glossário:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do glossário no banco de dados.' });
  }
});

app.post('/api/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  // 1. Validação simples
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    // 2. Criptografar a senha ANTES de salvar
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 3. Inserir no banco de dados
    const newUser = await db.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id_usuario, nome, email, data_criacao",
      [nome, email, senhaHash]
    );

    // 4. Sucesso
    res.status(201).json(newUser.rows[0]);

  } catch (err) {
    // 5. Tratamento de erro (ex: e-mail já existe)
    if (err.code === '23505') { // '23505' é o código do PostgreSQL para 'unique_violation'
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }
    console.error('Erro ao registrar usuário:', err);
    res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
  }
});


// ROTA 2: FAZER LOGIN DE UM USUÁRIO
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    // 1. Encontrar o usuário pelo e-mail
    const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      // Usamos uma mensagem genérica por segurança
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' }); 
    }

    const user = result.rows[0];

    // 2. Comparar a senha enviada com o hash salvo no banco
    const match = await bcrypt.compare(senha, user.senha_hash);

    if (!match) {
      // Senha incorreta
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // 3. Sucesso! Não enviar o hash da senha de volta.
    const { senha_hash, ...userData } = user;
    res.status(200).json(userData); // Envia os dados do usuário (sem a senha)

  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
  }
});

// Inicia o servidor e o faz "escutar" por requisições na porta definida
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend do OPTO Review está no ar em http://localhost:${PORT}`);
});