const axios = require("axios");
const cheerio = require("cheerio");

const CONFIG = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
  },
  timeout: 15000,
};

const parsePrice = (text) => {
  if (!text) return null;
  let clean = text.replace(/[^\d,]/g, "");
  if (!clean.includes(",")) return null;
  return parseFloat(clean.replace(",", "."));
};

module.exports = async function scrapeTerabyte(url) {
  console.log("🟠 [Terabyte] Iniciando...");
  try {
    const { data } = await axios.get(url, CONFIG);
    const $ = cheerio.load(data);

    // Terabyte usa IDs bem definidos
    let price = $("#valVista").text().trim();
    if (!price) price = $("p#valVista").text().trim();
    if (!price) price = $(".p-price span").first().text().trim();

    if (!price) {
      console.log("❌ [Terabyte] Preço não encontrado.");
      return { status: "indisponivel", preco: null };
    }

    const parsed = parsePrice(price);
    if (!parsed) return { status: "erro", preco: null };

    console.log(`✅ [Terabyte] Preço encontrado: R$ ${parsed}`);
    return { status: "ok", preco: parsed };

  } catch (err) {
    console.error(`⚠️ [Terabyte] Erro: ${err.message}`);
    return { status: "erro", preco: null };
  }
};