// frontend/src/components/GlossaryPage.js
import React, { useState, useEffect, useMemo } from 'react';

// 1. Importa os nossos componentes e CSS
import './GlossaryPage.css'; 
import TermCard from './TermCard'; // O componente para o "acordeão"

// --- O "MAPA" DE FILTROS (Mantido) ---
/*const logicalCategories = [
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
];*/

const logicalCategories = [
  { id: 'Todas', label: 'Todas as Categorias', icon: 'fas fa-border-all', dataCategories: [] },
  { id: 'PC', label: 'PC (Computador)', icon: 'fas fa-desktop', dataCategories: ['PC (Computador)'] },
  { id: 'Perifericos', label: 'Periféricos', icon: 'fas fa-mouse', dataCategories: ['Mouse', 'Teclado', 'Monitor', 'Headset'] },
  { id: 'Acessorios', label: 'Acessórios', icon: 'fas fa-box-open', dataCategories: ['Acessórios'] },
  { id: 'Geral', label: 'Conceitos Gerais', icon: 'fas fa-brain', dataCategories: ['Geral', 'Conceitos'] }
];

function GlossaryPage() {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState('Todas');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                // AQUI ESTAVA O ERRO - URL CORRIGIDA
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

    // ... (RESTO DA LÓGICA DE FILTRO E PAGINAÇÃO PERMANECE IGUAL) ...
    // Se quiser garantir, cole o arquivo inteiro que eu mando abaixo:

    // Filtros
    const filteredTerms = useMemo(() => {
        return terms.filter(term => {
            const matchesSearch = term.termo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  term.definicao.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (activeCategoryFilter === 'Todas') return matchesSearch;

            const categoryGroup = logicalCategories.find(c => c.id === activeCategoryFilter);
            if (!categoryGroup) return matchesSearch;

            return matchesSearch && categoryGroup.dataCategories.includes(term.categoria);
        });
    }, [terms, searchTerm, activeCategoryFilter]);

    // Paginação
    const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
    const currentTerms = filteredTerms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Carregando glossário...</div>;

    return (
        <div className="glossary-page">
            <header className="glossary-header">
                <h1><i className="fas fa-book"></i> Glossário Gamer</h1>
                <p>Entenda os termos técnicos antes de comprar.</p>
            </header>

            <div className="glossary-controls">
                <div className="search-bar-wrapper">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Pesquisar termo..." 
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="category-filters">
                    {logicalCategories.map(cat => (
                        <button 
                            key={cat.id} 
                            className={`filter-btn ${activeCategoryFilter === cat.id ? 'active' : ''}`}
                            onClick={() => { setActiveCategoryFilter(cat.id); setCurrentPage(1); }}
                        >
                            <i className={cat.icon}></i> {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="terms-list">
                {currentTerms.length === 0 ? (
                    <div className="no-results">Nenhum termo encontrado.</div>
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

            {totalPages > 1 && (
                <div className="pagination">
                    <button className="page-btn" onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                    <span className="page-info">Página {currentPage} de {totalPages}</span>
                    <button className="page-btn" onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                </div>
            )}
        </div> 
    );
}

export default GlossaryPage;