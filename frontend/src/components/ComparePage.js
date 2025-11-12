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
            'Conectividade': 'Lightspeed 2.4GHz, USB-A (cabo)',
            'Bateria': 'Até 70 horas'
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
        image: 'https://m.media-amazon.com/images/I/71fRKz9pUnL._AC_SX679_.jpg',
        summary: 'Mouse ergonômico topo de linha, focado em performance e leveza para destros.',
        specs: {
            'Peso': '64g',
            'Sensor': 'Focus Pro 30K',
            'DPI': '30.000',
            'Polling Rate': '1000Hz (Até 4000Hz com dongle)',
            'Conectividade': 'Razer HyperSpeed 2.4GHz, USB-C (cabo)',
            'Bateria': 'Até 90 horas'
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
        image: 'https://m.media-amazon.com/images/I/51HaCM8wFcL._AC_SX679_.jpg',
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
    { 
        id: 12, 
        name: 'Logitech G703 Lightspeed', 
        brand: 'logitech', 
        category: 'mouse', 
        price_avg: 620, 
        price_low: 580, 
        image: 'https://resource.logitechg.com/w_800,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g703/g703-gallery-1.png?v=1',
        summary: 'Mouse sem fio com sensor HERO 25K e design ergonômico clássico, ótimo para quem busca conforto.',
        specs: {
            'Peso': '95g',
            'Sensor': 'HERO 25K',
            'DPI': '25.600',
            'Polling Rate': '1000Hz',
            'Conectividade': 'Lightspeed 2.4GHz, USB-A (cabo)',
            'Bateria': 'Até 35 horas'
        },
        pros: ['Ergonomia clássica confortável', 'Sensor preciso', 'Compatível com Powerplay'],
        cons: ['Mais pesado que modelos competitivos', 'Micro-USB para recarga']
    },
    { 
        id: 18, 
        name: 'Razer BlackWidow V4 X', 
        brand: 'razer', 
        category: 'teclado', 
        price_avg: 850, 
        price_low: 780, 
        image: 'https://m.media-amazon.com/images/I/71Nqzh-u2rL._AC_SX679_.jpg',
        summary: 'Teclado mecânico full-size com switches verdes, iluminação RGB e teclas macro dedicadas.',
        specs: {
            'Formato': 'Full-size',
            'Switch': 'Razer Green (Clicky)',
            'Tipo': 'Mecânico',
            'Conectividade': 'USB-C destacável',
            'Bateria': 'Sem bateria (alimentação por cabo)'
        },
        pros: ['Teclas macro dedicadas', 'RGB individual por tecla', 'Construção robusta'],
        cons: ['Layout grande ocupa mais espaço', 'Switches clicky são barulhentos']
    },
    { 
        id: 25, 
        name: 'ASUS ROG Swift PG27AQN', 
        brand: 'asus', 
        category: 'monitor', 
        price_avg: 5400,  
        price_low: 5200, 
        image: 'https://m.media-amazon.com/images/I/61aBgNvGk0L._AC_SX679_.jpg',
        summary: 'Monitor gamer 27" QHD com taxa de atualização de 360Hz e painel IPS rápido para eSports.',
        specs: {
            'Tamanho': '27"',
            'Resolução': '2560x1440',
            'Taxa de Atualização': '360Hz',
            'Tempo de Resposta': '1ms GTG',
            'Tecnologia de Sincronização': 'NVIDIA G-Sync'
        },
        pros: ['Altíssima taxa de atualização', 'Painel IPS rápido', 'Compatível com G-Sync'],
        cons: ['Preço muito elevado', 'Requer hardware potente para 360Hz em QHD']
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
    'Bateria': 'Duração estimada da bateria em uso contínuo.',
    'Conectividade': 'Canais disponíveis para conectar o periférico (Bluetooth, USB, sem fio proprietário).',
    'Tamanho': 'Dimensão diagonal da tela em polegadas.',
    'Resolução': 'Quantidade de pixels exibidos (largura x altura).',
    'Taxa de Atualização': 'Número de vezes que a tela atualiza por segundo (Hz).',
    'Tempo de Resposta': 'Tempo para mudar de um tom de cinza para outro (ms).',
    'Tecnologia de Sincronização': 'Tecnologia que reduz tearing/stuttering (G-Sync, FreeSync, etc.).'
};

const parseSpecNumber = (text) => {
    if (!text || typeof text !== 'string') return null;
    const normalized = text.replace(',', '.');
    const match = normalized.match(/(\d+(\.\d+)?)/);
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isFinite(value) ? value : null;
};

const formatNumberWithUnit = (value, unit) => {
    if (!Number.isFinite(value)) return '-';
    const hasDecimal = value % 1 !== 0;
    const formatted = value.toLocaleString('pt-BR', {
        minimumFractionDigits: hasDecimal ? 1 : 0,
        maximumFractionDigits: hasDecimal ? 1 : 0,
    });
    return `${formatted} ${unit}`.trim();
};

const areValuesClose = (a, b, tolerance = 0.0001) => Math.abs(a - b) <= tolerance;

const metricDefinitions = [
    {
        id: 'price_low',
        label: 'preço',
        better: 'min',
        getter: (product) => Number.isFinite(product?.price_low) ? product.price_low : null,
        formatter: (value) => `R$ ${value.toLocaleString('pt-BR')}`,
    },
    {
        id: 'weight',
        label: 'peso',
        better: 'min',
        getter: (product) => parseSpecNumber(product?.specs?.['Peso']),
        formatter: (value) => formatNumberWithUnit(value, 'g'),
        applicable: (product) => product?.category === 'mouse',
    },
    {
        id: 'battery',
        label: 'autonomia de bateria',
        better: 'max',
        getter: (product) => parseSpecNumber(product?.specs?.['Bateria']),
        formatter: (value) => formatNumberWithUnit(value, 'horas'),
        applicable: (product) => product?.category === 'mouse',
    },
    {
        id: 'polling',
        label: 'polling rate',
        better: 'max',
        getter: (product) => parseSpecNumber(product?.specs?.['Polling Rate']),
        formatter: (value) => formatNumberWithUnit(value, 'Hz'),
        applicable: (product) => product?.category === 'mouse',
    },
];

const computeHighlights = (slots) => {
    const highlights = slots.map(() => ({ pros: [], cons: [] }));
    const activeCount = slots.filter(Boolean).length;
    if (activeCount < 2) {
        return highlights;
    }

    metricDefinitions.forEach((definition) => {
        const entries = slots
            .map((product, index) => {
                if (!product) return null;
                if (definition.applicable && !definition.applicable(product)) return null;
                const value = definition.getter(product);
                if (value === null || !Number.isFinite(value)) return null;
                return { index, value };
            })
            .filter(Boolean);

        if (entries.length < 2) return;

        const values = entries.map((entry) => entry.value);
        const bestValue = definition.better === 'min' ? Math.min(...values) : Math.max(...values);
        const worstValue = definition.better === 'min' ? Math.max(...values) : Math.min(...values);

        if (areValuesClose(bestValue, worstValue)) {
            return;
        }

        const bestEntries = entries.filter((entry) => areValuesClose(entry.value, bestValue));
        if (bestEntries.length === 1) {
            const text = `Melhor ${definition.label} (${definition.formatter ? definition.formatter(bestValue) : bestValue})`;
            highlights[bestEntries[0].index].pros.push(text);
        }

        const worstEntries = entries.filter((entry) => areValuesClose(entry.value, worstValue));
        if (worstEntries.length === 1) {
            const text = `Pior ${definition.label} (${definition.formatter ? definition.formatter(worstValue) : worstValue})`;
            highlights[worstEntries[0].index].cons.push(text);
        }
    });

    return highlights;
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
  const [modalSelectedBrand, setModalSelectedBrand] = useState('all');
  const [modalSelectedCategories, setModalSelectedCategories] = useState([]);

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

  const computedHighlights = useMemo(() => computeHighlights(compareSlots), [compareSlots]);

  const availableBrands = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      if (product.brand) {
        unique.add(product.brand);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, []);

  const availableCategories = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      if (product.category) {
        unique.add(product.category);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, []);

  // --- HANDLERS ---
  const handleOpenModal = (index) => {
    setTargetSlot(index);
    setModalSearch('');
    setModalSelectedBrand('all');
    setModalSelectedCategories([]);
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
    const terms = modalSearch
      .toLowerCase()
      .split(' ')
      .map((t) => t.trim())
      .filter(Boolean);

    return products.filter((product) => {
      // search terms across name, brand, summary, category
      const haystack = `${product.name} ${product.brand || ''} ${product.summary || ''} ${product.category || ''}`.toLowerCase();
      const matchesSearch = terms.every((term) => haystack.includes(term));
      if (!matchesSearch && terms.length > 0) return false;

      const matchesBrand =
        modalSelectedBrand === 'all' ||
        !modalSelectedBrand ||
        (product.brand && product.brand.toLowerCase() === modalSelectedBrand.toLowerCase());

      if (!matchesBrand) return false;

      const matchesCategory =
        modalSelectedCategories.length === 0 ||
        modalSelectedCategories.includes(product.category);

      return matchesCategory;
    });
  }, [modalSearch, modalSelectedBrand, modalSelectedCategories]);

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
              <div className="comparison-card">
                <div className="product-summary">
                  <div className="summary-header">
                    <button className="remove-btn" onClick={() => handleRemoveProduct(index)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
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

                <div className="card-body">
                  <section className="card-section pros-section">
                    <h4 className="section-title">Prós</h4>
                    <ul className="pros-list">
                      {computedHighlights[index]?.pros.length
                        ? computedHighlights[index].pros.map((pro, i) => (
                            <li key={i}><i className="fas fa-check"></i> {pro}</li>
                          ))
                        : <li className="empty-state">Nenhum destaque positivo ainda</li>}
                    </ul>
                  </section>

                  <section className="card-section cons-section">
                    <h4 className="section-title">Contras</h4>
                    <ul className="cons-list">
                      {computedHighlights[index]?.cons.length
                        ? computedHighlights[index].cons.map((con, i) => (
                            <li key={i}><i className="fas fa-times"></i> {con}</li>
                          ))
                        : <li className="empty-state">Nenhum alerta negativo ainda</li>}
                    </ul>
                  </section>

                  <section className="card-section specs-section">
                    <h4 className="section-title">Especificações</h4>
                    <ul className="spec-list">
                      {allSpecKeys.map(specKey => (
                        <li className="spec-item" key={specKey}>
                          <div className="spec-name">
                            {specKey}
                            {specExplanations[specKey] && (
                              <span className="spec-info">
                                <span className="spec-info-icon">?</span>
                                <span className="spec-tooltip">{specExplanations[specKey]}</span>
                              </span>
                            )}
                          </div>
                          <div className="spec-value">
                            {product.specs[specKey] || '-'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
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

            <div className="modal-body">
              <div className="modal-filters">
                <div className="filter-group search-group">
                  <label htmlFor="modal-search-input">Buscar produto</label>
                  <input 
                    type="text" 
                    id="modal-search-input" 
                    className="search-input" 
                    placeholder="Ex.: Razer mouse sem fio"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                  />
                </div>

                <div className="filter-group brand-group">
                  <label htmlFor="modal-brand-filter">Marca</label>
                  <select
                    id="modal-brand-filter"
                    value={modalSelectedBrand}
                    onChange={(e) => setModalSelectedBrand(e.target.value)}
                  >
                    <option value="all">Todas as marcas</option>
                    {availableBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand.charAt(0).toUpperCase() + brand.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group category-group">
                  <span className="category-label">Categorias</span>
                  <div className="category-options">
                    {availableCategories.map((category) => {
                      const checked = modalSelectedCategories.includes(category);
                      return (
                        <label
                          key={category}
                          className={`category-option ${checked ? 'is-active' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setModalSelectedCategories((prev) => {
                                if (checked) {
                                  return prev.filter((item) => item !== category);
                                }
                                return [...prev, category];
                              });
                            }}
                          />
                          <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="results-summary">
                {modalFilteredProducts.length > 0 ? (
                  <span>
                    Mostrando {modalFilteredProducts.length} produto{modalFilteredProducts.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span>Nenhum item encontrado com os filtros aplicados.</span>
                )}
              </div>

              <div id="modal-product-grid" className="modal-product-grid">
                {modalFilteredProducts.length > 0 ? (
                  modalFilteredProducts.map(product => (
                    <div 
                      key={product.id} 
                      className={`modal-product-card ${compareSlots.some(p => p?.id === product.id) ? 'selected-for-comparison' : ''}`}
                      onClick={() => {
                        if (!compareSlots.some(p => p?.id === product.id)) {
                          handleSelectProduct(product);
                        }
                      }}
                    >
                      <img src={product.image} alt={product.name} />
                      <h4>{product.name}</h4>
                      <p>R$ {product.price_low.toLocaleString('pt-BR')}</p>
                    </div>
                  ))
                ) : (
                  <div className="modal-empty-state">
                    Nenhum item encontrado com os filtros aplicados.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div> 
  );
}

export default ComparePage;