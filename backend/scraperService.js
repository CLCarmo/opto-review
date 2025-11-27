const scrape = require('./scrapers'); // Importa o index.js da pasta scrapers

module.exports = {
  async getPrice(url) {
    if (!url) return null;

    // Delay aleatório para parecer humano (entre 0.8s e 2s)
    // A sintaxe anterior estava quebrada ((r) = ...), aqui está a corrigida:
    const delay = Math.floor(Math.random() * 1200) + 800;
    await new Promise((r) => setTimeout(r, delay));

    try {
        const result = await scrape(url);

        // Só retorna o preço se o status for explicitamente 'ok' (com aspas!)
        if (result && result.status === 'ok') {
            return result.preco;
        }
        return null;

    } catch (error) {
        console.error(`Erro fatal no serviço de scrape: ${error.message}`);
        return null;
    }
  },
};