import React from 'react';
// 1. Importa o Link para usarmos nos cartões de features
import { Link } from 'react-router-dom';

// 2. Importa o CSS que acabámos de criar.
// O React (via Webpack) vai garantir que este CSS é carregado
// juntamente com este componente.
import './HomePage.css'; 

/**
 * Componente HomePage
 * Renderiza o conteúdo principal da página inicial.
 *
 * Nota: Não usamos a tag <main> aqui dentro.
 * Porquê? Porque o nosso componente <Layout /> (que criámos antes)
 * já tem uma tag <main> que "envolve" o <Outlet />.
 * Este componente (HomePage) é renderizado DENTRO do <Outlet />,
 * por isso começamos direto com as <section>.
 */
function HomePage() {
  return (
    // Usamos um Fragment (<>...</>) para agrupar as secções
    // sem adicionar uma <div> extra no HTML final.
    <>
      {/* --- Secção Hero --- */}
      {/* Baseado na secção 'hero' do index.html */}
      <section className="hero">
        <div className="hero-banner"></div>
        <div className="hero-content">
          <h1 className="hero-title">Sua fonte confiável para o setup perfeito.</h1>
          <p className="hero-subtitle">Chega de dúvidas. Ajudamos você a escolher os melhores periféricos gamers com base em dados técnicos reais e comparações imparciais.</p>
          
          {/* Este é um link de âncora (mesma página), por isso
            mantemos a tag <a> normal. Está correto! */}
          <a href="#features" className="cta-button">Começar Agora</a>
        </div>
      </section>

      {/* --- Secção Features --- */}
      {/* Baseado na secção 'features' */}
      <section id="features" className="features">
        <h2 className="section-title">Encontre o que você precisa</h2>
        <div className="feature-cards-container">
          <div className="features-row">
            
            {/* Links convertidos de <a> para <Link> */}
            <Link to="/produtos" className="feature-card">
              <i className="fas fa-magnifying-glass feature-icon"></i>
              <h3>Buscar Produto</h3>
              <p>Já sabe o que quer? Encontre análises e especificações de produtos específicos.</p>
            </Link>
            <Link to="/compare" className="feature-card">
              <i className="fas fa-balance-scale feature-icon"></i>
              <h3>Comparar Produtos</h3>
              <p>Compare especificações técnicas e preços lado a lado para uma decisão informada.</p>
            </Link>
            <Link to="/upgrade" className="feature-card">
              <i className="fas fa-arrow-up-right-dots feature-icon"></i>
              <h3>Fazer um Upgrade</h3>
              <p>Diga-nos suas peças atuais e encontre o melhor componente para sua performance.</p>
            </Link>
          </div>
          <div className="features-row two-items">
            <Link to="/upgrade" className="feature-card">
              <i className="fas fa-desktop feature-icon"></i>
              <h3>Montar PC do Zero</h3>
              <p>Responda nosso questionário e receba uma build completa para o seu orçamento.</p>
            </Link>
            <Link to="/about" className="feature-card">
              <i className="fas fa-info-circle feature-icon"></i>
              <h3>Sobre Nós</h3>
              <p>Conheça nossa missão, nossos valores e a equipe por trás do OPTO Review.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Secção How It Works --- */}
      {/* Baseado na secção 'how-it-works' */}
      <section className="how-it-works">
        <h2 className="section-title">
          Nosso sistema de recomendação transparente para 
          {/* O 'style' em React é escrito como um objeto JavaScript.
            Repara nos {{ ... }} duplos.
          */}
          <span style={{ color: 'var(--primary-color)' }}> Upgrade</span> e 
          <span style={{ color: 'var(--primary-color)' }}> Criar Setup</span>
        </h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon-wrapper"><i className="fas fa-list-check step-icon"></i><span className="step-number">1</span></div>
            <h3>Responda o Questionário</h3>
            <p>Você nos informa seu orçamento, jogos preferidos e seu objetivo principal.</p>
          </div>
          <div className="step-arrow"><i className="fas fa-arrow-right"></i></div>
          <div className="step">
            <div className="step-icon-wrapper"><i className="fas fa-robot step-icon"></i><span className="step-number">2</span></div>
            <h3>Analisamos os Dados</h3>
            <p>Nosso sistema cruza suas respostas com nossa base de dados e benchmarks.</p>
          </div>
          <div className="step-arrow"><i className="fas fa-arrow-right"></i></div>
          <div className="step">
            <div className="step-icon-wrapper"><i className="fas fa-gift step-icon"></i><span className="step-number">3</span></div>
            <h3>Receba a Recomendação</h3>
            <p>Apresentamos a melhor combinação de componentes, explicando cada escolha.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;