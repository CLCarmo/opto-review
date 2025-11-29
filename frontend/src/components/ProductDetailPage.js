import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

// --- DICIONÁRIO DE TRADUÇÃO (CORRIGIDO) ---
const specLabels = {
    // Chaves exatas do seu banco de dados
    'botoes': 'Botões',
    'peso_g': 'Peso em Gramas',
    'sensor': 'Sensor',
    'dpi_max': 'DPI Máximo',
    'sem_fio': 'Sem Fio',
    'conexao': 'Conexão',
    'cor': 'Cor',
    'iluminacao': 'Iluminação',
    'tipo_switch': 'Switch',
    'layout': 'Layout',
    'resolucao': 'Resolução',
    'taxa_atualizacao': 'Taxa de Atualização',
    'tempo_resposta': 'Tempo de Resposta',
    'tipo_painel': 'Painel',
    'tamanho_tela': 'Tamanho',
    'garantia': 'Garantia',
    'marca': 'Marca',
    'modelo': 'Modelo'
};

// Formata os valores (True/False, g, DPI)
const formatSpecValue = (key, value) => {
    if (value === true || value === 'true') return 'Sim';
    if (value === false || value === 'false') return 'Não';
    if (key === 'peso_g') return `${value}g`;
    if (key === 'dpi_max') return `${value} DPI`;
    return value;
};

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

