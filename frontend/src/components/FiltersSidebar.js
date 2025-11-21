import React, { useState, useEffect } from 'react';
import './FiltersSidebar.css';

// --- CONSTANTES ESTRUTURAIS ---
// Agrupamento visual das categorias
const CATEGORY_GROUPS = {
    'Periféricos': [
        'Monitor', 'Mouse', 'Teclado', 'Headset', 'Microfone', 'Controle'
    ],
    'Peças de PC': [
        'Placa Mãe', 'Placa de Vídeo', 'Processador', 'Memória RAM', 
        'Armazenamento', 'Cooler', 'Fans', 'Fonte', 'Gabinete'
    ]
};

// Lista de Marcas Solicitada
const BRAND_LIST = [
    'Logitech', 'Razer', 'Intel', 'AMD', 'NVIDIA', 'Corsair', 
    'HyperX', 'SteelSeries', 'Dell', 'LG', 'Samsung', 
    'ASUS', 'MSI', 'Gigabyte'
];

const FiltersSidebar = ({ categorias, onFilterChange }) => {
    // --- ESTADOS ---
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]); // Array de marcas selecionadas

    // --- HANDLERS ---

    // 1. Categoria (Seleção Única)
    const handleCategoryChange = (cat) => {
        // Se clicar na que já está selecionada, volta para 'all'
        if (selectedCategory === cat) {
            setSelectedCategory('all');
        } else {
            setSelectedCategory(cat);
        }
    };

    // 2. Preço (Inputs)
    // (O estado é atualizado diretamente no onChange dos inputs)

    // 3. Marcas (Seleção Múltipla)
    const handleBrandChange = (brand) => {
        setSelectedBrands(prev => {
            if (prev.includes(brand)) {
                return prev.filter(b => b !== brand); // Remove
            } else {
                return [...prev, brand]; // Adiciona
            }
        });
    };

    // --- EFEITO DE FILTRAGEM ---
    // Dispara sempre que qualquer filtro mudar
    useEffect(() => {
        const activeFilters = {
            category: selectedCategory,
            price_min: minPrice ? Number(minPrice) : null,
            price_max: maxPrice ? Number(maxPrice) : null,
            brands: selectedBrands // Passa o array de marcas
        };
        onFilterChange(activeFilters);
    }, [selectedCategory, minPrice, maxPrice, selectedBrands, onFilterChange]);

    return (
        <aside className="sidebar-filters">
            <div className="sidebar-header">
                <h3><i className="fas fa-filter"></i> Filtros</h3>
            </div>

            {/* --- GRUPO 1: CATEGORIAS --- */}
            <div className="filter-group">
                <h4>Categorias</h4>
                
                {/* Botão "Todas" */}
                <button 
                    className={`filter-category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('all')}
                >
                    <i className="fas fa-th-large"></i> Todas as Categorias
                </button>

                {/* Grupos de Categorias */}
                {Object.entries(CATEGORY_GROUPS).map(([groupName, items]) => (
                    <div key={groupName} className="category-group-block">
                        <h5 className="group-title">{groupName}</h5>
                        {items.map(cat => (
                            <button
                                key={cat}
                                className={`filter-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                ))}
                
                {/* Categorias "Outras" (que vieram do banco mas não estão nos grupos acima) */}
                {/* (Opcional: Lógica para mostrar categorias extras se necessário) */}
            </div>

            {/* --- GRUPO 2: PREÇO --- */}
            <div className="filter-group">
                <h4>Faixa de Preço</h4>
                <div className="price-filter-inputs">
                    <div className="price-input-wrapper">
                        <span>R$</span>
                        <input 
                            type="number" 
                            placeholder="Mín" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="price-input"
                        />
                    </div>
                    <span className="separator">-</span>
                    <div className="price-input-wrapper">
                        <span>R$</span>
                        <input 
                            type="number" 
                            placeholder="Máx" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="price-input"
                        />
                    </div>
                </div>
            </div>

            {/* --- GRUPO 3: MARCAS --- */}
            <div className="filter-group">
                <h4>Marcas</h4>
                <div className="brands-list">
                    {BRAND_LIST.map(brand => (
                        <label key={brand} className="brand-checkbox-item">
                            <input 
                                type="checkbox" 
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                            />
                            <span className="checkmark"></span>
                            <span className="brand-name">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>

        </aside>
    );
};

export default FiltersSidebar;