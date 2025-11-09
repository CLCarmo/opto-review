import React from 'react';
// Importamos o Link e o NavLink do React Router
import { Link, NavLink } from 'react-router-dom';

/**
 * Componente Header
 * Renderiza o cabeçalho principal e a navegação do site.
 * * Usamos <Link> para o logo, pois é um link simples para a home.
 * * Usamos <NavLink> para os links de navegação porque ele automaticamente
 * adiciona uma classe "active" ao link da página que está 
 * sendo visitada, exatamente como o teu HTML original fazia .
 */
function Header() {
  return (
    // Estamos a usar as classes CSS exatas (app-header, logo, etc.)
    // que já definiste no teu ficheiro /common/base.css ,
    // assim os estilos serão aplicados automaticamente.
    <header className="app-header">
      
      {/* O logo é um <Link> para a raiz do site */}
      <Link to="/" className="logo">OPTO REVIEW</Link>
      
      <nav className="navigation">
        {/* Usamos NavLink para que a classe "active" seja gerida */}
        
        {/* A propriedade 'end' no NavLink da "Home" é importante.
          Ela diz ao router para só marcar este link como ativo se
          a URL for EXATAMENTE "/", e não "/products" ou "/compare".
        */}
        <NavLink to="/" className="nav-link" end>Home</NavLink>
        <NavLink to="/produtos" className="nav-link">Buscar Produtos</NavLink>
        <NavLink to="/compare" className="nav-link">Comparar</NavLink>
        
        {/* Links baseados no teu index.html original */}
        <NavLink to="/upgrade" className="nav-link">Upgrade/Criar Setup</NavLink>
        <NavLink to="/glossary" className="nav-link">Glossário</NavLink>
        <NavLink to="/about" className="nav-link">Sobre</NavLink>
        
        {/* Link de Login */}
        <NavLink to="/login" className="nav-link login-button">Login</NavLink>
      </nav>
    </header>
  );
}

export default Header;