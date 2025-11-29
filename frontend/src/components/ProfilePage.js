import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Slayer",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Mage"
];

const COLOR_OPTIONS = [
    '#cccccc', // Cinza Padrão
    '#ef4444', // Vermelho
    '#f97316', // Laranja
    '#eab308', // Amarelo
    '#22c55e', // Verde
    '#3b82f6', // Azul
    '#a855f7', // Roxo
    '#ec4899', // Rosa
    '#1a202c'  // Preto
];

function ProfilePage() {
  const { user, logout, favorites, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // Modais
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Estados de Edição (Configurações)
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [msg, setMsg] = useState('');

  const [recommendations, setRecommendations] = useState([]);

  // Redirecionamento dentro de useEffect ---
  useEffect(() => {
      if (!user) {
          navigate('/login');
      }
  }, [user, navigate]);

  //  useEffect principal seguro ---
  useEffect(() => {
    // Se não tiver user, paramos aqui (o redirect acima vai lidar com isso)
    if (!user) return;

    // Preenche os campos de edição com os dados atuais
    setEditName(user.nome || '');
    setEditEmail(user.email || '');

    // Busca recomendações
    const fetchRecs = async () => {
        try {
            const res = await fetch('https://opto-review-production.up.railway.app/api/produtos');
            const data = await res.json();
            const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 4);
            setRecommendations(shuffled);
        } catch (e) { console.error(e); }
    };
    fetchRecs();
  }, [user]);

  // Handlers
  const handleLogout = () => { logout(); navigate('/'); };

  const handleSelectAvatar = (url) => { updateUser({ avatar_url: url }); };
  const handleColorSelect = (color) => { updateUser({ avatar_bg: color }); };

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 100000) { 
              alert("A imagem é muito grande! O limite é 100KB.");
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => { updateUser({ avatar_url: reader.result }); };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveSettings = async (e) => {
      e.preventDefault();
      setMsg('');
      
      const dataToUpdate = { nome: editName, email: editEmail };
      if (editPassword) {
          if (editPassword.length < 6) { setMsg('Senha muito curta.'); return; }
          dataToUpdate.senha = editPassword;
      }

      await updateUser(dataToUpdate);
      setMsg('Dados atualizados!');
      setEditPassword('');
      setTimeout(() => { setShowSettingsModal(false); setMsg(''); }, 1500);
  };

  // --- CORREÇÃO 3: O retorno antecipado (Loading/Null) fica APÓS todos os Hooks ---
  if (!user) return null;

  const memberSince = new Date().getFullYear();

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        
        {/* HEADER */}
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar-circle-large" style={{ backgroundColor: user.avatar_bg || '#cccccc' }}>
                {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Perfil" />
                ) : (
                    user.nome.charAt(0).toUpperCase()
                )}
            </div>
            <button className="edit-avatar-btn" onClick={() => setShowAvatarModal(true)} title="Alterar Imagem">
                <i className="fas fa-camera"></i>
            </button>
          </div>

          <div className="profile-info">
            <h1>{user.nome}</h1>
            <p className="email">{user.email}</p>
            <span className="member-badge">
                <i className="fas fa-medal"></i> Membro desde {memberSince}
            </span>
          </div>
          
          <button onClick={handleLogout} className="logout-btn-profile">
            <i className="fas fa-sign-out-alt"></i> Sair
          </button>
        </div>

        {/* MODAIS */}
        {showAvatarModal && (
            <div className="avatar-modal-overlay" onClick={() => setShowAvatarModal(false)}>
                <div className="avatar-modal" onClick={e => e.stopPropagation()}>
                    <h3>Personalize seu Avatar</h3>
                    <div className="upload-section">
                        <p>Envie sua imagem (Máx 100KB):</p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} id="file-upload" className="file-input"/>
                        <label htmlFor="file-upload" className="upload-btn"><i className="fas fa-upload"></i> Escolher Arquivo</label>
                    </div>
                    <div className="divider-text"><span>OU escolha um pronto</span></div>
                    <div className="avatar-grid">
                        {AVATAR_OPTIONS.map((url, index) => (
                            <div key={index} className="avatar-option" onClick={() => handleSelectAvatar(url)}>
                                <img src={url} alt="Avatar Option" />
                            </div>
                        ))}
                    </div>
                    <div className="divider-text"><span>Cor de Fundo</span></div>
                    <div className="color-grid">
                        {COLOR_OPTIONS.map((color) => (
                            <div key={color} className={`color-circle ${user.avatar_bg === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }} onClick={() => handleColorSelect(color)}></div>
                        ))}
                    </div>
                    <button className="close-modal-btn" onClick={() => setShowAvatarModal(false)}>Fechar</button>
                </div>
            </div>
        )}

        {showSettingsModal && (
            <div className="avatar-modal-overlay" onClick={() => setShowSettingsModal(false)}>
                <div className="avatar-modal settings-modal" onClick={e => e.stopPropagation()}>
                    <h3><i className="fas fa-cog"></i> Editar Dados</h3>
                    <form onSubmit={handleSaveSettings} className="settings-form">
                        <div className="form-group"><label>Nome</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} required /></div>
                        <div className="form-group"><label>E-mail</label><input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required /></div>
                        <div className="form-group"><label>Nova Senha</label><input type="password" placeholder="Opcional" value={editPassword} onChange={e => setEditPassword(e.target.value)} /></div>
                        {msg && <div className="success-msg">{msg}</div>}
                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowSettingsModal(false)}>Cancelar</button>
                            <button type="submit" className="save-btn">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* SETUP ATUAL */}
        <section className="profile-section">
            <div className="section-title-row">
                <h2><i className="fas fa-desktop"></i> Setup Atual</h2>
                {user.setup_atual && <Link to="/upgrade" className="edit-setup-link"><i className="fas fa-pen"></i> Mudar Setup</Link>}
            </div>
            {user.setup_atual ? (
                <div className="current-setup-card">
                    <div className="setup-item"><i className="fas fa-microchip"></i><div><strong>Processador</strong><p>{user.setup_atual.cpu?.nome || user.setup_atual.cpu || "Genérico"}</p></div></div>
                    <div className="setup-item"><i className="fas fa-video"></i><div><strong>Placa de Vídeo</strong><p>{user.setup_atual.gpu?.nome || user.setup_atual.gpu || "Genérica"}</p></div></div>
                    <div className="setup-status"><i className="fas fa-check-circle"></i> Setup Definido</div>
                </div>
            ) : (
                <div className="empty-setup-state">
                    <p>Você ainda não definiu seu setup atual.</p>
                    <Link to="/upgrade" className="btn-create-setup"><i className="fas fa-plus"></i> Definir meu Setup</Link>
                </div>
            )}
        </section>

        {/* DASHBOARD GRID */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon red"><i className="fas fa-heart"></i></div>
            <div className="card-content">
              <h3>Meus Favoritos</h3>
              <p>Você tem <strong>{favorites.length}</strong> itens salvos.</p>
              <Link to="/favoritos" className="card-link">Ver Lista <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-icon blue"><i className="fas fa-cog"></i></div>
            <div className="card-content">
              <h3>Configurações</h3>
              <p>Gerencie seus dados.</p>
              <button className="card-link" onClick={() => setShowSettingsModal(true)}>Editar Perfil <i className="fas fa-pen"></i></button>
            </div>
          </div>
        </div>

        {/* RECOMENDAÇÕES */}
        <section className="recommendations-section">
            <h2><i className="fas fa-star"></i> Recomendado para você</h2>
            <div className="rec-carousel">
                {recommendations.map(prod => (
                    <Link to={`/produtos/${prod.id_produto}`} key={prod.id_produto} className="rec-card">
                        <img src={prod.imagem_url} alt={prod.nome} />
                        <h4>{prod.nome}</h4>
                        <span>R$ {parseFloat(prod.price_low).toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
                    </Link>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;