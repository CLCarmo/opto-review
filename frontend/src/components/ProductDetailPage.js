import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// 1. IMPORTA O CSS (está correto)
import './ProductDetailPage.css';

// 2. FUNÇÃO DAS ESTRELAS (Mantida, está correta)
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
 * REFATORADO (AGORA CORRIGIDO)
 */
function ProductDetailPage() {

  // ESTADOS DA PÁGINA
  const { produtoId } = useParams(); 
  const [product, setProduct] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis'); 
  const [mainImage, setMainImage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  // LÓGICA DE BUSCA DE DADOS
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/produtos/${produtoId}`);
        if (!response.ok) {
          throw new Error(`Produto não encontrado (ID: ${produtoId})`);
        }
        const data = await response.json();

        // O teu backend já envia 'pros' e 'cons' como arrays (TEXT[])
        // e 'specs' e 'rating_breakdown' como JSON (JSONB).
        const formattedData = {
          ...data,
          // A única coisa que simulamos é a galeria
          gallery: [
              data.main_image, 
              data.main_image ? data.main_image.replace("gallery-1", "gallery-2") : data.main_image,
              data.main_image ? data.main_image.replace("gallery-1", "gallery-3") : data.main_image
          ]
        };

        setProduct(formattedData);
        setMainImage(formattedData.main_image || 'https://via.placeholder.com/400'); // Define a imagem principal

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [produtoId]); 

  // --- HANDLERS (Funções) ---
  const openImageModal = () => {
    if (window.innerWidth > 768) setShowImageModal(true);
  };
  const closeImageModal = () => setShowImageModal(false);

  // --- RENDERIZAÇÃO ---

  if (isLoading) {
    return <div className="loading-message" style={{ padding: '5rem', textAlign: 'center' }}>
        Carregando produto... <i className="fas fa-spinner fa-spin"></i>
    </div>;
  }

  if (error || !product) {
    return (
      <div className="product-detail" style={{ flexDirection: 'column', alignItems: 'center', padding: '3rem' }}>
        <h1>Erro: Produto não encontrado</h1>
        <p style={{textAlign: 'center'}}>{error ? error.message : `O ID "${produtoId}" não existe.`}</p>
        <Link to="/produtos" className="cta-button primary">Voltar para a lista</Link>
      </div>
    );
  }

  // O JSX agora vai funcionar
  return (
    <>
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <i className="fas fa-chevron-right"></i>
        <Link to="/produtos">Produtos</Link>
        <i className="fas fa-chevron-right"></i>
        <Link to={`/produtos?categoria=${product.categoria_id}`}>{product.categoria_nome}</Link>
        <i className="fas fa-chevron-right"></i>
        <span>{product.nome}</span>
      </nav>

      <section className="product-detail">
        <div className="product-gallery">
          <div className="main-image-container">
            <img src={mainImage || 'https://via.placeholder.com/400'} alt={product.nome} id="main-product-image" onClick={openImageModal} />
          </div>
          <div className="thumbnail-container">
            {(product.gallery || []).map((imgSrc, index) => (
              <img key={index} src={imgSrc || 'https://via.placeholder.com/80'} alt={`Thumbnail ${index + 1}`} 
                   className={`thumbnail ${mainImage === imgSrc ? 'active' : ''}`}
                   onClick={() => setMainImage(imgSrc)} />
            ))}
          </div>
        </div>

        <div className="product-info">
          <span className="product-category-tag">{product.categoria_nome}</span>
          <h1 className="product-title">{product.nome}</h1>
          <div className="product-rating">
            <span className="rating-score">{product.overall_rating.toFixed(1)}</span>
            <RenderRatingStars rating={product.overall_rating} />
            <span className="rating-text">Avaliação Geral</span>
          </div>
          <p className="product-summary">{product.sumario}</p>
          <div className="product-price-box">
            <span className="price-label">A partir de</span>
            <span className="price-value">R$ {product.price_low.toLocaleString('pt-BR')}</span>
          </div>
          <div className="product-actions-detail">
            <button className="cta-button primary"><i className="fas fa-shopping-cart"></i> Ver Ofertas</button>
            <button className="cta-button secondary"><i className="fas fa-plus"></i> Adicionar ao Comparador</button>
          </div>
        </div>
      </section>

      <section className="product-tabs">
        <nav className="tab-navigation">
          <button className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>Análise</button>
          <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Especificações</button>
          <button className={`tab-btn ${activeTab === 'alternatives' ? 'active' : ''}`} onClick={() => setActiveTab('alternatives')}>Alternativas</button>
        </nav>
        <div className="tab-content">
          {activeTab === 'analysis' && (
            <div className="tab-panel active">
              <div className="rating-breakdown">
                <div className="rating-chart-container">
                  <h4>Pontuação Detalhada</h4>
                  {product.rating_breakdown && Object.entries(product.rating_breakdown).map(([key, value]) => (
                    <div className="rating-bar" key={key}>
                      <span className="bar-label">{key}</span>
                      <div className="bar-bg">
                        {/* --- O 'D' FOI REMOVIDO DAQUI --- */}
                        <div className="bar-fill" style={{ width: `${(value / 5) * 100}%` }} data-score={value.toFixed(1)}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pros-cons-container">
                  <div className="pros-cons-box">
                    <h4><i className="fas fa-check"></i> Prós</h4>
                    <ul className="pros-list">
                      {(product.pros || []).map((pro, i) => <li key={i}>{pro}</li>)}
                    </ul>
                  </div>
                  <div className="pros-cons-box">
                    <h4><i className="fas fa-times"></i> Contras</h4>
                    <ul className="cons-list">
                      {(product.cons || []).map((con, i) => <li key={i}>{con}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="analysis-section">
                <h4>Recomendação</h4>
                <p>{product.recomendacao}</p>
              </div>
            </div>
          )}
          {activeTab === 'specs' && (
            <div className="tab-panel active">
              <h3>Especificações Completas</h3>
              {product.specs ? (
                <ul className="specs-grid">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <li className="spec-item-detail" key={key}>
                      <span className="spec-key">{key}</span>
                      <span className="spec-value">{String(value)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Especificações detalhadas não disponíveis.</p>
            )}
            </div>
          )}
          {activeTab === 'alternatives' && (
            <div className="tab-panel active">
              <h3>Produtos Alternativos</h3><p>(Em breve...)</p>
            </div>
          )}
        </div>
      </section>

      {showImageModal && (
        <div className="image-modal" style={{display: 'flex'}} onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" id="modal-close" onClick={closeImageModal}>&times;</span>
            <img id="modal-image" src={mainImage} alt="Imagem ampliada" />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDetailPage;