-- ===================================================================
-- SCRIPT DE SEEDS COMPLETO (OPTO REVIEW)
-- Popula Categorias, Fabricantes e Produtos (5 por categoria)
-- ===================================================================

-- 1. TODAS AS CATEGORIAS
INSERT INTO categorias (nome) VALUES
('Mouse'), ('Teclado'), ('Monitor'), ('Processador'), ('Placa de Vídeo'),
('Headset'), ('Microfone'), ('Controle'), ('Placa Mãe'), ('Memória RAM'),
('Armazenamento'), ('Cooler'), ('Fonte'), ('Gabinete')
ON CONFLICT (nome) DO NOTHING;

-- 2. TODOS OS FABRICANTES
INSERT INTO fabricantes (nome) VALUES
('Logitech'), ('Razer'), ('Intel'), ('AMD'), ('NVIDIA'), ('Corsair'),
('HyperX'), ('SteelSeries'), ('Dell'), ('LG'), ('Samsung'), ('ASUS'),
('MSI'), ('Gigabyte'), ('Zotac'), ('Kingston'), ('Crucial'), ('WD (Western Digital)'),
('DeepCool'), ('Cooler Master'), ('NZXT'), ('Lian Li'), ('Risemode'),
('Redragon'), ('Fifine'), ('Audio-Technica'), ('Blue'), ('Sony'), ('Microsoft'),
('8BitDo'), ('GameSir'), ('ASRock'), ('XPG'), ('Gamemax'), ('Seagate')
ON CONFLICT (nome) DO NOTHING;


-- ===================================================================
-- 3. INSERÇÃO DE PRODUTOS (5 POR CATEGORIA)
-- ===================================================================

-- --- MOUSE ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('Logitech G Pro X Superlight', (SELECT id_categoria FROM categorias WHERE nome='Mouse'), (SELECT id_fabricante FROM fabricantes WHERE nome='Logitech'), 'G Pro X', 'Mouse sem fio ultraleve.', '{ "dpi": 25600, "peso_g": 63, "sem_fio": true }'),
('Razer DeathAdder V3', (SELECT id_categoria FROM categorias WHERE nome='Mouse'), (SELECT id_fabricante FROM fabricantes WHERE nome='Razer'), 'DeathAdder V3', 'Ergonomia refinada para esports.', '{ "dpi": 30000, "peso_g": 59, "sem_fio": false }'),
('HyperX Pulsefire Haste', (SELECT id_categoria FROM categorias WHERE nome='Mouse'), (SELECT id_fabricante FROM fabricantes WHERE nome='HyperX'), 'Haste', 'Design favo de mel ultraleve.', '{ "dpi": 16000, "peso_g": 59, "sem_fio": false }'),
('Logitech G502 X', (SELECT id_categoria FROM categorias WHERE nome='Mouse'), (SELECT id_fabricante FROM fabricantes WHERE nome='Logitech'), 'G502 X', 'O clássico reinventado com switches híbridos.', '{ "dpi": 25600, "peso_g": 89, "sem_fio": false }'),
('Razer Viper Ultimate', (SELECT id_categoria FROM categorias WHERE nome='Mouse'), (SELECT id_fabricante FROM fabricantes WHERE nome='Razer'), 'Viper Ultimate', 'Ambidestro sem fio com dock de carga.', '{ "dpi": 20000, "peso_g": 74, "sem_fio": true }');

-- --- TECLADO ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('Logitech G915 TKL', (SELECT id_categoria FROM categorias WHERE nome='Teclado'), (SELECT id_fabricante FROM fabricantes WHERE nome='Logitech'), 'G915', 'Mecânico sem fio low profile.', '{ "tipo": "Mecânico", "switch": "GL Tactile", "formato": "TKL" }'),
('HyperX Alloy Origins', (SELECT id_categoria FROM categorias WHERE nome='Teclado'), (SELECT id_fabricante FROM fabricantes WHERE nome='HyperX'), 'Alloy Origins', 'Corpo em alumínio e switches próprios.', '{ "tipo": "Mecânico", "switch": "HyperX Red", "formato": "Full" }'),
('Razer Huntsman Mini', (SELECT id_categoria FROM categorias WHERE nome='Teclado'), (SELECT id_fabricante FROM fabricantes WHERE nome='Razer'), 'Huntsman Mini', 'Teclado 60% com switches ópticos.', '{ "tipo": "Óptico", "switch": "Purple", "formato": "60%" }'),
('Corsair K70 RGB PRO', (SELECT id_categoria FROM categorias WHERE nome='Teclado'), (SELECT id_fabricante FROM fabricantes WHERE nome='Corsair'), 'K70 PRO', 'Desempenho de torneio com estrutura de alumínio.', '{ "tipo": "Mecânico", "switch": "Cherry MX", "formato": "Full" }'),
('Redragon Kumara', (SELECT id_categoria FROM categorias WHERE nome='Teclado'), (SELECT id_fabricante FROM fabricantes WHERE nome='Redragon'), 'K552', 'O custo-benefício mais famoso do Brasil.', '{ "tipo": "Mecânico", "switch": "Outemu Blue", "formato": "TKL" }');

