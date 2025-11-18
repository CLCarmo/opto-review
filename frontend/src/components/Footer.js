import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; 2025 OPTO REVIEW. Todos os direitos reservados.</p>
        
        <div className="footer-links">
            {/* O Link agora vive aqui */}
            <Link to="/about" className="footer-link">Sobre o Projeto</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;