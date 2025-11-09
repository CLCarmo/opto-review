import React, { useState, useMemo } from 'react';

// 1. Importa os nossos componentes e CSS
import './GlossaryPage.css'; // O CSS do layout (header, filtros, paginação)
import TermCard from './TermCard'; // O componente que acabámos de criar

// --- O "MAPA" DE FILTROS QUE TU PEDISTE ---
// Baseado na tua imagem 
const logicalCategories = [
  { 
    id: 'Todas',        
    label: 'Todas as Categorias', // O texto que o utilizador vê
    icon: 'fas fa-border-all', // O ícone
    dataCategories: []  // Array vazio para a lógica de "Todos"
  },
  { 
    id: 'PC', 
    label: 'PC (Computador)', 
    icon: 'fas fa-desktop', 
    dataCategories: ['PC (Computador)'] // Este botão filtra pela categoria de dados "PC (Computador)"
  },
  { 
    id: 'Perifericos', 
    label: 'Periféricos (Mouse, Teclado, etc.)', 
    icon: 'fas fa-mouse', // Ícone de Periféricos
    // Este botão filtra por QUALQUER um destes
    dataCategories: ['Mouse', 'Teclado', 'Monitor', 'Headset'] 
  },
  { 
    id: 'Acessorios', 
    label: 'Acessórios', 
    icon: 'fas fa-box-open', 
    dataCategories: ['Acessórios'] 
  }
  // NOTA: Os teus dados também têm "Software e Serviços".
  // Se quiseres um botão para ele, adiciona-o aqui.
];

// --- CONSTANTES ---
const ITEMS_PER_PAGE = 10;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

