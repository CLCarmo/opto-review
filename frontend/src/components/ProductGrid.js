// src/components/ProductGrid.js
import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css'; // Precisaremos criar este CSS

const ProductGrid = ({ products, selectedProducts, onProductSelect }) => {
    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard 
                    key={product.id_produto} 
                    product={product}
                    isSelected={selectedProducts.includes(product.id_produto)}
                    onSelect={onProductSelect} 
                />
            ))}
            {/* Mensagem se não houver produtos */}
            {products.length === 0 && (
                <p className="no-products-message">Nenhum produto encontrado com os filtros selecionados.</p>
            )}
        </div>
    );
};

export default ProductGrid;