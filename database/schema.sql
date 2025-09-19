CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE fabricantes (
    id_fabricante SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE
);

-- ========================
-- BLOCO 4: PRODUTOS
-- ========================
CREATE TABLE produtos (
    id_produto SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    id_categoria INT REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    id_fabricante INT REFERENCES fabricantes(id_fabricante) ON DELETE SET NULL,
    modelo TEXT,
    descricao TEXT,
    imagem_url TEXT,
    data_lancamento DATE,
    especificacoes JSONB,  -- campo flexível para specs técnicas
    score_desempenho_normalizado NUMERIC
);

-- ========================
-- BLOCO 5: PREÇOS
-- ========================
CREATE TABLE precos (
    id_preco SERIAL PRIMARY KEY,
    id_produto INT NOT NULL REFERENCES produtos(id_produto) ON DELETE CASCADE,
    nome_loja TEXT NOT NULL,
    preco DECIMAL(12,2) NOT NULL,
    url_produto TEXT,
    data_ultima_verificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- BLOCO 6: COMPATIBILIDADE
-- ========================
CREATE TABLE compatibilidade (
    id_compatibilidade SERIAL PRIMARY KEY,
    id_categoria_a INT REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    id_categoria_b INT REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    regra_compatibilidade JSONB  -- ex.: {"chave_A":"especificacoes.soquete","chave_B":"especificacoes.soquete","operador":"igual"}
);

-- ========================
-- BLOCO 7: USUÁRIOS
-- ========================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    perfil JSONB   -- respostas do formulário (ex.: {"orcamento":5000,"uso":"gamer"})
);

-- ========================
-- BLOCO 8: RECOMENDAÇÕES
-- ========================
CREATE TABLE recomendacoes (
    id_recomendacao SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    custo_total_calculado DECIMAL(12,2)
);

CREATE TABLE itens_recomendacao (
    id_recomendacao INT REFERENCES recomendacoes(id_recomendacao) ON DELETE CASCADE,
    id_produto INT REFERENCES produtos(id_produto),
    quantidade INT DEFAULT 1,
    PRIMARY KEY (id_recomendacao, id_produto)
);

-- ========================
-- BLOCO 9: ÍNDICES ÚTEIS
-- ========================
-- Busca rápida por nome de produto
CREATE INDEX idx_produtos_nome ON produtos USING gin (to_tsvector('portuguese', nome));

-- Busca rápida em especificações JSONB
CREATE INDEX idx_produtos_especificacoes ON produtos USING gin (especificacoes);

-- Índice para pesquisa por preço
CREATE INDEX idx_precos_preco ON precos (preco);

-- Índice para data de verificação de preços
CREATE INDEX idx_precos_data ON precos (data_ultima_verificacao);