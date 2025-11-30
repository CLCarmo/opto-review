// src/components/ComparePage.js
// 1. IMPORTAÇÕES (sem o 'React' principal)
import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

// 2. IMPORTA O CSS
import './ComparePage.css';

// =====================================================================
// (A) FUNÇÕES HELPER (Fora do componente)
// =====================================================================
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
 */
function ComparePage() {

    // =====================================================================
    // (B) ESTADOS DA API
    // =====================================================================
    const [allProducts, setAllProducts] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://opto-review-production.up.railway.app/api/produtos');
                if (!response.ok) {
                    throw new Error('Falha ao buscar produtos da API');
                }
                const dataFromApi = await response.json();
                const mappedData = dataFromApi.map(p => ({
                    id: p.id_produto,
                    name: p.nome,
                    brand: p.fabricante,
                    category: p.categoria,
                    price_avg: parseFloat(p.price_low), 
                    price_low: parseFloat(p.price_low), 
                    image: p.imagem_url,
                    summary: p.descricao,
                    specs: p.especificacoes || {}, 
                }));
                
                setAllProducts(mappedData); 
                
            } catch (err) {
                console.error("Erro no fetchProducts:", err);
                setError(err.message); 
            } finally {
                setIsLoading(false); 
            }
        };

        fetchProducts(); 
    }, []); 


    // =====================================================================
    // (C) ESTADOS DA PÁGINA (SLOTS, MODAL, ETC)
    // =====================================================================
    const [compareSlots, setCompareSlots] = useState(Array(4).fill(null));
    const [showModal, setShowModal] = useState(false);
    const [targetSlot, setTargetSlot] = useState(0);
    const [modalSearch, setModalSearch] = useState('');
    const [modalSelectedBrand, setModalSelectedBrand] = useState('all');
    const [modalSelectedCategories, setModalSelectedCategories] = useState([]);

    // =====================================================================
    // (D) LÓGICA DE FILTROS E DADOS (useMemo)
    // =====================================================================

    // Lógica de carregar produtos (via ?state=)
    const location = useLocation();
    useEffect(() => {
        const productsToCompare = location.state?.compareProducts;
        if (allProducts.length > 0 && productsToCompare && productsToCompare.length > 0) {
            const newSlots = Array(4).fill(null);
            productsToCompare.forEach((id, index) => {
                const product = allProducts.find(p => p.id === id); 
                if (product && index < 4) {
                    newSlots[index] = product;
                }
            });
            setCompareSlots(newSlots);
        }
    }, [location.state, allProducts]); 

    // Calcula os Prós/Contras
    const computedHighlights = useMemo(() => computeHighlights(compareSlots), [compareSlots]);

    // Lista de Marcas para o filtro do modal
    const availableBrands = useMemo(() => {
        const unique = new Set();
        allProducts.forEach((product) => { 
            if (product.brand) {
                unique.add(product.brand);
            }
        });
        return Array.from(unique).sort((a, b) => a.localeCompare(b));
    }, [allProducts]); 

    // Lista de Categorias para o filtro do modal
    const availableCategories = useMemo(() => {
        const unique = new Set();
        allProducts.forEach((product) => { 
            if (product.category) {
                unique.add(product.category);
            }
        });
        return Array.from(unique).sort((a, b) => a.localeCompare(b));
    }, [allProducts]); 


    // Determina a Categoria "Travada"
    const activeCategory = useMemo(() => {
        const firstProductInSlot = compareSlots.find(product => product !== null);
        if (firstProductInSlot) {
            return firstProductInSlot.category;
        }
        return null; 
    }, [compareSlots]); // Depende dos slots


    // --- HANDLERS ---
    const handleOpenModal = (index) => {
        setTargetSlot(index);
        setModalSearch('');
        setModalSelectedBrand('all');
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

    
    // O FILTRO DO MODAL
    const modalFilteredProducts = useMemo(() => {
        const terms = modalSearch
            .toLowerCase()
            .split(' ')
            .map((t) => t.trim())
            .filter(Boolean);

        return allProducts.filter((product) => {
            
            // Filtro de Categoria Travada
            if (activeCategory) {
                if (product.category !== activeCategory) {
                    return false; 
                }
            }
            
            // Filtro de Busca
            const haystack = `${product.name} ${product.brand || ''} ${product.summary || ''} ${product.category || ''}`.toLowerCase();
            const matchesSearch = terms.every((term) => haystack.includes(term));
            if (!matchesSearch && terms.length > 0) return false;

            // Filtro de Marca
            const matchesBrand =
                modalSelectedBrand === 'all' ||
                !modalSelectedBrand ||
                (product.brand && product.brand.toLowerCase() === modalSelectedBrand.toLowerCase());

            if (!matchesBrand) return false;

            // Filtro de Checkbox de Categoria
            const matchesCategory =
                modalSelectedCategories.length === 0 ||
                modalSelectedCategories.includes(product.category);

            return matchesCategory;
        });
    }, [modalSearch, modalSelectedBrand, modalSelectedCategories, allProducts, activeCategory]);


    // Pega todas as chaves de specs
    const allSpecKeys = useMemo(() => {
        const keys = new Set();
        compareSlots.forEach(product => {
            if (product) {
                Object.keys(product.specs).forEach(key => keys.add(key));
            }
        });
        return Array.from(keys);
    }, [compareSlots]);

    // --- RENDERIZAÇÃO (JSX) ---
    return (
        <div className="compare-page-wrapper"> 
            <div className="comparison-header">
                <h1>Comparar Produtos</h1>
                <p>Adicione de 2 a 4 produtos para ver as especificações lado a lado.</p>
            </div>

            {/* --- O CONTAINER DOS SLOTS --- */}
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
                                    <img src={product.image || 'https://via.placeholder.com/120'} alt={product.name} className="summary-image" />
                                    <h3 className="summary-name">
                                        <Link to={`/produtos/${product.id}`}>{product.name}</Link>
                                    </h3>
                                    <p className="summary-price">
                                        R$ {product.price_low ? product.price_low.toLocaleString('pt-BR') : '???'}
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
                            // --- Cartão Vazio (Placeholder) ---
                            <div className="placeholder-card" onClick={() => handleOpenModal(index)}>
                                <i className="fas fa-plus-circle placeholder-icon"></i>
                                <span>Adicionar Produto</span>
                            </div>
                        )}
                    </div>

                ))}
            </div>
            
            {/* --- O MODAL --- */}
            {showModal && (
                <div id="product-modal" className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <span className="modal-close-btn" onClick={handleCloseModal}>&times;</span>
                        <h2>Selecione um Produto para Comparar</h2>
                        
                        {/* Aviso de Categoria Travada */}
                        {activeCategory && (
                            <div className="modal-lock-warning">
                                <i className="fas fa-info-circle"></i>
                                Mostrando apenas produtos da categoria <strong>{activeCategory}</strong>. Remova todos os produtos para comparar outras categorias.
                            </div>
                        )}

                        {/* ============================================== */}
                        {/* A CORREÇÃO ESTÁ AQUI */}
                        {/* ============================================== */}
                        <div className="modal-body">
                            
                            {/* Coluna 1: Filtros */}
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
                                            const isDisabled = activeCategory && category !== activeCategory; 
                                            return (
                                                <label
                                                    key={category}
                                                    className={`category-option ${checked ? 'is-active' : ''} ${isDisabled ? 'is-disabled' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        disabled={isDisabled}
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
                            
                            {/* NOVO WRAPPER para a Coluna 2 */}
                            <div className="modal-main-content">
                                
                                <div className="results-summary">
                                    <span>
                                        Mostrando {modalFilteredProducts.length} produto{modalFilteredProducts.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div id="modal-product-grid" className="modal-product-grid">
                                    {/* ETAPA 1: CARREGANDO? */}
                                    {isLoading && (
                                    <div className="modal-empty-state">
                                        <i className="fas fa-spinner fa-spin"></i> Carregando produtos...
                                    </div>
                                    )}

                                    {/* ETAPA 2: DEU ERRO? */}
                                    {!isLoading && error && (
                                    <div className="modal-empty-state error">
                                        <i className="fas fa-exclamation-triangle"></i>
                                        <p>Erro ao carregar produtos.</p>
                                        <small>{error}</small>
                                    </div>
                                    )}

                                    {/* ETAPA 3: SUCESSO, MAS FILTRO NÃO ACHOU NADA? */}
                                    {!isLoading && !error && modalFilteredProducts.length === 0 && (
                                    <div className="modal-empty-state">
                                        Nenhum item encontrado com os filtros aplicados.
                                    </div>
                                    )}

                                    {/* ETAPA 4: SUCESSO E TEM PRODUTOS */}
                                    {!isLoading && !error && modalFilteredProducts.length > 0 && (
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
                                                <img src={product.image || 'https://via.placeholder.com/120'} alt={product.name} />
                                                <h4>{product.name}</h4>
                                                <p>R$ {product.price_low ? product.price_low.toLocaleString('pt-BR') : '???'}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div> {/* Fim do NOVO WRAPPER .modal-main-content */}
                        </div> {/* Fim do .modal-body */}
                    </div>
                </div>
            )}
        </div> 
    );
}

export default ComparePage;