function ProductDetailPage() {
  const { produtoId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, favorites, addFavorite, removeFavorite } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('specs'); 
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(''); 

  const isFavorited = useMemo(() => {
      if (!favorites) return false;
      return favorites.map(Number).includes(Number(produtoId));
  }, [favorites, produtoId]);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://opto-review-production.up.railway.app/api/produtos/${produtoId}`);
        if (!response.ok) throw new Error('Produto não encontrado');
        const data = await response.json();
        
        setProduct(data);
        setSelectedImage(data.imagem_url);
        fetchRelatedProducts(data.categoria, data.id_produto);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [produtoId]);

  const fetchRelatedProducts = async (category, currentId) => {
      try {
          const res = await fetch('https://opto-review-production.up.railway.app/api/produtos');
          const all = await res.json();
          const related = all
            .filter(p => p.categoria === category && p.id_produto !== currentId)
            .slice(0, 5);
          setRelatedProducts(related);
      } catch (e) {
          console.error("Erro ao carregar relacionados", e);
      }
  };

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
        alert("Faça login para salvar favoritos.");
        navigate('/login');
        return;
    }
    const idNum = Number(produtoId);
    if (isFavorited) removeFavorite(idNum);
    else addFavorite(idNum);
  };

  const handleCompareClick = () => {
      try {
          const saved = localStorage.getItem('compareProducts');
          let currentList = saved ? JSON.parse(saved) : [];
          const idNum = Number(produtoId);

          if (!currentList.includes(idNum)) {
              if (currentList.length >= 4) {
                  alert("A lista de comparação já está cheia.");
                  return;
              }
              currentList.push(idNum);
              localStorage.setItem('compareProducts', JSON.stringify(currentList));
          }
          navigate('/compare', { state: { compareProducts: currentList } });
      } catch (e) {
          console.error(e);
      }
  };

  if (isLoading) return <div className="product-detail-page-wrapper"><div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Carregando...</div></div>;
  if (error || !product) return <div className="product-detail-page-wrapper"><div className="error-state"><h2>Produto não encontrado</h2><Link to="/produtos" className="cta-button">Voltar</Link></div></div>;

  const lowestPrice = product.ofertas && product.ofertas.length > 0 
    ? parseFloat(product.ofertas[0].preco) 
    : null;

  const galleryImages = [product.imagem_url, product.imagem_url, product.imagem_url];

  return (
    <div className="product-detail-page-wrapper">
      
      <div className="breadcrumb">
        <Link to="/">Home</Link> <i className="fas fa-chevron-right"></i>
        <Link to="/produtos">Produtos</Link> <i className="fas fa-chevron-right"></i>
        <span>{product.nome}</span>
      </div>

      <div className="product-detail">
        
        {/* GALERIA */}
        <div className="product-gallery-section">
          <div className="main-image-container" onClick={() => setShowImageModal(true)}>
             <img src={selectedImage || 'https://via.placeholder.com/400'} alt={product.nome} />
             <div className="zoom-hint"><i className="fas fa-expand"></i></div>
          </div>
          <div className="thumbnail-list">
              {galleryImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-item ${selectedImage === img && index === 0 ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                      <img src={img} alt={`Thumb ${index}`} />
                  </div>
              ))}
          </div>
        </div>

        {/* INFO */}
        <div className="product-info">
          <div className="info-header">
              <span className="brand-tag">{product.fabricante}</span>
              <span className="sku-tag">ID: {product.id_produto}</span>
          </div>
          
          <h1 className="product-title">{product.nome}</h1>
          
          <div className="product-rating">
            {product.rating > 0 && <RenderRatingStars rating={product.rating} />}
            <span className="review-count">(Score: {(product.rating * 20).toFixed(0)})</span>
          </div>

          <div className="price-highlight">
             <span className="price-label">Melhor preço encontrado</span>
             <div className="price-value-row">
                <span className="currency">R$</span>
                <span className="value">{lowestPrice ? lowestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '---'}</span>
             </div>
          </div>

          {/* --- GRID DE BOTÕES (ESTRUTURA AJUSTADA) --- */}
          <div className="action-buttons-grid">
            
            {/* 1. LINHA SUPERIOR: Ver Ofertas (100% Width) */}
            <button 
                className="action-btn primary-btn full-width-btn"
                onClick={() => {
                    setActiveTab('offers');
                    document.getElementById('tabs-section').scrollIntoView({ behavior: 'smooth' });
                }}
            >
                <i className="fas fa-shopping-bag"></i> Ver Ofertas
            </button>

            {/* 2. LINHA INFERIOR: Comparar e Salvar (50% / 50%) */}
            <div className="secondary-actions-row">
                <button className="action-btn compare-btn half-width-btn" onClick={handleCompareClick}>
                    <i className="fas fa-balance-scale"></i> Comparar
                </button>

                <button 
                    className={`action-btn favorite-btn half-width-btn ${isFavorited ? 'favorited' : ''}`} 
                    onClick={handleFavoriteClick}
                >
                    <i className={isFavorited ? "fas fa-heart" : "far fa-heart"}></i>
                    {isFavorited ? "Salvo" : "Salvar"}
                </button>
            </div>
          </div>

          <div className="short-description">
              <p>{product.descricao}</p>
          </div>
        </div>
      </div>

      <div className="content-tabs-wrapper" id="tabs-section">
          <div className="tabs-header">
              <button 
                className={`tab-trigger ${activeTab === 'specs' ? 'active' : ''}`} 
                onClick={() => setActiveTab('specs')}
              >
                  <i className="fas fa-list-ul"></i> Especificações
              </button>
              <button 
                className={`tab-trigger ${activeTab === 'offers' ? 'active' : ''}`} 
                onClick={() => setActiveTab('offers')}
              >
                  <i className="fas fa-tags"></i> Ofertas ({product.ofertas ? product.ofertas.length : 0})
              </button>
          </div>

          <div className="tabs-body">
              {/* SPECS COM TRADUÇÃO */}
              {activeTab === 'specs' && (
                  <div className="specs-container fade-in">
                      <h3>Ficha Técnica</h3>
                      <div className="specs-table">
                          {product.especificacoes && Object.entries(product.especificacoes).map(([key, value], index) => (
                              <div className="spec-row" key={key}>
                                  <div className="spec-label">
                                    {/* Usa o dicionário. Se não achar, usa a chave original formatada */}
                                    {specLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                  </div>
                                  <div className="spec-data">
                                    {formatSpecValue(key, value)}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {activeTab === 'offers' && (
                  <div className="offers-container fade-in">
                      <h3>Lojas Disponíveis</h3>
                      <div className="offers-grid">
                        {product.ofertas && product.ofertas.map((offer, index) => (
                            <div className="offer-card-row" key={index}>
                                <div className="store-info">
                                    <i className="fas fa-store store-icon"></i>
                                    <span className="store-name">{offer.nome_loja}</span>
                                </div>
                                <div className="price-info">
                                    R$ {parseFloat(offer.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                                <a href={offer.url_produto} target="_blank" rel="noopener noreferrer" className="go-store-btn">
                                    Ir à Loja <i className="fas fa-external-link-alt"></i>
                                </a>
                            </div>
                        ))}
                        {(!product.ofertas || product.ofertas.length === 0) && (
                            <p className="no-offers">Nenhuma oferta encontrada.</p>
                        )}
                      </div>
                  </div>
              )}
          </div>
      </div>

      {relatedProducts.length > 0 && (
          <div className="related-products-section">
              <h3><i className="fas fa-random"></i> Produtos Relacionados</h3>
              <div className="related-grid">
                  {relatedProducts.map(rel => (
                      <Link to={`/produtos/${rel.id_produto}`} key={rel.id_produto} className="related-card">
                          <div className="related-img-box">
                              <img src={rel.imagem_url || 'https://via.placeholder.com/150'} alt={rel.nome} />
                          </div>
                          <div className="related-info">
                              <h4>{rel.nome}</h4>
                              <span className="related-price">
                                  R$ {parseFloat(rel.price_low).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      )}

      {showImageModal && (
        <div className="image-modal" onClick={() => setShowImageModal(false)}>
          <span className="modal-close">&times;</span>
          <div className="modal-content">
             <img src={selectedImage} alt={product.nome} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;