-- --- MONITOR ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('Samsung Odyssey G7', (SELECT id_categoria FROM categorias WHERE nome='Monitor'), (SELECT id_fabricante FROM fabricantes WHERE nome='Samsung'), 'G7', 'Curvatura 1000R para imersão total.', '{ "resolucao": "QHD", "hz": 240, "painel": "VA" }'),
('LG UltraGear 27GN800', (SELECT id_categoria FROM categorias WHERE nome='Monitor'), (SELECT id_fabricante FROM fabricantes WHERE nome='LG'), '27GN800', 'Painel IPS com 1ms de resposta real.', '{ "resolucao": "QHD", "hz": 144, "painel": "IPS" }'),
('Dell Alienware AW2521HF', (SELECT id_categoria FROM categorias WHERE nome='Monitor'), (SELECT id_fabricante FROM fabricantes WHERE nome='Dell'), 'AW2521HF', 'Design icônico e performance de 240Hz.', '{ "resolucao": "FHD", "hz": 240, "painel": "IPS" }'),
('ASUS TUF VG27AQ', (SELECT id_categoria FROM categorias WHERE nome='Monitor'), (SELECT id_fabricante FROM fabricantes WHERE nome='ASUS'), 'VG27AQ', 'Equilíbrio perfeito com ELMB Sync.', '{ "resolucao": "QHD", "hz": 165, "painel": "IPS" }'),
('AOC Hero 24', (SELECT id_categoria FROM categorias WHERE nome='Monitor'), (SELECT id_fabricante FROM fabricantes WHERE nome='Dell'), -- Placeholder AOC
'24G2', 'O rei do custo-benefício 144Hz.', '{ "resolucao": "FHD", "hz": 144, "painel": "IPS" }');

-- --- PROCESSADOR ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('AMD Ryzen 5 5600', (SELECT id_categoria FROM categorias WHERE nome='Processador'), (SELECT id_fabricante FROM fabricantes WHERE nome='AMD'), '5600', 'O melhor custo-benefício para jogos.', '{ "socket": "AM4", "nucleos": 6, "tdp": 65 }'),
('AMD Ryzen 7 5800X3D', (SELECT id_categoria FROM categorias WHERE nome='Processador'), (SELECT id_fabricante FROM fabricantes WHERE nome='AMD'), '5800X3D', 'Lendário para jogos com 3D V-Cache.', '{ "socket": "AM4", "nucleos": 8, "tdp": 105 }'),
('Intel Core i5-13400F', (SELECT id_categoria FROM categorias WHERE nome='Processador'), (SELECT id_fabricante FROM fabricantes WHERE nome='Intel'), '13400F', 'Híbrido de performance e eficiência.', '{ "socket": "LGA1700", "nucleos": 10, "tdp": 65 }'),
('Intel Core i7-13700K', (SELECT id_categoria FROM categorias WHERE nome='Processador'), (SELECT id_fabricante FROM fabricantes WHERE nome='Intel'), '13700K', 'Poder bruto para jogos e trabalho.', '{ "socket": "LGA1700", "nucleos": 16, "tdp": 125 }'),
('AMD Ryzen 9 7950X', (SELECT id_categoria FROM categorias WHERE nome='Processador'), (SELECT id_fabricante FROM fabricantes WHERE nome='AMD'), '7950X', 'Topo de linha para produtividade AM5.', '{ "socket": "AM5", "nucleos": 16, "tdp": 170 }');

