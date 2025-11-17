// frontend/src/components/GlossaryPage.js
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
    id: 'Software', 
    label: 'Software e Testes', 
    icon: 'fas fa-cogs', // Ícone para software/configurações
    // ADICIONADO: Filtro para "Software e Serviços"
    dataCategories: ['Software e Serviços'] 
  }
];


// --- DADOS ESTÁTICOS ANTIGOS (REMOVIDO!) ---
// const termsData = [...]; 
// O JSON que estava aqui foi APAGADO.


/**
 * Componente GlossaryPage
 * (VERSÃO ATUALIZADA COM FETCH DA API)
 */
function GlossaryPage() {

    // --- ESTADOS DA PÁGINA ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todas');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Quantos termos por página

    // --- NOVOS ESTADOS PARA A API ---
    const [allTerms, setAllTerms] = useState([]); // Guarda os termos vindos do BD
    const [isLoading, setIsLoading] = useState(true); // Controla o "Carregando..."
    const [error, setError] = useState(null); // Guarda mensagens de erro

    // --- PASSO NOVO: BUSCAR DADOS DA API ---
    useEffect(() => {
        const fetchGlossary = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/glossario');
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados do glossário');
                }
                const dataFromApi = await response.json();
                
                // "Traduz" os nomes das colunas do BD (ex: 'termo') 
                // para os nomes que o TermCard espera (ex: 'term')
                const mappedData = dataFromApi.map(item => ({
                    id: item.id_glossario,
                    term: item.termo,
                    explanation: item.explicacao,
                    category: item.categoria,
                    subcategory: item.subcategoria,
                    practical_tip: item.dica_pratica,
                    details: item.detalhes
                }));

                setAllTerms(mappedData); // Guarda no estado

            } catch (err) {
                console.error("Erro no fetchGlossary:", err);
                setError(err.message);
            } finally {
                setIsLoading(false); // Termina o carregamento
            }
        };

        fetchGlossary(); // Executa a busca
    }, []); // O array vazio [] faz isso rodar apenas uma vez


    // --- LÓGICA DE FILTRO (useMemo) ---
    // ATUALIZADO: Agora usa 'allTerms' (do estado) em vez de 'termsData' (estático)
    const filteredTerms = useMemo(() => {
        let terms = allTerms; // Começa com todos os termos da API

        // 1. Filtra por Categoria (baseado no 'activeFilter')
        const activeCategoryDef = logicalCategories.find(c => c.id === activeFilter);
        if (activeCategoryDef && activeCategoryDef.dataCategories.length > 0) {
            terms = terms.filter(term => 
                activeCategoryDef.dataCategories.includes(term.category)
            );
        }

        // 2. Filtra pelo Termo de Busca (Search)
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            terms = terms.filter(term => 
                term.term.toLowerCase().includes(lowerSearch) ||
                term.explanation.toLowerCase().includes(lowerSearch)
            );
        }
        
        return terms;
    }, [allTerms, activeFilter, searchTerm]); // Depende do estado da API


    // --- LÓGICA DE PAGINAÇÃO (useMemo) ---
    const { paginatedTerms, totalPages } = useMemo(() => {
        const total = Math.ceil(filteredTerms.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        return {
            paginatedTerms: filteredTerms.slice(start, end),
            totalPages: total
        };
    }, [filteredTerms, currentPage, itemsPerPage]);

    // --- Handlers (Funções de clique) ---
    const handleFilterClick = (filterId) => {
        setActiveFilter(filterId);
        setCurrentPage(1); // Reseta para a página 1
    };

    const handlePageClick = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };


    // --- RENDERIZAÇÃO ---
    
   return (
    <div className="glossary-page-wrapper">
            {/* --- Header da Página --- */}
            <div className="glossary-header">
                <h1>
                    <i className="fas fa-book-open"></i> Glossário Técnico
                </h1>
                <p>Descomplicando os termos e jargões do mundo do hardware.</p>
            </div>

            {/* --- Controles (Busca e Filtros) --- */}
            <div className="glossary-controls">
                {/* Barra de Busca */}
                <div className="search-bar-container">
                    <i className="fas fa-search search-icon"></i>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Buscar termo (ex: DPI, Switch, Ray Tracing...)"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reseta página ao digitar
                        }}
                    />
                </div>
                {/* Botões de Filtro */}
                <div className="filter-buttons">
                    {logicalCategories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
                            onClick={() => handleFilterClick(cat.id)}
                        >
                            <i className={cat.icon}></i> {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Grelha de Termos (com Loading e Error) --- */}
            <div className="terms-grid">
                {/* ESTADO DE CARREGAMENTO */}
                {isLoading && (
                    <div className="glossary-message">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Carregando termos do banco de dados...</p>
                    </div>
                )}

                {/* ESTADO DE ERRO */}
                {!isLoading && error && (
                    <div className="glossary-message error">
                        <i className="fas fa-exclamation-triangle"></i>
                        <p>Erro ao carregar glossário.</p>
                        <small>{error}</small>
                    </div>
                )}

                {/* SUCESSO, MAS SEM RESULTADOS */}
                {!isLoading && !error && filteredTerms.length === 0 && (
                    <div className="glossary-message">
                        <i className="fas fa-search"></i>
                        <p>Nenhum termo encontrado.</p>
                        <small>Tente alterar seus filtros ou termo de busca.</small>
                    </div>
                )}

                {/* SUCESSO COM RESULTADOS */}
                {!isLoading && !error && paginatedTerms.length > 0 && (
                    paginatedTerms.map(term => (
                        <TermCard key={term.id} termData={term} />
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
                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNum = index + 1;
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