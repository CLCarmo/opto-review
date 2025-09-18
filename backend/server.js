// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080; 

app.use(cors());
app.use(express.json());

const mockProdutos = [
  {
    id: 1,
    nome: 'Logitech G Pro X Superlight',
    marca: 'Logitech',
    categoria: 'mouse',
    preco_medio: 699.90,
    especificacoes: { 'Sensor': 'HERO 25K', 'Peso': '63g' }
  },
  {
    id: 2,
    nome: 'Razer DeathAdder V2',
    marca: 'Razer',
    categoria: 'mouse',
    preco_medio: 299.90,
    especificacoes: { 'Sensor': 'Focus+', 'Peso': '82g' }
  }
];

// ROTA RAIZ (PÁGINA INICIAL DE TESTE)
app.get('/', (req, res) => {
  res.send('<h1>🚀 Servidor do OPTO Review está no ar!</h1><p>Para ver os dados dos produtos, acesse <a href="/api/produtos">/api/produtos</a>.</p>');
});

// Rota principal da API que retorna a lista de produtos
app.get('/api/produtos', (req, res) => {
  res.json(mockProdutos);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend do OPTO Review está no ar em http://localhost:${PORT}`);
});