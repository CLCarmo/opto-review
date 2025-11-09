import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

// 1. IMPORTA O CSS CORRETO (product-detail.css)
import './ProductDetailPage.css';

// 2. BASE DE DADOS (Copiada do teu product-detail.js.txt)
const products = [
    { 
        id: 1, 
        name: 'G Pro X Superlight', 
        brand: 'logitech', 
        category: 'mouse', 
        category_label: 'Mouse',
        price_avg: 750, 
        price_low: 650, 
        main_image: 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-white-gallery-1.png?v=1',
        gallery: [
            'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-white-gallery-1.png?v=1',
            'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-white-gallery-2.png?v=1',
            'https.resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-white-gallery-3.png?v=1'
        ],
        summary: 'Mouse sem fio ultra-leve com sensor HERO 25K, ideal para jogos competitivos e uso profissional.',
        specs: {
            'Peso': '63g',
            'Sensor': 'HERO 25K',
            'DPI': '25.600',
            'Polling Rate': '1000Hz',
            'Bateria': '70 horas',
            'Conectividade': 'Micro-USB', // Corrigido
            'Dimensões': '125 x 63.5 x 40mm'
        },
        pros: [
            'Peso extremamente leve para melhor agilidade',
            'Sensor HERO 25K de alta precisão',
            'Ótima duração de bateria'
        ],
        cons: [
            'Preço elevado',
            'Conector Micro-USB (em vez de USB-C)',
            'Switches podem desenvolver clique duplo'
        ],
        overall_rating: 4.5,
        rating_breakdown: {
            'Performance': 5,
            'Construção': 4,
            'Recursos': 4,
            'Custo-Benefício': 3.5
        },
        recommendation: 'É a escolha ideal para jogadores de FPS que procuram a vantagem mais leve e rápida possível, desde que o orçamento permita e o formato simétrico seja confortável para sua pegada.'
    },
    // ... (Aqui entrariam os outros produtos do teu product-detail.js.txt)
];

// 3. FUNÇÃO DAS ESTRELAS (O que faltava!)
// Esta é a lógica do 'renderRating()' do teu JS original, convertida para React.
function RenderRatingStars({ rating }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<i className="fas fa-star" key={`full-${i}`}></i>);
  }
  if (halfStar) {
    stars.push(<i className="fas fa-star-half-alt" key="half"></i>);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<i className="far fa-star" key={`empty-${i}`}></i>);
  }
  return <div className="rating-stars">{stars}</div>;
}


/**
 * Componente ProductDetailPage
 * Versão Fiel ao Original
 */
