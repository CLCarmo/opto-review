// backend/server.js

const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const app = express();
const bcrypt = require('bcrypt'); 
const saltRounds = 10;
const scraper = require('./scraperService');
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
    const result = await db.query(
      `SELECT 
         p.id_produto,
         p.nome,
         p.modelo,
         p.descricao,
         p.especificacoes,
         p.imagem_url,
         c.nome AS categoria,
         f.nome AS fabricante,
         -- AQUI ESTÁ A MÁGICA:
         -- Tenta pegar o menor preço da tabela 'precos'. 
         -- Se não existir, usa o 'p.price_low' da tabela 'produtos'.
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

// ROTA: Buscar detalhes de múltiplos produtos por ID
// Útil para a página de favoritos e carrinho
app.post('/api/produtos/detalhes', async (req, res) => {
  const { ids } = req.body; // Espera um body assim: { ids: [1, 2, 3] }

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(200).json([]); // Retorna lista vazia se não houver IDs
  }

  try {
    // O operador ANY($1) permite buscar onde o id_produto está dentro do array fornecido
    const query = "SELECT * FROM produtos WHERE id_produto = ANY($1::int[])";
    const result = await db.query(query, [ids]);

    // Mapeamos para converter string numérica em float (como nas outras rotas)
    const mappedProducts = result.rows.map(p => ({
        ...p,
        price_avg: parseFloat(p.price_avg),
        price_low: parseFloat(p.price_low)
    }));

    res.json(mappedProducts);
  } catch (err) {
    console.error('Erro ao buscar detalhes dos produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

// ROTA 1: BUSCAR TODOS OS FAVORITOS DE UM UTILIZADOR
// Usamos :id_usuario na URL (parâmetro)
app.get('/api/favoritos/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params; // Pega o ID da URL

  if (!id_usuario) {
    return res.status(400).json({ error: 'ID do utilizador é obrigatório.' });
  }

  try {
    const query = "SELECT id_produto FROM usuario_favoritos WHERE id_usuario = $1";
    const result = await db.query(query, [id_usuario]);
    
    // Em vez de retornar o objeto [{id_produto: 5}, {id_produto: 10}],
    // retornamos um array simples de IDs: [5, 10]
    // Fica mais fácil para o frontend consumir.
    const favoriteIds = result.rows.map(row => row.id_produto);
    
    res.status(200).json(favoriteIds);

  } catch (err) {
    console.error('Erro ao buscar favoritos:', err);
    res.status(500).json({ error: 'Erro interno ao buscar favoritos.' });
  }
});


// ROTA 2: ADICIONAR UM NOVO FAVORITO
// Usamos o body (corpo) da requisição
app.post('/api/favoritos', async (req, res) => {
  // O frontend vai enviar o ID do utilizador (do AuthContext) e do produto
  const { id_usuario, id_produto } = req.body;

  if (!id_usuario || !id_produto) {
    return res.status(400).json({ error: 'ID do utilizador e ID do produto são obrigatórios.' });
  }

  try {
    const query = "INSERT INTO usuario_favoritos (id_usuario, id_produto) VALUES ($1, $2) RETURNING *";
    const result = await db.query(query, [id_usuario, id_produto]);
    
    res.status(201).json(result.rows[0]); // Retorna o favorito que foi criado

  } catch (err) {
    // Código '23505' = unique_violation (utilizador tentou favoritar o mesmo produto 2x)
    if (err.code === '23505') { 
      return res.status(409).json({ error: 'Este produto já está nos favoritos.' });
    }
    console.error('Erro ao adicionar favorito:', err);
    res.status(500).json({ error: 'Erro interno ao adicionar favorito.' });
  }
});


// ROTA 3: REMOVER UM FAVORITO
// Usamos o body também (poderia ser query params, mas body é mais limpo)
app.delete('/api/favoritos', async (req, res) => {
  const { id_usuario, id_produto } = req.body;

  if (!id_usuario || !id_produto) {
    return res.status(400).json({ error: 'ID do utilizador e ID do produto são obrigatórios.' });
  }

  try {
    // Deleta a linha que combina EXATAMENTE este utilizador e este produto
    const query = "DELETE FROM usuario_favoritos WHERE id_usuario = $1 AND id_produto = $2 RETURNING *";
    const result = await db.query(query, [id_usuario, id_produto]);

    if (result.rowCount === 0) {
      // Se rowCount é 0, significa que não encontrou o favorito para deletar
      return res.status(404).json({ error: 'Favorito não encontrado.' });
    }

    res.status(200).json({ message: 'Favorito removido com sucesso.' });

  } catch (err) {
    console.error('Erro ao remover favorito:', err);
    res.status(500).json({ error: 'Erro interno ao remover favorito.' });
  }
});

// ROTA: Atualizar Perfil (Com tratamento de Senha e Cor)
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  // Recebemos tudo o que pode ser mudado
  const { nome, email, senha, avatar_url, avatar_bg, setup_atual } = req.body;

  try {
    let query = "UPDATE usuarios SET ";
    const values = [];
    let count = 1;

    // Constrói a query dinamicamente (só atualiza o que foi enviado)
    if (nome) { query += `nome = $${count}, `; values.push(nome); count++; }
    if (email) { query += `email = $${count}, `; values.push(email); count++; }
    if (avatar_url) { query += `avatar_url = $${count}, `; values.push(avatar_url); count++; }
    if (avatar_bg) { query += `avatar_bg = $${count}, `; values.push(avatar_bg); count++; }
    if (setup_atual) { query += `setup_atual = $${count}, `; values.push(setup_atual); count++; }
    
    // Se enviou senha, CRIPTOGRAFA antes de salvar
    if (senha) {
       const salt = await bcrypt.genSalt(10);
       const senha_hash = await bcrypt.hash(senha, salt);
       query += `senha_hash = $${count}, `;
       values.push(senha_hash);
       count++;
    }

    // Finaliza a query
    query = query.slice(0, -2) + ` WHERE id_usuario = $${count} RETURNING id_usuario, nome, email, avatar_url, avatar_bg, setup_atual`;
    values.push(id);

    const result = await db.query(query, values);
    
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ error: "Erro interno ao atualizar." });
  }
});

// ==================================================================
// ROTA ADMIN: ATUALIZADOR DE PREÇOS (SCRAPER)
// ==================================================================
app.post('/api/admin/atualizar-precos', async (req, res) => {
    try {
        // 1. Busca links cadastrados que não sejam nulos
        const result = await db.query('SELECT id_preco, url_produto FROM precos WHERE url_produto IS NOT NULL');
        const links = result.rows;

        if (links.length === 0) {
            return res.json({ message: "Nenhum link encontrado para atualizar." });
        }

        let atualizados = 0;
        let erros = 0;

        console.log(`🔄 Iniciando atualização de ${links.length} produtos...`);

        // 2. Loop para atualizar cada produto
        for (const item of links) {
            // Chama o scraper
            console.log(`➡️ Verificando: ${item.url_produto}`);
            const novoPreco = await scraper.getPrice(item.url_produto);
            
            if (novoPreco && novoPreco > 0) {
                // Atualiza no banco
                await db.query(
                    'UPDATE precos SET preco = $1, data_ultima_verificacao = NOW() WHERE id_preco = $2',
                    [novoPreco, item.id_preco]
                );
                console.log(`✅ [ID ${item.id_preco}] Atualizado para R$ ${novoPreco}`);
                atualizados++;
            } else {
                console.log(`❌ [ID ${item.id_preco}] Falha ao ler preço.`);
                erros++;
            }
            
            // IMPORTANTE: Espera 2 segundos entre cada requisição
            await new Promise(r => setTimeout(r, 2000));
        }

        // 3. Sincroniza o menor preço na tabela produtos
        await db.query(`
            UPDATE produtos p
            SET price_low = (SELECT MIN(pr.preco) FROM precos pr WHERE pr.id_produto = p.id_produto)
            WHERE p.id_produto IN (SELECT id_produto FROM precos)
        `);

        res.json({ 
            message: `Atualização concluída.`, 
            sucesso: atualizados, 
            falhas: erros,
            total: links.length
        });

    } catch (err) {
        console.error("Erro fatal no scraper:", err);
        res.status(500).json({ error: "Erro ao rodar scraper" });
    }
});

// Inicia o servidor e o faz "escutar" por requisições na porta definida
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend do OPTO Review está no ar em http://localhost:${PORT}`);
});