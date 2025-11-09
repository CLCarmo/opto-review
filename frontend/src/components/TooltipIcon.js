import React from 'react';
import './TooltipIcon.css'; // Importa o CSS que acabámos de criar

/**
 * Componente Reutilizável de Tooltip
 * @param {string} text - O texto a ser mostrado no balão de ajuda.
 */
function TooltipIcon({ text }) {
  return (
    <span className="tooltip-icon">
      ?
      <span className="tooltip-text">
        {text}
      </span>
    </span>
  );
}

export default TooltipIcon;