// frontend/src/components/ProductDetailPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

// --- DICIONÁRIO DE TRADUÇÃO ---
const specLabels = {
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

const formatSpecValue = (key, value) => {
    if (value === true || value === 'true') return 'Sim';
    if (value === false || value === 'false') return 'Não';
    if (key === 'peso_g') return `${value}g`;
    if (key === 'dpi_max') return `${value} DPI`;
    return value;
};

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

  // Verifica se está favoritado olhando para o Contexto Global
  const isFavorited = useMemo(() => {
      if (!favorites) return false;
      return favorites.includes(Number(id)) || favorites.includes(String(id));
  }, [favorites, id]);

  // 1. Carrega os dados do produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // --- AQUI ESTAVA O ERRO (URL HARDCODED CORRETA) ---
        const response = await fetch(`https://opto-review-production.up.railway.app/api/produtos/${id}`);
        
        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }

        const data = await response.json();
        setProduct(data);
        
        // Carrega produtos relacionados (mesma categoria)
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
            // Filtra: Mesma categoria, diferente do atual, pega 4
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
          navigate('/login');
          return;
      }
      if (isFavorited) {
          await removeFavorite(product.id_produto);
      } else {
          await addFavorite(product.id_produto);
      }
  };

  if (loading) return <div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Carregando detalhes...</div>;
  if (error) return <div className="error-state"><h2>Erro: {error}</h2><Link to="/produtos" className="back-link">Voltar</Link></div>;
  if (!product) return null;

  // Prepara as especificações para exibição
  const specs = product.especificacoes || {};
  const specKeys = Object.keys(specs);

  return (
    <div className="product-detail-page">
      
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/produtos">Produtos</Link> / <span>{product.nome}</span>
      </div>

      <div className="detail-container">
          {/* COLUNA DA ESQUERDA: IMAGENS */}
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
                  <span className="brand-badge">{product.fabricante || 'Genérico'}</span>
                  <span className="category-badge">{product.categoria || 'Hardware'}</span>
                  
                  {/* Score de Desempenho (se existir) */}
                  {product.rating > 0 && (
                      <div className="score-badge" title={`Nota: ${product.rating} de 5`}>
                          <i className="fas fa-star"></i> {parseFloat(product.rating).toFixed(1)}
                      </div>
                  )}
              </div>

              {/* PREÇO E AÇÃO */}
              <div className="price-card" id="offers-section">
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
                        {isFavorited ? 'Salvo nos Favoritos' : 'Favoritar'}
                    </button>
                    
                    {/* Botão de Comparar (Exemplo simples - poderia integrar com o Contexto de comparação) */}
                    <Link to="/produtos" className="compare-btn-large">
                        <i className="fas fa-balance-scale"></i> Comparar
                    </Link>
                  </div>
              </div>

              {/* LISTA DE OFERTAS (Lojas) */}
              <div className="offers-list">
                  <h3><i className="fas fa-store"></i> Ofertas Encontradas</h3>
                  {product.ofertas && product.ofertas.length > 0 ? (
                      product.ofertas.map((oferta, idx) => (
                          <div key={idx} className="store-row">
                              <div className="store-name">
                                  <i className="fas fa-shopping-bag"></i> {oferta.nome_loja}
                              </div>
                              <div className="store-price">
                                  R$ {parseFloat(oferta.preco).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                              </div>
                              <a href={oferta.url_produto} target="_blank" rel="noopener noreferrer" className="store-link">
                                  Ir à Loja <i className="fas fa-external-link-alt"></i>
                              </a>
                          </div>
                      ))
                  ) : (
                      <p className="no-offers">Nenhuma oferta online encontrada no momento.</p>
                  )}
              </div>

              {/* DESCRIÇÃO */}
              <div className="description-box">
                  <h3>Descrição</h3>
                  <p>{product.descricao || "Sem descrição disponível para este produto."}</p>
              </div>

              {/* ESPECIFICAÇÕES TÉCNICAS */}
              {specKeys.length > 0 && (
                <div className="specs-box">
                    <h3>Especificações Técnicas</h3>
                    <div className="specs-grid">
                        {specKeys.map(key => (
                            <div key={key} className="spec-item">
                                <strong>{specLabels[key] || key}:</strong>
                                <span>{formatSpecValue(key, specs[key])}</span>
                            </div>
                        ))}
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