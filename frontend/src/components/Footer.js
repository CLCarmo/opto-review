import React from 'react';

/**
 * Componente Footer
 * Renderiza o rodapé padrão do site.
 */
function Footer() {
  return (
    // Estamos a usar a mesma classe "app-footer" que tinhas
    // no teu HTML original .
    // O teu CSS em /common/base.css já tem os 
    // estilos para esta classe, então ele será estilizado
    // automaticamente.
    <footer className="app-footer">
      <p>&copy; 2025 OPTO Review. Todos os direitos reservados.</p>
    </footer>
  );
}

export default Footer;