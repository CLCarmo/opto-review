const axios = require("axios");
const cheerio = require("cheerio");

const CONFIG = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Upgrade-Insecure-Requests": "1"
  },
  timeout: 15000,
};

const parsePrice = (text) => {
  if (!text) return null;
  let clean = text.replace(/[^\d,]/g, "");
  if (!clean.includes(",")) return null;
  return parseFloat(clean.replace(",", "."));
};

module.exports = async function scrapePichau(url) {
  console.log("🟢 [Pichau] Iniciando...");
  try {
    const { data } = await axios.get(url, CONFIG);
    const $ = cheerio.load(data);

    let found = "";

    // Estratégia de busca textual (mais robusta contra mudanças de classe)
    $("div, span, h1, h2, h3, h4, p").each((i, el) => {
      const t = $(el).text().trim();
      // Procura texto curto que tenha R$ e vírgula
      if (t.includes("R$") && t.includes(",") && t.length < 20 && !found) {
        // Evita pegar parcelas "10x de..."
        if (!/^\d+x/.test(t)) {
          found = t;
        }
      }
    });

    if (!found) {
      console.log("❌ [Pichau] Preço não encontrado.");
      return { status: "indisponivel", preco: null };
    }

    const parsed = parsePrice(found);
    if (!parsed) return { status: "erro", preco: null };

    console.log(`✅ [Pichau] Preço encontrado: R$ ${parsed}`);
    return { status: "ok", preco: parsed };

  } catch (err) {
    console.error(`⚠️ [Pichau] Erro: ${err.message}`);
    return { status: "erro", preco: null };
  }
};