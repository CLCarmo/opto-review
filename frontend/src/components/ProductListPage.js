// src/components/ProductListPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegar para a página de comparação

// Importar os componentes filhos
import FiltersSidebar from './FiltersSidebar';
import ProductGrid from './ProductGrid';
import ComparisonBar from './ComparisonBar';

// Importar o CSS da página
import './ProductListPage.css'; 

const normalizeText = (text) => {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const ProductListPage = () => {
    // --- ESTADOS DO COMPONENTE ---
    const [allProducts, setAllProducts] = useState([]); // Guarda todos os produtos da API
    const [filteredProducts, setFilteredProducts] = useState([]); // Produtos a serem exibidos após filtros
    const [categorias, setCategorias] = useState([]); // Categorias para a sidebar
    const [activeFilters, setActiveFilters] = useState({ // Filtros selecionados
        category: 'all',
        price_min: null,
        price_max: null,
        // Futuro: brand: 'all', search: ''
    });
    const [selectedProducts, setSelectedProducts] = useState(() => {
        // Inicializa a seleção com dados do localStorage, se existirem
         try {
             const saved = localStorage.getItem('compareProducts');
             const initialValue = JSON.parse(saved);
             // Garante que é um array de números
             return Array.isArray(initialValue) ? initialValue.map(Number).filter(id => !isNaN(id)) : [];
         } catch (e) {
             return [];
         }
    }); 
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado de erro
    const [searchTerm, setSearchTerm] = useState(''); // Termo de busca (futuro)
    // Hook para navegação programática (ex: ir para /comparar)
    const navigate = useNavigate();

    // --- BUSCA DE DADOS DA API ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Busca produtos e categorias em paralelo
                const [productsResponse, categoriesResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/produtos'),
                    fetch('http://localhost:8080/api/categorias')
                ]);

                if (!productsResponse.ok || !categoriesResponse.ok) {
                    throw new Error('Falha ao buscar dados da API');
                }

                const productsData = await productsResponse.json();
                const categoriesData = await categoriesResponse.json();

                // Adiciona price_low simulado se não vier da API (baseado no schema.sql)
                // O ideal é que a API já retorne isso (talvez buscando da tabela precos)
                const productsWithPrice = productsData.map(p => ({
                    ...p,
                    price_low: p.price_avg ? p.price_avg * 0.85 : (Math.random() * 500 + 50)
                }));

                setAllProducts(productsWithPrice);
                setFilteredProducts(productsWithPrice); // Inicialmente mostra todos
                setCategorias(categoriesData);

            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Array vazio significa que roda apenas uma vez, no mount

    // --- LÓGICA DE FILTRAGEM ---
    useEffect(() => {
        let currentProducts = [...allProducts];
        const normalizedSearch = normalizeText(searchTerm); // ++ Normaliza o termo de busca ++

        // ++ 1. Filtrar por Busca (Nome, Modelo, Fabricante) ++
        if (normalizedSearch) {
            currentProducts = currentProducts.filter(p =>
                normalizeText(p.nome).includes(normalizedSearch) ||
                normalizeText(p.modelo).includes(normalizedSearch) ||
                normalizeText(p.fabricante).includes(normalizedSearch)
            );
        }

        // 2. Filtrar por Categoria
        if (activeFilters.category && activeFilters.category !== 'all') {
            currentProducts = currentProducts.filter(p => p.categoria === activeFilters.category);
        }

        // 3. Filtrar por Preço Mínimo
        if (activeFilters.price_min !== null) {
            currentProducts = currentProducts.filter(p => p.price_low >= activeFilters.price_min);
        }

        // 4. Filtrar por Preço Máximo
        if (activeFilters.price_max !== null && activeFilters.price_max > 0) {
            currentProducts = currentProducts.filter(p => p.price_low <= activeFilters.price_max);
        }

        // Futuro: Adicionar ordenação aqui

        setFilteredProducts(currentProducts);

    // ++ Adiciona searchTerm às dependências ++
    }, [activeFilters, allProducts, searchTerm]);

     // --- LÓGICA DE COMPARAÇÃO (Atualiza localStorage) ---
     useEffect(() => {
        // Salva a seleção atual no localStorage sempre que ela mudar
         try {
             localStorage.setItem('compareProducts', JSON.stringify(selectedProducts));
         } catch (e) {
              console.error("Erro ao salvar seleção no localStorage:", e);
         }
     }, [selectedProducts]);


    // --- HANDLERS (Funções de Callback) ---

    // Chamado pelo FiltersSidebar quando um filtro muda
    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    }, []);

    // Chamado pelo ProductCard quando o checkbox é marcado/desmarcado
    const handleProductSelect = useCallback((productId, isChecked) => {
        setSelectedProducts(prevSelected => {
            if (isChecked) {
                // Adiciona se não estiver presente e se houver espaço (máx 4)
                if (!prevSelected.includes(productId) && prevSelected.length < 4) {
                    return [...prevSelected, productId];
                }
            } else {
                // Remove se estiver presente
                return prevSelected.filter(id => id !== productId);
            }
            return prevSelected; // Retorna o estado anterior se não houver mudança
        });
    }, []);

     // Chamado pela ComparisonBar para remover um item
     const handleRemoveProduct = useCallback((productId) => {
        setSelectedProducts(prevSelected => prevSelected.filter(id => id !== productId));
     }, []);

     // Chamado pela ComparisonBar para limpar tudo
     const handleClearSelection = useCallback(() => {
        setSelectedProducts([]);
     }, []);

     // Chamado pela ComparisonBar para ir à página de comparação
     const handleGoToCompare = useCallback(() => {
         // O localStorage já foi atualizado pelo useEffect. Apenas navega.
         if (selectedProducts.length >= 2) {
            // Assumindo que você tem uma rota '/comparar' no seu React Router
            navigate('/comparar'); 
         }
     }, [selectedProducts, navigate]);

     //HANDLER para atualizar o estado da busca
     const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
     };

    // --- RENDERIZAÇÃO ---

    if (loading) {
        return <div className="loading-message">Carregando produtos... <i className="fas fa-spinner fa-spin"></i></div>;
    }

    if (error) {
        return <div className="error-message">Erro ao carregar produtos: {error}</div>;
    }

    return (
        <div className="product-list-page">
            {/* Cabeçalho da Página (Opcional) */}
            <header className="page-header">
                <h1>Encontre Seu Produto Ideal</h1>
                <p>Use os filtros para refinar sua busca.</p>
                {/* Adicionando a barra de busca aqui */}
                <div className="search-bar-container">
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, modelo..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="main-search-bar" 
                    />
                </div>
            </header>

            {/* Layout Principal: Sidebar + Grid */}
            <div className="page-content-layout">
                <FiltersSidebar 
                    categorias={categorias} 
                    onFilterChange={handleFilterChange} 
                />
                <main className="main-content">
                    {/* Futuro: Adicionar ordenação (mais caro, mais barato, etc.) */}
                    <ProductGrid 
                        products={filteredProducts} 
                        selectedProducts={selectedProducts}
                        onProductSelect={handleProductSelect}
                    />
                     {/* Futuro: Adicionar paginação se houver muitos produtos */}
                </main>
            </div>

            {/* Barra de Comparação Flutuante */}
            <ComparisonBar 
                selectedProductIds={selectedProducts}
                allProducts={allProducts} // Passa todos para a barra poder mostrar nome/imagem
                onRemoveProduct={handleRemoveProduct}
                onClearSelection={handleClearSelection}
                onGoToCompare={handleGoToCompare}
            />
        </div>
    );
};

export default ProductListPage;