// frontend/src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

// Avatares Fixos
const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Slayer",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Mage"
];

const COLOR_OPTIONS = ['#cccccc', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#1a202c'];

function ProfilePage() {
  const { user, logout, updateUser, favorites } = useAuth();
  const navigate = useNavigate();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState(''); // Guarda o URL do avatar selecionado
  const [tempBg, setTempBg] = useState('');
  const [saving, setSaving] = useState(false);

  // Inicializa os campos quando abre
  useEffect(() => {
      if (user) {
          setTempName(user.nome || '');
          setTempAvatar(user.avatar_url || '');
          setTempBg(user.avatar_bg || '#cccccc');
      }
  }, [user, showSettingsModal]);

  // Função para ler arquivo de imagem (Upload)
  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { alert("Máximo 2MB"); return; }

      const reader = new FileReader();
      reader.onloadend = () => setTempAvatar(reader.result); // Converte para texto e salva no estado
      reader.readAsDataURL(file);
  };

  const handleSaveSettings = async () => {
      setSaving(true);
      await updateUser({ nome: tempName, avatar_url: tempAvatar, avatar_bg: tempBg });
      setSaving(false);
      setShowSettingsModal(false);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return <div className="page-container">Faça login.</div>;

  return (
    <div className="profile-page">
      <div className="profile-header-banner" style={{ backgroundColor: user.avatar_bg || '#1a202c' }}></div>
      
      <div className="profile-content container">
        <div className="user-card-main">
            <div className="user-avatar-large" style={{ backgroundColor: user.avatar_bg || '#ccc' }}>
                {user.avatar_url ? <img src={user.avatar_url} alt="Avatar" /> : <span>{user.nome?.charAt(0)}</span>}
            </div>
            <h1>{user.nome}</h1>
            <p className="user-email">{user.email}</p>
            <div className="profile-actions">
                <button className="btn-edit" onClick={() => setShowSettingsModal(true)}>Editar Perfil</button>
                <button className="btn-logout-profile" onClick={handleLogout}>Sair</button>
            </div>
        </div>

        {/* MODAL DE EDIÇÃO */}
        {showSettingsModal && (
          <div className="modal-overlay">
              <div className="modal-content settings-modal">
                  <div className="modal-header">
                      <h3>Editar Perfil</h3>
                      <button onClick={() => setShowSettingsModal(false)}>X</button>
                  </div>
                  <div className="modal-body">
                      {/* PREVIEW */}
                      <div className="avatar-preview" style={{ backgroundColor: tempBg, width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px', overflow: 'hidden', border: '2px solid #ddd' }}>
                          {tempAvatar && <img src={tempAvatar} alt="Preview" style={{width: '100%', height:'100%', objectFit:'cover'}} />}
                      </div>

                      <label>Nome</label>
                      <input className="input-field" type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} />

                      <label>Escolher Avatar</label>
                      <div className="avatar-options" style={{display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center'}}>
                          {AVATAR_OPTIONS.map((url, idx) => (
                              <img 
                                key={idx} 
                                src={url} 
                                // AQUI: Adiciona classe 'selected' se for o atual
                                className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`}
                                onClick={() => setTempAvatar(url)}
                                alt="Opção"
                                style={{ width: 50, height: 50, borderRadius: '50%', cursor: 'pointer', border: tempAvatar === url ? '3px solid #3182ce' : '2px solid transparent' }}
                              />
                          ))}
                      </div>
                      
                      <label style={{marginTop: 10, display: 'block'}}>Ou subir imagem:</label>
                      <input type="file" accept="image/*" onChange={handleFileUpload} />

                      <label style={{marginTop: 10, display: 'block'}}>Cor de Fundo</label>
                      <div className="color-options" style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
                          {COLOR_OPTIONS.map(color => (
                              <div 
                                key={color} 
                                onClick={() => setTempBg(color)}
                                style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: color, cursor: 'pointer', border: tempBg === color ? '3px solid #3182ce' : '2px solid transparent', transform: tempBg === color ? 'scale(1.2)' : 'scale(1)' }}
                              />
                          ))}
                      </div>
                  </div>
                  <div className="modal-footer" style={{marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10}}>
                      <button onClick={() => setShowSettingsModal(false)}>Cancelar</button>
                      <button className="btn-save" onClick={handleSaveSettings} disabled={saving} style={{background: '#3182ce', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 5}}>
                          {saving ? 'Salvando...' : 'Salvar'}
                      </button>
                  </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;