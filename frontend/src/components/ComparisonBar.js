// src/components/ComparisonBar.js
import React from 'react';
import './ComparisonBar.css'; // Precisaremos criar este CSS

// Recebe a lista de IDs selecionados, todos os produtos, e funções de callback
const ComparisonBar = ({ selectedProductIds, allProducts, onRemoveProduct, onClearSelection, onGoToCompare }) => {
    
    // Encontra os objetos completos dos produtos selecionados
    const selectedProductsData = selectedProductIds
        .map(id => allProducts.find(p => p.id_produto === id))
        .filter(p => p); // Filtra caso algum produto não seja encontrado

    const selectedCount = selectedProductIds.length;
    const canCompare = selectedCount >= 2 && selectedCount <= 4;

    return (
        // A barra só é visível se houver produtos selecionados
        <div className={`comparison-bar ${selectedCount > 0 ? 'active' : ''}`}>
            <div className="comparison-bar-info">
                {/* Contador */}
                <div className="comparison-count">
                    <div className="comparison-count-number">
                        <span>{selectedCount}</span>/4
                    </div>
                    <div className="comparison-helper-text">
                        {selectedCount === 1 ? 'produto selecionado' : 'produtos selecionados'}
                    </div>
                </div>
                {/* Pré-visualização dos produtos selecionados */}
                <div className="selected-products-preview">
                    {selectedProductsData.map(product => (
                        <div key={product.id_produto} className="selected-product-mini" title={product.nome}>
                            <img 
                                src={product.imagem_url || 'https://via.placeholder.com/50?text=Img'} 
                                alt={product.nome}
                                onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/50?text=Erro'; }}
                            />
                            {/* Botão para remover este item específico */}
                            <button 
                                className="remove-mini-btn" 
                                onClick={() => onRemoveProduct(product.id_produto)}
                                title={`Remover ${product.nome}`}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ))}
                    {/* Placeholders vazios até 4 slots */}
                    {Array.from({ length: 4 - selectedCount }).map((_, index) => (
                         <div key={`placeholder-${index}`} className="selected-product-mini placeholder"></div>
                    ))}
                </div>
            </div>
            {/* Botões de Ação */}
            <div className="comparison-bar-actions">
                <button 
                    className="clear-selection-btn" 
                    onClick={onClearSelection}
                    disabled={selectedCount === 0} // Desabilitado se não houver seleção
                >
                    <i className="fas fa-times"></i> Limpar Seleção
                </button>
                <button 
                    className="compare-now-btn" 
                    onClick={onGoToCompare}
                    disabled={!canCompare} // Habilitado apenas com 2 a 4 produtos
                >
                    <i className="fas fa-balance-scale"></i> Comparar ({selectedCount})
                </button>
            </div>
        </div>
    );
};

export default ComparisonBar;