// src/components/ProductCard.js
// Versão robusta com normalização de IDs e lógica de "travar"

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onProductSelect, selectedProducts, isLocked }) => {

    // Normaliza o ID do produto (aceita product.id ou product.id_produto)
    const productId = useMemo(() => {
        const rawId = product?.id ?? product?.id_produto ?? product?.sku ?? product?.codigo;
        // Se não for convertível para número, usamos string fallback
        const asNumber = Number(rawId);
        return Number.isNaN(asNumber) ? String(rawId) : asNumber;
    }, [product]);

    // Normaliza array de selectedProducts para números (ou strings coerentes)
    const normalizedSelected = useMemo(() => {
        if (!Array.isArray(selectedProducts)) return [];
        return selectedProducts.map(id => {
            const n = Number(id);
            return Number.isNaN(n) ? String(id) : n;
        });
    }, [selectedProducts]);

    // isSelected agora compara valores normalizados (número com número)
    const isSelected = normalizedSelected.includes(productId);

    // Função que notifica o pai com o ID normalizado (numérico se possível)
    const handleSelectChange = (eventOrObj) => {
        // eventOrObj pode ser um event real ou o objeto simulado do botão "Comparar"
        const checked = typeof eventOrObj === 'object' && 'target' in eventOrObj
            ? eventOrObj.target.checked
            : Boolean(eventOrObj);

        if (typeof onProductSelect === 'function') {
            onProductSelect(productId, checked);
        } else {
            console.warn('onProductSelect não recebido pelo ProductCard', { product, productId, onProductSelect });
        }

        // Log de debug (remova em produção)
        // eslint-disable-next-line no-console
        console.debug('ProductCard.handleSelectChange', { productId, checked, isSelected, normalizedSelected });
    };

    const formatPrice = (price) => {
        return price ? `R$ ${Number(price).toFixed(2).replace('.', ',')}` : 'N/A';
    };

    return (
        
        // 1. CORREÇÃO: Adiciona a classe 'is-locked' se a prop for verdadeira
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
                        // 2. CORREÇÃO: Desabilita o checkbox se 'isLocked' for verdadeiro
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
                        // 3. CORREÇÃO: Desabilita o botão se 'isLocked' for verdadeiro
                        disabled={isLocked}
                    >
                        <i className="fas fa-columns"></i>
                        {isSelected ? 'Remover' : 'Comparar'}
                    </button>
                </div>

                <div className="product-action-row">
                    <Link to={`/produtos/${productId}#ofertas`} className="buy-button-card">
                        <i className="fas fa-shopping-cart"></i> Comprar
                    </Link>
                    <button className="favorite-button-card" onClick={() => alert('Função de favorito ainda em desenvolvimento!')}>
                        <i className="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
        
    );
};

export default ProductCard;