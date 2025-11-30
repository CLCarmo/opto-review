import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

// Avatares Pré-definidos
const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Slayer",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Mage"
];

// Cores de Fundo
const COLOR_OPTIONS = ['#cccccc', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#1a202c'];

function ProfilePage() {
  const { user, logout, updateUser, favorites } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS DO MODAL E EDIÇÃO ---
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState('');
  const [tempBg, setTempBg] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [recommendations, setRecommendations] = useState([]);

  // 1. Carrega dados para o Modal quando o usuário abre ou muda
  useEffect(() => {
      if (user) {
          setTempName(user.nome || '');
          setTempAvatar(user.avatar_url || ''); // Garante que carrega o avatar atual
          setTempBg(user.avatar_bg || '#cccccc');
      }
  }, [user, showSettingsModal]);

  // 2. Busca recomendações (simulação)
  useEffect(() => {
    const fetchRecs = async () => {
        try {
            const res = await fetch('https://opto-review-production.up.railway.app/api/produtos');
            const data = await res.json();
            setRecommendations(data.slice(0, 3)); 
        } catch(e) { console.error(e); }
    };
    fetchRecs();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- LÓGICA DE UPLOAD DE IMAGEM ---
  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Limite de 2MB
      if (file.size > 2 * 1024 * 1024) {
          alert("A imagem deve ter no máximo 2MB.");
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
          setTempAvatar(reader.result); // Atualiza o preview instantaneamente
      };
      reader.readAsDataURL(file);
  };

  // --- SALVAR ALTERAÇÕES ---
  const handleSaveSettings = async () => {
      setSaving(true);
      try {
          // Chama a função do AuthContext para atualizar no Back e no Front
          await updateUser({ 
              nome: tempName, 
              avatar_url: tempAvatar, 
              avatar_bg: tempBg 
          });
          setShowSettingsModal(false); // Fecha o modal só depois de salvar
      } catch (error) {
          alert("Erro ao salvar perfil.");
      } finally {
          setSaving(false);
      }
  };

  if (!user) return <div className="page-container">Faça login para ver seu perfil.</div>;

  return (
    <div className="profile-page">
      {/* 1. BANNER DE FUNDO (Estilo Original) */}
      <div className="profile-header-banner" style={{ backgroundColor: user.avatar_bg || '#1a202c' }}></div>
      
      <div className="profile-content container">
        
        {/* 2. CARD DO USUÁRIO (Estilo Original) */}
        <div className="user-card-main">
            <div className="user-avatar-large" style={{ backgroundColor: user.avatar_bg || '#ccc', border: `4px solid ${user.avatar_bg || '#ccc'}` }}>
                {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" />
                ) : (
                    <span>{user.nome?.charAt(0)}</span>
                )}
            </div>
            
            <h1>{user.nome}</h1>
            <p className="user-email">{user.email}</p>
            
            {/* Badges que você gostava */}
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

        {/* 3. DASHBOARD GRID (Favoritos e Configs) */}
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
              <p>Altere seus dados pessoais.</p>
              <button className="card-link" onClick={() => setShowSettingsModal(true)}>
                  Editar <i className="fas fa-pen"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 4. RECOMENDAÇÕES */}
        <section className="recommendations-section">
            <h2><i className="fas fa-star"></i> Recomendado para você</h2>
            <div className="rec-carousel">
                {recommendations.map(prod => (
                    <Link to={`/produtos/${prod.id_produto}`} key={prod.id_produto} className="rec-card">
                        <img src={prod.imagem_url || 'https://via.placeholder.com/150'} alt={prod.nome} />
                        <h4>{prod.nome}</h4>
                        <span>R$ {parseFloat(prod.price_low || 0).toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
                    </Link>
                ))}
            </div>
        </section>
      </div>

      {/* --- MODAL DE EDIÇÃO (Lógica Nova) --- */}
      {showSettingsModal && (
          <div className="modal-overlay">
              <div className="modal-content settings-modal">
                  <div className="modal-header">
                      <h3>Editar Perfil</h3>
                      <button className="close-btn" onClick={() => setShowSettingsModal(false)}>
                          <i className="fas fa-times"></i>
                      </button>
                  </div>
                  
                  <div className="modal-body">
                      {/* PREVIEW AO VIVO */}
                      <div className="avatar-preview-container">
                          <p>Pré-visualização:</p>
                          <div className="avatar-preview" style={{ backgroundColor: tempBg }}>
                              {tempAvatar ? (
                                  <img src={tempAvatar} alt="Preview" />
                              ) : (
                                  <span>{tempName?.charAt(0) || '?'}</span>
                              )}
                          </div>
                      </div>

                      <div className="form-group">
                          <label>Nome de Exibição</label>
                          <input 
                            type="text" 
                            className="input-field"
                            value={tempName} 
                            onChange={(e) => setTempName(e.target.value)} 
                          />
                      </div>

                      <div className="form-group">
                          <label>Escolher Avatar</label>
                          <div className="avatar-options">
                              {AVATAR_OPTIONS.map((url, idx) => (
                                  <img 
                                    key={idx} 
                                    src={url} 
                                    className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`}
                                    onClick={() => setTempAvatar(url)}
                                    alt="Avatar Opção"
                                  />
                              ))}
                          </div>
                      </div>
                      
                      <div className="form-group">
                          <label>Ou envie sua imagem (Máx 2MB)</label>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="file-input" />
                      </div>

                      <div className="form-group">
                          <label>Cor de Fundo</label>
                          <div className="color-options">
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
                  </div>

                  <div className="modal-footer">
                      <button className="btn-cancel" onClick={() => setShowSettingsModal(false)}>Cancelar</button>
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