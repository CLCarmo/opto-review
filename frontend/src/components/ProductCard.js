// src/components/ProductCard.js
import React from 'react';
import './ProductCard.css'; // Precisaremos criar este CSS

const ProductCard = ({ product, onSelect, isSelected }) => {
    // Função para formatar o preço (pode mover para um utilitário depois)
    const formatPrice = (price) => {
        return price ? `R$ ${price.toFixed(2).replace('.', ',')}` : 'N/A';
    };

    // Função para lidar com a seleção do checkbox
    const handleSelectChange = (event) => {
        onSelect(product.id_produto, event.target.checked);
    };

    return (
        <div className={`product-card ${isSelected ? 'selected' : ''}`}>
            <div className="product-image-container">
                <img 
                    src={product.imagem_url || 'https://via.placeholder.com/200?text=Sem+Imagem'} 
                    alt={product.nome} 
                    className="product-image"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/200?text=Erro+Img'; }} // Fallback
                />
                {/* Checkbox de seleção para comparação */}
                <div className="select-checkbox">
                    <input 
                        type="checkbox" 
                        id={`select-${product.id_produto}`} 
                        className="select-checkbox-input"
                        checked={isSelected}
                        onChange={handleSelectChange}
                    />
                    <label htmlFor={`select-${product.id_produto}`} className="select-checkbox-label">
                        <i className="fas fa-check"></i>
                    </label>
                </div>
            </div>
            <div className="product-info">
                <span className="product-brand">{product.fabricante}</span>
                <h3 className="product-name">{product.nome}</h3>
                <p className="product-model">{product.modelo}</p>
                {/* Poderia adicionar um resumo da descrição aqui */}
            </div>
            <div className="product-footer">
                <div className="product-price">
                    <span className="price-label">A partir de</span>
                    <span className="price-value">{formatPrice(product.price_low)}</span> {/* Assumindo que você terá price_low */}
                </div>
                {/* Link para a página de detalhes (precisará de React Router) */}
                <a href={`/produto/${product.id_produto}`} className="details-button">
                    Ver Detalhes <i className="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    );
};

export default ProductCard;