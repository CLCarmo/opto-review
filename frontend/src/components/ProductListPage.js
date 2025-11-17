// src/components/ProductListPage.js
import { useState, useEffect, useCallback, useMemo } from 'react'; // 1. Adiciona useMemo
import { useNavigate } from 'react-router-dom';

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
    const [allProducts, setAllProducts] = useState([]); 
    const [filteredProducts, setFilteredProducts] = useState([]); 
    const [categorias, setCategorias] = useState([]); 
    const [activeFilters, setActiveFilters] = useState({ 
        category: 'all',
        price_min: null,
        price_max: null,
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
                // Busca produtos e categorias em paralelo
                const [productsResponse, categoriesResponse] = await Promise.all([
                    // ATUALIZADO: Usando a rota de produtos que já busca tudo
                    fetch('http://localhost:8080/api/produtos'), 
                    fetch('http://localhost:8080/api/categorias')
                ]);

                if (!productsResponse.ok || !categoriesResponse.ok) {
                    throw new Error('Falha ao buscar dados da API');
                }

                const productsData = await productsResponse.json();
                const categoriesData = await categoriesResponse.json();

                // Mapeia os dados da API para o formato que o frontend espera
                const mappedProducts = productsData.map(p => ({
                    // (O 'p' é o objeto vindo do backend)
                    id: p.id_produto, // (frontend espera 'id')
                    nome: p.nome,
                    fabricante: p.fabricante,
                    categoria: p.categoria,
                    descricao: p.descricao,
                    imagem_url: p.imagem_url,
                    especificacoes: p.especificacoes,
                    // Garante que price_low seja um número
                    price_low: parseFloat(p.price_low) || null 
                }));

                setAllProducts(mappedProducts);
                setFilteredProducts(mappedProducts); // Inicialmente mostra todos
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
        const normalizedSearch = normalizeText(searchTerm);

        // 1. Filtrar por Busca (Nome, Modelo, Fabricante)
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
            currentProducts = currentProducts.filter(p => p.price_low && p.price_low >= activeFilters.price_min);
        }

        // 4. Filtrar por Preço Máximo
        if (activeFilters.price_max !== null && activeFilters.price_max > 0) {
            currentProducts = currentProducts.filter(p => p.price_low && p.price_low <= activeFilters.price_max);
        }

        setFilteredProducts(currentProducts);

    }, [activeFilters, allProducts, searchTerm]);

    // --- LÓGICA DE COMPARAÇÃO (Atualiza localStorage) ---
    useEffect(() => {
         try {
             localStorage.setItem('compareProducts', JSON.stringify(selectedProducts));
         } catch (e) {
             console.error("Erro ao salvar seleção no localStorage:", e);
         }
    }, [selectedProducts]);


    // --- HANDLERS (Funções de Callback) ---
    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    }, []);

    const handleProductSelect = useCallback((productId, isChecked) => {
        // Usa o ID normalizado (que já deve ser número)
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
        navigate(
            '/compare', 
            { 
              state: { 
                compareProducts: selectedProducts 
              } 
            }
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    // 2. CORREÇÃO: Cria o título e descrição do banner dinamicamente
    const { pageTitle, pageDescription } = useMemo(() => {
        if (activeFilters.category === 'all') {
            return {
                pageTitle: "Todos os Produtos",
                pageDescription: "Explore nosso catálogo completo de hardware e periféricos."
            };
        }
        // Tenta encontrar o nome da categoria selecionada
        const categoriaObj = categorias.find(c => c.nome === activeFilters.category);
        if (categoriaObj) {
            return {
                pageTitle: categoriaObj.nome, // ex: "Mouses"
                pageDescription: `Encontre os melhores ${categoriaObj.nome.toLowerCase()} do mercado.`
            };
        }
        // Fallback
        return {
            pageTitle: "Produtos",
            pageDescription: "Explore nosso catálogo."
        };
    }, [activeFilters.category, categorias]);

    // 3. NOVO: Descobre qual categoria está "ativa" para a comparação
    const activeCategory = useMemo(() => {
        // Se não há produtos selecionados, nenhuma categoria está ativa
        if (selectedProducts.length === 0) {
            return null;
        }
        
        // Pega o ID do *primeiro* produto selecionado
        const firstProductId = selectedProducts[0];
        
        // Encontra o objeto completo desse produto
        const firstProduct = allProducts.find(p => p.id === firstProductId);
        
        // Retorna a categoria dele (ex: "Mouse")
        return firstProduct ? firstProduct.categoria : null;

    }, [selectedProducts, allProducts]);

    // --- RENDERIZAÇÃO ---
    if (loading) {
        return (
            <div className="product-list-page">
                <div className="page-content-layout">
                    {/* Mostra um "esqueleto" da sidebar enquanto carrega */}
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

                    {/* 1. BANNER (Agora com as variáveis corretas) */}
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
                        activeCategory={activeCategory} 
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