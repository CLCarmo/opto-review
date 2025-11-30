import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

// Avatares pré-definidos
const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Slayer",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Mage"
];

// Cores de fundo
const COLOR_OPTIONS = [
  '#cccccc', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#1a202c'
];

function ProfilePage() {
  const { user, logout, updateUser, favorites } = useAuth();
  const navigate = useNavigate();

  // Estados locais
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState('');
  const [tempBg, setTempBg] = useState('');
  const [saving, setSaving] = useState(false);

  const [recommendations, setRecommendations] = useState([]);

  // Carrega dados iniciais ao abrir o modal
  useEffect(() => {
    if (user) {
      setTempName(user.nome || '');
      setTempAvatar(user.avatar_url || '');
      setTempBg(user.avatar_bg || '#cccccc');
    }
  }, [user, showSettingsModal]);

  // Recomendados
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch('https://opto-review-production.up.railway.app/api/produtos');
        const data = await res.json();
        setRecommendations(data.slice(0, 3));
      } catch (e) { console.error(e); }
    };
    fetchRecs();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Upload Base64
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Salvar alterações
  const handleSaveSettings = async () => {
    setSaving(true);

    const updates = {
      nome: tempName,
      avatar_url: tempAvatar,
      avatar_bg: tempBg
    };

    await updateUser(updates);

    setSaving(false);
    setShowSettingsModal(false);
  };

  if (!user) return <div className="page-container">Faça login para ver seu perfil.</div>;

  return (
    <div className="profile-page">

      {/* Banner */}
      <div
        className="profile-header-banner"
        style={{ backgroundColor: user.avatar_bg || '#1a202c' }}
      ></div>

      <div className="profile-content container">

        {/* CARD DO USUÁRIO */}
        <div className="user-card-main">
          <div
            className="user-avatar-large"
            style={{
              backgroundColor: user.avatar_bg || '#ccc',
              border: `4px solid ${user.avatar_bg || '#ccc'}`
            }}
          >
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" />
            ) : (
              <span>{user.nome?.charAt(0)}</span>
            )}
          </div>

          <h1>{user.nome}</h1>
          <p className="user-email">{user.email}</p>

          <div className="user-badges">
            <span className="badge">Membro desde 2024</span>
            <span className="badge pro">Beta Tester</span>
          </div>

          <div className="profile-actions">
            <button className="btn-edit" onClick={() => setShowSettingsModal(true)}>
              <i className="fas fa-cog"></i> Editar Perfil
            </button>
            <button className="btn-logout-profile" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>

        {/* DASHBOARD */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon red"><i className="fas fa-heart"></i></div>
            <div className="card-content">
              <h3>Meus Favoritos</h3>
              <p>Você tem <strong>{favorites?.length || 0}</strong> itens salvos.</p>
              <Link to="/favoritos" className="card-link">Ver Lista <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon blue"><i className="fas fa-cog"></i></div>
            <div className="card-content">
              <h3>Configurações</h3>
              <p>Gerencie seus dados e preferências.</p>
              <button className="card-link" onClick={() => setShowSettingsModal(true)}>
                Editar Perfil <i className="fas fa-pen"></i>
              </button>
            </div>
          </div>
        </div>

        {/* RECOMENDADOS */}
        <section className="recommendations-section">
          <h2><i className="fas fa-star"></i> Recomendado para você</h2>
          <div className="rec-carousel">
            {recommendations.map(prod => (
              <Link to={`/produtos/${prod.id_produto}`} key={prod.id_produto} className="rec-card">
                <img src={prod.imagem_url || 'https://via.placeholder.com/150'} alt={prod.nome} />
                <h4>{prod.nome}</h4>
                <span>R$ {parseFloat(prod.price_low || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>


      {/* MODAL DE EDIÇÃO */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content settings-modal">

            <div className="modal-header">
              <h3>Editar Perfil</h3>
              <button onClick={() => setShowSettingsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">

              {/* Nome */}
              <label>Nome de Exibição</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="input-field"
              />

              {/* Avatar */}
              <label>Avatar</label>
              <div className="avatar-selection">
                
                {/* Avatares pré-definidos */}
                <div className="avatar-grid">
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <div
                      key={idx}
                      className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`}
                      onClick={() => setTempAvatar(url)}
                    >
                      <img src={url} alt={`Avatar ${idx}`} />
                    </div>
                  ))}
                </div>

                {/* Upload personalizado */}
                <div className="upload-section">
                  <p>Ou envie sua própria imagem:</p>

                  <input
                    type="file"
                    accept="image/*"
                    id="avatarUpload"
                    className="file-input"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="avatarUpload" className="upload-btn">
                    Enviar Imagem
                  </label>
                </div>
              </div>

              {/* Cores */}
              <label>Cor de Fundo</label>
              <div className="color-grid">
                {COLOR_OPTIONS.map(color => (
                  <div
                    key={color}
                    className={`color-circle ${tempBg === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTempBg(color)}
                  />
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowSettingsModal(false)}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSaveSettings} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ProfilePage;