// --- FUNÇÃO HELPER ---
const normalizeText = (text) => {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// ===================================================================
// --- DADOS ---
// ===================================================================
//
// OS TEUS 700+ TERMOS DO 'Tem certexza.txt' ESTÃO AGORA AQUI DENTRO:
//
const glossaryTerms = [
    { 
        term: "Placa Mãe (Motherboard)", 
        category: "PC (Computador)", 
        subcategory: "Placa Mãe", 
        explanation: "É o principal circuito do computador. Funciona como a espinha dorsal que conecta e permite a comunicação de todos os outros componentes (CPU, GPU, RAM, etc.).",
        practical_tip: "É a base do seu PC. O modelo dela define quais Processadores (CPU) e Memórias RAM você pode usar, e quantos SSDs pode instalar.",
        details: "Define o tipo de processador (socket), a quantidade de memória RAM e os tipos de conexões que o PC pode suportar.",
        keywords: "motherboard, mobo, placa mae"
    },
    { 
        term: "Processador (CPU)", 
        category: "PC (Computador)", 
        subcategory: "Processador", 
        explanation: "O 'cérebro' do computador. Ele executa as instruções de todos os programas.",
        practical_tip: "Em jogos, um bom processador (ex: AMD Ryzen 5/7, Intel Core i5/7) evita 'gargalos', garantindo que sua Placa de Vídeo rode 100%.",
        keywords: "cpu, central processing unit, processador"
    },
    { 
        term: "Placa de Vídeo (GPU)", 
        category: "PC (Computador)", 
        subcategory: "Placa de Vídeo", 
        explanation: "Componente responsável por gerar e processar as imagens que você vê no monitor.",
        practical_tip: "É o componente MAIS importante para jogos. A performance (medida em FPS) depende 90% dela.",
        keywords: "gpu, graphics processing unit, placa de video"
    },
    { 
        term: "Memória RAM", 
        category: "PC (Computador)", 
        subcategory: "Memória RAM", 
        explanation: "Memória de acesso rápido que armazena dados temporariamente enquanto o computador está ligado.",
        practical_tip: "Para jogos hoje em dia, 16GB é o ideal (2x8GB). 32GB (2x16GB) é recomendado para setups mais caros ou para quem faz multitarefa pesada.",
        keywords: "ram, random access memory, memoria"
    },
    { 
        term: "SSD (Solid State Drive)", 
        category: "PC (Computador)", 
        subcategory: "Armazenamento", 
        explanation: "Dispositivo de armazenamento de dados muito mais rápido que um HD tradicional. Usa memória flash.",
        practical_tip: "O seu sistema operativo (Windows) e seus jogos DEVERIAM estar num SSD. O 'Loading' dos jogos será drasticamente mais rápido.",
        keywords: "ssd, solid state drive, armazenamento"
    },
    { 
        term: "HD (Hard Drive)", 
        category: "PC (Computador)", 
        subcategory: "Armazenamento", 
        explanation: "Dispositivo de armazenamento de dados magnético (mecânico). É mais lento, mas oferece mais espaço por um preço menor.",
        practical_tip: "Bom para guardar arquivos grandes que você não acede sempre (fotos, vídeos, backups). Evite instalar jogos pesados nele.",
        keywords: "hd, hard drive, disco rigido, armazenamento"
    },
    { 
        term: "Fonte de Alimentação (PSU)", 
        category: "PC (Computador)", 
        subcategory: "Fonte (PSU)", 
        explanation: "Converte a energia da tomada (AC) para a energia que os componentes do computador usam (DC).",
        practical_tip: "NÃO economize na fonte. Uma fonte de má qualidade pode queimar e levar outros componentes (como sua placa de vídeo) com ela.",
        keywords: "psu, power supply unit, fonte"
    },
    { 
        term: "Selo 80 Plus", 
        category: "PC (Computador)", 
        subcategory: "Fonte (PSU)", 
        explanation: "Um selo de certificação que garante a eficiência energética de uma fonte.",
        practical_tip: "Procure por fontes com, no mínimo, o selo '80 Plus Bronze'. Isso indica que é um produto com um mínimo de qualidade e eficiência.",
        details: "Os níveis são: 80 Plus (White), Bronze, Silver, Gold, Platinum, Titanium. Quanto maior o nível, mais eficiente (e menos energia desperdiça).",
        keywords: "80 plus, 80plus, eficiencia, psu"
    },
    { 
        term: "Gabinete (Case)", 
        category: "PC (Computador)", 
        subcategory: "Gabinete", 
        explanation: "A 'caixa' que protege e aloja todos os componentes internos do computador.",
        practical_tip: "Não é só estética. Um bom gabinete com 'Airflow' (fluxo de ar) adequado é essencial para manter suas peças frias e evitar perda de performance.",
        keywords: "gabinete, case, chassi, airflow, fluxo de ar"
    },
    { 
        term: "Cooler (Refrigeração)", 
        category: "PC (Computador)", 
        subcategory: "Refrigeração", 
        explanation: "Sistema de refrigeração para manter o processador (CPU) em temperaturas seguras.",
        practical_tip: "Pode ser 'Air Cooler' (ventoinha) ou 'Water Cooler' (líquido). Um bom cooler é essencial para processadores mais potentes (i7/i9, Ryzen 7/9).",
        keywords: "cooler, water cooler, air cooler, refrigeração"
    },
    { 
        term: "Formato (Placa Mãe)", 
        category: "PC (Computador)", 
        subcategory: "Placa Mãe", 
        explanation: "Define o tamanho físico da placa mãe e, consequentemente, o tipo de gabinete que ela precisa.",
        practical_tip: "Os mais comuns são ATX (grande, mais conexões), Micro-ATX (médio, bom custo-benefício) e Mini-ITX (pequeno, para PCs compactos).",
        details: "O formato ATX é o padrão, Micro-ATX (mATX) é um pouco menor, e Mini-ITX (ITX) é o menor de todos, geralmente para builds 'SFF' (Small Form Factor).",
        keywords: "atx, micro-atx, matx, mini-itx, itx, sff, formato"
    },
    { 
        term: "Socket (Soquete)", 
        category: "PC (Computador)", 
        subcategory: "Processador", 
        explanation: "O 'encaixe' na placa mãe onde o processador (CPU) é instalado. O processador e a placa mãe devem ter o mesmo socket.",
        practical_tip: "Exemplos: A Intel usa o socket LGA 1700 (12ª/13ª/14ª gen). A AMD usa o socket AM4 (Ryzen 1000-5000) e AM5 (Ryzen 7000+).",
        keywords: "socket, soquete, lga 1700, am4, am5"
    },
    { 
        term: "Chipset", 
        category: "PC (Computador)", 
        subcategory: "Placa Mãe", 
        explanation: "O 'cérebro' da placa mãe. É um conjunto de chips que gerencia a comunicação entre a CPU, a RAM, a GPU e outros periféricos.",
        practical_tip: "Exemplos: Para AMD AM5, os chipsets são B650 (intermediário) e X670 (topo de linha). Para Intel LGA 1700, são B760 (intermediário) e Z790 (topo de linha, permite overclock).",
        keywords: "chipset, b650, x670, b760, z790"
    },
    { 
        term: "VRM (Voltage Regulator Module)", 
        category: "PC (Computador)", 
        subcategory: "Placa Mãe", 
        explanation: "Circuito na placa mãe responsável por fornecer energia limpa e estável para o processador (CPU).",
        practical_tip: "Um VRM robusto (com mais 'fases' e bons dissipadores) é crucial para processadores potentes (i9, Ryzen 9) e para fazer overclock, pois evita superaquecimento da placa mãe.",
        keywords: "vrm, fases, modulo de regulagem de tensão"
    },
    { 
        term: "Overclock (OC)", 
        category: "PC (Computador)", 
        subcategory: "Processador", 
        explanation: "A prática de forçar um componente (CPU ou GPU) a rodar em uma frequência (velocidade) maior do que a especificada de fábrica.",
        practical_tip: "Pode dar mais performance de graça, mas exige uma placa mãe com chipset específico (Z na Intel, B/X na AMD), um bom cooler e aumenta o consumo de energia.",
        keywords: "oc, overclocking"
    },
    { 
        term: "Gargalo (Bottleneck)", 
        category: "PC (Computador)", 
        subcategory: "Processador", 
        explanation: "Situação em que um componente é muito mais lento que os outros, limitando a performance geral do sistema.",
        practical_tip: "Exemplo comum: Usar um processador (CPU) muito antigo com uma placa de vídeo (GPU) nova. A GPU não consegue rodar a 100% porque a CPU não dá conta de 'alimentá-la' com dados.",
        keywords: "gargalo, bottleneck, cpu bound, gpu bound"
    },
    { 
        term: "SSD NVMe M.2", 
        category: "PC (Computador)", 
        subcategory: "Armazenamento", 
        explanation: "O tipo de SSD mais rápido disponível. Ele se parece com um 'pente' de memória e se conecta diretamente na placa mãe (no slot M.2), usando a interface PCIe.",
        practical_tip: "É significativamente mais rápido que um SSD SATA (o de 'caixinha'). Use-o para o seu sistema operacional e jogos mais jogados.",
        details: "NVMe é o protocolo (linguagem), M.2 é o formato físico (o 'encaixe'), e PCIe é a interface (o 'caminho' por onde os dados passam).",
        keywords: "nvme, m.2, m2, pcie, pci express, ssd"
    },
    { 
        term: "SSD SATA", 
        category: "PC (Computador)", 
        subcategory: "Armazenamento", 
        explanation: "Um SSD que usa o formato tradicional de 2.5 polegadas (parecido com um HD de notebook) e se conecta através de um cabo SATA.",
        practical_tip: "Ainda é muito mais rápido que um HD. É uma opção excelente e mais barata para expandir o armazenamento de jogos se os seus slots M.2 já estiverem ocupados.",
        keywords: "ssd sata, 2.5, armazenamento"
    },
    { 
        term: "DDR4 / DDR5", 
        category: "PC (Computador)", 
        subcategory: "Memória RAM", 
        explanation: "Gerações de memória RAM. DDR5 é a mais nova, mais rápida e usada nas plataformas mais recentes (Intel LGA 1700, AMD AM5). DDR4 é a geração anterior, ainda muito usada.",
        practical_tip: "Placas mãe ou são DDR4 ou são DDR5. Elas não são compatíveis entre si. Verifique qual a sua placa mãe suporta antes de comprar.",
        keywords: "ddr4, ddr5, memoria ram"
    },
    { 
        term: "Dual-Channel", 
        category: "PC (Computador)", 
        subcategory: "Memória RAM", 
        explanation: "Uma tecnologia que dobra a largura de banda de comunicação entre a memória RAM e o processador. Requer dois (ou quatro) pentes de memória idênticos.",
        practical_tip: "É por isso que 16GB (2x8GB) é MUITO melhor que 16GB (1x16GB). Usar apenas um pente de memória (single-channel) pode cortar sua performance em jogos pela metade.",
        keywords: "dual channel, single channel, memoria"
    },
    { 
        term: "Frequência (RAM)", 
        category: "PC (Computador)", 
        subcategory: "Memória RAM", 
        explanation: "A velocidade da memória RAM, medida em Megahertz (MHz). Ex: 3200MHz, 3600MHz (DDR4) ou 5200MHz, 6000MHz (DDR5).",
        practical_tip: "Velocidades maiores geralmente dão mais performance, especialmente em processadores AMD Ryzen. Para DDR5, 6000MHz é considerado o 'ponto ideal' (sweet spot) hoje.",
        keywords: "frequencia, mhz, velocidade, ddr4, ddr5"
    },
    { 
        term: "Latência CAS (CL)", 
        category: "PC (Computador)", 
        subcategory: "Memória RAM", 
        explanation: "O 'tempo de resposta' da memória RAM. É o número de ciclos de clock que ela leva para responder a um pedido. Ex: CL16, CL18 (DDR4) ou CL30, CL36 (DDR5).",
        practical_tip: "Quanto MENOR a latência (CL), melhor. A performance real da RAM é uma combinação da Frequência (alta) e da Latência (baixa).",
        keywords: "cas latency, cl, latencia, timings"
    },
    { 
        term: "XMP / EXPO", 
        category: "PC (Computador)", 
        subcategory: "Memória RAM", 
        explanation: "Perfis de overclock automático para a memória RAM. XMP (Intel) e EXPO (AMD) são configurações na BIOS que ajustam a frequência e latência da sua RAM para a velocidade anunciada.",
        practical_tip: "Se você comprar uma RAM de 6000MHz, ela provavelmente rodará a 4800MHz por padrão. Você precisa entrar na BIOS e ativar o XMP/EXPO para ela rodar a 6000MHz.",
        keywords: "xmp, expo, overclock, bios, ram"
    },
    { 
        term: "VRAM (Vídeo RAM)", 
        category: "PC (Computador)", 
        subcategory: "Placa de Vídeo", 
        explanation: "A memória dedicada da placa de vídeo (GPU), usada para armazenar texturas e dados gráficos.",
        practical_tip: "Para jogos modernos em 1080p, 8GB de VRAM é o mínimo recomendado. Para 1440p ou 4K, procure por 12GB ou 16GB para não ter 'engasgos' (stuttering).",
        keywords: "vram, memoria de video, gpu"
    },
    { 
        term: "Ray Tracing (RT)", 
        category: "PC (Computador)", 
        subcategory: "Placa de Vídeo", 
        explanation: "Uma técnica de renderização que simula o comportamento físico da luz, criando reflexos, sombras e iluminação ultra-realistas.",
        practical_tip: "É uma tecnologia pesada. Placas da NVIDIA (RTX) geralmente têm performance melhor com Ray Tracing ligado do que as placas da AMD (RX).",
        keywords: "ray tracing, rt, rtx"
    },
    { 
        term: "DLSS / FSR", 
        category: "PC (Computador)", 
        subcategory: "Placa de Vídeo", 
        explanation: "Tecnologias de 'Upscaling'. Elas renderizam o jogo numa resolução menor (ex: 1080p) e usam IA para 'esticar' a imagem para uma resolução maior (ex: 4K), ganhando muita performance (FPS).",
        practical_tip: "DLSS (NVIDIA) e FSR (AMD) são essenciais para jogar em 4K ou com Ray Tracing. DLSS 3 (com Frame Generation) só funciona nas placas RTX 4000.",
        keywords: "dlss, fsr, frame generation, upscaling, amd, nvidia"
    },
    { 
        term: "TDP (Thermal Design Power)", 
        category: "PC (Computador)", 
        subcategory: "Processador", 
        explanation: "Uma medida (em Watts) da quantidade máxima de calor que um componente (CPU ou GPU) gera sob carga. Indica o quão potente o seu cooler ou fonte precisa ser.",
        practical_tip: "Um processador com TDP de 125W precisa de um cooler muito melhor que um de 65W. O TDP também ajuda a calcular qual a potência (Watts) da Fonte (PSU) que você precisa.",
        keywords: "tdp, watts, consumo, calor, psu"
    },
    { 
        term: "BIOS / UEFI", 
        category: "PC (Computador)", 
        subcategory: "Placa Mãe", 
        explanation: "O software de 'baixo nível' da placa mãe. É a primeira tela que aparece ao ligar o PC (antes do Windows) e onde você configura coisas como XMP/EXPO, ordem de boot e overclock.",
        practical_tip: "UEFI é a versão moderna e gráfica da BIOS antiga (que era só texto).",
        keywords: "bios, uefi, setup"
    },
    
    // ===============================================
    // MOUSE
    // ===============================================
    
    { 
        term: "DPI (Dots Per Inch)", 
        category: "Mouse", 
        subcategory: "Especificações", 
        explanation: "Mede a sensibilidade do mouse. Um DPI alto faz o cursor mover-se mais (e mais rápido) na tela com menos movimento físico do mouse.",
        practical_tip: "DPI alto NÃO significa 'mouse melhor'. A maioria dos jogadores profissionais usa DPIs baixos (400 a 1600). O importante é ter um sensor bom.",
        keywords: "dpi, sensibilidade, sensor"
    },
    { 
        term: "Polling Rate (Taxa de Atualização)", 
        category: "Mouse", 
        subcategory: "Especificações", 
        explanation: "A frequência com que o mouse reporta sua posição para o computador, medida em Hertz (Hz).",
        practical_tip: "Procure por mouses com 1000Hz (1ms de tempo de resposta). Menos que isso (ex: 125Hz) pode parecer 'travado' em jogos.",
        details: "Mouses mais recentes estão a vir com 4000Hz ou 8000Hz, mas 1000Hz ainda é o padrão-ouro.",
        keywords: "polling rate, hz, hertz, taxa de atualização, tempo de resposta"
    },
    { 
        term: "Sensor (Mouse)", 
        category: "Mouse", 
        subcategory: "Componentes", 
        explanation: "O 'olho' do mouse que lê a superfície para detetar movimento. Pode ser Óptico ou a Laser.",
        practical_tip: "Sensores ópticos (ex: PixArt, ou os proprietários da Logitech/Razer) são considerados os melhores para jogos por não terem aceleração e serem mais precisos.",
        keywords: "sensor, optico, laser, pixart"
    },
    { 
        term: "Aceleração (Mouse)", 
        category: "Mouse", 
        subcategory: "Especificações", 
        explanation: "Quando o cursor se move mais rápido dependendo da velocidade com que você mexe o mouse. Isso causa inconsistência na 'memória muscular'.",
        practical_tip: "Para jogos (especialmente FPS), você quer um mouse com ZERO aceleração de hardware. Mouses gamers modernos (Logitech, Razer, Zowie, etc.) não têm aceleração.",
        keywords: "aceleração, acceleration"
    },
    { 
        term: "Switches (Mouse)", 
        category: "Mouse", 
        subcategory: "Componentes", 
        explanation: "Os mecanismos embaixo dos botões de clique (esquerdo/direito).",
        practical_tip: "Podem ser mecânicos (ex: Omron, Kailh) que dão o 'clique' tátil, ou Ópticos (ex: Razer) que usam luz, são mais rápidos e evitam o problema do 'clique duplo'.",
        keywords: "switch, switches, optico, omron, kailh, clique duplo, double click"
    },
    { 
        term: "Clique Duplo (Double Click)", 
        category: "Mouse", 
        subcategory: "Componentes", 
        explanation: "Um defeito comum em switches mecânicos desgastados, onde um único clique é registrado pelo PC como dois cliques.",
        practical_tip: "Mouses com switches ópticos são imunes a este problema.",
        keywords: "double click, clique duplo, defeito"
    },
    { 
        term: "Mouse Skates (Pés)", 
        category: "Mouse", 
        subcategory: "Componentes", 
        explanation: "Os 'pés' de deslize na base do mouse. Geralmente feitos de PTFE (Teflon).",
        practical_tip: "Pés de 100% PTFE virgem (brancos) oferecem o menor atrito e o melhor deslize. Muitos mouses vêm com pés pretos (mix de PTFE) que são um pouco mais lentos.",
        keywords: "skates, pés, pezinhos, ptfe, teflon, deslize"
    },
    { 
        term: "Pegada (Grip)", 
        category: "Mouse", 
        subcategory: "Ergonomia", 
        explanation: "A forma como você segura o mouse. Os três tipos principais são Palm, Claw e Fingertip.",
        practical_tip: "Palm (Palma): A mão inteira descansa sobre o mouse. Claw (Garra): A palma toca a traseira, mas os dedos ficam arqueados. Fingertip (Ponta do Dedo): Apenas as pontas dos dedos tocam o mouse.",
        details: "Mouses ergonômicos (ex: DeathAdder) são bons para Palm/Claw. Mouses simétricos (ex: G Pro X) são bons para todos os tipos.",
        keywords: "grip, pegada, palm, claw, fingertip, ergonomia"
    },
    { 
        term: "Ergonômico vs Simétrico", 
        category: "Mouse", 
        subcategory: "Ergonomia", 
        explanation: "Define o 'shape' (formato) do mouse. Simétrico é igual em ambos os lados. Ergonômico é moldado para destros (ou canhotos), com curvas de apoio.",
        practical_tip: "Mouses ergonômicos (ex: Razer DeathAdder, Zowie EC2) são geralmente mais confortáveis para longas sessões. Mouses simétricos (ex: Logitech G Pro X) são preferidos por muitos para 'mira' pura.",
        keywords: "ergonomico, simetrico, ambidestro, shape, formato"
    },
    { 
        term: "Wireless (Sem Fio)", 
        category: "Mouse", 
        subcategory: "Especificações", 
        explanation: "Tecnologia de conexão sem fio. As tecnologias 'gamers' modernas (ex: Lightspeed da Logitech, HyperSpeed da Razer) têm latência (atraso) zero, igual ou até melhor que mouses com fio.",
        practical_tip: "Não confunda um mouse gamer wireless (que usa um 'dongle' USB 2.4GHz) com um mouse Bluetooth. Bluetooth tem muito atraso e não é bom para jogos.",
        keywords: "wireless, sem fio, lightspeed, hyperspeed, 2.4ghz, bluetooth"
    },
    
    // ===============================================
    // TECLADO
    // ===============================================
    
    { 
        term: "Teclado Mecânico", 
        category: "Teclado", 
        subcategory: "Tipo", 
        explanation: "Um teclado que usa 'switches' mecânicos individuais para cada tecla. Oferece maior precisão, durabilidade e sensação tátil.",
        practical_tip: "É o padrão para quem joga ou digita muito. Muito superior aos teclados de 'membrana' (comuns de escritório).",
        keywords: "mecanico, mecanical keyboard"
    },
    { 
        term: "Teclado de Membrana", 
        category: "Teclado", 
        subcategory: "Tipo", 
        explanation: "Usa uma camada de borracha (membrana) sob as teclas. A sensação é mais 'borrachuda' e menos precisa.",
        practical_tip: "São mais baratos, mas menos duráveis e piores para jogos que exigem velocidade.",
        keywords: "membrana, membrane"
    },
    { 
        term: "Switch (Teclado)", 
        category: "Teclado", 
        subcategory: "Switch", 
        explanation: "O mecanismo individual de cada tecla em um teclado mecânico. Define a sensação e o som do clique.",
        practical_tip: "Os 3 tipos principais são: Linear (Vermelho/Red), Tátil (Marrom/Brown) e 'Clicky' (Azul/Blue).",
        keywords: "switch, switches, cherry, gateron, kailh"
    },
    { 
        term: "Switch Linear (Red)", 
        category: "Teclado", 
        subcategory: "Switch", 
        explanation: "Um switch com um pressionar suave e linear (sem 'calombo' no meio) e silencioso.",
        practical_tip: "Considerado o melhor para jogos (especialmente FPS) por ser o mais rápido e leve. Ex: Cherry MX Red, Gateron Red.",
        keywords: "linear, red, vermelho, switch"
    },
    { 
        term: "Switch Tátil (Brown)", 
        category: "Teclado", 
        subcategory: "Switch", 
        explanation: "Um switch que tem um 'calombo' (bump) tátil no meio do caminho, para você sentir quando a tecla foi ativada. É silencioso.",
        practical_tip: "É o melhor 'meio-termo' para quem joga e também digita muito. Ex: Cherry MX Brown, Gateron Brown.",
        keywords: "tatil, tactile, brown, marrom, switch"
    },
    { 
        term: "Switch Clicky (Blue)", 
        category: "Teclado", 
        subcategory: "Switch", 
        explanation: "Um switch que tem o 'calombo' tátil e também um clique AUDÍVEL (barulhento).",
        practical_tip: "Ótimo para digitar (sensação de máquina de escrever), mas muito barulhento para jogos ou para usar perto de outras pessoas. Ex: Cherry MX Blue, Gateron Blue.",
        keywords: "clicky, blue, azul, switch, barulhento"
    },
    { 
        term: "Formato (Teclado)", 
        category: "Teclado", 
        subcategory: "Tipo", 
        explanation: "O tamanho e layout do teclado. Os mais comuns são Full-size (100%), TKL (80%) e 60%.",
        practical_tip: "Full-size (100%): Tem o teclado numérico. TKL (Tenkeyless, 80%): Não tem o teclado numérico (o mais popular para jogos, dá mais espaço para o mouse). 60% / 65%: Super compacto, não tem as teclas F (F1-F12) nem as setas (o 65% tem as setas).",
        keywords: "formato, layout, full-size, 100%, tkl, tenkeyless, 80%, 65%, 60%"
    },
    { 
        term: "Keycaps", 
        category: "Teclado", 
        subcategory: "Componentes", 
        explanation: "As 'capas' das teclas (o plástico com a letra impressa) que você pressiona.",
        practical_tip: "Podem ser de plástico ABS (mais comum, fica brilhante com o tempo) ou PBT (mais texturizado, muito mais durável, não fica brilhante).",
        details: "As 'Doubleshot' (injeção dupla) são as melhores, pois a letra é feita de uma segunda camada de plástico e nunca vai apagar.",
        keywords: "keycaps, keycap, pbt, abs, doubleshot"
    },
    { 
        term: "Hot-Swappable", 
        category: "Teclado", 
        subcategory: "Tipo", 
        explanation: "Um teclado 'hot-swap' permite que você troque os switches facilmente (apenas puxando-os), sem precisar de solda.",
        practical_tip: "Excelente para quem quer experimentar diferentes tipos de switches (ex: Red, Brown) no futuro ou para facilitar a manutenção.",
        keywords: "hot-swap, hotswap, hot swappable"
    },
    { 
        term: "Anti-Ghosting / N-Key Rollover", 
        category: "Teclado", 
        subcategory: "Especificações", 
        explanation: "Anti-Ghosting garante que o teclado registre corretamente múltiplas teclas pressionadas ao mesmo tempo.",
        practical_tip: "N-Key Rollover (NKRO) é a versão perfeita disso, significando que você pode pressionar TODAS as teclas ao mesmo tempo e todas serão registradas. Essencial para jogos.",
        keywords: "anti-ghosting, ghosting, n-key rollover, nkro"
    },
    { 
        term: "Layout (ABNT2 / ANSI)", 
        category: "Teclado", 
        subcategory: "Tipo", 
        explanation: "O padrão de layout das teclas. ABNT2 é o padrão brasileiro (com 'Ç' e Enter grande em 'L'). ANSI é o padrão americano (sem 'Ç' e Enter reto).",
        practical_tip: "A maioria dos teclados gamers importados é ANSI. Se você faz questão do 'Ç', procure especificamente por um teclado ABNT2.",
        keywords: "abnt, abnt2, ansi, layout, padrão"
    },
    { 
        term: "RGB", 
        category: "Teclado", 
        subcategory: "Componentes", 
        explanation: "Iluminação colorida (Red, Green, Blue) configurável sob as teclas.",
        practical_tip: "Pode ser útil para destacar teclas específicas (ex: WASD) ou apenas por estética. Não afeta a performance.",
        keywords: "rgb, iluminação, backlight, luz"
    },
    
    // ===============================================
    // MONITOR
    // ===============================================
    
    { 
        term: "Resolução", 
        category: "Monitor", 
        subcategory: "Especificações", 
        explanation: "O número de pixels que formam a imagem. Mais pixels = imagem mais nítida.",
        practical_tip: "Full HD (FHD) = 1920x1080. Quad HD (QHD) = 2560x1440 (o 'ponto ideal' hoje). Ultra HD (4K) = 3840x2160 (exige uma placa de vídeo MUITO potente).",
        keywords: "resolução, fhd, full hd, 1080p, qhd, quad hd, 1440p, 4k, ultra hd"
    },
    { 
        term: "Taxa de Atualização (Hz)", 
        category: "Monitor", 
        subcategory: "Especificações", 
        explanation: "O número de vezes que a imagem no monitor é atualizada por segundo, medida em Hertz (Hz).",
        practical_tip: "Para jogos, 60Hz é o mínimo. 144Hz ou 165Hz é o 'ponto ideal' (sweet spot) para jogos competitivos, pois deixa a imagem muito mais fluida.",
        details: "Para rodar um jogo a 144 FPS (Frames Per Second), você precisa de um monitor de 144Hz para ver essa fluidez.",
        keywords: "taxa de atualização, refresh rate, hz, hertz, 144hz, 165hz, 240hz, 60hz"
    },
    { 
        term: "Tempo de Resposta (ms)", 
        category: "Monitor", 
        subcategory: "Especificações", 
        explanation: "O tempo que um pixel leva para mudar de uma cor para outra (geralmente de cinza para cinza - GtG), medido em milissegundos (ms).",
        practical_tip: "Procure por monitores com 1ms (GtG) para evitar 'ghosting' (rastros) em movimentos rápidos.",
        keywords: "tempo de resposta, response time, ms, gtg, mprt, ghosting"
    },
    { 
        term: "Ghosting / Motion Blur", 
        category: "Monitor", 
        subcategory: "Especificações", 
        explanation: "Um 'rastro' ou 'borrão' que aparece em objetos que se movem rápido na tela. Causado por um tempo de resposta lento dos pixels.",
        practical_tip: "Monitores com painel VA são mais suscetíveis a 'black smearing' (um tipo de ghosting em transições de preto).",
        keywords: "ghosting, motion blur, rastro, black smearing"
    },
    { 
        term: "Tipo de Painel (IPS, VA, TN)", 
        category: "Monitor", 
        subcategory: "Painel", 
        explanation: "A tecnologia do display do monitor. Cada tipo tem prós e contras.",
        practical_tip: "IPS: Melhores cores e ângulos de visão (bom para tudo). VA: Melhor contraste (pretos mais profundos), bom para jogos 'cinemáticos'. TN: Pior cor, mas historicamente era o mais rápido (hoje os IPS são tão rápidos quanto).",
        keywords: "painel, ips, in-plane switching, va, vertical alignment, tn, twisted nematic"
    },
    { 
        term: "G-Sync / FreeSync", 
        category: "Monitor", 
        subcategory: "Especificações", 
        explanation: "Tecnologias de 'Taxa de Atualização Variável' (VRR). Elas sincronizam os Hz do monitor com os FPS da placa de vídeo.",
        practical_tip: "Isto elimina o 'Screen Tearing' (imagem 'quebrada'), tornando o jogo muito mais suave, mesmo se o seu FPS variar (ex: cair de 144 para 100).",
        details: "G-Sync (NVIDIA) e FreeSync (AMD). Hoje, a maioria dos monitores FreeSync é 'G-Sync Compatible', funcionando bem com placas NVIDIA.",
        keywords: "vrr, g-sync, gsync, freesync, adaptive sync, screen tearing"
    },
    { 
        term: "Screen Tearing", 
        category: "Monitor", 
        subcategory: "Especificações", 
        explanation: "Um defeito visual onde a imagem parece 'rasgada' ou 'quebrada' ao meio, especialmente em movimentos rápidos.",
        practical_tip: "Acontece quando os FPS da sua placa de vídeo não estão sincronizados com os Hz do seu monitor. G-Sync ou FreeSync corrigem isso.",
        keywords: "screen tearing, tearing, rasgo na tela"
    },
    { 
        term: "HDR (High Dynamic Range)", 
        category: "Monitor", 
        subcategory: "Especificações", 
        explanation: "Capacidade do monitor de exibir uma gama maior de brilho e cores, resultando em brancos mais brilhantes e pretos mais escuros na mesma cena.",
        practical_tip: "O HDR 'de verdade' (bom) é caro. Muitos monitores baratos dizem ter HDR (ex: HDR10, VESA DisplayHDR 400), mas o efeito é fraco. Não use isso como fator de decisão principal em monitores de entrada.",
        keywords: "hdr, high dynamic range, displayhdr 400"
    },
    { 
        term: "Conexões (HDMI / DisplayPort)", 
        category: "Monitor", 
        subcategory: "Especificações", 
        explanation: "Os cabos usados para conectar a placa de vídeo ao monitor.",
        practical_tip: "Para taxas de atualização altas (144Hz+) em resoluções altas (1440p+), use sempre o cabo DisplayPort (DP). O HDMI (especialmente versões antigas) pode não ter banda suficiente.",
        keywords: "hdmi, displayport, dp"
    },
    { 
        term: "Tamanho (Polegadas)", 
        category: "Monitor", 
        subcategory: "Especificações", 
        explanation: "O tamanho diagonal da tela.",
        practical_tip: "Para 1080p, o ideal é 24 polegadas. Para 1440p, 27 polegadas é o 'ponto ideal'. Acima disso (ex: 32 polegadas), 4K é recomendado para manter a nitidez.",
        keywords: "polegadas, tamanho, 24, 27, 32"
    },
    
    // ===============================================
    // HEADSET
    // ===============================================
    
    { 
        term: "Headset vs Headphone", 
        category: "Headset", 
        subcategory: "Tipo", 
        explanation: "Headset = Fone de ouvido + Microfone embutido. Headphone (Fone de Ouvido) = Apenas áudio, sem microfone.",
        practical_tip: "Para jogos online, um Headset é mais prático. Para a melhor qualidade de áudio possível (música, jogos single-player), um Headphone dedicado (e um microfone de mesa separado) é superior.",
        keywords: "headset, headphone, fone de ouvido, microfone"
    },
    { 
        term: "Driver (Áudio)", 
        category: "Headset", 
        subcategory: "Componentes", 
        explanation: "O 'alto-falante' dentro do fone de ouvido que cria o som. O tamanho é medido em milímetros (mm).",
        practical_tip: "Tamanho (ex: 40mm, 50mm) não significa necessariamente 'qualidade'. A 'sintonia' (tuning) do driver é muito mais importante.",
        keywords: "driver, drivers, 50mm"
    },
    { 
        term: "Aberto vs Fechado", 
        category: "Headset", 
        subcategory: "Tipo", 
        explanation: "Define a parte de trás do 'copo' do fone. Fechado (Closed-Back): Isola o som (você não ouve fora, ninguém ouve o seu som). Aberto (Open-Back): O som 'vaza' (você ouve o ambiente, e os outros ouvem seu som).",
        practical_tip: "Fechado é melhor para ambientes barulhentos ou para não incomodar ninguém. Aberto é melhor para 'Palco Sonoro' (imersão) em ambientes silenciosos.",
        keywords: "aberto, fechado, open-back, closed-back, isolamento"
    },
    { 
        term: "Palco Sonoro (Soundstage)", 
        category: "Headset", 
        subcategory: "Especificações", 
        explanation: "A sensação de 'espaço' e direção do som. Um palco sonoro amplo faz parecer que o som vem de 'fora' da sua cabeça.",
        practical_tip: "Importante para jogos de FPS, para saber de onde vêm os passos. Fones abertos geralmente têm um palco sonoro muito maior.",
        keywords: "palco sonoro, soundstage, imagem, imaging"
    },
    { 
        term: "Som Surround (7.1)", 
        category: "Headset", 
        subcategory: "Especificações", 
        explanation: "Software que simula 7 alto-falantes e 1 subwoofer para dar uma sensação de áudio 3D.",
        practical_tip: "É quase sempre um 'truque' de software (VIRTUAL 7.1) e muitas vezes *piora* a qualidade do áudio e a precisão direcional. Um bom fone ESTÉREO é quase sempre melhor.",
        keywords: "7.1, 5.1, surround, virtual surround"
    },
    { 
        term: "Impedância (Ohms)", 
        category: "Headset", 
        subcategory: "Especificações", 
        explanation: "A 'resistência' elétrica do fone, medida em Ohms (Ω).",
        practical_tip: "Fones com baixa impedância (ex: 32 Ohms) são 'fáceis de empurrar' e tocam alto em qualquer dispositivo (PC, celular). Fones com alta impedância (ex: 250 Ohms) precisam de um 'Amplificador' (AMP) para tocar alto.",
        keywords: "impedancia, ohms, Ω, amplificador, amp"
    },
    { 
        term: "DAC / AMP", 
        category: "Headset", 
        subcategory: "Componentes", 
        explanation: "DAC (Digital-to-Analog Converter): Converte o sinal digital (do PC) em som. AMP (Amplificador): Aumenta o volume do sinal.",
        practical_tip: "A sua placa mãe já tem um DAC/AMP. Um DAC/AMP externo (dedicado) oferece um som mais limpo (sem 'chiado') e mais potência para fones de alta impedância.",
        keywords: "dac, amp, amplificador, dac/amp"
    },
    { 
        term: "Microfone Condensador vs Dinâmico", 
        category: "Headset", 
        subcategory: "Componentes", 
        explanation: "Tipos de microfone. Condensador é mais sensível e capta mais detalhes (e mais ruído de fundo). Dinâmico é menos sensível e capta mais o que está perto dele (bom para ambientes barulhentos).",
        practical_tip: "A maioria dos microfones de headset é 'condensador de eletreto'.",
        keywords: "microfone, condensador, dinamico"
    },
    { 
        term: "Cancelamento de Ruído (Mic)", 
        category: "Headset", 
        subcategory: "Especificações", 
        explanation: "Software ou hardware que filtra ruídos de fundo (ex: clique de teclado, ventoinha) da sua voz no microfone.",
        practical_tip: "Procure por microfones com 'Cardioid' (padrão de captação) e software de redução de ruído (ex: NVIDIA Broadcast, Discord Krisp).",
        keywords: "cancelamento de ruido, noise cancelling, cardioid"
    },
    { 
        term: "ANC (Active Noise Cancelling)", 
        category: "Headset", 
        subcategory: "Especificações", 
        explanation: "Cancelamento de Ruído ATIVO para os *fones de ouvido*. O fone 'ouve' o ruído externo (ex: avião, ar condicionado) e cria um som oposto para cancelá-lo.",
        practical_tip: "Comum em fones de viagem (ex: Sony, Bose), mas raro em headsets gamers, pois pode afetar a qualidade do áudio.",
        keywords: "anc, active noise cancelling, cancelamento de ruido"
    },
    
    // ===============================================
    // ACESSÓRIOS
    // ===============================================
    
    { 
        term: "Mousepad", 
        category: "Acessórios", 
        subcategory: "Mousepad", 
        explanation: "A superfície sobre a qual o mouse desliza.",
        practical_tip: "Pode ser 'Speed' (superfície lisa, rápida) ou 'Control' (superfície texturizada, com mais atrito/parada). A escolha é 100% preferência pessoal.",
        keywords: "mousepad, pad, speed, control"
    },
    { 
        term: "Mouse Bungee", 
        category: "Acessórios", 
        subcategory: "Mouse", 
        explanation: "Um suporte que segura o fio do mouse (com fio), evitando que ele prenda ou arraste na mesa.",
        practical_tip: "Faz um mouse com fio parecer 'quase' sem fio. Essencial se você usa DPI baixo e faz grandes movimentos.",
        keywords: "bungee, mouse bungee"
    },
    { 
        term: "Webcam", 
        category: "Acessórios", 
        subcategory: "Câmera", 
        explanation: "Câmera de vídeo para streaming ou videochamadas.",
        practical_tip: "Para streaming, 1080p a 60 FPS (ex: Logitech C922, Razer Kiyo Pro) é o ideal. Para reuniões, 720p ou 1080p a 30 FPS é suficiente.",
        keywords: "webcam, camera, stream"
    },
    { 
        term: "Microfone de Mesa", 
        category: "Acessórios", 
        subcategory: "Microfone", 
        explanation: "Um microfone dedicado (separado do headset) que fica na mesa ou num braço articulado.",
        practical_tip: "Oferece qualidade de áudio muito superior à de qualquer headset. Pode ser USB (mais fácil, ex: HyperX QuadCast, Blue Yeti) ou XLR (profissional, precisa de uma 'interface de áudio').",
        keywords: "microfone de mesa, usb, xlr, hyperx quadcast, blue yeti"
    },
    { 
        term: "Braço Articulado (Mic)", 
        category: "Acessórios", 
        subcategory: "Microfone", 
        explanation: "Um braço mecânico que segura o microfone, permitindo posicioná-lo perto da boca e fora do caminho.",
        practical_tip: "Essencial para microfones de mesa, pois tira o microfone da vibração da mesa e o posiciona para a melhor captação.",
        keywords: "braço, boom arm, mic arm"
    },
    
    // ===============================================
    // SOFTWARE E SERVIÇOS
    // ===============================================
    
    { 
        term: "Driver (Software)", 
        category: "Software e Serviços", 
        subcategory: "Driver", 
        explanation: "Software que 'ensina' o sistema operacional (Windows) a se comunicar corretamente com um hardware (ex: placa de vídeo, mouse).",
        practical_tip: "Mantenha o driver da sua Placa de Vídeo (NVIDIA ou AMD) sempre atualizado para garantir a melhor performance e correção de bugs em jogos novos.",
        keywords: "driver, software, nvidia, amd"
    },
    { 
        term: "Benchmark", 
        category: "Software e Serviços", 
        subcategory: "Teste", 
        explanation: "Um teste padronizado (pode ser um software ou uma cena dentro de um jogo) usado para medir e comparar a performance de um componente.",
        practical_tip: "Usado para comparar placas de vídeo (medindo os FPS) ou processadores (medindo pontuação, ex: Cinebench).",
        keywords: "benchmark, teste, fps, cinebench"
    },
    { 
        term: "FPS (Frames Per Second)", 
        category: "Software e Serviços", 
        subcategory: "Teste", 
        explanation: "Quadros Por Segundo. A medida de performance em jogos. É o número de 'fotos' (frames) que a sua placa de vídeo consegue gerar por segundo.",
        practical_tip: "30 FPS é 'jogável' (consoles antigos). 60 FPS é o ideal para fluidez. 144+ FPS é o alvo para jogos competitivos (requer um monitor de 144Hz+).",
        keywords: "fps, frames, quadros por segundo, performance"
    },
    { 
        term: "Input Lag", 
        category: "Software e Serviços", 
        subcategory: "Teste", 
        explanation: "O atraso (em milissegundos) entre você executar uma ação (ex: clicar o mouse) e a ação acontecer na tela.",
        practical_tip: "É o inimigo nº 1 em jogos. É causado por uma soma de atrasos (mouse, PC, monitor). Mouses de 1000Hz, monitores de 1ms e FPS alto ajudam a reduzir o input lag.",
        keywords: "input lag, atraso, latencia"
    },
    { 
        term: "Stuttering (Engasgo)", 
        category: "Software e Serviços", 
        subcategory: "Teste", 
        explanation: "Quando o jogo 'trava' ou 'engasga' por uma fração de segundo, mesmo que o FPS médio esteja alto. Causa uma quebra de fluidez.",
        practical_tip: "Muitas vezes causado por falta de VRAM (memória da placa de vídeo) ou por 'gargalo' de CPU.",
        keywords: "stuttering, engasgo, travada, 0.1% low"
    }
];
// ===================================================================
// ===================================================================


/**
 * Componente GlossaryPage
 * Renderiza a página do glossário técnico com filtros LÓGICOS e paginação.
 */
function GlossaryPage() {

    // --- ESTADOS ---
    const [searchTerm, setSearchTerm] = useState('');
    // AGORA USAMOS O 'ID' DA NOSSA CATEGORIA LÓGICA
    const [activeCategoryId, setActiveCategoryId] = useState('Todas'); 
    const [activeSubcategory, setActiveSubcategory] = useState('all');
    const [activeAlpha, setActiveAlpha] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1);
    const [showClearBtn, setShowClearBtn] = useState(false);

    // --- DADOS DERIVADOS (useMemo) ---

    // GERA A LISTA DE SUBCATEGORIAS
    // Esta lógica agora é mais inteligente: ela olha para a categoria lógica
    // e encontra todas as subcategorias dos dados que ela agrupa.
    const subcategories = useMemo(() => {
        // Encontra o objeto da categoria lógica ativa
        const currentLogicalCat = logicalCategories.find(c => c.id === activeCategoryId);
        
        // Se "Todas" estiver selecionado ou a categoria não for encontrada, não mostra subcategorias.
        if (!currentLogicalCat || currentLogicalCat.id === 'Todas') {
            return [];
        }

        // Pega a lista de categorias de dados (ex: ['Mouse', 'Teclado', ...])
        const dataCatsToFilter = currentLogicalCat.dataCategories;

        // Encontra todas as subcategorias únicas dos termos que pertencem a essas categorias
        const subs = new Set(
            glossaryTerms
                .filter(term => 
                    dataCatsToFilter.includes(term.category) && term.subcategory
                )
                .map(term => term.subcategory)
        );
        
        if (subs.size === 0) return []; // Não mostra nada se não houver subcategorias

        return ['all', ...subs]; // 'all' = "Todas as Subcategorias"
    }, [activeCategoryId, glossaryTerms]); // Adicionado glossaryTerms como dependência


    // --- LÓGICA DE FILTRO PRINCIPAL ---
    const filteredTerms = useMemo(() => {
        // AVISA SE OS DADOS ESTIVEREM VAZIOS (PARA DEBUG)
        if (!glossaryTerms || glossaryTerms.length === 0) {
            console.warn("Array 'glossaryTerms' está vazio! Os filtros não funcionarão.");
            return [];
        }
      
        let terms = [...glossaryTerms]; // Começa com todos

        // 1. Filtro de Busca (prioridade máxima)
        if (searchTerm) {
            const normalizedSearch = normalizeText(searchTerm);
            terms = terms.filter(item => 
                normalizeText(item.term).includes(normalizedSearch) ||
                normalizeText(item.explanation).includes(normalizedSearch) ||
                normalizeText(item.keywords).includes(normalizedSearch) ||
                normalizeText(item.practical_tip).includes(normalizedSearch)
            );
        } 
        // 2. Filtros de Categoria (só se não houver busca)
        else {
            // Encontra o objeto da categoria lógica ativa
            const currentLogicalCat = logicalCategories.find(c => c.id === activeCategoryId);

            // Filtra pelos dados da Categoria Lógica
            if (currentLogicalCat && currentLogicalCat.id !== 'Todas') {
                const dataCatsToFilter = currentLogicalCat.dataCategories;
                terms = terms.filter(item => 
                    dataCatsToFilter.includes(item.category)
                );
            }

            // Filtra pela Subcategoria (só se aplica se uma subcat estiver ativa)
            if (activeSubcategory !== 'all') {
                terms = terms.filter(item => item.subcategory === activeSubcategory);
            }

            // Filtro Alfabético
            if (activeAlpha) {
                terms = terms.filter(item => 
                    normalizeText(item.term).startsWith(normalizeText(activeAlpha))
                );
            }
        }
        
        return terms;
    }, [searchTerm, activeCategoryId, activeSubcategory, activeAlpha, glossaryTerms]); // Adicionado glossaryTerms como dependência

    // --- LÓGICA DE PAGINAÇÃO ---
    const totalPages = Math.ceil(filteredTerms.length / ITEMS_PER_PAGE);
    const paginatedTerms = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredTerms.slice(start, end);
    }, [filteredTerms, currentPage]);


    // --- HANDLERS (Funções que atualizam o estado) ---

    const handleSearchChange = (e) => {
        const newSearch = e.target.value;
        setSearchTerm(newSearch);
        setShowClearBtn(newSearch.length > 0);
        
        // Limpa os outros filtros
        setActiveCategoryId('Todas');
        setActiveSubcategory('all');
        setActiveAlpha(null);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setShowClearBtn(false);
        setCurrentPage(1);
    };

    // Clique num botão de Categoria LÓGICA
    const handleLogicalCategoryClick = (categoryId) => {
        setActiveCategoryId(categoryId);
        setActiveSubcategory('all'); // Reseta a subcategoria
        setActiveAlpha(null);
        setSearchTerm(''); // Limpa a busca
        setShowClearBtn(false);
        setCurrentPage(1);
    };

    const handleSubcategoryClick = (subcategory) => {
        setActiveSubcategory(subcategory);
        setActiveAlpha(null);
        setCurrentPage(1);
    };

    const handleAlphaClick = (letter) => {
        setActiveAlpha(activeAlpha === letter ? null : letter);
        setSearchTerm('');
        setShowClearBtn(false);
        if (activeCategoryId === 'Todas') {
             setActiveCategoryId('Todas');
        }
        setActiveSubcategory('all');
        setCurrentPage(1);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    // --- RENDERIZAÇÃO (O JSX) ---
    return (
        <>
            {/* --- Cabeçalho do Glossário --- */}
            <div className="glossary-header">
                <h1><i className="fas fa-book-open"></i> Glossário Técnico</h1>
                <p>Entenda os termos do universo gamer de forma simples e clara.</p>
            </div>

            {/* --- Controles de Filtro --- */}
            <div className="glossary-controls">
                
                {/* Barra de Busca (Controlada pelo React) */}
                <div className="search-bar-container">
                    <i className="fas fa-search search-icon"></i>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Busque por termos, componentes ou especificações..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button 
                        className="clear-search-btn" 
                        style={{ display: showClearBtn ? 'flex' : 'none' }}
                        onClick={handleClearSearch}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                {/* === FILTROS DE CATEGORIA LÓGICA (O NOVO JSX) === */}
                <div className="category-filters">
                    {logicalCategories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`category-filter-btn ${activeCategoryId === cat.id ? 'active' : ''}`}
                            onClick={() => handleLogicalCategoryClick(cat.id)}
                        >
                            <i className={cat.icon}></i> {cat.label}
                        </button>
                    ))}
                </div>
                
                {/* === FILTROS DE SUBCATEGORIA (LÓGICA ATUALIZADA) === */}
                {/* Só aparecem se uma Categoria (que não "Todas") estiver ativa */}
                {activeCategoryId !== 'Todas' && subcategories.length > 1 && (
                    <div className="category-filters sub-filters">
                        {subcategories.map(subCat => (
                            <button 
                                key={subCat}
                                className={`category-filter-btn ${activeSubcategory === subCat ? 'active' : ''}`}
                                onClick={() => handleSubcategoryClick(subCat)}
                            >
                                {subCat === 'all' ? 'Todas as Subcategorias' : subCat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Índice Alfabético (Renderizado via .map) */}
                {!searchTerm && (
                    <nav className="alpha-index">
                        {ALPHABET.map(letter => (
                            <a
                                key={letter}
                                className={activeAlpha === letter ? 'active' : ''}
                                onClick={() => handleAlphaClick(letter)}
                            >
                                {letter}
                            </a>
                        ))}
                    </nav>
                )}
            </div>

            {/* --- Lista de Termos (Renderizada via .map) --- */}
            <div className="terms-container">
                {/* AVISO: Se 'glossaryTerms' estiver vazio, isto mostra "Nenhum termo" */}
                {paginatedTerms.length > 0 ? (
                    paginatedTerms.map(term => (
                        <TermCard key={term.term} termData={term} />
                    ))
                ) : (
                    <div className="no-results">
                        <h3>Nenhum termo encontrado</h3>
                        <p>Tente alargar os seus filtros ou rever o termo de busca.</p>
                    </div>
                )}
            </div>

            {/* --- Paginação (Renderização Condicional) --- */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="page-btn"
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &laquo;
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button 
                                key={pageNum}
                                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                onClick={() => handlePageClick(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button 
                        className="page-btn"
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &raquo;
                    </button>
                </div>
            )}
        </>
    );
}

export default GlossaryPage;