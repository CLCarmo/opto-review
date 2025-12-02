import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams(); // O ID que vem da URL
  const navigate = useNavigate();
  const { isLoggedIn, user, addFavorite, removeFavorite, favorites } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Verifica se está favoritado (Converte tudo para String para garantir a comparação)
  const isFavorited = useMemo(() => {
      if (!favorites) return false;
      return favorites.some(favId => String(favId) === String(id));
  }, [favorites, id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Busca direta no Backend
        const response = await fetch(`https://opto-review-production.up.railway.app/api/produtos/${id}`);
        
        if (!response.ok) {
            // Se o backend disser 404, lançamos o erro
            throw new Error('Produto não encontrado no banco de dados.');
        }

        const data = await response.json();
        setProduct(data);
        
        // Se deu certo, busca relacionados
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

    const fetchRelated = async (categoria, currentId) => {
        try {
            const response = await fetch('https://opto-review-production.up.railway.app/api/produtos');
            const data = await response.json();
            // Filtra: Mesma categoria, ID diferente (comparando como String pra garantir)
            const related = data
                .filter(p => p.categoria === categoria && String(p.id_produto) !== String(currentId))
                .slice(0, 4);
            setRelatedProducts(related);
        } catch (e) {
            console.error("Erro ao buscar relacionados", e);
        }
    };

    if (id) {
        fetchProduct();
    }
  }, [id]);

  const handleFavoriteClick = async () => {
      if (!isLoggedIn) {
          navigate('/login');
          return;
      }
      if (isFavorited) {
          await removeFavorite(product.id_produto);
      } else {
          await addFavorite(product.id_produto);
      }
  };

  // --- RENDERIZAÇÃO DAS ESPECIFICAÇÕES (Compatível com Scraper) ---
  const renderSpecs = () => {
      const specs = product.especificacoes;
      
      if (!specs) return <p className="no-specs">Detalhes técnicos não informados.</p>;

      // Se for Objeto (ex: { "DPI": "1000" })
      if (!Array.isArray(specs) && typeof specs === 'object') {
          const validEntries = Object.entries(specs).filter(([_, v]) => v !== null && v !== '');
          if (validEntries.length === 0) return <p className="no-specs">Sem detalhes.</p>;

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

      // Se for Lista (ex: ["DPI: 1000", "Cor: Preto"])
      if (Array.isArray(specs) && specs.length > 0) {
          return (
              <ul className="specs-list-simple">
                  {specs.map((item, idx) => (
                      <li key={idx}>{String(item)}</li>
                  ))}
              </ul>
          );
      }

      return <p className="no-specs">Detalhes técnicos indisponíveis.</p>;
  };

  if (loading) return <div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Carregando detalhes...</div>;
  
  if (error || !product) return (
      <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Produto não encontrado</h2>
          <p>O produto que você procura não existe ou foi removido.</p>
          <Link to="/produtos" className="back-link">Voltar para a Loja</Link>
      </div>
  );

  return (
    <div className="product-detail-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/produtos">Produtos</Link> / <span>{product.nome}</span>
      </div>

      <div className="detail-container">
          <div className="detail-images">
              <div className="main-image" onClick={() => { setSelectedImage(product.imagem_url); setShowImageModal(true); }}>
                  <img src={product.imagem_url || 'https://via.placeholder.com/400'} alt={product.nome} onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Sem+Imagem'; }} />
                  <div className="zoom-hint"><i className="fas fa-search-plus"></i> Ampliar</div>
              </div>
          </div>

          <div className="detail-info">
              <h1 className="product-title">{product.nome}</h1>
              
              <div className="product-meta">
                  {product.fabricante && <span className="brand-badge">{product.fabricante}</span>}
                  {product.categoria && <span className="category-badge">{product.categoria}</span>}
              </div>

              <div className="price-card">
                  <div className="price-row">
                      <span className="price-label">Melhor Preço:</span>
                      <span className="current-price">
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
                    
                    {/* Botão para Loja Externa */}
                    {/* O scraper salva o link na tabela precos, então verificamos se existe oferta */}
                    {(product.ofertas && product.ofertas.length > 0) ? (
                        <a href={product.ofertas[0].url_produto} target="_blank" rel="noopener noreferrer" className="buy-btn-large">
                            Ir à Loja <i className="fas fa-external-link-alt"></i>
                        </a>
                    ) : (
                        // Fallback: Se não tiver oferta, tenta usar um link genérico ou desabilita
                        <button className="buy-btn-large disabled" disabled>Sem Estoque</button>
                    )}
                  </div>
              </div>

              {product.descricao && (
                  <div className="description-box">
                      <h3>Sobre este produto</h3>
                      <p>{product.descricao}</p>
                  </div>
              )}

              <div className="specs-box">
                  <h3>Ficha Técnica</h3>
                  {renderSpecs()}
              </div>
          </div>
      </div>

      {relatedProducts.length > 0 && (
          <div className="related-products-section">
              <h3>Veja também</h3>
              <div className="related-grid">
                  {relatedProducts.map(rel => (
                      <Link to={`/produtos/${rel.id_produto}`} key={rel.id_produto} className="related-card">
                          <div className="related-img-box">
                              <img src={rel.imagem_url} alt={rel.nome} onError={(e) => {e.target.src='https://via.placeholder.com/150'}} />
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