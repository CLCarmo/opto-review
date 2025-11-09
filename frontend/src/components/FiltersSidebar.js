// src/components/FiltersSidebar.js
import React, { useState, useEffect } from 'react';
import './FiltersSidebar.css'; // Precisaremos criar este CSS

const FiltersSidebar = ({ categorias, onFilterChange }) => {
    // Estado para guardar os filtros selecionados
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    // Futuramente: estado para marcas, etc.

    // Função para lidar com a mudança de categoria
    const handleCategoryChange = (categoriaNome) => {
        setSelectedCategory(categoriaNome);
    };

    // Função para lidar com a mudança nos preços
    const handlePriceChange = () => {
        // Chamaremos onFilterChange quando o usuário parar de digitar ou clicar em "Aplicar"
        // Por enquanto, apenas atualiza o estado local
    };

    // Efeito para chamar onFilterChange sempre que um filtro mudar
    useEffect(() => {
        // Cria um objeto com os filtros ativos
        const activeFilters = {
            category: selectedCategory,
            price_min: minPrice ? parseInt(minPrice) : null,
            price_max: maxPrice ? parseInt(maxPrice) : null,
            // Adicionar outros filtros aqui (marca, etc.)
        };
        // Chama a função passada pelo componente pai (ProductListPage)
        onFilterChange(activeFilters);
    }, [selectedCategory, minPrice, maxPrice, onFilterChange]); // Dependências do efeito


    return (
        <aside className="sidebar-filters">
            <h3><i className="fas fa-filter"></i> Filtros</h3>

            {/* Filtro de Categoria */}
            <div className="filter-group">
                <h4>Categorias</h4>
                <div className="button-filter-group">
                    <button 
                        className={`filter-button ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('all')}
                    >
                        Todas as Categorias
                    </button>
                    {categorias.map(cat => (
                        <button 
                            key={cat.id_categoria}
                            className={`filter-button ${selectedCategory === cat.nome ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat.nome)}
                        >
                            {cat.nome} 
                            {/* Futuramente: Adicionar ícone aqui? */}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filtro de Preço */}
            <div className="filter-group">
                <h4>Faixa de Preço</h4>
                <div className="price-filter-inputs">
                    <input 
                        type="number" 
                        placeholder="Mín. R$" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        // onBlur={handlePriceChange} // Chama ao sair do campo
                        className="price-input"
                    />
                    <span>-</span>
                    <input 
                        type="number" 
                        placeholder="Máx. R$" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        // onBlur={handlePriceChange} // Chama ao sair do campo
                        className="price-input"
                    />
                    {/* Botão Aplicar pode ser útil se não quiser filtrar a cada digitação */}
                    {/* <button onClick={handlePriceChange} className="apply-price-btn">Aplicar</button> */}
                </div>
            </div>

            {/* Futuro: Filtro de Fabricante (Marca) */}
            {/* <div className="filter-group">
                <h4>Fabricante</h4>
                 // Precisaria buscar os fabricantes da API ou extrair dos produtos
            </div> */}

             {/* Futuro: Outros filtros baseados em especificações (ex: Switch, Formato) */}

        </aside>
    );
};

export default FiltersSidebar;