-- --- PLACA DE VÍDEO ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('RTX 3060 12GB', (SELECT id_categoria FROM categorias WHERE nome='Placa de Vídeo'), (SELECT id_fabricante FROM fabricantes WHERE nome='NVIDIA'), 'RTX 3060', 'A rainha do 1080p e trabalho com VRAM alta.', '{ "vram": 12, "dlss": true, "tdp": 170 }'),
('RTX 4070', (SELECT id_categoria FROM categorias WHERE nome='Placa de Vídeo'), (SELECT id_fabricante FROM fabricantes WHERE nome='NVIDIA'), 'RTX 4070', 'Eficiência energética e DLSS 3.', '{ "vram": 12, "dlss": 3, "tdp": 200 }'),
('RX 6600', (SELECT id_categoria FROM categorias WHERE nome='Placa de Vídeo'), (SELECT id_fabricante FROM fabricantes WHERE nome='AMD'), 'RX 6600', 'Entrada sólida para Full HD.', '{ "vram": 8, "fsr": true, "tdp": 132 }'),
('RX 7800 XT', (SELECT id_categoria FROM categorias WHERE nome='Placa de Vídeo'), (SELECT id_fabricante FROM fabricantes WHERE nome='AMD'), 'RX 7800 XT', 'Monstro para 1440p com muita VRAM.', '{ "vram": 16, "fsr": 3, "tdp": 263 }'),
('RTX 4090', (SELECT id_categoria FROM categorias WHERE nome='Placa de Vídeo'), (SELECT id_fabricante FROM fabricantes WHERE nome='NVIDIA'), 'RTX 4090', 'O topo absoluto de desempenho.', '{ "vram": 24, "dlss": 3, "tdp": 450 }');

-- --- PLACA MÃE ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('ASUS TUF B550M-Plus', (SELECT id_categoria FROM categorias WHERE nome='Placa Mãe'), (SELECT id_fabricante FROM fabricantes WHERE nome='ASUS'), 'TUF B550M', 'Robustez militar para Ryzen AM4.', '{ "socket": "AM4", "ram": "DDR4", "formato": "mATX" }'),
('Gigabyte B650M Aorus Elite', (SELECT id_categoria FROM categorias WHERE nome='Placa Mãe'), (SELECT id_fabricante FROM fabricantes WHERE nome='Gigabyte'), 'B650M', 'Pronta para o futuro AM5.', '{ "socket": "AM5", "ram": "DDR5", "formato": "mATX" }'),
('MSI MAG B660M Mortar', (SELECT id_categoria FROM categorias WHERE nome='Placa Mãe'), (SELECT id_fabricante FROM fabricantes WHERE nome='MSI'), 'B660M', 'Excelente VRM para Intel 12/13/14ª.', '{ "socket": "LGA1700", "ram": "DDR4", "formato": "mATX" }'),
('ASRock B450M Steel Legend', (SELECT id_categoria FROM categorias WHERE nome='Placa Mãe'), (SELECT id_fabricante FROM fabricantes WHERE nome='ASRock'), 'B450M', 'Visual incrível e ótimo preço.', '{ "socket": "AM4", "ram": "DDR4", "formato": "mATX" }'),
('ASUS ROG Strix Z790-E', (SELECT id_categoria FROM categorias WHERE nome='Placa Mãe'), (SELECT id_fabricante FROM fabricantes WHERE nome='ASUS'), 'Z790-E', 'Placa topo de linha para overclock.', '{ "socket": "LGA1700", "ram": "DDR5", "formato": "ATX" }');

