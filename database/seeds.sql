-- ===================================================================
-- SCRIPT DE SEEDS PARA O BANCO DE DADOS OPTO REVIEW
-- Este script popula o banco de dados com os dados iniciais.
-- ===================================================================

-- PASSO 1: INSERIR CATEGORIAS INICIAIS
-- Usamos 'ON CONFLICT (nome) DO NOTHING' para que o script não dê erro se for executado mais de uma vez.
INSERT INTO categorias (nome) VALUES
('Mouse'),
('Teclado'),
('Monitor'),
('Processador'),
('Placa de Vídeo')
ON CONFLICT (nome) DO NOTHING;

-- PASSO 2: INSERIR FABRICANTES INICIAIS
INSERT INTO fabricantes (nome) VALUES
('Logitech'),
('Razer'),
('Intel'),
('AMD'),
('NVIDIA'),
('Corsair'),
('HyperX'),
('SteelSeries'),
('Dell'),
('LG'),
('Samsung'),
('ASUS'),
('MSI'),
('Gigabyte')
ON CONFLICT (nome) DO NOTHING;


-- ========================
-- PASSO 3: INSERIR PRODUTOS
-- ========================

-- CATEGORIA: MOUSE
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
(
    'TESTE 123 - MOUSE DO CAIO',
    (SELECT id_categoria FROM categorias WHERE nome = 'Mouse'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Logitech'),
    '910-005878',
    'Um dos mouses sem fio mais leves e rápidos do mercado, projetado para pro-players.',
    '{ "sensor": "HERO 25K", "peso_g": 63, "dpi_max": 25600, "sem_fio": true, "botoes": 5 }'
),
(
    'Razer DeathAdder V2',
    (SELECT id_categoria FROM categorias WHERE nome = 'Mouse'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Razer'),
    'RZ01-03210100-R3U1',
    'Mouse ergonômico com fio, famoso por seu design confortável e sensor de alta precisão.',
    '{ "sensor": "Focus+", "peso_g": 82, "dpi_max": 20000, "sem_fio": false, "botoes": 8 }'
),
(
    'Razer Viper Mini',
    (SELECT id_categoria FROM categorias WHERE nome = 'Mouse'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Razer'),
    'RZ01-03250100-R3U1',
    'Mouse ultraleve com fio, ideal para mãos pequenas e pegada claw ou fingertip.',
    '{ "sensor": "Óptico 8500 DPI", "peso_g": 61, "dpi_max": 8500, "sem_fio": false, "botoes": 6 }'
),
(
    'Logitech G502 HERO',
    (SELECT id_categoria FROM categorias WHERE nome = 'Mouse'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Logitech'),
    '910-005469',
    'Mouse com fio icônico com peso ajustável, 11 botões programáveis e sensor de alta precisão.',
    '{ "sensor": "HERO 25K", "peso_g": 121, "dpi_max": 25600, "sem_fio": false, "botoes": 11 }'
),
(
    'SteelSeries Rival 3',
    (SELECT id_categoria FROM categorias WHERE nome = 'Mouse'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'SteelSeries'),
    '62513',
    'Mouse gamer com fio, durável e com iluminação RGB Prism. Ótimo custo-benefício.',
    '{ "sensor": "TrueMove Core", "peso_g": 77, "dpi_max": 8500, "sem_fio": false, "botoes": 6 }'
),
(
    'Corsair Harpoon RGB Wireless',
    (SELECT id_categoria FROM categorias WHERE nome = 'Mouse'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Corsair'),
    'CH-9311011-NA',
    'Mouse sem fio leve e versátil com múltiplas formas de conexão (Slipstream ou Bluetooth).',
    '{ "sensor": "Óptico 10000 DPI", "peso_g": 99, "dpi_max": 10000, "sem_fio": true, "botoes": 6 }'
);

-- CATEGORIA: TECLADO
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
(
    'Razer Huntsman Mini',
    (SELECT id_categoria FROM categorias WHERE nome = 'Teclado'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Razer'),
    'RZ03-03390200-R3U1',
    'Teclado gamer 60% com switches ópticos lineares da Razer para atuação ultra-rápida.',
    '{ "formato": "60%", "switch": "Razer Optical Red Gen-2", "iluminacao": "RGB Chroma", "sem_fio": false }'
),
(
    'Corsair K70 RGB MK.2',
    (SELECT id_categoria FROM categorias WHERE nome = 'Teclado'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Corsair'),
    'CH-9109010-NA',
    'Teclado mecânico com estrutura de alumínio, switches Cherry MX Red e descanso de pulso.',
    '{ "formato": "Full-size", "switch": "Cherry MX Red", "iluminacao": "RGB", "sem_fio": false }'
),
(
    'HyperX Alloy Origins Core',
    (SELECT id_categoria FROM categorias WHERE nome = 'Teclado'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'HyperX'),
    'HX-KB7RDX-US',
    'Teclado mecânico TKL (sem numpad) com corpo de alumínio e switches HyperX Red.',
    '{ "formato": "TKL", "switch": "HyperX Red", "iluminacao": "RGB", "sem_fio": false }'
),
(
    'Logitech G915 TKL',
    (SELECT id_categoria FROM categorias WHERE nome = 'Teclado'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Logitech'),
    '920-009495',
    'Teclado mecânico sem fio de perfil baixo com tecnologia Lightspeed para baixa latência.',
    '{ "formato": "TKL", "switch": "GL Tactile", "iluminacao": "RGB", "sem_fio": true }'
),
(
    'SteelSeries Apex Pro',
    (SELECT id_categoria FROM categorias WHERE nome = 'Teclado'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'SteelSeries'),
    '64626',
    'Teclado mecânico com switches ajustáveis OmniPoint, permitindo customizar a atuação das teclas.',
    '{ "formato": "Full-size", "switch": "OmniPoint Adjustable", "iluminacao": "RGB", "sem_fio": false }'
);

-- CATEGORIA: MONITOR
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
(
    'Dell S2721DGF',
    (SELECT id_categoria FROM categorias WHERE nome = 'Monitor'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Dell'),
    'S2721DGF',
    'Monitor gamer de 27 polegadas, QHD (1440p), 165Hz com painel IPS para cores vibrantes.',
    '{ "tamanho_pol": 27, "resolucao": "2560x1440", "taxa_att_hz": 165, "painel": "IPS", "tempo_resposta_ms": 1 }'
),
(
    'LG UltraGear 27GL850-B',
    (SELECT id_categoria FROM categorias WHERE nome = 'Monitor'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'LG'),
    '27GL850-B',
    'Monitor de 27 polegadas com painel Nano IPS, resolução QHD e compatível com G-Sync.',
    '{ "tamanho_pol": 27, "resolucao": "2560x1440", "taxa_att_hz": 144, "painel": "Nano IPS", "tempo_resposta_ms": 1 }'
),
(
    'Samsung Odyssey G7',
    (SELECT id_categoria FROM categorias WHERE nome = 'Monitor'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Samsung'),
    'LC32G75TQSLXZD',
    'Monitor curvo de 32 polegadas, QHD, com taxa de atualização de 240Hz e painel QLED.',
    '{ "tamanho_pol": 32, "resolucao": "2560x1440", "taxa_att_hz": 240, "painel": "VA QLED", "tempo_resposta_ms": 1 }'
),
(
    'ASUS TUF Gaming VG249Q',
    (SELECT id_categoria FROM categorias WHERE nome = 'Monitor'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'ASUS'),
    'VG249Q',
    'Monitor gamer de 24 polegadas, Full HD (1080p), 144Hz, painel IPS. Excelente opção de entrada.',
    '{ "tamanho_pol": 24, "resolucao": "1920x1080", "taxa_att_hz": 144, "painel": "IPS", "tempo_resposta_ms": 1 }'
);

-- CATEGORIA: PROCESSADOR
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
(
    'Intel Core i5-13400F',
    (SELECT id_categoria FROM categorias WHERE nome = 'Processador'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Intel'),
    'BX8071513400F',
    'Processador de 10 núcleos da 13ª geração, ótimo para jogos e multitarefa. Requer placa de vídeo dedicada.',
    '{ "nucleos": 10, "threads": 16, "soquete": "LGA1700", "frequencia_base_ghz": 2.5, "graficos_integrados": false }'
),
(
    'AMD Ryzen 5 5600X',
    (SELECT id_categoria FROM categorias WHERE nome = 'Processador'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'AMD'),
    '100-100000065BOX',
    'Processador de 6 núcleos e 12 threads, excelente para jogos e produtividade no soquete AM4.',
    '{ "nucleos": 6, "threads": 12, "soquete": "AM4", "frequencia_base_ghz": 3.7, "graficos_integrados": false }'
),
(
    'AMD Ryzen 7 5800X3D',
    (SELECT id_categoria FROM categorias WHERE nome = 'Processador'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'AMD'),
    '100-100000651WOF',
    'Processador de 8 núcleos com tecnologia 3D V-Cache, um dos melhores para performance em jogos.',
    '{ "nucleos": 8, "threads": 16, "soquete": "AM4", "frequencia_base_ghz": 3.4, "graficos_integrados": false }'
),
(
    'Intel Core i9-13900K',
    (SELECT id_categoria FROM categorias WHERE nome = 'Processador'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Intel'),
    'BX8071513900K',
    'Processador topo de linha com 24 núcleos, ideal para máxima performance em jogos e criação de conteúdo.',
    '{ "nucleos": 24, "threads": 32, "soquete": "LGA1700", "frequencia_base_ghz": 3.0, "graficos_integrados": true }'
),
(
    'AMD Ryzen 9 7950X',
    (SELECT id_categoria FROM categorias WHERE nome = 'Processador'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'AMD'),
    '100-100000514WOF',
    'Processador de 16 núcleos e 32 threads da plataforma AM5, focado em máxima produtividade.',
    '{ "nucleos": 16, "threads": 32, "soquete": "AM5", "frequencia_base_ghz": 4.5, "graficos_integrados": true }'
);

-- CATEGORIA: PLACA DE VÍDEO
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
(
    'NVIDIA GeForce RTX 3060',
    (SELECT id_categoria FROM categorias WHERE nome = 'Placa de Vídeo'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'NVIDIA'),
    'RTX 3060',
    'Placa de vídeo com 12GB de VRAM, ótima para jogos em Full HD (1080p) com Ray Tracing.',
    '{ "memoria_vram_gb": 12, "tipo_memoria": "GDDR6", "interface": "PCIe 4.0", "fabricante_chip": "NVIDIA" }'
),
(
    'AMD Radeon RX 6700 XT',
    (SELECT id_categoria FROM categorias WHERE nome = 'Placa de Vídeo'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'AMD'),
    'RX 6700 XT',
    'Placa de vídeo com 12GB de VRAM, excelente performance para jogos em QHD (1440p).',
    '{ "memoria_vram_gb": 12, "tipo_memoria": "GDDR6", "interface": "PCIe 4.0", "fabricante_chip": "AMD" }'
),
(
    'NVIDIA GeForce RTX 4070',
    (SELECT id_categoria FROM categorias WHERE nome = 'Placa de Vídeo'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'NVIDIA'),
    'RTX 4070',
    'Placa de vídeo da nova geração com tecnologias como DLSS 3, ideal para jogos em 1440p/4K.',
    '{ "memoria_vram_gb": 12, "tipo_memoria": "GDDR6X", "interface": "PCIe 4.0", "fabricante_chip": "NVIDIA" }'
),
(
    'Gigabyte GeForce RTX 4090 Gaming OC',
    (SELECT id_categoria FROM categorias WHERE nome = 'Placa de Vídeo'),
    (SELECT id_fabricante FROM fabricantes WHERE nome = 'Gigabyte'),
    'GV-N4090GAMING OC-24GD',
    'Uma das placas de vídeo mais poderosas do mercado, para jogos em 4K com tudo no máximo.',
    '{ "memoria_vram_gb": 24, "tipo_memoria": "GDDR6X", "interface": "PCIe 4.0", "fabricante_chip": "NVIDIA" }'
);