function ProductDetailPage() {

  // --- ESTADOS (Lógica do product-detail.js.txt) ---
  const { produtoId } = useParams(); 
  const [activeTab, setActiveTab] = useState('analysis'); 
  const [mainImage, setMainImage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  // --- LÓGICA DE DADOS ---
  const product = useMemo(() => {
    return products.find(p => p.id === +produtoId);
  }, [produtoId]);

  useEffect(() => {
    if (product) {
      setMainImage(product.main_image);
      setActiveTab('analysis'); // Reseta a aba ao mudar de produto
    }
  }, [product]); // Corre sempre que o 'product' mudar

  
  // --- HANDLERS (Funções) ---
  const openImageModal = () => {
    // Esta lógica é do teu product-detail.js.txt
    if (window.innerWidth > 768) { // Só abre o modal em desktop
        setShowImageModal(true);
    }
  };
  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // --- RENDERIZAÇÃO (JSX 100% FIEL AO TEU HTML) ---
  if (!product) {
    return (
      <div className="product-detail">
        <h1>Produto não encontrado!</h1>
        <p>O ID {produtoId} não corresponde a nenhum produto.</p>
        <Link to="/produtos">Voltar para a lista</Link>
      </div>
    );
  }
  
  return (
    <>
      {/* --- Breadcrumb (do product-detail.html.txt) --- */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <i className="fas fa-chevron-right"></i>
        <Link to="/produtos">Produtos</Link>
        <i className="fas fa-chevron-right"></i>
        <span>{product.name}</span>
      </nav>

      {/* --- Layout Principal (do product-detail.html.txt) --- */}
      <section className="product-detail">
        
        {/* --- LADO ESQUERDO: GALERIA DE IMAGENS --- */}
        <div className="product-gallery">
          <div className="main-image-container">
            <img 
              src={mainImage} 
              alt={product.name} 
              id="main-product-image" 
              onClick={openImageModal} // Lógica do modal
            />
          </div>
          <div className="thumbnail-container">
            {product.gallery.map((imgSrc, index) => (
              <img 
                key={index}
                src={imgSrc} 
                alt={`Thumbnail ${index + 1}`} 
                className={`thumbnail ${mainImage === imgSrc ? 'active' : ''}`}
                onClick={() => setMainImage(imgSrc)} 
              />
            ))}
          </div>
        </div>

        {/* --- LADO DIREITO: INFORMAÇÕES DO PRODUTO --- */}
        <div className="product-info">
          <span className="product-category-tag">{product.category_label}</span>
          <h1 className="product-title">{product.name}</h1>
          
          {/* AQUI ESTÃO AS ESTRELAS QUE FALTAVAM! */}
          <div className="product-rating">
            <span className="rating-score">{product.overall_rating.toFixed(1)}</span>
            <RenderRatingStars rating={product.overall_rating} />
            <span className="rating-text">Avaliação Geral</span>
          </div>

          <p className="product-summary">{product.summary}</p>
          
          <div className="product-price-box">
            <span className="price-label">A partir de</span>
            <span className="price-value">R$ {product.price_low.toLocaleString('pt-BR')}</span>
          </div>
          
          {/* AQUI ESTÃO OS BOTÕES QUE FALTAVAM! */}
          <div className="product-actions-detail">
            <button className="cta-button primary">
              <i className="fas fa-shopping-cart"></i> Ver Ofertas
            </button>
            <button className="cta-button secondary">
              <i className="fas fa-plus"></i> Adicionar ao Comparador
            </button>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DE ABAS (TABS) --- */}
      <section className="product-tabs">
        {/* 1. Navegação das Abas (controlada pelo state 'activeTab') */}
        <nav className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            Análise e Recomendação
          </button>
          <button 
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Especificações Técnicas
          </button>
          <button 
            className={`tab-btn ${activeTab === 'alternatives' ? 'active' : ''}`}
            onClick={() => setActiveTab('alternatives')}
          >
            Alternativas
          </button>
        </nav>

        {/* 2. Conteúdo das Abas (Renderização Condicional) */}
        <div className="tab-content">
          
          {/* Aba de Análise */}
          {activeTab === 'analysis' && (
            <div className="tab-panel active" id="analysis">
              <div className="rating-breakdown">
                {/* Esquerda: Gráfico de Pontuação */}
                <div className="rating-chart-container">
                  <h4>Pontuação Detalhada</h4>
                  {Object.entries(product.rating_breakdown).map(([key, value]) => (
                    <div className="rating-bar" key={key}>
                      <span className="bar-label">{key}</span>
                      <div className="bar-bg">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${(value / 5) * 100}%` }}
                          data-score={value.toFixed(1)}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Direita: Prós e Contras */}
                <div className="pros-cons-container">
                  <div className="pros-cons-box">
                    <h4><i className="fas fa-check"></i> Prós</h4>
                    <ul className="pros-list">
                      {product.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                    </ul>
                  </div>
                  <div className="pros-cons-box">
                    <h4><i className="fas fa-times"></i> Contras</h4>
                    <ul className="cons-list">
                      {product.cons.map((con, i) => <li key={i}>{con}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="analysis-section">
                <h4>Recomendação</h4>
                <p>{product.recommendation}</p>
              </div>
            </div>
          )}

          {/* Aba de Especificações */}
          {activeTab === 'specs' && (
            <div className="tab-panel active" id="specs">
              <h3>Especificações Completas</h3>
              <ul className="specs-grid">
                {Object.entries(product.specs).map(([key, value]) => (
                  <li className="spec-item-detail" key={key}>
                    <span className="spec-key">{key}</span>
                    <span className="spec-value">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Aba de Alternativas */}
          {activeTab === 'alternatives' && (
            <div className="tab-panel active" id="alternatives">
              <h3>Produtos Alternativos</h3>
              <div className="alternatives-grid" id="alternatives-grid">
                <p>(Em breve...)</p>
              </div>
            </div>
          )}
          
        </div>
      </section>

      {/* (O teu HTML original tinha 
         'related-products', mas o teu CSS 
         não o estilizava. Podemos adicionar depois.) */}
      
      {/* --- Modal de Zoom da Imagem (do product-detail.html.txt) --- */}
      {/* Controlado pelo state 'showImageModal' */}
      {showImageModal && (
        <div className="image-modal" id="image-modal" style={{display: 'flex'}} onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" id="modal-close" onClick={closeImageModal}>
              &times;
            </span>
            <img id="modal-image" src={mainImage} alt="Imagem ampliada" />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDetailPage;