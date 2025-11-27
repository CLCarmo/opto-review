const scrapeKabum = require("./kabumScraper");
const scrapePichau = require("./pichauScraper");
const scrapeTerabyte = require("./terabyteScraper");

module.exports = async function scrape(url) {
  if (!url) return { status: "erro", preco: null };

  if (url.includes("kabum.com.br")) {
    return await scrapeKabum(url);
  }
  if (url.includes("pichau.com.br")) {
    return await scrapePichau(url);
  }
  if (url.includes("terabyteshop.com.br")) {
    return await scrapeTerabyte(url);
  }

  return { status: "erro", preco: null };
};