-- --- MEMÓRIA RAM ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('Kingston Fury Beast 16GB (2x8)', (SELECT id_categoria FROM categorias WHERE nome='Memória RAM'), (SELECT id_fabricante FROM fabricantes WHERE nome='Kingston'), 'Fury DDR4', 'Kit padrão ouro para qualquer PC.', '{ "tipo": "DDR4", "freq": 3200, "cap": "16GB" }'),
('Corsair Vengeance RGB Pro 32GB', (SELECT id_categoria FROM categorias WHERE nome='Memória RAM'), (SELECT id_fabricante FROM fabricantes WHERE nome='Corsair'), 'Vengeance', 'RGB dinâmico e performance.', '{ "tipo": "DDR4", "freq": 3600, "cap": "32GB" }'),
('XPG Lancer DDR5 32GB', (SELECT id_categoria FROM categorias WHERE nome='Memória RAM'), (SELECT id_fabricante FROM fabricantes WHERE nome='XPG'), 'Lancer', 'A nova era de velocidade DDR5.', '{ "tipo": "DDR5", "freq": 5200, "cap": "32GB" }'),
('Asgard Loki W2 16GB', (SELECT id_categoria FROM categorias WHERE nome='Memória RAM'), (SELECT id_fabricante FROM fabricantes WHERE nome='Corsair'), -- Placeholder
'Loki', 'RGB estilo cristal belíssimo.', '{ "tipo": "DDR4", "freq": 3200, "cap": "16GB" }'),
('Kingston Fury Impact (Notebook)', (SELECT id_categoria FROM categorias WHERE nome='Memória RAM'), (SELECT id_fabricante FROM fabricantes WHERE nome='Kingston'), 'Impact', 'Upgrade ideal para laptops.', '{ "tipo": "DDR4 SO-DIMM", "freq": 2666, "cap": "16GB" }');

-- --- ARMAZENAMENTO ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('Kingston NV2 1TB', (SELECT id_categoria FROM categorias WHERE nome='Armazenamento'), (SELECT id_fabricante FROM fabricantes WHERE nome='Kingston'), 'NV2', 'SSD NVMe custo-benefício imbatível.', '{ "tipo": "NVMe", "cap": "1TB", "gen": 4 }'),
('Samsung 980 PRO 1TB', (SELECT id_categoria FROM categorias WHERE nome='Armazenamento'), (SELECT id_fabricante FROM fabricantes WHERE nome='Samsung'), '980 PRO', 'Velocidade extrema para profissionais.', '{ "tipo": "NVMe", "cap": "1TB", "gen": 4 }'),
('WD Black SN850X 2TB', (SELECT id_categoria FROM categorias WHERE nome='Armazenamento'), (SELECT id_fabricante FROM fabricantes WHERE nome='WD (Western Digital)'), 'SN850X', 'Focado em gamers exigentes.', '{ "tipo": "NVMe", "cap": "2TB", "gen": 4 }'),
('Kingston A400 480GB', (SELECT id_categoria FROM categorias WHERE nome='Armazenamento'), (SELECT id_fabricante FROM fabricantes WHERE nome='Kingston'), 'A400', 'SATA clássico para reviver PCs.', '{ "tipo": "SATA", "cap": "480GB", "formato": "2.5" }'),
('HD Seagate Barracuda 2TB', (SELECT id_categoria FROM categorias WHERE nome='Armazenamento'), (SELECT id_fabricante FROM fabricantes WHERE nome='Seagate'), 'Barracuda', 'Armazenamento massivo barato.', '{ "tipo": "HDD", "cap": "2TB", "rpm": 7200 }');

-- --- COOLER ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('DeepCool AK400', (SELECT id_categoria FROM categorias WHERE nome='Cooler'), (SELECT id_fabricante FROM fabricantes WHERE nome='DeepCool'), 'AK400', 'Air cooler eficiente e elegante.', '{ "tipo": "Air", "fan": "120mm", "tdp": 220 }'),
('Cooler Master Hyper 212', (SELECT id_categoria FROM categorias WHERE nome='Cooler'), (SELECT id_fabricante FROM fabricantes WHERE nome='Cooler Master'), 'Hyper 212', 'O clássico dos air coolers.', '{ "tipo": "Air", "fan": "120mm", "rgb": true }'),
('Rise Mode Z4', (SELECT id_categoria FROM categorias WHERE nome='Cooler'), (SELECT id_fabricante FROM fabricantes WHERE nome='Risemode'), 'Z4', 'Baratinho e funcional.', '{ "tipo": "Air", "fan": "120mm", "rgb": false }'),
('Corsair H100i Elite', (SELECT id_categoria FROM categorias WHERE nome='Cooler'), (SELECT id_fabricante FROM fabricantes WHERE nome='Corsair'), 'H100i', 'Water cooler premium 240mm.', '{ "tipo": "AIO", "radiador": "240mm", "rgb": true }'),
('DeepCool LE500', (SELECT id_categoria FROM categorias WHERE nome='Cooler'), (SELECT id_fabricante FROM fabricantes WHERE nome='DeepCool'), 'LE500', 'Water cooler de entrada robusto.', '{ "tipo": "AIO", "radiador": "240mm", "rgb": false }');

