import React from 'react';
import { Link } from 'react-router-dom';
import './UpgradePage.css'; // Mantemos o CSS para estrutura básica

function UpgradePage() {
  return (
    <div className="upgrade-page-wrapper">
      <div className="wizard-container" style={{textAlign: 'center', padding: '4rem 2rem'}}>
        
        {/* Ícone de Construção */}
        <div style={{fontSize: '4rem', color: '#cbd5e0', marginBottom: '1.5rem'}}>
            <i className="fas fa-hard-hat"></i>
        </div>

        <h1 style={{fontSize: '2rem', marginBottom: '1rem', color: '#1a202c'}}>
            Funcionalidade em Desenvolvimento
        </h1>
        
        <p style={{fontSize: '1.1rem', color: '#718096', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6'}}>
            Estamos trabalhando duro no nosso <strong>Mago de Recomendação Inteligente</strong>. 
            Em breve, você poderá gerar setups personalizados com base em inteligência de dados.
        </p>

        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <Link to="/produtos" className="wizard-btn next" style={{textDecoration: 'none'}}>
                Explorar Produtos <i className="fas fa-search"></i>
            </Link>
            <Link to="/" className="wizard-btn back" style={{textDecoration: 'none'}}>
                Voltar para Home
            </Link>
        </div>

      </div>
    </div>
  );
}

export default UpgradePage;