// backend/seed_products.js
const fs = require('fs');
const path = require('path');
const db = require('./db'); // O seu arquivo de conexão existente

async function seed() {
  try {
    console.log("🔥 Iniciando a importação dos produtos...");

    // 1. Ler o arquivo TXT/JSON
    // Certifique-se que o nome do arquivo está EXATO aqui
    const filePath = path.join(__dirname, 'Converter em sql para subirmos no Bd.txt');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const productsMap = JSON.parse(rawData);

    console.log("📂 Arquivo lido com sucesso!");

    // 2. Limpar o Banco de Dados (Apaga produtos, preços e specs antigos)
    console.log("🧹 Limpando banco de dados antigo...");
    await db.query("TRUNCATE TABLE produtos, precos, specs_tecnicas, itens_recomendacao, usuario_favoritos RESTART IDENTITY CASCADE;");

    // 3. Iterar e Inserir
    for (const [categoriaNome, items] of Object.entries(productsMap)) {
      console.log(`📦 Processando categoria: ${categoriaNome} (${items.length} itens)`);

      // 3.1 Garantir que a Categoria existe
      // Tenta inserir, se já existir não faz nada
      await db.query("INSERT INTO categorias (nome) VALUES ($1) ON CONFLICT (nome) DO NOTHING", [categoriaNome]);
      
      // Pega o ID da categoria
      const catRes = await db.query("SELECT id_categoria FROM categorias WHERE nome = $1", [categoriaNome]);
      const idCategoria = catRes.rows[0].id_categoria;

      // 3.2 Inserir Produtos
      for (const item of items) {
        // Limpeza do Preço (R$ 1.200,50 -> 1200.50)
        let price = 0;
        if (item.preco) {
            price = parseFloat(item.preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        }

        // Tenta extrair Fabricante do nome (Ex: "Mouse Redragon..." -> Redragon)
        // Isso é opcional, mas ajuda nos filtros
        let fabricanteNome = 'Genérico';
        const marcasComuns = ['Logitech', 'Razer', 'Redragon', 'HyperX', 'Corsair', 'SteelSeries', 'Asus', 'Dell', 'Samsung', 'LG', 'AOC', 'Gigabyte', 'MSI', 'Intel', 'AMD', 'NVIDIA', 'Husky', 'SuperFrame', 'Ninja', 'Gamemax'];
        
        for (const marca of marcasComuns) {
            if (item.nome.toLowerCase().includes(marca.toLowerCase())) {
                fabricanteNome = marca;
                break;
            }
        }

        // Insere/Busca Fabricante
        await db.query("INSERT INTO fabricantes (nome) VALUES ($1) ON CONFLICT (nome) DO NOTHING", [fabricanteNome]);
        const fabRes = await db.query("SELECT id_fabricante FROM fabricantes WHERE nome = $1", [fabricanteNome]);
        const idFabricante = fabRes.rows[0].id_fabricante;

        // Inserir Produto
        const prodQuery = `
          INSERT INTO produtos (nome, id_categoria, id_fabricante, imagem_url, price_low, especificacoes)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id_produto
        `;
        
        // Se 'especificacoes' for um array vazio no JSON, salvamos como '{}' para não dar erro
        const specsJson = item.especificacoes && item.especificacoes.length > 0 ? JSON.stringify(item.especificacoes) : '{}';

        const prodRes = await db.query(prodQuery, [
            item.nome, 
            idCategoria, 
            idFabricante, 
            item.imagem, 
            price,
            specsJson
        ]);
        
        const idProduto = prodRes.rows[0].id_produto;

        // 3.3 Inserir Preço (Tabela de Preços)
        // Como o link é da Terabyte, vamos fixar a loja
        await db.query(
            `INSERT INTO precos (id_produto, nome_loja, preco, url_produto)
             VALUES ($1, 'Terabyte', $2, $3)`,
            [idProduto, price, item.link]
        );
      }
    }

    console.log("✅ Importação concluída com sucesso! Banco atualizado.");
    process.exit(0);

  } catch (err) {
    console.error("❌ Erro fatal na importação:", err);
    process.exit(1);
  }
}

seed();