-- --- FONTE ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('MSI MAG A650BN', (SELECT id_categoria FROM categorias WHERE nome='Fonte'), (SELECT id_fabricante FROM fabricantes WHERE nome='MSI'), 'A650BN', 'A queridinha do Brasil. Confiável e barata.', '{ "watts": 650, "selo": "Bronze", "modular": false }'),
('Corsair RM750e', (SELECT id_categoria FROM categorias WHERE nome='Fonte'), (SELECT id_fabricante FROM fabricantes WHERE nome='Corsair'), 'RM750e', 'Totalmente modular e silenciosa.', '{ "watts": 750, "selo": "Gold", "modular": true }'),
('XPG Core Reactor 850W', (SELECT id_categoria FROM categorias WHERE nome='Fonte'), (SELECT id_fabricante FROM fabricantes WHERE nome='XPG'), 'Core Reactor', 'Tier A, aguenta qualquer placa.', '{ "watts": 850, "selo": "Gold", "modular": true }'),
('Gigabyte P650B', (SELECT id_categoria FROM categorias WHERE nome='Fonte'), (SELECT id_fabricante FROM fabricantes WHERE nome='Gigabyte'), 'P650B', 'Opção intermediária sólida.', '{ "watts": 650, "selo": "Bronze", "modular": false }'),
('Gamemax GX600', (SELECT id_categoria FROM categorias WHERE nome='Fonte'), (SELECT id_fabricante FROM fabricantes WHERE nome='Gamemax'), 'GX600', 'Aprovada pelo TecLab.', '{ "watts": 600, "selo": "Gold", "modular": false }');

-- --- GABINETE ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('Lian Li O11 Dynamic', (SELECT id_categoria FROM categorias WHERE nome='Gabinete'), (SELECT id_fabricante FROM fabricantes WHERE nome='Lian Li'), 'O11', 'O aquário mais famoso.', '{ "formato": "Mid", "tipo": "Aquário", "fans": 0 }'),
('Montech Air 903 Base', (SELECT id_categoria FROM categorias WHERE nome='Gabinete'), (SELECT id_fabricante FROM fabricantes WHERE nome='Corsair'), -- Placeholder
'Air 903', 'Fluxo de ar absurdo com 3 fans de 140mm.', '{ "formato": "Mid", "tipo": "Mesh", "fans": 3 }'),
('Corsair 4000D Airflow', (SELECT id_categoria FROM categorias WHERE nome='Gabinete'), (SELECT id_fabricante FROM fabricantes WHERE nome='Corsair'), '4000D', 'Construção premium e fácil de montar.', '{ "formato": "Mid", "tipo": "Mesh", "fans": 2 }'),
('Pichau Kazan 2', (SELECT id_categoria FROM categorias WHERE nome='Gabinete'), (SELECT id_fabricante FROM fabricantes WHERE nome='Corsair'), -- Placeholder
'Kazan 2', 'Barato e já vem com 4 ventoinhas.', '{ "formato": "Mid", "tipo": "Mesh", "fans": 4 }'),
('NZXT H5 Flow', (SELECT id_categoria FROM categorias WHERE nome='Gabinete'), (SELECT id_fabricante FROM fabricantes WHERE nome='NZXT'), 'H5 Flow', 'Minimalista com fan dedicada pra GPU.', '{ "formato": "Mid", "tipo": "Mesh", "fans": 2 }');

