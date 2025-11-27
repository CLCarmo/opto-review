const axios = require("axios");
const cheerio = require("cheerio");

const CONFIG = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1"
  },
  timeout: 15000,
};

const parsePrice = (text) => {
  if (!text) return null;
  let clean = text.replace(/[^\d,]/g, "");
  if (!clean.includes(",")) return null;
  return parseFloat(clean.replace(",", "."));
};

module.exports = async function scrapeKabum(url) {
  console.log("🔵 [Kabum] Iniciando...");
  try {
    const { data } = await axios.get(url, CONFIG);
    const $ = cheerio.load(data);

    let price = $("h4.finalPrice").text().trim();
    if (!price) price = $(".finalPrice").first().text().trim();
    if (!price) price = $("#blocoValores .price").first().text().trim();

    if (!price) {
      console.log("❌ [Kabum] Preço não encontrado no HTML.");
      return { status: "indisponivel", preco: null };
    }

    const parsed = parsePrice(price);
    if (!parsed) {
      return { status: "erro", preco: null };
    }

    console.log(`✅ [Kabum] Preço encontrado: R$ ${parsed}`);
    return { status: "ok", preco: parsed };
    
  } catch (err) {
    console.error(`⚠️ [Kabum] Erro: ${err.message}`);
    return { status: "erro", preco: null };
  }
};