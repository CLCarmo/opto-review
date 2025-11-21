import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UpgradePage.css';

// --- AS PERGUNTAS (Hardcoded por enquanto, para validarmos o visual) ---
const WIZARD_STEPS = [
  {
    id: 1,
    question: "Qual é o seu objetivo principal?",
    subtitle: "Isso nos ajuda a priorizar processador vs. placa de vídeo.",
    options: [
      { id: 'gaming', label: 'Apenas Jogos', icon: 'fa-gamepad' },
      { id: 'work', label: 'Trabalho & Produtividade', icon: 'fa-briefcase' },
      { id: 'mixed', label: 'Híbrido (Jogos + Trabalho)', icon: 'fa-layer-group' },
    ]
  },
  {
    id: 2,
    question: "Qual seu nível de experiência?",
    subtitle: "Define a complexidade e potência do equipamento.",
    options: [
      { id: 'entry', label: 'Iniciante / Casual', icon: 'fa-user' },
      { id: 'mid', label: 'Entusiasta / Mid-Range', icon: 'fa-rocket' },
      { id: 'pro', label: 'Pro Player / Hardcore', icon: 'fa-trophy' },
    ]
  },
  {
    id: 3,
    question: "Qual é o seu orçamento aproximado?",
    subtitle: "Vamos encontrar o melhor custo-benefício dentro deste valor.",
    options: [
      { id: 'low', label: 'Até R$ 2.500', icon: 'fa-wallet' },
      { id: 'medium', label: 'R$ 2.500 - R$ 5.000', icon: 'fa-money-bill-wave' },
      { id: 'high', label: 'Acima de R$ 5.000', icon: 'fa-gem' },
    ]
  }
];

function UpgradePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const currentStep = WIZARD_STEPS[currentStepIndex];
  const totalSteps = WIZARD_STEPS.length;
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  // Selecionar uma opção
  const handleOptionSelect = (optionId) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: optionId }));
  };

  // Avançar
  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      finishWizard();
    }
  };

  // Voltar
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Finalizar (Simulação)
  const finishWizard = () => {
    setIsProcessing(true);
    console.log("Respostas Finais:", answers);
    
    // Simula um "processamento" de 2 segundos antes de mostrar resultado
    setTimeout(() => {
      setIsProcessing(false);
      alert("Mago finalizado! (Lógica de recomendação será implementada a seguir)");
      // Aqui redirecionaríamos para uma página de resultados
      // navigate('/recommendations', { state: { answers } });
    }, 1500);
  };

  // Tela de Carregamento (Processando)
  if (isProcessing) {
    return (
      <div className="upgrade-page-wrapper">
        <div className="wizard-container" style={{ padding: '4rem', textAlign: 'center' }}>
          <i className="fas fa-magic fa-spin fa-3x" style={{ color: '#00e676', marginBottom: '1rem' }}></i>
          <h2>Gerando sua recomendação...</h2>
          <p>O nosso algoritmo está analisando milhares de combinações.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upgrade-page-wrapper">
      <div className="wizard-container">
        
        {/* Barra de Progresso */}
        <div className="wizard-progress-bar">
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.85rem', color: '#aaa' }}>
            Passo {currentStepIndex + 1} de {totalSteps}
          </div>
        </div>

        {/* Conteúdo das Perguntas */}
        <div className="wizard-content">
          <div className="wizard-question">
            <h2>{currentStep.question}</h2>
            <p>{currentStep.subtitle}</p>
          </div>

          <div className="options-grid">
            {currentStep.options.map((option) => (
              <div 
                key={option.id}
                className={`option-card ${answers[currentStep.id] === option.id ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <i className={`fas ${option.icon} option-icon`}></i>
                <span className="option-label">{option.label}</span>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="wizard-actions">
            <button 
              className="wizard-btn back" 
              onClick={handleBack}
              style={{ visibility: currentStepIndex === 0 ? 'hidden' : 'visible' }}
            >
              <i className="fas fa-arrow-left"></i> Voltar
            </button>

            <button 
              className="wizard-btn next" 
              onClick={handleNext}
              disabled={!answers[currentStep.id]} // Desabilita se não tiver selecionado nada
            >
              {currentStepIndex === totalSteps - 1 ? 'Ver Resultado' : 'Próximo'}
              {currentStepIndex !== totalSteps - 1 && <i className="fas fa-arrow-right"></i>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UpgradePage;