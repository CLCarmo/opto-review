import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

// 1. IMPORTA O CSS CORRETO (compare.css)
import './ComparePage.css';

// 2. BASE DE DADOS (Copiada do teu compare.js.txt e product-detail.js.txt)
const products = [
    { 
        id: 1, 
        name: 'G Pro X Superlight', 
        brand: 'logitech', 
        category: 'mouse', 
        price_avg: 750, 
        price_low: 650, 
        image: 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-white-gallery-1.png?v=1',
        summary: 'Mouse sem fio ultra-leve com sensor HERO 25K, ideal para jogos competitivos e uso profissional.',
        specs: {
            'Peso': '63g',
            'Sensor': 'HERO 25K',
            'DPI': '25.600',
            'Polling Rate': '1000Hz',
            'Bateria': '70 horas'
        },
        pros: ['Peso extremamente leve', 'Sensor HERO 25K de alta precisão', 'Ótima duração de bateria'],
        cons: ['Preço elevado', 'Conector Micro-USB (em vez de USB-C)', 'Switches podem desenvolver clique duplo']
    },
    { 
        id: 7, 
        name: 'DeathAdder V3 Pro', 
        brand: 'razer', 
        category: 'mouse', 
        price_avg: 900, 
        price_low: 800, 
        image: 'https://assets2.razerzone.com/images/pnx.assets/61840bbed3c94ad2f592633d85c4f5c5/razer-deathadder-v3-pro-white-500x500.png',
        summary: 'Mouse ergonômico topo de linha, focado em performance e leveza para destros.',
        specs: {
            'Peso': '64g',
            'Sensor': 'Focus Pro 30K',
            'DPI': '30.000',
            'Polling Rate': '1000Hz (Até 4000Hz com dongle)',
            'Bateria': '90 horas'
        },
        pros: ['Shape ergonômico ultra-confortável', 'Sensor impecável (Focus Pro 30K)', 'Switches ópticos (sem clique duplo)', 'Leve para um ergo sem fio'],
        cons: ['Preço muito elevado', 'Dongle de 4000Hz é vendido separadamente']
    },
    { 
        id: 10, 
        name: 'Keychron Q1 Pro', 
        brand: 'keychron', 
        category: 'teclado', 
        price_avg: 1100, 
        price_low: 1000, 
        image: 'https://cdn.shopify.com/s/files/1/0059/0630/1017/products/Keychron-Q1-Pro-QMK-VIA-wireless-custom-mechanical-keyboard-ISO-layout-for-Mac-Windows-Linux-carbon-black-with-keycaps_1800x1800.png?v=1678872015',
        summary: 'Teclado mecânico customizável 75% sem fio, com corpo em alumínio, gasket mount e switches hot-swappable.',
        specs: {
            'Formato': '75%',
            'Switch': 'Keychron K Pro (Hot-swappable)',
            'Tipo': 'Mecânico (Gasket Mount)',
            'Bateria': '4000mAh',
            'Conectividade': 'Bluetooth, USB-C'
        },
        pros: ['Qualidade de construção premium (alumínio)', 'Sensação de digitação (Gasket)', 'Altamente customizável (Hot-swap)'],
        cons: ['Muito pesado', 'Software VIA/QMK pode ser complexo para iniciantes']
    },
];

// 3. EXPLICAÇÕES (Copiadas do teu compare.js.txt) [cite: 3, 4, 5, 6, 7, 8, 9]
const specExplanations = {
    'DPI': 'Sensibilidade do mouse. Quanto maior, mais rápido o cursor se move.',
    'Peso': 'Peso do mouse em gramas. Mais leve pode ser melhor para jogos rápidos.',
    'Sensor': 'Tecnologia do sensor que detecta o movimento do mouse.',
    'Polling Rate': 'Taxa de atualização (Hz). Quanto maior, menor o atraso de resposta.',
    'Formato': 'Tamanho do teclado. 75% é compacto, TKL não tem numpad, Full-size é completo.',
    'Switch': 'Tipo de tecla mecânica. Cada tipo tem sensação e som diferentes.',
    'Tipo': 'Tipo de construção do teclado (mecânico, membrana, etc).',
    'Bateria': 'Duração estimada da bateria em uso contínuo.'
};


/**
 * Componente ComparePage
 * Recriado do zero (Versão Fiel)
 */
