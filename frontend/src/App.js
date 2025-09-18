// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // O useState cria um "estado" para guardar nossa lista de produtos.
  // Começa como um array vazio [].
  const [produtos, setProdutos] = useState([]);

  // O useEffect executa o código dentro dele uma vez,
  // assim que o componente App é montado na tela.
  useEffect(() => {
    // A função fetch busca os dados da URL da nossa API no backend.
    fetch('http://localhost:8080/api/produtos')
      .then(response => response.json()) // Converte a resposta para o formato JSON
      .then(data => {
        console.log('Dados recebidos do backend:', data); // Mostra os dados no console do navegador
        setProdutos(data); // Atualiza o estado 'produtos' com os dados recebidos
      })
      .catch(error => console.error('Erro ao buscar dados:', error)); // Captura qualquer erro
  }, []); // O [] no final garante que isso rode apenas uma vez.

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plataforma OPTO Review</h1>
        <p>Produtos encontrados:</p>
      </header>
      <main className="product-container">
        {/* Usamos o .map() para criar um card para cada produto na nossa lista */}
        {produtos.map(produto => (
          <div key={produto.id} className="product-card">
            <div className="product-info">
              <h2>{produto.nome}</h2>
              <p>Marca: {produto.marca}</p>
              <p>Preço Médio: R$ {produto.preco_medio}</p>
              <ul>
                <li>Sensor: {produto.especificacoes.Sensor}</li>
                <li>Peso: {produto.especificacoes.Peso}</li>
              </ul>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;