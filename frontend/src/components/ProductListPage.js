// src/components/ProductListPage.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import FiltersSidebar from './FiltersSidebar';
import ProductGrid from './ProductGrid';
import ComparisonBar from './ComparisonBar';

import './ProductListPage.css'; 

const normalizeText = (text) => {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const ProductListPage = () => {
    // --- ESTADOS DO COMPONENTE ---
    const [allProducts, setAllProducts] = useState([]); 
    const [filteredProducts, setFilteredProducts] = useState([]); 
    const [categorias, setCategorias] = useState([]); 
    
    // Estado de filtros agora inclui 'brands'
    const [activeFilters, setActiveFilters] = useState({ 
        category: 'all',
        price_min: null,
        price_max: null,
        brands: [] // Novo: Array de marcas
    });

    const [selectedProducts, setSelectedProducts] = useState(() => {
         try {
             const saved = localStorage.getItem('compareProducts');
             const initialValue = JSON.parse(saved);
             return Array.isArray(initialValue) ? initialValue.map(Number).filter(id => !isNaN(id)) : [];
         } catch (e) {
             return [];
         }
    }); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // --- BUSCA DE DADOS DA API ---
    useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // MUDANÇA AQUI: Links diretos do Railway
            const [productsResponse, categoriesResponse] = await Promise.all([
                fetch('https://opto-review-production.up.railway.app/api/produtos'), 
                fetch('https://opto-review-production.up.railway.app/api/categorias')
            ]);

            if (!productsResponse.ok || !categoriesResponse.ok) {
                throw new Error('Falha ao buscar dados da API');
            }

            const productsData = await productsResponse.json();
            const categoriesData = await categoriesResponse.json();

            const mappedProducts = productsData.map(p => ({
                id: p.id_produto,
                nome: p.nome,
                fabricante: p.fabricante,
                categoria: p.categoria,
                descricao: p.descricao,
                imagem_url: p.imagem_url,
                especificacoes: p.especificacoes,
                price_low: parseFloat(p.price_low) || null 
            }));

            setAllProducts(mappedProducts);
            setFilteredProducts(mappedProducts);
            setCategorias(categoriesData);

        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);

    // --- LÓGICA DE FILTRAGEM ATUALIZADA ---
    useEffect(() => {
        let currentProducts = [...allProducts];
        const normalizedSearch = normalizeText(searchTerm);

        // 1. Filtro de Busca
        if (normalizedSearch) {
            currentProducts = currentProducts.filter(p =>
                normalizeText(p.nome).includes(normalizedSearch) ||
                normalizeText(p.modelo).includes(normalizedSearch) ||
                normalizeText(p.fabricante).includes(normalizedSearch)
            );
        }

        // 2. Filtro de Categoria
        if (activeFilters.category && activeFilters.category !== 'all') {
            // Lógica para mapear nomes do menu para nomes do banco
            // Ex: O banco pode ter "Placa de Video" (sem acento) e o menu "Placa de Vídeo"
            // Usamos normalizeText para garantir
            currentProducts = currentProducts.filter(p => 
                normalizeText(p.categoria) === normalizeText(activeFilters.category)
            );
        }

        // 3. Filtro de Preço Mínimo
        if (activeFilters.price_min !== null) {
            currentProducts = currentProducts.filter(p => p.price_low && p.price_low >= activeFilters.price_min);
        }

        // 4. Filtro de Preço Máximo
        if (activeFilters.price_max !== null && activeFilters.price_max > 0) {
            currentProducts = currentProducts.filter(p => p.price_low && p.price_low <= activeFilters.price_max);
        }

        // 5. (NOVO) Filtro de Marcas
        if (activeFilters.brands && activeFilters.brands.length > 0) {
            currentProducts = currentProducts.filter(p => 
                // Verifica se o fabricante do produto está na lista de selecionados
                // Normalizamos para evitar problemas com maiúsculas/minúsculas
                activeFilters.brands.some(brand => normalizeText(brand) === normalizeText(p.fabricante))
            );
        }

        setFilteredProducts(currentProducts);

    }, [activeFilters, allProducts, searchTerm]);

    // --- LÓGICA DE COMPARAÇÃO ---
    useEffect(() => {
         try {
             localStorage.setItem('compareProducts', JSON.stringify(selectedProducts));
         } catch (e) {
             console.error("Erro ao salvar seleção no localStorage:", e);
         }
    }, [selectedProducts]);


    // --- HANDLERS ---
    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    }, []);

    const handleProductSelect = useCallback((productId, isChecked) => {
        const idNum = Number(productId); 
        setSelectedProducts(prevSelected => {
            if (isChecked) {
                if (!prevSelected.includes(idNum) && prevSelected.length < 4) {
                    return [...prevSelected, idNum];
                }
            } else {
                return prevSelected.filter(id => id !== idNum);
            }
            return prevSelected; 
        });
    }, []);

    const handleRemoveProduct = useCallback((productId) => {
        setSelectedProducts(prevSelected => prevSelected.filter(id => id !== productId));
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedProducts([]);
    }, []);

    const handleGoToCompare = () => {
        navigate('/compare', { state: { compareProducts: selectedProducts } });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    // Banner Dinâmico (Atualizado para lidar com grupos)
    const { pageTitle, pageDescription } = useMemo(() => {
        if (activeFilters.category === 'all') {
            return {
                pageTitle: "Todos os Produtos",
                pageDescription: "Explore nosso catálogo completo de hardware e periféricos."
            };
        }
        // Se tiver categoria selecionada
        return {
            pageTitle: activeFilters.category,
            pageDescription: `As melhores ofertas de ${activeFilters.category} para o seu setup.`
        };
    }, [activeFilters.category]);


    // --- RENDERIZAÇÃO ---
    if (loading) {
        return (
            <div className="product-list-page">
                <div className="page-content-layout">
                    <div className="sidebar-filters is-loading">
                        <h3><i className="fas fa-sliders-h"></i> Filtros</h3>
                    </div> 
                    <main className="main-content">
                        <div className="loading-message">
                            <i className="fas fa-spinner fa-spin"></i>
                            Carregando produtos...
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
        return (
             <div className="product-list-page">
                <div className="error-message">
                     <i className="fas fa-exclamation-triangle"></i>
                    Erro ao carregar produtos: {error}
                </div>
             </div>
        );
    }

    return (
        <div className="product-list-page">
            
            <div className="page-content-layout">
                <FiltersSidebar 
                    categorias={categorias} 
                    onFilterChange={handleFilterChange} 
                />
                
                <main className="main-content">

                    {/* 1. BANNER */}
                    <header className="page-header">
                        <h1>{pageTitle}</h1>
                        <p>{pageDescription}</p>
                    </header>

                    {/* 2. BARRA DE BUSCA */}
                    <div className="search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input 
                            type="search" 
                            placeholder="Buscar por nome, modelo, fabricante..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="main-search-bar" 
                        />
                    </div>
                    
                    {/* 3. A GRID DE PRODUTOS */}
                    <ProductGrid 
                        products={filteredProducts} 
                        selectedProducts={selectedProducts}
                        onProductSelect={handleProductSelect}
                    />
                </main>
            </div>

            {/* Barra de Comparação Flutuante */}
            <ComparisonBar 
                selectedProductIds={selectedProducts}
                allProducts={allProducts}
                onRemoveProduct={handleRemoveProduct}
                onClearSelection={handleClearSelection}
                onGoToCompare={handleGoToCompare}
            />
        </div>
    );
};

export default ProductListPage;