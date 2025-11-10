// frontend/src/components/ProductGrid.js
// VERSÃO FINAL - O "TRADUTOR"


import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

function ProductGrid({ products, selectedProducts, onProductSelect }) {
  
  if (!products) {
    return <div className="product-grid"></div>;
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          selectedProducts={selectedProducts}
          onProductSelect={onProductSelect}
        />
      ))}
    </div>
  );
}

export default ProductGrid;