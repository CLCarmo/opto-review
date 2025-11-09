import React from 'react';
// 1. Importa o Link para os botões "Buscar Produtos" e "Fazer Upgrade"
import { Link } from 'react-router-dom';

// 2. Importa o CSS que acabámos de criar
import './AboutPage.css';

/**
 * Componente AboutPage
 * Renderiza o conteúdo da página "Sobre Nós".
 *
 * Como o nosso <Layout.js> já tem a tag <main>,
 * começamos direto com as <section>.
 */
function AboutPage() {
  return (
    // Usamos um Fragment (<>...</>) para agrupar as secções
    <>
      {/* --- Secção Hero --- */}
      {/* Baseado no 'about.html' */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">Nossa missão é simples: trazer clareza.</h1>
          <p className="hero-subtitle">
            O mundo do hardware gamer é confuso. Estamos aqui para 
            descomplicar e ajudar você a tomar a melhor decisão 
            com base em dados, não em hype.
          </p>
        </div>
        
        {/* Este div está no teu HTML. O teu about.css 
          tem uma regra comentada para uma imagem de fundo aqui. 
          Quando quiseres, podes descomentar no 'AboutPage.css' 
          e adicionar a imagem em 'src/assets/images/'.
        */}
        <div className="hero-image"></div>
      </section>

      {/* --- Secção Nossa História --- */}
      <section className="about-story page-container-narrow">
        <h2 className="section-title">Nossa História</h2>
        <div className="story-content">
          <div className="story-text">
            <h3>De Gamers para Gamers</h3>
            <p>
              O OPTO Review nasceu da frustração de seus fundadores. 
              Cansados de análises patrocinadas e benchmarks que não 
              refletiam o uso real, decidimos criar a plataforma que 
              sempre quisemos usar: imparcial, técnica e focada no 
              custo-benefício real para o jogador.
            </p>
            <h3>Como Funciona</h3>
            <p>
              Nossa equipe analisa centenas de especificações e 
              benchmarks de fontes confiáveis. Cruzamos esses dados com 
              o seu perfil (jogos, orçamento, peças atuais) para 
              fornecer uma recomendação personalizada, explicando o 
              "porquê" de cada escolha.
            </p>
          </div>
          <div className="story-stats">
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Produtos na Base</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Benchmarks Analisados</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Foco no Usuário</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Secção Nossos Valores --- */}
      <section className="about-values">
        <h2 className="section-title">Nossos Valores</h2>
        <div className="values-grid">
          <div className="value-card">
            <i className="fas fa-bullseye value-icon"></i>
            <h3>Transparência Total</h3>
            <p>
              Nunca aceitamos patrocínio para recomendar um produto. 
              Nossas recomendações são baseadas puramente em dados 
              e performance.
            </p>
          </div>
          <div className="value-card">
            <i className="fas fa-database value-icon"></i>
            <h3>Decisões via Dados</h3>
            <p>
              Achismos não têm lugar aqui. Usamos benchmarks, 
              especificações e testes reais para fundamentar cada 
              análise e sugestão.
            </p>
          </div>
          <div className="value-card">
            <i className="fas fa-users value-icon"></i>
            <h3>Foco na Comunidade</h3>
            <p>
              Ouvimos o feedback dos nossos usuários para 
              constantemente melhorar nossos algoritmos e 
              a experiência na plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* --- Secção Fale Conosco --- */}
      {/* Baseado no 'about.html' */}
      <section className="about-contact page-container-narrow">
        <h2 className="section-title">Fale Conosco</h2>
        <div className="contact-container">
          <div className="contact-info">
            <h3>Queremos seu feedback!</h3>
            <p>
              Encontrou um erro? Tem uma sugestão? Nosso sistema 
              de recomendação é complexo e estamos sempre abertos 
              para ouvir nossa comunidade.
            </p>
            <div className="contact-methods">
              <div className="contact-method">
                <i className="fas fa-envelope"></i>
                <span>contato@optoreview.com.br</span>
              </div>
              <div className="contact-method">
                <i className="fab fa-discord"></i>
                <span>Discord: OPTO Review</span>
              </div>
              <div className="contact-method">
                <i className="fab fa-twitter"></i>
                <span>@OPTOReview</span>
              </div>
            </div>
          </div>
          <div className="contact-cta">
            <h3>Pronto para começar?</h3>
            <p>Explore nossa plataforma e encontre o setup perfeito para você.</p>
            
            {/* 3. Links convertidos para <Link> */}
            <Link to="/produtos" className="cta-button">Buscar Produtos</Link>
            <Link to="/upgrade" className="cta-button secondary">Fazer Upgrade</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;