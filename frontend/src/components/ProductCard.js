// src/components/ProductCard.js
import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // (NOVO) Importa useNavigate
import './ProductCard.css';

// (NOVO) 1. Importa o nosso "cérebro" de autenticação
import { useAuth } from '../context/AuthContext'; 

const ProductCard = ({ product, onProductSelect, selectedProducts, isLocked }) => {

    // (NOVO) 2. Pega os dados de login e favoritos do "cérebro"
    const { isLoggedIn, favorites, addFavorite, removeFavorite } = useAuth();
    const navigate = useNavigate(); // (NOVO) Para redirecionar para o login

    // Normaliza o ID do produto (código antigo)
    const productId = useMemo(() => {
        const rawId = product?.id ?? product?.id_produto ?? product?.sku ?? product?.codigo;
        const asNumber = Number(rawId);
        return Number.isNaN(asNumber) ? String(rawId) : asNumber;
    }, [product]);

    // Normaliza array de selectedProducts (código antigo)
    const normalizedSelected = useMemo(() => {
        if (!Array.isArray(selectedProducts)) return [];
        return selectedProducts.map(id => {
            const n = Number(id);
            return Number.isNaN(n) ? String(id) : n;
        });
    }, [selectedProducts]);

    // Verifica se este card está selecionado (código antigo)
    const isSelected = normalizedSelected.includes(productId);

    // (NOVO) 3. Verifica se este card está FAVORITADO
    // O useMemo garante que isto só é recalculado se a lista de favoritos mudar
    const isFavorited = useMemo(() => {
        return favorites.includes(productId);
    }, [favorites, productId]); // Dependências: a lista global e o ID deste card

    
    // Handler para o Checkbox de Comparação (código antigo)
    const handleSelectChange = (eventOrObj) => {
        const checked = typeof eventOrObj === 'object' && 'target' in eventOrObj
            ? eventOrObj.target.checked
            : Boolean(eventOrObj);

        if (typeof onProductSelect === 'function') {
            onProductSelect(productId, checked);
        } else {
            console.warn('onProductSelect não recebido pelo ProductCard', { product, productId, onProductSelect });
        }
    };

    // (NOVO) 4. Handler para o Botão de Favorito (Coração)
    const handleFavoriteClick = () => {
        // Se não estiver logado, redireciona para a página de login
        if (!isLoggedIn) {
            alert("Você precisa estar logado para favoritar produtos.");
            navigate('/login'); // Redireciona
            return;
        }

        // Se já estiver favoritado, chama a função de remover
        if (isFavorited) {
            removeFavorite(productId);
        } 
        // Se não estiver, chama a função de adicionar
        else {
            addFavorite(productId);
        }
    };


    const formatPrice = (price) => {
        return price ? `R$ ${Number(price).toFixed(2).replace('.', ',')}` : 'N/A';
    };

    return (
        
        <div className={`product-card ${isLocked ? 'is-locked' : ''} ${isSelected ? 'is-selected' : ''}`} data-product-id={productId}>
            <div className="product-image-container">
                <Link to={`/produtos/${productId}`}>
                    <img
                        src={product?.main_image ?? product?.imagem_url ?? 'https://via.placeholder.com/200?text=Sem+Imagem'}
                        alt={product?.nome ?? product?.titulo ?? 'Produto'}
                        className="product-image"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/200?text=Erro+Img'; }}
                    />
                </Link>
                <div className="select-checkbox">
                    <input
                        type="checkbox"
                        id={`select-${productId}`}
                        className="select-checkbox-input"
                        checked={isSelected}
                        onChange={handleSelectChange}
                        disabled={isLocked}
                    />
                    <label htmlFor={`select-${productId}`} className="select-checkbox-label">
                        <i className="fas fa-check"></i>
                    </label>
                </div>
            </div>

            <div className="product-info">
                <span className="product-brand">{product?.fabricante ?? product?.brand ?? ''}</span>
                <h3 className="product-name">
                    <Link to={`/produtos/${productId}`}>{product?.nome ?? product?.titulo ?? 'Produto sem nome'}</Link>
                </h3>
                <p className="product-model">{product?.modelo ?? product?.model ?? ''}</p>
            </div>

            <div className="product-footer">
                <div className="product-price-section">
                    <div className="product-price">
                        <span className="price-label">A partir de</span>
                        <span className="price-value">{formatPrice(product?.price_low ?? product?.preco ?? product?.price)}</span>
                    </div>
                </div>

                <div className="product-action-row">
                    <Link to={`/produtos/${productId}`} className="details-button-card">
                        <i className="fas fa-arrow-right"></i> Detalhes
                    </Link>
                    <button
                        className="compare-button-card"
                        onClick={() => handleSelectChange({ target: { checked: !isSelected } })}
                        disabled={isLocked}
                    >
                        <i className="fas fa-columns"></i>
                        {isSelected ? 'Remover' : 'Comparar'}
                    </button>
                </div>

                <div className="product-action-row">
                    <Link to={`/produtos/${productId}#offers-section`} className="buy-button-card">
                        <i className="fas fa-shopping-cart"></i> Comprar
                    </Link>
                    
                    {/* 5. (CORRIGIDO) O Botão de Favorito agora é dinâmico */}
                    <button 
                        className="favorite-button-card" 
                        onClick={handleFavoriteClick} // (NOVO) Chama o novo handler
                        title={isFavorited ? "Remover dos Favoritos" : "Adicionar aos Favoritos"} // (NOVO) Dica
                    >
                        {/* (NOVO) Muda o ícone se estiver favoritado (coração cheio vs. vazio) */}
                        <i className={isFavorited ? 'fas fa-heart' : 'far fa-heart'}></i>
                    </button>
                </div>
            </div>
        </div>
        
    );
};

export default ProductCard;