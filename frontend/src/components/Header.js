import React from 'react';
// 1. Importamos o Link, NavLink, e o NOVO useNavigate (para o logout)
import { Link, NavLink, useNavigate } from 'react-router-dom';

// 2. Importamos o nosso "cérebro" (o AuthContext)
import { useAuth } from '../context/AuthContext';

/**
 * Componente Header
 * Renderiza o cabeçalho principal e a navegação do site.
 * AGORA É DINÂMICO: Mostra o estado de login do utilizador.
 */
function Header() {
  
  // 3. Acedemos aos dados e funções do nosso cérebro
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate(); // Para redirecionar após o logout

  // 4. Criamos uma função para o botão "Sair"
  const handleLogout = () => {
    logout(); // Chama a função de logout do cérebro
    navigate('/'); // Redireciona o utilizador para a Home
  };

  return (
    <header className="app-header">
      
      {/* O logo é um <Link> para a raiz do site */}
      <Link to="/" className="logo">OPTO REVIEW</Link>
      
      <nav className="navigation">
        {/* Usamos NavLink para que a classe "active" seja gerida */}
        
        <NavLink to="/" className="nav-link" end>Home</NavLink>
        <NavLink to="/produtos" className="nav-link">Buscar Produtos</NavLink>
        <NavLink to="/compare" className="nav-link">Comparar</NavLink>
        
        <NavLink to="/upgrade" className="nav-link">Upgrade/Criar Setup</NavLink>
        <NavLink to="/glossary" className="nav-link">Glossário</NavLink>
        
        {/* =================================================== */}
        {/* 5. AQUI ESTÁ A LÓGICA (Renderização Condicional) */}
        {/* =================================================== */}
        
        {isLoggedIn ? (
          // --- SE ESTIVER LOGADO ---
          <>
            <NavLink to="/favoritos" className="nav-link">
              <i className="fas fa-heart"></i> Favoritos
            </NavLink>

            <Link to="/perfil" className="user-menu-item">
                <div className="header-avatar">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Avatar" />
                    ) : (
                        <span>{user.nome.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <span className="header-username">Olá, {user.nome.split(' ')[0]}</span>
            </Link>
            <button onClick={handleLogout} className="nav-link logout-button">
              <i className="fas fa-sign-out-alt"></i> Sair
            </button>
          </>

        ) : (
          // --- SE NÃO ESTIVER LOGADO ---
          <NavLink to="/login" className="nav-link login-button">
            Login
          </NavLink>
        )}        
      </nav>
    </header>
  );
}

export default Header;