function ComparePage() {

  // --- ESTADOS ---
  const [compareSlots, setCompareSlots] = useState(Array(4).fill(null));
  const [showModal, setShowModal] = useState(false);
  const [targetSlot, setTargetSlot] = useState(0);
  const [modalSearch, setModalSearch] = useState('');

  // Lógica de carregar produtos (do compare.js.txt)
  const location = useLocation();
  useEffect(() => {
    const productsToCompare = location.state?.compareProducts;
    if (productsToCompare && productsToCompare.length > 0) {
      const newSlots = Array(4).fill(null);
      productsToCompare.forEach((id, index) => {
        const product = products.find(p => p.id === id);
        if (product && index < 4) {
          newSlots[index] = product;
        }
      });
      setCompareSlots(newSlots);
    }
  }, [location.state]);

  // --- HANDLERS ---
  const handleOpenModal = (index) => {
    setTargetSlot(index);
    setModalSearch('');
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleSelectProduct = (product) => {
    const newSlots = [...compareSlots];
    newSlots[targetSlot] = product;
    setCompareSlots(newSlots);
    handleCloseModal();
  };
  const handleRemoveProduct = (index) => {
    const newSlots = [...compareSlots];
    newSlots[index] = null;
    setCompareSlots(newSlots);
  };
  
  // Filtra produtos no modal
  const modalFilteredProducts = useMemo(() => {
    if (!modalSearch) return products;
    return products.filter(p => p.name.toLowerCase().includes(modalSearch.toLowerCase()));
  }, [modalSearch]);

  // Pega todas as chaves de specs (lógica do compare.js.txt)
  const allSpecKeys = useMemo(() => {
    const keys = new Set();
    compareSlots.forEach(product => {
      if (product) {
        Object.keys(product.specs).forEach(key => keys.add(key));
      }
    });
    return Array.from(keys);
  }, [compareSlots]);

  // --- RENDERIZAÇÃO (JSX 100% FIEL AO TEU HTML ORIGINAL) ---
  return (
     <div className="compare-page-wrapper">
      <div className="comparison-header">
        <h1>Comparar Produtos</h1>
        <p>Adicione de 2 a 4 produtos para ver as especificações lado a lado.</p>
      </div>

      {/* --- O CONTAINER DOS SLOTS --- */}
      {/* Este é o grid de 4 colunas do teu CSS [cite: 3] */}
      <div id="comparison-container" className="comparison-container">
        
        {compareSlots.map((product, index) => (
          
          <div key={index} className="comparison-column">
            {product ? (
              // --- Cartão Preenchido (JSX do compare.js.txt) ---
              <>
                {/* 1. O SUMÁRIO DO PRODUTO */}
                <div className="product-summary">
                  <button className="remove-btn" onClick={() => handleRemoveProduct(index)}>
                    <i className="fas fa-times"></i>
                  </button>
                  <img src={product.image} alt={product.name} className="summary-image" />
                  <h3 className="summary-name">
                    <Link to={`/produtos/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="summary-price">
                    R$ {product.price_low.toLocaleString('pt-BR')}
                  </p>
                  <div className="product-actions">
                    <Link to={`/produtos/${product.id}`} className="product-action-btn secondary">
                      <i className="fas fa-search"></i> Ver Detalhes
                    </Link>
                    <button className="product-action-btn primary" onClick={() => alert('Lógica de "Comprar" não implementada')}>
                      <i className="fas fa-shopping-cart"></i> Comprar
                    </button>
                  </div>
                </div>
                
                {/* 2. A LISTA DE SPECS (DENTRO DA COLUNA) */}
                <ul className="spec-list">
                  {/* Prós */}
                  <li className="spec-item">
                    <span className="spec-name">Prós</span>
                    <span className="spec-value">
                      <ul className="pros-list" style={{ textAlign: 'left', margin: 0, padding: 0 }}>
                        {product.pros.map((pro, i) => <li key={i}><i className="fas fa-check"></i> {pro}</li>)}
                      </ul>
                    </span>
                  </li>
                  {/* Contras */}
                  <li className="spec-item">
                    <span className="spec-name">Contras</span>
                    <span className="spec-value">
                      <ul className="cons-list" style={{ textAlign: 'left', margin: 0, padding: 0 }}>
                        {product.cons.map((con, i) => <li key={i}><i className="fas fa-times"></i> {con}</li>)}
                      </ul>
                    </span>
                  </li>
                  
                  {/* Specs Dinâmicas */}
                  {allSpecKeys.map(specKey => (
                    <li className="spec-item" key={specKey}>
                      <span className="spec-name">
                        {specKey}
                        {/* O TOOLTIP ORIGINAL DO TEU CSS! [cite: 22, 23, 25] */}
                        {specExplanations[specKey] && (
                          <span className="spec-info">
                            <span className="spec-info-icon">?</span>
                            <span className="spec-tooltip">{specExplanations[specKey]}</span>
                          </span>
                        )}
                      </span>
                      <span className="spec-value">
                        {product.specs[specKey] || '-'}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              // --- Cartão Vazio (Placeholder) [cite: 5, 6, 7] ---
              <div className="placeholder-card" onClick={() => handleOpenModal(index)}>
                <i className="fas fa-plus-circle placeholder-icon"></i>
                <span>Adicionar Produto</span>
              </div>
            )}
          </div>

        ))}
      </div>
      
      {/* (Não existe mais tabela separada aqui) */}

      {/* --- O MODAL (do compare.html.txt) --- */}
      {showModal && (
        <div id="product-modal" className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="modal-close-btn" onClick={handleCloseModal}>&times;</span>
            <h2>Selecione um Produto para Comparar</h2>
            
            <div className="modal-filters">
              <input 
                type="text" 
                id="modal-search-input" 
                className="search-input" 
                placeholder="Buscar por nome..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
              />
              {/* (O teu compare.html.txt [cite: 27, 28] tinha filtros de marca e preço) */}
              <select id="modal-brand-filter">
                <option value="all">Todas as Marcas</option>
              </select>
              <input type="number" id="modal-price-filter" className="price-input" placeholder="Preço Máx." />
            </div>

            <div id="modal-product-grid" className="modal-product-grid">
              {modalFilteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className={`modal-product-card ${compareSlots.some(p => p?.id === product.id) ? 'selected-for-comparison' : ''}`}
                  onClick={() => {
                    // Impede o clique se o produto já estiver na lista [cite: 37, 38, 41]
                    if (!compareSlots.some(p => p?.id === product.id)) {
                      handleSelectProduct(product);
                    }
                  }}
                >
                  <img src={product.image} alt={product.name} />
                  <h4>{product.name}</h4>
                  <p>R$ {product.price_low.toLocaleString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div> 
  );
}

export default ComparePage;