import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './HomePage.css';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/produtos`);
        const data = await response.json();
        setFeaturedProducts(data.slice(0, 4)); 
      } catch (error) {
        console.error("Erro ao carregar destaques:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page-wrapper">
      
      {/* 1. HERO BANNER (O Seu Texto Original + Visual Novo) */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Encontre o Hardware Ideal pelo Melhor Preço</h1>
          <p>Análise imparcial, comparação técnica e recomendação inteligente para o seu setup gamer.</p>
          <div className="hero-buttons">
            <Link to="/upgrade" className="cta-button primary">
              <i className="fas fa-magic"></i> Criar Setup
            </Link>
            <Link to="/produtos" className="cta-button secondary">
              <i className="fas fa-search"></i> Buscar Peças
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SECÇÃO DE FERRAMENTAS (O Coração do Projeto) */}
      <section className="tools-section">
        
        {/* A frase que você gosta, usada como âncora visual */}
        <div className="section-header-center">
            <h2>Nosso sistema de recomendação transparente</h2>
            <p>Escolha como quer começar a sua jornada.</p>
        </div>
        
        <div className="tools-grid">
            
            {/* CARD 1: Montar PC (Destaque) */}
            <Link to="/upgrade" className="tool-card highlight">
                <div className="icon-wrapper green">
                    <i className="fas fa-tools"></i>
                </div>
                <div className="tool-info">
                    <h3>Montar PC do Zero</h3>
                    <p>Responda nosso questionário e receba uma build completa para o seu orçamento.</p>
                </div>
                <i className="fas fa-chevron-right arrow-icon"></i>
            </Link>

            {/* CARD 2: Upgrade (Destaque) */}
            <Link to="/upgrade" className="tool-card highlight">
                <div className="icon-wrapper blue">
                    <i className="fas fa-level-up-alt"></i>
                </div>
                <div className="tool-info">
                    <h3>Fazer um Upgrade</h3>
                    <p>Diga-nos suas peças atuais e encontre o melhor componente para sua performance.</p>
                </div>
                <i className="fas fa-chevron-right arrow-icon"></i>
            </Link>

            {/* CARD 3: Buscar */}
            <Link to="/produtos" className="tool-card">
                <div className="icon-wrapper gray">
                    <i className="fas fa-search"></i>
                </div>
                <div className="tool-info">
                    <h3>Buscar Produto</h3>
                    <p>Já sabe o que quer? Encontre análises e especificações.</p>
                </div>
            </Link>

            {/* CARD 4: Comparar */}
            <Link to="/compare" className="tool-card">
                <div className="icon-wrapper gray">
                    <i className="fas fa-columns"></i>
                </div>
                <div className="tool-info">
                    <h3>Comparar Produtos</h3>
                    <p>Compare especificações técnicas e preços lado a lado.</p>
                </div>
            </Link>

            {/* CARD 5: Favoritos */}
            <Link to="/favoritos" className="tool-card">
                <div className="icon-wrapper red">
                    <i className="fas fa-heart"></i>
                </div>
                <div className="tool-info">
                    <h3>Favoritos</h3>
                    <p>Acesse sua lista de desejos e produtos salvos.</p>
                </div>
            </Link>

        </div>
      </section>

      {/* 3. DESTAQUES DA SEMANA */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Destaques da Semana</h2>
          <Link to="/produtos" className="view-all-link">Ver tudo <i className="fas fa-arrow-right"></i></Link>
        </div>

        {loading ? (
          <div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Carregando...</div>
        ) : (
          <div className="featured-grid">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id_produto} 
                product={{
                    ...product,
                    id: product.id_produto,
                    price_low: parseFloat(product.price_low)
                }} 
                selectedProducts={[]} 
                isLocked={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;