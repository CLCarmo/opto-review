import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Para o logo no topo

// 1. Importa o CSS que já copiaste
import './LoginPage.css';

/**
 * Componente LoginPage
 * Substitui o login.html e o login.js 
 */
function LoginPage() {

  // --- ESTADOS (O novo 'login.js') ---
  // Estados para os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para o "Lembrar-me"
  const [rememberMe, setRememberMe] = useState(false);

  // Estado para mostrar/esconder a senha
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para controlar os modais
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Estados para o formulário de "esqueci-me"
  const [resetEmail, setResetEmail] = useState('');

  // Estado de loading (para o submit)
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para mensagens de erro
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');


  // --- EFEITO PARA A CLASSE DO BODY ---
  // O teu CSS tem a classe .login-page no BODY.
  // Este 'useEffect' adiciona essa classe quando o componente
  // "monta" (aparece) e remove-a quando ele "desmonta" (desaparece).
  // // O array vazio [] significa que isto só corre 1 vez (ao montar/desmontar)


  // --- HANDLERS (As funções do componente) ---

  // Validação simples (como no teu login.js )
  const validateLogin = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    
    if (!email) {
      setEmailError('E-mail é obrigatório.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('E-mail inválido.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Senha é obrigatória.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Senha deve ter no mínimo 6 caracteres.');
      isValid = false;
    }
    return isValid;
  };

  // Lida com o submit do Login
  const handleLoginSubmit = (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (!validateLogin() || isLoading) return;

    setIsLoading(true);
    // Simula uma chamada de API (como no teu login.js)
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login:', { email, password, rememberMe });
      // TODO: Lógica de login real (chamar API, guardar token)
      // Se for sucesso:
      // history.push('/'); // Redireciona para a Home (usar 'useNavigate' do React Router)
      alert('Login (simulado) com sucesso! Redirecionando...');
    }, 2000);
  };
  
  // Lida com o submit do "Esqueci-me da Senha"
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setResetEmailError('');

    if (!resetEmail) {
      setResetEmailError('E-mail é obrigatório.');
      return;
    }

    setIsLoading(true);
    // Simula chamada de API
    setTimeout(() => {
      setIsLoading(false);
      setShowForgotModal(false); // Fecha o modal de "esqueci"
      setShowSuccessModal(true); // Abre o modal de "sucesso"
      setResetEmail(''); // Limpa o campo
    }, 2000);
  };
  
  // --- RENDERIZAÇÃO (O JSX) ---
  return (
    // Esta div substitui o <body class="login-page">
    // (Embora o useEffect já tenha adicionado a classe ao body real)
    // Usamos <main> como no teu HTML original
    <>

      {/* --- O CONTAINER DO LOGIN --- */}
      <div className="login-container">
        
        {/* --- LADO ESQUERDO: CONTEÚDO (FORMULÁRIO) --- */}
        <div className="login-content">
          <div className="login-header">
            {/* O Logo agora usa <Link> do React Router */}
            <Link to="/" className="login-logo">
              {/* Se tiveres a LogoOpto.png em /src/assets/images/,
                  podes importá-la no topo e usá-la aqui.
                  Por agora, vamos usar o texto. */}
              {/* <img src={logoImage} alt="OPTO Review" className="logo-image" /> */}
              <h2 className="login-title-logo">OPTO REVIEW</h2>
            </Link>
            <h1 className="login-title">Acesse sua Conta</h1>
            <p className="login-subtitle">Bem-vindo de volta! Faça login para continuar.</p>
          </div>

          <form id="login-form" onSubmit={handleLoginSubmit} noValidate>
            
            {/* --- GRUPO E-MAIL --- */}
            <div className={`form-group ${emailError ? 'error' : ''}`}>
              <label htmlFor="email">E-mail</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {emailError && <div className="error-message">{emailError}</div>}
            </div>

            {/* --- GRUPO SENHA --- */}
            <div className={`form-group ${passwordError ? 'error' : ''}`}>
              <label htmlFor="password">Senha</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  className="form-input" 
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  id="password-toggle" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </button>
              </div>
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>

            {/* --- OPÇÕES (LEMBRAR / ESQUECI) --- */}
            <div className="form-options">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me">Lembrar-me</label>
              </div>
              <button 
                type="button" 
                id="forgot-password" 
                className="link-button"
                onClick={() => setShowForgotModal(true)}
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* --- BOTÃO SUBMIT --- */}
            <button 
              type="submit" 
              id="login-btn" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <span className="btn-text">Entrar</span>
              <span className="btn-loading" style={{ display: isLoading ? 'flex' : 'none' }}>
                <i className="fas fa-spinner fa-spin"></i>
                Entrando...
              </span>
            </button>
          </form>

          {/* --- DIVISOR E LOGIN SOCIAL --- */}
          <div className="separator">
            <span>OU</span>
          </div>
          <div className="social-login">
            <button id="google-login" className="social-btn google">
              <i className="fab fa-google"></i>
              <span>Entrar com Google</span>
            </button>
            <button id="facebook-login" className="social-btn facebook">
              <i className="fab fa-facebook-f"></i>
              <span>Entrar com Facebook</span>
            </button>
          </div>
          <p className="register-link">
            Não tem uma conta? <a href="#">Registre-se</a>
          </p>

        </div> {/* Fim .login-content */}

        {/* --- LADO DIREITO: POR QUE FAZER LOGIN? --- */}
        <div className="login-sidebar">
          <h2 className="sidebar-title">Por que fazer login?</h2>
          
          {/* Lista de features (baseada no teu login.html ) */}
          <ul className="feature-list">
            <li className="feature-item">
              <i className="fas fa-heart"></i>
              <div>
                <h3>Lista de Favoritos</h3>
                <p>Salve produtos que você gostou para consultar depois</p>
              </div>
            </li>
            <li className="feature-item">
              {/* Nota: fa-balance-scale é do FontAwesome v5. Se usas v6, o ícone é fa-scale-balanced */}
              <i className="fas fa-scale-balanced"></i> 
              <div>
                <h3>Comparações Salvas</h3>
                <p>Mantenha suas comparações de produtos organizadas</p>
              </div>
            </li>
            <li className="feature-item">
              <i className="fas fa-cogs"></i>
              <div>
                <h3>Setup Personalizado</h3>
                <p>Receba recomendações baseadas no seu perfil</p>
              </div>
            </li>
            <li className="feature-item">
              <i className="fas fa-bell"></i>
              <div>
                <h3>Alertas de Preço</h3>
                <p>Seja notificado quando produtos baixarem de preço</p>
              </div>
            </li>
          </ul>
        </div>
        
      </div> {/* Fim .login-container */}


      {/* --- MODAIS --- */}
      {/* A visibilidade deles é controlada pelo 'useState' */}

      {/* --- MODAL ESQUECI A SENHA --- */}
      {showForgotModal && (
        <div className="modal" id="forgot-password-modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Recuperar Senha</h3>
              <button 
                className="modal-close" 
                id="close-forgot-modal"
                onClick={() => setShowForgotModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form id="forgot-password-form" onSubmit={handleForgotSubmit} noValidate>
              <div className="modal-body">
                <p>Digite seu e-mail e enviaremos as instruções para redefinir sua senha.</p>
                <div className={`form-group ${resetEmailError ? 'error' : ''}`}>
                  <label htmlFor="reset-email">E-mail de Recuperação</label>
                  <div className="input-wrapper">
                    <i className="fas fa-envelope input-icon"></i>
                    <input 
                      type="email" 
                      id="reset-email" 
                      className="form-input" 
                      placeholder="seu.email@exemplo.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                  {resetEmailError && <div className="error-message" id="reset-email-error">{resetEmailError}</div>}
                </div>
                <button 
                  type="submit" 
                  className={`login-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  <span className="btn-text">Enviar Instruções</span>
                  <span className="btn-loading" style={{ display: isLoading ? 'flex' : 'none' }}>
                    <i className="fas fa-spinner fa-spin"></i>
                    Enviando...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE SUCESSO --- */}
      {showSuccessModal && (
        <div className="modal" id="success-modal" style={{ display: 'block' }}>
          <div className="modal-content success-modal">
            <div className="modal-header">
              <h3>E-mail Enviado!</h3>
              <button 
                className="modal-close" 
                id="close-success-modal"
                onClick={() => setShowSuccessModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <p>Enviamos as instruções de recuperação de senha para o seu e-mail. Verifique sua caixa de entrada e spam.</p>
              <button 
                className="login-btn" 
                id="close-success-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginPage;