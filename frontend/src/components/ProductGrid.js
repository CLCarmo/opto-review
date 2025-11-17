// frontend/src/components/ProductGrid.js
import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

// 1. ACEITA A NOVA PROP 'activeCategory'
function ProductGrid({ products, selectedProducts, onProductSelect, activeCategory }) {
  
  if (!products) {
    return <div className="product-grid"></div>;
  }

  // Se não houver produtos, mostra uma mensagem
  if (products.length === 0) {
    return (
      <div className="product-grid">
        <div className="no-products-message">
          <i className="fas fa-search"></i>
          <p>Nenhum produto encontrado com os filtros aplicados.</p>
        </div>
      </div>
    );
  }

  const isFull = selectedProducts.length >= 4; // A lista de comparação está cheia?

  return (
    <div className="product-grid">
      {products.map(product => {
        
        // 2. LÓGICA DE TRAVAMENTO
        const isSelected = selectedProducts.includes(product.id);
        
        // O card deve ser travado (disabled) se:
        // A) Uma categoria está ativa (ex: "Mouse") E
        // B) A categoria deste card (ex: "Teclado") é DIFERENTE E
        // C) Este card NÃO está selecionado (para permitir que seja desmarcado)
        const categoryMismatch = activeCategory && product.categoria !== activeCategory;

        // Trava também se a lista estiver cheia e este item não estiver selecionado
        const isLocked = !isSelected && (categoryMismatch || isFull);

        return (
          <ProductCard 
            key={product.id} 
            product={product}
            selectedProducts={selectedProducts}
            onProductSelect={onProductSelect}
            isLocked={isLocked} // 3. PASSA O BOOLEANO 'isLocked'
          />
        );
      })}
    </div>
  );
}

export default ProductGrid;