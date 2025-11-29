-- ===================================================================
-- SCHEMA OFICIAL OPTO REVIEW - VERSÃO CONSOLIDADA
-- ===================================================================

-- ========================
-- BLOCO 1: CATEGORIAS E FABRICANTES
-- ========================
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS fabricantes (
    id_fabricante SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE
);

-- ========================
-- BLOCO 2: PRODUTOS
-- ========================
CREATE TABLE IF NOT EXISTS produtos (
    id_produto SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    id_categoria INT REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    id_fabricante INT REFERENCES fabricantes(id_fabricante) ON DELETE SET NULL,
    modelo TEXT,
    descricao TEXT,
    imagem_url TEXT,
    data_lancamento DATE,
    especificacoes JSONB,  -- Campo flexível para dados extras
    
    -- Colunas Específicas para o Algoritmo de Recomendação e Scraper
    price_low DECIMAL(12, 2),       -- Menor preço encontrado (Cache do Scraper)
    score_gaming INT DEFAULT 50,    -- Nota 0-100 para perfil Gamer
    score_work INT DEFAULT 50,      -- Nota 0-100 para perfil Trabalho
    score_desempenho_normalizado NUMERIC -- Legado (pode ser usado para ordenação geral)
);

-- ========================
-- BLOCO 3: ESPECIFICAÇÕES TÉCNICAS (O "Cérebro" da Compatibilidade)
-- ========================
-- Esta tabela é essencial para o Mago saber o que encaixa onde
CREATE TABLE IF NOT EXISTS specs_tecnicas (
    id_spec SERIAL PRIMARY KEY,
    id_produto INT REFERENCES produtos(id_produto) ON DELETE CASCADE,
    
    -- Compatibilidade Física
    socket VARCHAR(50),        -- Ex: 'AM4', 'LGA1700'
    chipset VARCHAR(50),       -- Ex: 'B550', 'RTX 3060'
    tipo_memoria VARCHAR(20),  -- Ex: 'DDR4', 'DDR5'
    fator_forma VARCHAR(20),   -- Ex: 'ATX', 'mATX'
    
    -- Energia e Capacidade
    tdp_w INT,                 -- Consumo (Watts)
    potencia_w INT,            -- Potência (Fontes)
    vram_gb INT,               -- Memória de Vídeo
    nucleos INT,               -- Núcleos CPU
    frequencia_mhz INT,        -- Velocidade
    capacidade VARCHAR(20),    -- Ex: '16GB', '1TB'
    
    -- Dimensões
    comprimento_mm INT,        -- Tamanho da GPU
    suporte_gpu_mm INT         -- Tamanho máximo no gabinete
);

-- ========================
-- BLOCO 4: PREÇOS E LOJAS
-- ========================
CREATE TABLE IF NOT EXISTS precos (
    id_preco SERIAL PRIMARY KEY,
    id_produto INT NOT NULL REFERENCES produtos(id_produto) ON DELETE CASCADE,
    nome_loja TEXT NOT NULL,
    preco DECIMAL(12,2) NOT NULL,
    url_produto TEXT, -- Link para o Scraper ler
    data_ultima_verificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- BLOCO 5: REGRAS DE COMPATIBILIDADE
-- ========================
CREATE TABLE IF NOT EXISTS compatibilidade (
    id_compatibilidade SERIAL PRIMARY KEY,
    id_categoria_a INT REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    id_categoria_b INT REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    regra_compatibilidade JSONB  -- ex.: {"chave_A":"socket","chave_B":"socket","operador":"igual"}
);

-- ========================
-- BLOCO 6: USUÁRIOS
-- ========================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL, -- Essencial para o Login funcionar
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Perfil e Personalização
    avatar_url TEXT,
    avatar_bg VARCHAR(20),
    setup_atual JSONB, -- Ex: { "cpu": "Ryzen 5", "gpu": "RTX 3060" }
    perfil JSONB       -- Dados genéricos extras (ex: preferências)
);

-- ========================
-- BLOCO 7: RECOMENDAÇÕES SALVAS
-- ========================
CREATE TABLE IF NOT EXISTS recomendacoes (
    id_recomendacao SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    custo_total_calculado DECIMAL(12,2)
);

CREATE TABLE IF NOT EXISTS itens_recomendacao (
    id_recomendacao INT REFERENCES recomendacoes(id_recomendacao) ON DELETE CASCADE,
    id_produto INT REFERENCES produtos(id_produto),
    quantidade INT DEFAULT 1,
    PRIMARY KEY (id_recomendacao, id_produto)
);

-- ========================
-- BLOCO 8: FAVORITOS DO USUÁRIO
-- ========================
CREATE TABLE IF NOT EXISTS usuario_favoritos (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produtos(id_produto) ON DELETE CASCADE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_usuario, id_produto) -- Evita duplicatas
);

-- ========================
-- BLOCO 9: GLOSSÁRIO
-- ========================
CREATE TABLE IF NOT EXISTS glossario (
    id_termo SERIAL PRIMARY KEY,
    termo VARCHAR(100) NOT NULL UNIQUE,
    definicao TEXT NOT NULL,
    categoria VARCHAR(50) -- Ex: 'Geral', 'Hardware'
);

-- ========================
-- BLOCO 10: ÍNDICES DE PERFORMANCE
-- ========================
-- Busca rápida por nome de produto
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos USING gin (to_tsvector('portuguese', nome));

-- Busca rápida em especificações JSONB
CREATE INDEX IF NOT EXISTS idx_produtos_especificacoes ON produtos USING gin (especificacoes);

-- Índice para pesquisa por preço
CREATE INDEX IF NOT EXISTS idx_precos_preco ON precos (preco);

-- Índice para data de verificação de preços
CREATE INDEX IF NOT EXISTS idx_precos_data ON precos (data_ultima_verificacao);

-- Índice para otimizar busca de specs (Usado pelo Mago)
CREATE INDEX IF NOT EXISTS idx_specs_socket ON specs_tecnicas(socket);