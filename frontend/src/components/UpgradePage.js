import React, { useState } from 'react';
import './UpgradePage.css'; // O CSS que já corrigimos

// 1. IMPORTA O NOVO COMPONENTE DE GALERIA
import SearchableGallery from './SearchableGallery';

// --- DADOS PARA AS NOSSAS NOVAS GALERIAS ---
// (Isto pode vir de uma API no futuro)

// 2. DADOS PARA A GALERIA DE APPS (Baseado na tua imagem )
const appsData = [
  { id: 'photoshop', name: 'Photoshop', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg' },
  { id: 'illustrator', name: 'Illustrator', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg' },
  { id: 'premiere', name: 'Premiere Pro', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg' },
  { id: 'aftereffects', name: 'After Effects', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg' },
  { id: 'vscode', name: 'VS Code', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg' },
  { id: 'figma', name: 'Figma', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
  { id: 'sketch', name: 'Sketch', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Sketch_Logo.svg' },
  { id: 'canva', name: 'Canva', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/08/Canva_icon_2021.svg' },
  { id: 'blender', name: 'Blender', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg' },
  { id: 'autocad', name: 'AutoCAD', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/AutoCAD_logo.svg' },
  // ... (etc)
];

// 3. DADOS DE EXEMPLO PARA A GALERIA DE JOGOS
const jogosData = [
  { id: 'valorant', name: 'Valorant', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_pink_color_version.svg' },
  { id: 'csgo', name: 'CS:GO / CS2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Counter-Strike_Global_Offensive_logo.svg' },
  { id: 'lol', name: 'League of Legends', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/League_of_Legends_logo.svg' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_logo.svg' },
  { id: 'eldenring', name: 'Elden Ring', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Elden_Ring_Logo.svg' },
  { id: 'cod', name: 'Call of Duty', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Call_of_Duty_logo.svg' },
  // ... (etc)
];


/**
 * Componente UpgradePage
 * Versão 4.0 - Lógica de Peças e Galerias
 */
function UpgradePage() {
  
  // --- 1. ESTADO ---
  const [currentStep, setCurrentStep] = useState('objetivo'); 
  
  const [formData, setFormData] = useState({
    objetivo: '', 
    orcamento: 5000, 
    foco: '',
    // 4. ESTADO DAS PEÇAS ATUALIZADO (COMO PEDISTE)
    pecasSelecionadas: [], // Controla os checkboxes: ['cpu', 'gpu']
    pecasAtuais: { // Controla os dropdowns/inputs
      cpu: '', gpu: '', ram: '', motherboard: ''
    },
    preferencias_wireless: [],
    // 5. ESTADO DAS GALERIAS
    jogos: [], // IDs dos jogos: ['valorant', 'csgo']
    appsTrabalho: [], // IDs dos apps: ['photoshop', 'vscode']
  });
  
  // --- 2. HANDLERS (Funções que atualizam o estado) ---
  
  // Handlers genéricos (reutilizáveis)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };
  
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prevData => {
      const oldValues = prevData[name];
      let newValues;
      if (checked) {
        newValues = [...oldValues, value];
      } else {
        newValues = oldValues.filter(v => v !== value);
      }
      return { ...prevData, [name]: newValues };
    });
  };

  // 6. HANDLERS PARA O PASSO "PEÇAS"
  const handlePecasCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => {
      const oldValues = prevData.pecasSelecionadas;
      let newValues;
      if (checked) {
        newValues = [...oldValues, value];
      } else {
        newValues = oldValues.filter(v => v !== value);
        // Opcional: Limpa o input se o checkbox for desmarcado
        // (descomentar se quiser esta funcionalidade)
        // const newPecasAtuais = { ...prevData.pecasAtuais, [value]: '' };
        // return { ...prevData, pecasSelecionadas: newValues, pecasAtuais: newPecasAtuais };
      }
      return { ...prevData, pecasSelecionadas: newValues };
    });
  };

  // Handler para os inputs/selects de peças
  const handlePecaAtualChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      pecasAtuais: { ...prevData.pecasAtuais, [name]: value }
    }));
  };

  const handleBudgetChange = (e) => {
    setFormData(prevData => ({ ...prevData, orcamento: parseInt(e.target.value) }));
  };

  // 7. HANDLERS PARA AS GALERIAS
  // (Estas funções são passadas como 'props' para o SearchableGallery)
  const handleJogoSelection = (newSelection) => {
    setFormData(prevData => ({ ...prevData, jogos: newSelection }));
  };

  const handleAppSelection = (newSelection) => {
    setFormData(prevData => ({ ...prevData, appsTrabalho: newSelection }));
  };

  // --- 3. LÓGICA DE NAVEGAÇÃO (A mesma de antes) ---
  const nextStep = () => {
    switch (currentStep) {
      case 'objetivo': setCurrentStep('orcamento'); break;
      case 'orcamento': setCurrentStep('foco'); break;
      case 'foco':
        if (formData.objetivo === 'upgrade') setCurrentStep('pecas_atuais');
        else setCurrentStep('preferencias_wireless');
        break;
      case 'pecas_atuais': setCurrentStep('preferencias_wireless'); break;
      case 'preferencias_wireless':
        switch (formData.foco) {
          case 'jogos': setCurrentStep('finalizar_jogos'); break;
          case 'trabalho': setCurrentStep('finalizar_trabalho'); break;
          case 'estudo': setCurrentStep('finalizar_estudo'); break;
          case 'hibrido': setCurrentStep('finalizar_hibrido'); break;
          default: break;
        }
        break;
      default: break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case 'orcamento': setCurrentStep('objetivo'); break;
      case 'foco': setCurrentStep('orcamento'); break;
      case 'pecas_atuais': setCurrentStep('foco'); break;
      case 'preferencias_wireless':
        if (formData.objetivo === 'upgrade') setCurrentStep('pecas_atuais');
        else setCurrentStep('foco');
        break;
      case 'finalizar_jogos':
      case 'finalizar_trabalho':
      case 'finalizar_estudo':
      case 'finalizar_hibrido':
        setCurrentStep('preferencias_wireless');
        break;
      default: break;
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('--- RECOMENDAÇÃO SOLICITADA (COM GALERIAS) ---');
    console.log(formData);
    alert('Formulário enviado! (Verifique o console para ver os dados)');
  };

  // --- 4. RENDERIZAÇÃO (O JSX) ---
  
  // 8. FUNÇÃO DA BARRA DE PROGRESSO ATUALIZADA (4 PASSOS)
  const getStepStatus = (stepName) => {
    const stepOrder = {
      'objetivo': 1,
      'orcamento': 2,
      'pecas_atuais': 3, // O passo "Peças" é o 3
      'finalizar': 4
    };
    
    // Mapeia o passo atual para a ordem
    let currentOrder = 1; // Default
    if (currentStep === 'orcamento') currentOrder = 2;
    if (currentStep === 'foco' || currentStep === 'pecas_atuais' || currentStep === 'preferencias_wireless') currentOrder = 3;
    if (currentStep.includes('finalizar')) currentOrder = 4;
    
    // Lógica de "pular" o passo 3 (Peças) se for "novo"
    if (stepName === 'pecas_atuais' && formData.objetivo !== 'upgrade') {
      return 'skipped'; 
    }
    
    if (stepOrder[stepName] < currentOrder) return 'completed';
    if (stepOrder[stepName] === currentOrder) return 'active';
    return 'inactive';
  };
  
  return (
    <div className="wizard-container">
      
      {/* CABEÇALHO */}
      <div className="wizard-header">
        <h1>Monte seu Setup ou faça um Upgrade</h1>
        <p>Responda algumas perguntas e encontraremos os melhores componentes para você.</p>
      </div>

      {/* 9. BARRA DE PROGRESSO DE 4 PASSOS (COMO PEDISTE) */}
      <div className="progress-bar">
        <div className={`progress-step ${getStepStatus('objetivo')}`}>
          <div className="step-icon"><i className="fas fa-bullseye"></i></div>
          <div className="step-label">Objetivo</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${getStepStatus('orcamento')}`}>
          <div className="step-icon"><i className="fas fa-dollar-sign"></i></div>
          <div className="step-label">Orçamento</div>
        </div>
        <div className="progress-line"></div>
        {/* O passo "Peças" (só relevante para upgrade) */}
        <div className={`progress-step ${getStepStatus('pecas_atuais')}`}>
          <div className="step-icon"><i className="fas fa-desktop"></i></div>
          <div className="step-label">Peças</div> {/* NOME TROCADO */}
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${getStepStatus('finalizar')}`}>
          <div className="step-icon"><i className="fas fa-check-circle"></i></div>
          <div className="step-label">Finalizar</div>
        </div>
      </div>

      {/* --- FORMULÁRIO --- */}
      <form id="setup-wizard-form" className="wizard-form" onSubmit={handleSubmit}>

        {/* --- PASSO 1: OBJETIVO --- */}
        {currentStep === 'objetivo' && (
          <div className="wizard-step-content">
            <h2 className="step-title">Qual é o seu objetivo principal?</h2>
            <div className="card-selection-grid two-cols">
              <label className="card-option">
                <input type="radio" name="objetivo" value="upgrade"
                       checked={formData.objetivo === 'upgrade'}
                       onChange={handleInputChange} />
                <div className="card-option-content">
                  <i className="fas fa-arrow-up-right-dots card-icon"></i>
                  <h3>Fazer um Upgrade</h3>
                  <p>Já tenho um PC e quero melhorar uma ou mais peças.</p>
                </div>
              </label>
              <label className="card-option">
                <input type="radio" name="objetivo" value="novo"
                       checked={formData.objetivo === 'novo'}
                       onChange={handleInputChange} />
                <div className="card-option-content">
                  <i className="fas fa-box-open card-icon"></i>
                  <h3>Montar um PC Novo</h3>
                  <p>Estou começando do zero e preciso de um setup completo.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* --- PASSO 2: ORÇAMENTO --- */}
        {currentStep === 'orcamento' && (
          <div className="wizard-step-content">
            <h2 className="step-title">Qual é o seu orçamento?</h2>
            <div className="form-group-range">
              <label htmlFor="budget-range">
                Orçamento: <strong>R$ {formData.orcamento.toLocaleString('pt-BR')}</strong>
              </label>
              <input type="range" id="budget-range" className="budget-slider" 
                     min="1500" max="25000" step="500" 
                     value={formData.orcamento}
                     onChange={handleBudgetChange} />
              {/* ... (labels do range) ... */}
            </div>
          </div>
        )}

        {/* --- PASSO 3: FOCO --- */}
        {currentStep === 'foco' && (
          <div className="wizard-step-content">
            <h2 className="step-title">Qual será o foco principal do PC?</h2>
            <div className="card-selection-grid two-cols">
              {/* (O mesmo código de antes para Jogos, Trabalho, Estudo, Híbrido) */}
              <label className="card-option">
                <input type="radio" name="foco" value="jogos"
                       checked={formData.foco === 'jogos'}
                       onChange={handleInputChange} />
                <div className="card-option-content">
                  <i className="fas fa-gamepad card-icon"></i>
                  <h3>Jogos</h3>
                </div>
              </label>
              <label className="card-option">
                <input type="radio" name="foco" value="trabalho"
                       checked={formData.foco === 'trabalho'}
                       onChange={handleInputChange} />
                <div className="card-option-content">
                  <i className="fas fa-briefcase card-icon"></i>
                  <h3>Trabalho / Produtividade</h3>
                </div>
              </label>
              <label className="card-option">
                <input type="radio" name="foco" value="estudo"
                       checked={formData.foco === 'estudo'}
                       onChange={handleInputChange} />
                <div className="card-option-content">
                  <i className="fas fa-book-open card-icon"></i>
                  <h3>Estudo / Uso Geral</h3>
                </div>
              </label>
              <label className="card-option">
                <input type="radio" name="foco" value="hibrido"
                       checked={formData.foco === 'hibrido'}
                       onChange={handleInputChange} />
                <div className="card-option-content">
                  <i className="fas fa-layer-group card-icon"></i>
                  <h3>Híbrido (Multitarefa)</h3>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* --- 10. PASSO "PEÇAS ATUAIS" REFEITO (COMO PEDISTE) --- */}
        {currentStep === 'pecas_atuais' && (
          <div className="wizard-step-content">
            <h2 className="step-title">Quais peças você já possui?</h2>
            <p className="step-subtitle">Selecione as peças que você já tem e quer aproveitar.</p>
            
            {/* 10A. Os Checkboxes */}
            <div className="card-selection-grid three-cols" style={{ marginBottom: '2rem' }}>
              <label className="card-option small">
                <input type="checkbox" name="pecasSelecionadas" value="cpu"
                       checked={formData.pecasSelecionadas.includes('cpu')}
                       onChange={handlePecasCheckboxChange} />
                <div className="card-option-content">
                  <i className="fas fa-microchip card-icon"></i>
                  <h3>Processador</h3>
                </div>
              </label>
              <label className="card-option small">
                <input type="checkbox" name="pecasSelecionadas" value="gpu"
                       checked={formData.pecasSelecionadas.includes('gpu')}
                       onChange={handlePecasCheckboxChange} />
                <div className="card-option-content">
                  <i className="fas fa-tv card-icon"></i>
                  <h3>Placa de Vídeo</h3>
                </div>
              </label>
              <label className="card-option small">
                <input type="checkbox" name="pecasSelecionadas" value="ram"
                       checked={formData.pecasSelecionadas.includes('ram')}
                       onChange={handlePecasCheckboxChange} />
                <div className="card-option-content">
                  <i className="fas fa-memory card-icon"></i>
                  <h3>Memória RAM</h3>
                </div>
              </label>
              {/* (Podes adicionar mais, ex: Placa Mãe, Fonte) */}
            </div>

            {/* 10B. Os Inputs Condicionais (A "nova aba" que pediste) */}
            <div className="form-grid">
              {/* Este é o "selectdropdow" que pediste. */}
              {/* No futuro, podemos trocar <input> por <Select ... /> */}
              
              {formData.pecasSelecionadas.includes('cpu') && (
                <div className="form-group">
                  <label htmlFor="cpu">Seu Processador (CPU)</label>
                  <input type="text" id="cpu" name="cpu" className="form-input" 
                         placeholder="Ex: Ryzen 5 3600"
                         value={formData.pecasAtuais.cpu}
                         onChange={handlePecaAtualChange} />
                </div>
              )}
              {formData.pecasSelecionadas.includes('gpu') && (
                <div className="form-group">
                  <label htmlFor="gpu">Sua Placa de Vídeo (GPU)</label>
                  <input type="text" id="gpu" name="gpu" className="form-input" 
                         placeholder="Ex: NVIDIA RTX 3060"
                         value={formData.pecasAtuais.gpu}
                         onChange={handlePecaAtualChange} />
                </div>
              )}
              {formData.pecasSelecionadas.includes('ram') && (
                <div className="form-group">
                  <label htmlFor="ram">Sua Memória RAM</label>
                  <input type="text" id="ram" name="ram" className="form-input" 
                         placeholder="Ex: 16GB (2x8GB) DDR4 3200MHz"
                         value={formData.pecasAtuais.ram}
                         onChange={handlePecaAtualChange} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 11. NOVO PASSO "PREFERÊNCIAS WIRELESS" --- */}
        {currentStep === 'preferencias_wireless' && (
          <div className="wizard-step-content">
            <h2 className="step-title">Alguma preferência por periféricos sem fio?</h2>
            <p className="step-subtitle">Selecione os que você NÃO abre mão de serem wireless.</p>
            <div className="card-selection-grid three-cols">
              <label className="card-option small">
                <input type="checkbox" name="preferencias_wireless" value="mouse"
                       checked={formData.preferencias_wireless.includes('mouse')}
                       onChange={handleCheckboxChange} />
                <div className="card-option-content">
                  <i className="fas fa-mouse card-icon"></i>
                  <h3>Mouse Sem Fio</h3>
                </div>
              </label>
              <label className="card-option small">
                <input type="checkbox" name="preferencias_wireless" value="teclado"
                       checked={formData.preferencias_wireless.includes('teclado')}
                       onChange={handleCheckboxChange} />
                <div className="card-option-content">
                  <i className="fas fa-keyboard card-icon"></i>
                  <h3>Teclado Sem Fio</h3>
                </div>
              </label>
              <label className="card-option small">
                <input type="checkbox" name="preferencias_wireless" value="headset"
                       checked={formData.preferencias_wireless.includes('headset')}
                       onChange={handleCheckboxChange} />
                <div className="card-option-content">
                  <i className="fas fa-headset card-icon"></i>
                  <h3>Headset Sem Fio</h3>
                </div>
              </label>
            </div>
          </div>
        )}
        
        {/* --- 12. PASSO FINAL "JOGOS" (AGORA USA A GALERIA) --- */}
        {currentStep === 'finalizar_jogos' && (
          <div className="wizard-step-content">
            <h2 className="step-title">Quais jogos você mais joga?</h2>
            <p className="step-subtitle">Selecione seus principais jogos para otimizarmos o setup.</p>
            <SearchableGallery
              data={jogosData}
              selectedItems={formData.jogos}
              onSelectionChange={handleJogoSelection}
            />
          </div>
        )}

        {/* --- 13. PASSO FINAL "TRABALHO" (AGORA USA A GALERIA) --- */}
        {currentStep === 'finalizar_trabalho' && (
          <div className="wizard-step-content">
            <h2 className="step-title">Quais aplicações de trabalho você usa?</h2>
            <p className="step-subtitle">Selecione os programas mais importantes para seu fluxo.</p>
            <SearchableGallery
              data={appsData}
              selectedItems={formData.appsTrabalho}
              onSelectionChange={handleAppSelection}
            />
          </div>
        )}

        {/* (Os passos 'estudo' e 'hibrido' continuam como placeholders) */}
        {currentStep === 'finalizar_estudo' && (
          <div className="wizard-step-content">
            <h2 className="step-title">Estudo / Uso Geral</h2>
            <p className="step-subtitle">Para este foco, vamos focar em custo-benefício e velocidade para tarefas do dia-a-dia.</p>
          </div>
        )}
        {currentStep === 'finalizar_hibrido' && (
          <div className="wizard-step-content">
            <h2 className="step-title">Defina suas prioridades</h2>
            <p className="step-subtitle">PLACEHOLDER: Aqui teríamos sliders para "Prioridade Jogos" vs "Prioridade Trabalho"</p>
          </div>
        )}

        {/* --- BOTÕES DE NAVEGAÇÃO --- */}
        <div className="wizard-navigation">
          {currentStep !== 'objetivo' && (
            <button type="button" id="prev-btn" className="wizard-btn secondary" onClick={prevStep}>
              <i className="fas fa-arrow-left"></i> Anterior
            </button>
          )}
          {!currentStep.includes('finalizar') && (
            <button type="button" id="next-btn" className="wizard-btn" onClick={nextStep}>
              Próximo Passo <i className="fas fa-arrow-right"></i>
            </button>
          )}
          {currentStep.includes('finalizar') && (
            <button type="submit" id="submit-btn" className="wizard-btn submit">
              Ver Recomendação <i className="fas fa-check"></i>
            </button>
          )}
        </div>
        
      </form>
    </div>
  );
}

export default UpgradePage;