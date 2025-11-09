import React, { useState, useMemo } from 'react';
import './SearchableGallery.css'; // Importa o CSS

/**
 * Componente Reutilizável de Galeria com Busca
 * (Baseado na tua ideia da galeria de apps )
 * * @param {Array} data - A lista completa de itens (ex: todos os jogos, todos os apps)
 * @param {Array} selectedItems - A lista de IDs dos itens selecionados (do estado pai)
 * @param {Function} onSelectionChange - A função para atualizar o estado pai
 */
function SearchableGallery({ data, selectedItems, onSelectionChange }) {
  
  // Estado SÓ para o termo de busca, local a este componente
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra os itens com base na busca
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => 
      item.name.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, data]);

  // Lida com o clique num item
  const handleToggle = (itemId) => {
    const isSelected = selectedItems.includes(itemId);
    let newSelection;
    if (isSelected) {
      newSelection = selectedItems.filter(id => id !== itemId); // Remove
    } else {
      newSelection = [...selectedItems, itemId]; // Adiciona
    }
    // Chama a função do componente PAI para atualizar o estado
    onSelectionChange(newSelection);
  };

  return (
    <div className="searchable-gallery">
      {/* --- A TUA BARRA DE BUSCA --- */}
      <div className="gallery-search-container">
        <div className="input-wrapper-gallery">
          <i className="fas fa-search icon"></i>
          <input 
            type="text" 
            className="gallery-search-input"
            placeholder="Pesquisar jogos ou apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* --- A TUA GRELHA DE ITENS --- */}
      <div className="gallery-grid">
        {filteredData.map(item => {
          const isSelected = selectedItems.includes(item.id);
          return (
            <div 
              key={item.id}
              className={`logo-item ${isSelected ? 'selected' : ''}`}
              onClick={() => handleToggle(item.id)}
            >
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchableGallery;