import React, { useState, useEffect, useMemo } from 'react';

// 1. Importa os nossos componentes e CSS
import './GlossaryPage.css'; 
import TermCard from './TermCard'; // O componente para o "acordeão"

// --- O "MAPA" DE FILTROS (Mantido) ---
const logicalCategories = [
  { 
    id: 'Todas',        
    label: 'Todas as Categorias', 
    icon: 'fas fa-border-all', 
    dataCategories: [] // Array vazio = "Todas"
  },
  { 
    id: 'PC', 
    label: 'PC (Computador)', 
    icon: 'fas fa-desktop', 
    // Filtra pela categoria exata vinda do banco
    dataCategories: ['PC (Computador)'] 
  },
  { 
    id: 'Perifericos', 
    label: 'Periféricos', 
    icon: 'fas fa-mouse', 
    // CORRIGIDO: Agora filtra o grupo de categorias vindo do banco
    dataCategories: ['Mouse', 'Teclado', 'Monitor', 'Headset'] 
  },
  { 
    id: 'Acessorios', 
    label: 'Acessórios', 
    icon: 'fas fa-box-open',
    // ADICIONADO: Filtro para "Acessórios"
    dataCategories: ['Acessórios'] 
  },
  { 
    id: 'Geral', 
    label: 'Conceitos Gerais', 
    icon: 'fas fa-brain', 
    // Filtra conceitos gerais
    dataCategories: ['Geral', 'Conceitos'] 
  }
];

function GlossaryPage() {
    // --- ESTADOS ---
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState('Todas');
    
    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- EFEITO: CARREGAR DADOS ---
    useEffect(() => {
        const fetchTerms = async () => {
            try {
                // ==========================================================
                // ÚNICA ALTERAÇÃO: LINK CORRIGIDO PARA O RAILWAY
                // ==========================================================
                const response = await fetch('https://opto-review-production.up.railway.app/api/glossario');
                if (!response.ok) throw new Error('Erro ao buscar glossário');
                
                const data = await response.json();
                setTerms(data);
            } catch (error) {
                console.error("Erro no glossário:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTerms();
    }, []);

    // --- LÓGICA DE FILTRO (useMemo para performance) ---
    const filteredTerms = useMemo(() => {
        return terms.filter(term => {
            // 1. Filtro de Texto (Nome ou Definição)
            const matchesSearch = term.termo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  term.definicao.toLowerCase().includes(searchTerm.toLowerCase());
            
            // 2. Filtro de Categoria (Botões)
            if (activeCategoryFilter === 'Todas') {
                return matchesSearch;
            }

            // Encontra a configuração da categoria ativa
            const categoryGroup = logicalCategories.find(c => c.id === activeCategoryFilter);
            
            // Se algo der errado e não achar o grupo, retorna só a busca
            if (!categoryGroup) return matchesSearch;

            // Verifica se a categoria do termo está dentro do array dataCategories
            return matchesSearch && categoryGroup.dataCategories.includes(term.categoria);
        });
    }, [terms, searchTerm, activeCategoryFilter]);

    // --- LÓGICA DE PAGINAÇÃO ---
    const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
    const currentTerms = filteredTerms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Função para mudar de página e rolar para o topo
    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Carregando glossário...</div>;

    return (
        <div className="glossary-page">
            
            {/* --- CABEÇALHO --- */}
            <header className="glossary-header">
                <h1><i className="fas fa-book"></i> Glossário Gamer</h1>
                <p>Entenda os termos técnicos antes de comprar.</p>
            </header>

            {/* --- CONTROLES (Busca + Filtros) --- */}
            <div className="glossary-controls">
                
                {/* Barra de Pesquisa */}
                <div className="search-bar-wrapper">
                    <i className="fas fa-search icon"></i>
                    <input 
                        type="text" 
                        placeholder="Pesquisar termo..." 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reseta para pág 1 ao pesquisar
                        }}
                    />
                </div>

                {/* Botões de Categoria */}
                <div className="category-filters">
                    {logicalCategories.map(cat => (
                        <button 
                            key={cat.id} 
                            className={`filter-btn ${activeCategoryFilter === cat.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategoryFilter(cat.id);
                                setCurrentPage(1); // Reseta para pág 1 ao filtrar
                            }}
                        >
                            <i className={cat.icon}></i> {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- LISTA DE TERMOS (Resultados) --- */}
            <div className="terms-list">
                {currentTerms.length === 0 ? (
                    <div className="no-results">
                        Nenhum termo encontrado para sua busca.
                    </div>
                ) : (
                    currentTerms.map(term => (
                        // Adaptação para usar o componente TermCard com os dados do banco
                        <TermCard 
                            key={term.id_termo} 
                            termData={{
                                term: term.termo,
                                category: term.categoria,
                                explanation: term.definicao
                            }} 
                        />
                    ))
                )}
            </div>

            {/* --- Paginação (Renderização Condicional) --- */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="page-btn"
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &laquo;
                    </button>
                    
                    {/* Números das páginas */}
                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNum = index + 1;
                        // Lógica simples para não mostrar 100 botões se tiver muitas páginas
                        // (Aqui mostra todos, mas para glossário deve ser OK)
                        return (
                            <button 
                                key={pageNum}
                                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                onClick={() => handlePageClick(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button 
                        className="page-btn"
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &raquo;
                    </button>
                </div>
            )}
        </div> 
    );
}

export default GlossaryPage;import React, { useState, useEffect, useMemo } from 'react';

// 1. Importa os nossos componentes e CSS
import './GlossaryPage.css'; 
import TermCard from './TermCard'; // O componente para o "acordeão"

// --- O "MAPA" DE FILTROS (Mantido) ---
const logicalCategories = [
  { 
    id: 'Todas',        
    label: 'Todas as Categorias', 
    icon: 'fas fa-border-all', 
    dataCategories: [] // Array vazio = "Todas"
  },
  { 
    id: 'PC', 
    label: 'PC (Computador)', 
    icon: 'fas fa-desktop', 
    // Filtra pela categoria exata vinda do banco
    dataCategories: ['PC (Computador)'] 
  },
  { 
    id: 'Perifericos', 
    label: 'Periféricos', 
    icon: 'fas fa-mouse', 
    // CORRIGIDO: Agora filtra o grupo de categorias vindo do banco
    dataCategories: ['Mouse', 'Teclado', 'Monitor', 'Headset'] 
  },
  { 
    id: 'Acessorios', 
    label: 'Acessórios', 
    icon: 'fas fa-box-open',
    // ADICIONADO: Filtro para "Acessórios"
    dataCategories: ['Acessórios'] 
  },
  { 
    id: 'Geral', 
    label: 'Conceitos Gerais', 
    icon: 'fas fa-brain', 
    // Filtra conceitos gerais
    dataCategories: ['Geral', 'Conceitos'] 
  }
];

function GlossaryPage() {
    // --- ESTADOS ---
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState('Todas');
    
    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- EFEITO: CARREGAR DADOS ---
    useEffect(() => {
        const fetchTerms = async () => {
            try {
                // ==========================================================
                // ÚNICA ALTERAÇÃO: LINK CORRIGIDO PARA O RAILWAY
                // ==========================================================
                const response = await fetch('https://opto-review-production.up.railway.app/api/glossario');
                if (!response.ok) throw new Error('Erro ao buscar glossário');
                
                const data = await response.json();
                setTerms(data);
            } catch (error) {
                console.error("Erro no glossário:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTerms();
    }, []);

    // --- LÓGICA DE FILTRO (useMemo para performance) ---
    const filteredTerms = useMemo(() => {
        return terms.filter(term => {
            // 1. Filtro de Texto (Nome ou Definição)
            const matchesSearch = term.termo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  term.definicao.toLowerCase().includes(searchTerm.toLowerCase());
            
            // 2. Filtro de Categoria (Botões)
            if (activeCategoryFilter === 'Todas') {
                return matchesSearch;
            }

            // Encontra a configuração da categoria ativa
            const categoryGroup = logicalCategories.find(c => c.id === activeCategoryFilter);
            
            // Se algo der errado e não achar o grupo, retorna só a busca
            if (!categoryGroup) return matchesSearch;

            // Verifica se a categoria do termo está dentro do array dataCategories
            return matchesSearch && categoryGroup.dataCategories.includes(term.categoria);
        });
    }, [terms, searchTerm, activeCategoryFilter]);

    // --- LÓGICA DE PAGINAÇÃO ---
    const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
    const currentTerms = filteredTerms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Função para mudar de página e rolar para o topo
    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Carregando glossário...</div>;

    return (
        <div className="glossary-page">
            
            {/* --- CABEÇALHO --- */}
            <header className="glossary-header">
                <h1><i className="fas fa-book"></i> Glossário Gamer</h1>
                <p>Entenda os termos técnicos antes de comprar.</p>
            </header>

            {/* --- CONTROLES (Busca + Filtros) --- */}
            <div className="glossary-controls">
                
                {/* Barra de Pesquisa */}
                <div className="search-bar-wrapper">
                    <i className="fas fa-search icon"></i>
                    <input 
                        type="text" 
                        placeholder="Pesquisar termo..." 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reseta para pág 1 ao pesquisar
                        }}
                    />
                </div>

                {/* Botões de Categoria */}
                <div className="category-filters">
                    {logicalCategories.map(cat => (
                        <button 
                            key={cat.id} 
                            className={`filter-btn ${activeCategoryFilter === cat.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategoryFilter(cat.id);
                                setCurrentPage(1); // Reseta para pág 1 ao filtrar
                            }}
                        >
                            <i className={cat.icon}></i> {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- LISTA DE TERMOS (Resultados) --- */}
            <div className="terms-list">
                {currentTerms.length === 0 ? (
                    <div className="no-results">
                        Nenhum termo encontrado para sua busca.
                    </div>
                ) : (
                    currentTerms.map(term => (
                        // Adaptação para usar o componente TermCard com os dados do banco
                        <TermCard 
                            key={term.id_termo} 
                            termData={{
                                term: term.termo,
                                category: term.categoria,
                                explanation: term.definicao
                            }} 
                        />
                    ))
                )}
            </div>

            {/* --- Paginação (Renderização Condicional) --- */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="page-btn"
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &laquo;
                    </button>
                    
                    {/* Números das páginas */}
                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNum = index + 1;
                        // Lógica simples para não mostrar 100 botões se tiver muitas páginas
                        // (Aqui mostra todos, mas para glossário deve ser OK)
                        return (
                            <button 
                                key={pageNum}
                                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                onClick={() => handlePageClick(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button 
                        className="page-btn"
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &raquo;
                    </button>
                </div>
            )}
        </div> 
    );
}

export default GlossaryPage;