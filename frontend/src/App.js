// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]); // Novo estado para as categorias

  // useEffect para buscar os produtos
  useEffect(() => {
    fetch('http://localhost:8080/api/produtos')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  // Novo useEffect para buscar as categorias
  useEffect(() => {
    fetch('http://localhost:8080/api/categorias')
      .then(response => response.json())
      .then(data => setCategorias(data))
      .catch(error => console.error('Erro ao buscar categorias:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plataforma OPTO Review</h1>
      </header>
      <main className="main-container">
        {/* Coluna das Categorias (Futuro Filtro) */}
        <aside className="sidebar">
          <h2>Categorias</h2>
          <ul>
            {categorias.map(categoria => (
              <li key={categoria.id_categoria}>
                {categoria.nome}
              </li>
            ))}
          </ul>
        </aside>

        {/* Coluna dos Produtos */}
        <section className="product-container">
          <h2>Produtos</h2>
          {produtos.map(produto => (
            <div key={produto.id_produto} className="product-card">
              <div className="product-info">
                <h3>{produto.nome}</h3>
                <p>Fabricante: {produto.fabricante}</p>
                <p>Modelo: {produto.modelo}</p>
                
                {produto.especificacoes && (
                  <ul>
                    <li>Sensor: {produto.especificacoes.sensor}</li>
                    <li>Peso: {produto.especificacoes.peso_g} g</li>
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;