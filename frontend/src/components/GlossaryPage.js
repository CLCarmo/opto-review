import React, { useState, useEffect, useMemo } from 'react';
import './GlossaryPage.css'; 
import TermCard from './TermCard';

// Categorias para os botões de filtro
const logicalCategories = [
  { id: 'Todas', label: 'Todas', icon: 'fas fa-border-all', dataCategories: [] },
  { id: 'PC', label: 'Hardware PC', icon: 'fas fa-desktop', dataCategories: ['PC (Computador)'] },
  { id: 'Perifericos', label: 'Periféricos', icon: 'fas fa-mouse', dataCategories: ['Mouse', 'Teclado', 'Monitor', 'Headset'] },
  { id: 'Acessorios', label: 'Acessórios', icon: 'fas fa-gamepad', dataCategories: ['Acessórios', 'Controle'] },
  { id: 'Geral', label: 'Conceitos', icon: 'fas fa-brain', dataCategories: ['Geral', 'Conceitos'] }
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
                // LINK CORRIGIDO DO RAILWAY
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
                <p>Domine os termos técnicos.</p>
            </header>

            <div className="glossary-controls">
                <div className="search-bar-wrapper">
                    <i className="fas fa-search icon"></i>
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
                    <span className="page-info">Pág {currentPage}</span>
                    <button className="page-btn" onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                </div>
            )}
        </div> 
    );
}

export default GlossaryPage;