-- --- HEADSET ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('HyperX Cloud II', (SELECT id_categoria FROM categorias WHERE nome='Headset'), (SELECT id_fabricante FROM fabricantes WHERE nome='HyperX'), 'Cloud II', 'Conforto lendário e som 7.1.', '{ "tipo": "Over-ear", "conexao": "USB/P2", "mic": "Removível" }'),
('Logitech G Pro X', (SELECT id_categoria FROM categorias WHERE nome='Headset'), (SELECT id_fabricante FROM fabricantes WHERE nome='Logitech'), 'G Pro X', 'Microfone Blue Voice incrível.', '{ "tipo": "Over-ear", "conexao": "USB", "mic": "Removível" }'),
('Razer BlackShark V2', (SELECT id_categoria FROM categorias WHERE nome='Headset'), (SELECT id_fabricante FROM fabricantes WHERE nome='Razer'), 'BlackShark V2', 'Ótimo isolamento passivo.', '{ "tipo": "Over-ear", "conexao": "USB", "mic": "Fixo" }'),
('SteelSeries Arctis Nova 1', (SELECT id_categoria FROM categorias WHERE nome='Headset'), (SELECT id_fabricante FROM fabricantes WHERE nome='SteelSeries'), 'Nova 1', 'Leve e compatível com tudo.', '{ "tipo": "Over-ear", "conexao": "P2", "mic": "Retrátil" }'),
('Redragon Zeus X', (SELECT id_categoria FROM categorias WHERE nome='Headset'), (SELECT id_fabricante FROM fabricantes WHERE nome='Redragon'), 'Zeus X', 'RGB e bom áudio por um preço baixo.', '{ "tipo": "Over-ear", "conexao": "USB", "mic": "Fixo" }');

-- --- MICROFONE ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('HyperX QuadCast S', (SELECT id_categoria FROM categorias WHERE nome='Microfone'), (SELECT id_fabricante FROM fabricantes WHERE nome='HyperX'), 'QuadCast S', 'O queridinho dos streamers com RGB.', '{ "tipo": "Condensador", "conexao": "USB" }'),
('Fifine A8', (SELECT id_categoria FROM categorias WHERE nome='Microfone'), (SELECT id_fabricante FROM fabricantes WHERE nome='Fifine'), 'A8', 'Melhor custo-benefício USB atual.', '{ "tipo": "Condensador", "conexao": "USB-C" }'),
('Blue Yeti', (SELECT id_categoria FROM categorias WHERE nome='Microfone'), (SELECT id_fabricante FROM fabricantes WHERE nome='Blue'), 'Yeti', 'Clássico e versátil.', '{ "tipo": "Condensador", "conexao": "USB" }'),
('Audio-Technica AT2020', (SELECT id_categoria FROM categorias WHERE nome='Microfone'), (SELECT id_fabricante FROM fabricantes WHERE nome='Audio-Technica'), 'AT2020', 'Qualidade de estúdio (XLR).', '{ "tipo": "Condensador", "conexao": "XLR" }'),
('Razer Seiren Mini', (SELECT id_categoria FROM categorias WHERE nome='Microfone'), (SELECT id_fabricante FROM fabricantes WHERE nome='Razer'), 'Seiren Mini', 'Compacto e discreto.', '{ "tipo": "Condensador", "conexao": "USB" }');

-- --- CONTROLE ---
INSERT INTO produtos (nome, id_categoria, id_fabricante, modelo, descricao, especificacoes) VALUES
('Xbox Wireless Controller', (SELECT id_categoria FROM categorias WHERE nome='Controle'), (SELECT id_fabricante FROM fabricantes WHERE nome='Microsoft'), 'Series X', 'O padrão ouro para PC.', '{ "conexao": "Bluetooth/USB", "vibra": true }'),
('Sony DualSense', (SELECT id_categoria FROM categorias WHERE nome='Controle'), (SELECT id_fabricante FROM fabricantes WHERE nome='Sony'), 'DualSense', 'Haptics e gatilhos adaptáveis.', '{ "conexao": "Bluetooth/USB", "vibra": true }'),
('8BitDo Ultimate', (SELECT id_categoria FROM categorias WHERE nome='Controle'), (SELECT id_fabricante FROM fabricantes WHERE nome='8BitDo'), 'Ultimate', 'Vem com base e sensores Hall Effect.', '{ "conexao": "2.4G/Bluetooth", "vibra": true }'),
('GameSir T4 Kaleid', (SELECT id_categoria FROM categorias WHERE nome='Controle'), (SELECT id_fabricante FROM fabricantes WHERE nome='GameSir'), 'T4K', 'Transparente, RGB e Hall Effect.', '{ "conexao": "Cabo", "vibra": true }'),
('Logitech F710', (SELECT id_categoria FROM categorias WHERE nome='Controle'), (SELECT id_fabricante FROM fabricantes WHERE nome='Logitech'), 'F710', 'Tanque de guerra indestrutível.', '{ "conexao": "2.4G", "vibra": true }');