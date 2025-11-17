import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// 1. IMPORTA O CSS
import './ProductDetailPage.css';

// 2. FUNÇÃO DAS ESTRELAS (Mantida do seu código)
function RenderRatingStars({ rating }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < fullStars; i++) stars.push(<i className="fas fa-star" key={`full-${i}`}></i>);
  if (halfStar) stars.push(<i className="fas fa-star-half-alt" key="half"></i>);
  for (let i = 0; i < emptyStars; i++) stars.push(<i className="far fa-star" key={`empty-${i}`}></i>);
  return <div className="rating-stars">{stars}</div>;
}

/**
 * Componente ProductDetailPage
 * (VERSÃO ATUALIZADA COM FETCH DA API E WRAPPER CSS)
 */
function ProductDetailPage() {

  // --- ESTADOS DA PÁGINA ---
  const { produtoId } = useParams(); // Pega o ID da URL
  const [product, setProduct] = useState(null); // Guarda os dados do produto
  const [isLoading, setIsLoading] = useState(true); // Controla o "Carregando..."
  const [error, setError] = useState(null); // Guarda mensagens de erro

  const [activeTab, setActiveTab] = useState('overview'); // Controla as abas
  const [showImageModal, setShowImageModal] = useState(false); // Controla o modal
  const [modalImageUrl, setModalImageUrl] = useState('');

  // --- BUSCA DE DADOS DA API ---
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:8080/api/produtos/${produtoId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Falha ao buscar dados do produto');
        }
        
        const data = await response.json();
        
        // A API já manda os dados no formato que precisamos
        // (ex: data.ofertas, data.especificacoes)
        setProduct(data); 
        
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setError(err.message);
      } finally {
        setIsLoading(false); // Termina o carregamento
      }
    };

    fetchProduct();
  }, [produtoId]); // Dependência: Busca de novo se o ID na URL mudar

  // --- Handlers do Modal de Imagem (Mantidos) ---
  const handleImageClick = (imgUrl) => {
    setModalImageUrl(imgUrl);
    setShowImageModal(true);
  };
  const handleCloseModal = () => {
    setShowImageModal(false);
  };
  
  // --- RENDERIZAÇÃO ---
  
  // 1. Estado de Carregamento
  if (isLoading) {
    return (
      // Usamos o wrapper aqui também para consistência
      <div className="product-detail-page-wrapper">
        <div className="product-detail-container loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <h2>Carregando dados do produto...</h2>
        </div>
      </div>
    );
  }

  // 2. Estado de Erro
  if (error) {
    return (
      <div className="product-detail-page-wrapper">
        <div className="product-detail-container error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Erro ao carregar produto</h2>
          <p>{error}</p>
          <Link to="/produtos" className="cta-button">Voltar para a lista</Link>
        </div>
      </div>
    );
  }

  // 3. Produto não encontrado (deveria ser pego pelo Erro, mas é uma segurança)
  if (!product) {
    return (
      <div className="product-detail-page-wrapper">
        <div className="product-detail-container error-state">
          <h2>Produto não encontrado</h2>
          <Link to="/produtos" className="cta-button">Voltar para a lista</Link>
        </div>
      </div>
    );
  }

  // 4. SUCESSO - Renderiza o produto
  return (
    <div className="product-detail-page-wrapper"> {/* <-- CLASSE-MÃE ADICIONADA AQUI */}
    
      {/* Breadcrumb (Agora dinâmico) */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <i className="fas fa-chevron-right"></i>
        <Link to="/produtos">Produtos</Link>
        <i className="fas fa-chevron-right"></i>
        {product.categoria && (
          <>
            <Link to={`/produtos?categoria=${product.categoria}`}>{product.categoria}</Link>
            <i className="fas fa-chevron-right"></i>
          </>
        )}
        <span>{product.nome}</span>
      </div>

      {/* Layout Principal do Produto */}
      <div className="product-detail">
        {/* Galeria de Imagens */}
        <div className="product-gallery">
          <div className="main-image-container">
            <img 
              src={product.imagem_url || 'https://via.placeholder.com/400'} 
              alt={product.nome} 
              id="main-product-image"
              onClick={() => handleImageClick(product.imagem_url)}
            />
          </div>
          {/* (Lógica para galeria de thumbnails pode ser adicionada aqui) */}
        </div>

        {/* Informações do Produto */}
        <div className="product-info">
          <span className="product-brand">{product.fabricante || 'Marca Desconhecida'}</span>
          <h1 className="product-title">{product.nome}</h1>
          
          <div className="product-rating">
            {product.rating > 0 && <RenderRatingStars rating={product.rating} />}
            <span className="review-count">
              (Score: {(product.rating * 20).toFixed(1)})
            </span>
          </div>

          <p className="product-summary">
            {product.descricao}
          </p>

          <div className="product-meta">
            <div className="meta-item">
              <strong>Categoria:</strong>
              <span>{product.categoria || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <strong>Modelo:</strong>
              <span>{product.modelo || 'N/A'}</span>
            </div>
          </div>

          <div className="product-actions-detail">
            {product.ofertas && product.ofertas.length > 0 && (
              <div className="price-tag-detail">
                <span className="price-label">A partir de</span>
                <span className="price-value">
                  {/* Pega o primeiro preço (mais barato) */}
                  R$ {parseFloat(product.ofertas[0].preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <a href="#offers-section" className="cta-button primary-cta">
              <i className="fas fa-shopping-cart"></i> Ver Ofertas
            </a>
            <button className="cta-button secondary-cta" onClick={() => alert('Função "Adicionar à Comparação" em desenvolvimento!')}>
              <i className="fas fa-columns"></i> Adicionar à Comparação
            </button>
          </div>
        </div>
      </div>

      {/* Tabs (Visão Geral, Specs, Ofertas) */}
      <div className="product-tabs-container">
        <div className="tab-navigation">
          <button 
            className={`tab-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button 
            className={`tab-link ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Especificações
          </button>
          <button 
            className={`tab-link ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
            id="offers-section" // ID para o link "Ver Ofertas"
          >
            Ofertas ({product.ofertas ? product.ofertas.length : 0})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="tab-panel active">
              <h3>Visão Geral do Produto</h3>
              <p>{product.descricao || 'Nenhuma descrição disponível.'}</p>
              {/* (Lógica futura para Prós/Contras) */}
            </div>
          )}
          {activeTab === 'specs' && (
            <div className="tab-panel active">
              <h3>Especificações Completas</h3>
              {product.especificacoes && Object.keys(product.especificacoes).length > 0 ? (
                <ul className="specs-grid">
                  {Object.entries(product.especificacoes).map(([key, value]) => (
                    <li className="spec-item-detail" key={key}>
                      <span className="spec-key">{key}</span>
                      <span className="spec-value">{String(value)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma especificação técnica detalhada disponível.</p>
              )}
            </div>
          )}
          {activeTab === 'offers' && (
            <div className="tab-panel active">
              <h3>Ofertas e Preços</h3>
              {product.ofertas && product.ofertas.length > 0 ? (
                <ul className="offers-list">
                  {product.ofertas.map((offer, index) => (
                    <li className="offer-item" key={index}>
                      <div className="offer-store">
                        <i className="fas fa-store"></i>
                        <span>{offer.nome_loja}</span>
                      </div>
                      <div className="offer-price">
                        R$ {parseFloat(offer.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <a 
                        href={offer.url_produto} 
                        className="offer-link" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Ir para a loja <i className="fas fa-external-link-alt"></i>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma oferta encontrada para este produto no momento.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Imagem (Mantido) */}
      {showImageModal && (
        <div className="image-modal" id="image-modal" onClick={handleCloseModal}>
          <span className="modal-close" id="modal-close-btn">&times;</span>
          <div className="modal-content">
            <img src={modalImageUrl} alt="Imagem do produto em zoom" id="modal-image" />
          </div>
        </div>
      )}
    </div> // {/* <-- FECHAMENTO DO NOSSO WRAPPER */}
  );
}

export default ProductDetailPage;