import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, addFavorite, removeFavorite, favorites } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Verifica se está favoritado
  const isFavorited = useMemo(() => {
      if (!favorites) return false;
      return favorites.includes(Number(id)) || favorites.includes(String(id));
  }, [favorites, id]);

  // 1. Carrega os dados do produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // LINK CORRIGIDO: Aponta para o Railway
        const response = await fetch(`https://opto-review-production.up.railway.app/api/produtos/${id}`);
        
        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }

        const data = await response.json();
        setProduct(data);
        
        // Carrega produtos relacionados (mesma categoria) se existir categoria
        if (data.categoria) {
            fetchRelated(data.categoria, data.id_produto);
        }

      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Função interna para buscar relacionados
    const fetchRelated = async (categoria, currentId) => {
        try {
            const response = await fetch('https://opto-review-production.up.railway.app/api/produtos');
            const data = await response.json();
            // Filtra: Mesma categoria, ID diferente, pega 4 itens
            const related = data
                .filter(p => p.categoria === categoria && p.id_produto !== currentId)
                .slice(0, 4);
            setRelatedProducts(related);
        } catch (e) {
            console.error("Erro ao buscar relacionados", e);
        }
    };

    fetchProduct();
  }, [id]);

  const handleFavoriteClick = async () => {
      if (!isLoggedIn) {
          navigate('/login'); // Manda pro login se não estiver logado
          return;
      }
      if (isFavorited) {
          await removeFavorite(product.id_produto);
      } else {
          await addFavorite(product.id_produto);
      }
  };

  if (loading) return <div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Carregando detalhes...</div>;
  if (error) return <div className="error-state"><h2>Produto não encontrado</h2><Link to="/produtos" className="back-link">Voltar para Loja</Link></div>;
  if (!product) return null;

  // TRATAMENTO DE ESPECIFICAÇÕES (O "Pulo do Gato" para dados do Scraper)
  // O scraper pode retornar specs como Array [] ou Objeto {}. Aqui tratamos os dois.
  const renderSpecs = () => {
      const specs = product.especificacoes;
      
      if (!specs) return <p>Sem especificações técnicas detalhadas.</p>;

      // Caso 1: É um Objeto (ex: { "DPI": "1000", "Cor": "Preto" })
      if (!Array.isArray(specs) && typeof specs === 'object') {
          // Filtra chaves vazias ou nulas
          const validEntries = Object.entries(specs).filter(([_, v]) => v !== null && v !== '');
          if (validEntries.length === 0) return <p>Sem especificações detalhadas.</p>;

          return (
              <div className="specs-grid">
                  {validEntries.map(([key, value]) => (
                      <div key={key} className="spec-item">
                          <strong>{key}:</strong> <span>{String(value)}</span>
                      </div>
                  ))}
              </div>
          );
      }

      // Caso 2: É um Array (ex: ["DPI: 1000", "Cor: Preto"])
      if (Array.isArray(specs) && specs.length > 0) {
          return (
              <ul className="specs-list-simple">
                  {specs.map((item, idx) => (
                      <li key={idx}>{String(item)}</li>
                  ))}
              </ul>
          );
      }

      return <p>Especificações indisponíveis no momento.</p>;
  };

  return (
    <div className="product-detail-page">
      
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/produtos">Produtos</Link> / <span>{product.nome}</span>
      </div>

      <div className="detail-container">
          {/* COLUNA DA ESQUERDA: IMAGEM */}
          <div className="detail-images">
              <div className="main-image" onClick={() => { setSelectedImage(product.imagem_url); setShowImageModal(true); }}>
                  <img src={product.imagem_url || 'https://via.placeholder.com/400'} alt={product.nome} />
                  <div className="zoom-hint"><i className="fas fa-search-plus"></i> Clique para ampliar</div>
              </div>
          </div>

          {/* COLUNA DA DIREITA: INFORMAÇÕES */}
          <div className="detail-info">
              <h1 className="product-title">{product.nome}</h1>
              
              <div className="product-meta">
                  {product.fabricante && <span className="brand-badge">{product.fabricante}</span>}
                  {product.categoria && <span className="category-badge">{product.categoria}</span>}
              </div>

              {/* PREÇO E AÇÃO */}
              <div className="price-card" id="offers-section">
                  <div className="price-row">
                      <span className="price-label">Melhor Preço:</span>
                      <span className="current-price">
                        {/* Formatação segura de preço */}
                        R$ {product.price_low ? parseFloat(product.price_low).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '---'}
                      </span>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                        className={`fav-btn-large ${isFavorited ? 'active' : ''}`} 
                        onClick={handleFavoriteClick}
                    >
                        <i className={isFavorited ? "fas fa-heart" : "far fa-heart"}></i> 
                        {isFavorited ? 'Salvo' : 'Favoritar'}
                    </button>
                    
                    {/* Botão para ir à loja externa (Scraper) */}
                    {product.ofertas && product.ofertas.length > 0 ? (
                        <a href={product.ofertas[0].url_produto} target="_blank" rel="noopener noreferrer" className="buy-btn-large">
                            Ir à Loja <i className="fas fa-external-link-alt"></i>
                        </a>
                    ) : (
                        <button className="buy-btn-large disabled" disabled>Indisponível</button>
                    )}
                  </div>
              </div>

              {/* DESCRIÇÃO (Se houver) */}
              {product.descricao && (
                  <div className="description-box">
                      <h3>Descrição</h3>
                      <p>{product.descricao}</p>
                  </div>
              )}

              {/* ESPECIFICAÇÕES TÉCNICAS */}
              <div className="specs-box">
                  <h3>Especificações Técnicas</h3>
                  {renderSpecs()}
              </div>
          </div>
      </div>

      {/* PRODUTOS RELACIONADOS */}
      {relatedProducts.length > 0 && (
          <div className="related-products-section">
              <h3><i className="fas fa-random"></i> Você também pode gostar</h3>
              <div className="related-grid">
                  {relatedProducts.map(rel => (
                      <Link to={`/produtos/${rel.id_produto}`} key={rel.id_produto} className="related-card">
                          <div className="related-img-box">
                              <img src={rel.imagem_url || 'https://via.placeholder.com/150'} alt={rel.nome} />
                          </div>
                          <div className="related-info">
                              <h4 title={rel.nome}>{rel.nome}</h4>
                              <span className="related-price">
                                  R$ {rel.price_low ? parseFloat(rel.price_low).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '---'}
                              </span>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      )}

      {/* MODAL DE ZOOM DA IMAGEM */}
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