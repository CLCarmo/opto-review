import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

// (NOVO) 1. Importa o nosso "hook" de autenticação
import { useAuth } from '../context/AuthContext';

/**
 * Componente LoginPage
 * (VERSÃO FINAL - Com abas de Login E Registo)
 */
function LoginPage() {

  // --- ESTADO GLOBAL DA PÁGINA ---
  const [mode, setMode] = useState('login'); 
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(''); 
  const navigate = useNavigate();

  // (NOVO) 2. Pega as funções e o estado do nosso "cérebro" (AuthContext)
  const { login, isLoggedIn } = useAuth();

  // --- ESTADOS DO FORMULÁRIO DE LOGIN ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // --- ESTADOS DO FORMULÁRIO DE REGISTO ---
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // --- ESTADOS DOS MODAIS (Mantidos) ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  
  // --- ESTADOS DE ERRO DE VALIDAÇÃO (Separados) ---
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  const [registerNameError, setRegisterNameError] = useState('');
  const [registerEmailError, setRegisterEmailError] = useState('');
  const [registerPasswordError, setRegisterPasswordError] = useState('');
  const [registerConfirmPasswordError, setRegisterConfirmPasswordError] = useState('');

  // Tenta ler o e-mail salvo se "Lembrar-me" foi usado
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setLoginEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // (NOVO) 3. Efeito que redireciona se o utilizador já estiver logado
  useEffect(() => {
    if (isLoggedIn) {
        // Se o utilizador já está logado (lido do localStorage pelo Contexto),
        // não o deixamos ver a página de login.
        navigate('/'); // Volta para a Home
    }
  }, [isLoggedIn, navigate]);


  // Função para limpar todos os erros
  const clearAllErrors = () => {
    setFormError('');
    setLoginEmailError('');
    setLoginPasswordError('');
    setRegisterNameError('');
    setRegisterEmailError('');
    setRegisterPasswordError('');
    setRegisterConfirmPasswordError('');
  };

  // --- FUNÇÃO DE LOGIN (ATUALIZADA) ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearAllErrors();

    // Validação local...
    let isValid = true;
    if (!loginEmail) {
      setLoginEmailError('O e-mail é obrigatório.');
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(loginEmail)) {
      setLoginEmailError('Formato de e-mail inválido.');
      isValid = false;
    }
    if (!loginPassword) {
      setLoginPasswordError('A senha é obrigatória.');
      isValid = false;
    }
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://opto-review-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          senha: loginPassword 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro desconhecido no login');

      // 5. SUCESSO!
      // (CORREÇÃO) 4. Chamamos a função login do Contexto com os dados do utilizador
      login(data); 
      
      console.log('Login bem-sucedido!', data);
      navigate('/'); // Redireciona para a Home (Isto pode ser removido, já que o useEffect acima vai tratar disso)

    } catch (err) {
      setFormError(err.message); 
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNÇÃO DE REGISTO (Sem alteração) ---
  // (Não queremos logar o utilizador automaticamente após o registo)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    clearAllErrors();

    // Validação local...
    let isValid = true;
    if (!registerName) {
      setRegisterNameError('O nome é obrigatório.');
      isValid = false;
    }
    if (!registerEmail) {
      setRegisterEmailError('O e-mail é obrigatório.');
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(registerEmail)) {
      setRegisterEmailError('Formato de e-mail inválido.');
      isValid = false;
    }
    if (!registerPassword) {
      setRegisterPasswordError('A senha é obrigatória.');
      isValid = false;
    } else if (registerPassword.length < 6) {
      setRegisterPasswordError('A senha deve ter pelo menos 6 caracteres.');
      isValid = false;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterConfirmPasswordError('As senhas não coincidem.');
      isValid = false;
    }
    if (!isValid) return; 

    setIsLoading(true);
    try {
      const response = await fetch('https://opto-review-production.up.railway.app/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: registerName,
          email: registerEmail,
          senha: registerPassword
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido no registo');
      }

      // 5. SUCESSO!
      console.log('Registo bem-sucedido!', data);
      
      // Muda para o modo 'login' e dá uma mensagem de sucesso
      setMode('login');
      // Limpa os campos de registo:
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      // (Idealmente, mostramos uma mensagem de sucesso aqui)
      setFormError('Registo concluído com sucesso! Faça o login.');


    } catch (err) {
      console.error('Erro no registo:', err.message);
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  // --- FUNÇÕES DOS MODAIS (Mantidas) ---
  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setResetEmailError('');
    if (!resetEmail) {
      setResetEmailError('Por favor, insira seu e-mail.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowForgotModal(false);
      setShowSuccessModal(true);
      setResetEmail('');
    }, 1500);
  };
  
  // --- FUNÇÃO PARA TROCAR DE MODO ---
  const toggleMode = (newMode) => {
    clearAllErrors();
    setMode(newMode);
  };


  // --- RENDERIZAÇÃO (JSX) ---
  return (
    // Usamos o wrapper de escopo de CSS
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* --- Lado Esquerdo: O Formulário --- */}
        <div className="login-content">
          
          {/* --- CABEÇALHO (Muda com o modo) --- */}
          {mode === 'login' ? (
            <div className="login-header">
              <Link to="/" className="login-logo">OPTO REVIEW</Link>
              <h2>Bem-vindo de volta!</h2>
              <p>Faça login para continuar.</p>
            </div>
          ) : (
            <div className="login-header">
              <Link to="/" className="login-logo">OPTO REVIEW</Link>
              <h2>Crie sua conta</h2>
              <p>É rápido e fácil. Comece a montar seu setup.</p>
            </div>
          )}

          {/* Erro Global da API */}
          <div className={`form-global-error ${formError ? 'visible' : ''}`}>
            {formError}
          </div>

          {/* --- FORMULÁRIO DE LOGIN (Condicional) --- */}
          {mode === 'login' && (
            <form id="login-form" onSubmit={handleLoginSubmit}>
              <div className={`form-group ${loginEmailError ? 'error' : ''}`}>
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="ex: seuemail@dominio.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <span className="form-error">{loginEmailError}</span>
              </div>

              <div className={`form-group ${loginPasswordError ? 'error' : ''}`}>
                <div className="label-wrapper">
                  <label htmlFor="password">Senha</label>
                  <a href="#" className="forgot-link" onClick={() => setShowForgotModal(true)}>
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="password-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    id="password" 
                    className="form-input" 
                    placeholder="Sua senha segura"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button className="toggle-password" onClick={handleShowPassword}>
                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
                <span className="form-error">{loginPasswordError}</span>
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Lembrar-me
                </label>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                <span style={{ display: isLoading ? 'none' : 'block' }}>Entrar</span>
                <span className="btn-loading" style={{ display: isLoading ? 'flex' : 'none' }}>
                  <i className="fas fa-spinner fa-spin"></i>
                  Entrando...
                </span>
              </button>
            </form>
          )}

          {/* --- FORMULÁRIO DE REGISTO (Condicional) --- */}
          {mode === 'register' && (
            <form id="register-form" onSubmit={handleRegisterSubmit}>
              <div className={`form-group ${registerNameError ? 'error' : ''}`}>
                <label htmlFor="register-name">Nome Completo</label>
                <input 
                  type="text" 
                  id="register-name" 
                  className="form-input" 
                  placeholder="Seu nome"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
                <span className="form-error">{registerNameError}</span>
              </div>

              <div className={`form-group ${registerEmailError ? 'error' : ''}`}>
                <label htmlFor="register-email">E-mail</label>
                <input 
                  type="email" 
                  id="register-email" 
                  className="form-input" 
                  placeholder="ex: seuemail@dominio.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <span className="form-error">{registerEmailError}</span>
              </div>

              <div className={`form-group ${registerPasswordError ? 'error' : ''}`}>
                <label htmlFor="register-password">Senha</label>
                <input 
                  type="password"
                  id="register-password" 
                  className="form-input" 
                  placeholder="Mínimo 6 caracteres"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <span className="form-error">{registerPasswordError}</span>
              </div>
              
              <div className={`form-group ${registerConfirmPasswordError ? 'error' : ''}`}>
                <label htmlFor="register-confirm-password">Confirmar Senha</label>
                <input 
                  type="password"
                  id="register-confirm-password" 
                  className="form-input" 
                  placeholder="Repita a senha"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                />
                <span className="form-error">{registerConfirmPasswordError}</span>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                <span style={{ display: isLoading ? 'none' : 'block' }}>Criar Conta</span>
                <span className="btn-loading" style={{ display: isLoading ? 'flex' : 'none' }}>
                  <i className="fas fa-spinner fa-spin"></i>
                  Criando...
                </span>
              </button>
            </form>
          )}


          {/* --- RODAPÉ (Links sociais e troca de modo) --- */}
          <div className="divider">
            <span>OU</span>
          </div>

          <div className="social-login">
            <button className="social-btn google" disabled title="Funcionalidade em desenvolvimento">
              <i className="fab fa-google"></i> Google (Em breve)
            </button>
            <button className="social-btn discord" disabled title="Funcionalidade em desenvolvimento">
              <i className="fab fa-discord"></i> Discord (Em breve)
            </button>
          </div>

          <div className="register-link">
            {mode === 'login' ? (
              <span>
                Não tem uma conta?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); toggleMode('register'); }}>
                  Crie uma agora
                </a>
              </span>
            ) : (
              <span>
                Já tem uma conta?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); toggleMode('login'); }}>
                  Faça login
                </a>
              </span>
            )}
          </div>
        </div>

        {/* --- Lado Direito: A Imagem (Mantido) --- */}
        <div className="login-promo-banner">
          <h3>Por que fazer login?</h3>
          <ul className="promo-features">
            <li className="promo-feature-item">
              <div className="feature-item-header">
                <i className="fas fa-heart"></i>
                <span className="feature-item-title">Lista de Favoritos</span>
              </div>
              <p className="feature-item-description">
                Salve produtos que você gostou para consultar depois.
              </p>
            </li>
            <li className="promo-feature-item">
              <div className="feature-item-header">
                <i className="fas fa-columns"></i>
                <span className="feature-item-title">Comparações Salvas</span>
              </div>
              <p className="feature-item-description">
                Mantenha suas comparações de produtos organizadas.
              </p>
            </li>
            <li className="promo-feature-item">
              <div className="feature-item-header">
                <i className="fas fa-cogs"></i>
                <span className="feature-item-title">Setup Personalizado</span>
              </div>
              <p className="feature-item-description">
                Receba recomendações baseadas no seu perfil.
              </p>
            </li>
            <li className="promo-feature-item">
              <div className="feature-item-header">
                <i className="fas fa-bell"></i>
                <span className="feature-item-title">Alertas de Preço</span>
              </div>
              <p className="feature-item-description">
                Seja notificado quando produtos baixarem de preço.
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* --- MODAIS (Mantidos - Sem alteração) --- */}
      {showForgotModal && (
        <div className="modal" id="forgot-modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Recuperar Senha</h3>
              <button className="modal-close" id="close-forgot-modal" onClick={() => setShowForgotModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="modal-body" id="forgot-form" onSubmit={handleForgotSubmit}>
              <p>Insira seu e-mail e enviaremos um link para redefinir sua senha.</p>
              <div className={`form-group ${resetEmailError ? 'error' : ''}`}>
                <label htmlFor="reset-email">E-mail de recuperação</label>
                <input 
                  type="email" 
                  id="reset-email" 
                  className="form-input" 
                  placeholder="Seu e-mail cadastrado"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <span className="form-error">{resetEmailError}</span>
              </div>
              <div className="modal-actions">
                <button type="button" className="wizard-btn secondary" onClick={() => setShowForgotModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="login-btn" id="send-reset-btn" disabled={isLoading}>
                  <span style={{ display: isLoading ? 'none' : 'block' }}>Enviar</span>
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

      {showSuccessModal && (
        <div className="modal" id="success-modal" style={{ display: 'block' }}>
          <div className="modal-content success-modal">
            <div className="modal-header">
              <h3>E-mail Enviado!</h3>
              <button className="modal-close" id="close-success-modal" onClick={() => setShowSuccessModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <p>Enviamos as instruções de recuperação de senha para o seu e-mail. Verifique sua caixa de entrada e spam.</p>
              <button className="login-btn" id="close-success-btn" onClick={() => setShowSuccessModal(false)}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div> 
  );
}

export default LoginPage;