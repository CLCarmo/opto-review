import React, { useState } from 'react';
import './TermCard.css'; // Importa o CSS que acabámos de criar

/**
 * Componente TermCard
 * Renderiza um único termo do glossário.
 * Ele gere o seu próprio estado de "expandido" ou "fechado".
 */
function TermCard({ termData }) {
  // 1. Estado local: Cada cartão sabe se está expandido ou não.
  const [isExpanded, setIsExpanded] = useState(false);

  // 2. Handler de Clique: Inverte o estado ao clicar.
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Desestrutura os dados do termo para facilitar o uso
  const { term, category, subcategory, explanation, practical_tip, details } = termData;

  return (
    // 3. Classe dinâmica: Adiciona 'expanded' se o estado for true
    <div className={`term-item ${isExpanded ? 'expanded' : ''}`}>
      
      {/* 4. O header inteiro é o botão de clique */}
      <div className="term-header" onClick={handleToggle}>
        <div className="term-info">
          <h3 className="term-title">{term}</h3>
          <div className="term-tags">
            <span className="term-tag category">{category}</span>
            {subcategory && (
              <span className="term-tag subcategory">{subcategory}</span>
            )}
          </div>
        </div>
        <button className="toggle-icon">
          <i className="fas fa-chevron-down"></i>
        </button>
      </div>
      
      {/* 5. Renderização Condicional: O conteúdo só aparece se 'isExpanded' for true */}
      {isExpanded && (
        <div className="term-content">
          <p className="explanation">{explanation}</p>
          
          {practical_tip && (
            <div className="practical-tip">
              <strong><i className="fas fa-lightbulb"></i> Dica Prática:</strong>
               {practical_tip}
            </div>
          )}
          
          {details && (
            <p className="details">{details}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TermCard;