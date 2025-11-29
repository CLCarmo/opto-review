import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductGrid from './ProductGrid';
import './ProductListPage.css'; // Reutilizamos o CSS da lista de produtos

function FavoritesPage() {
  const { isLoggedIn, favorites } = useAuth();
  const navigate = useNavigate();
  
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Redireciona se não estiver logado
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  // 2. Busca os detalhes dos produtos favoritados
  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      setLoading(true);
      
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://opto-review-production.up.railway.app/api/produtos/detalhes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: favorites })
        });

        if (!response.ok) throw new Error('Falha ao carregar favoritos');

        const data = await response.json();
        
        // Mapeamento igual ao da ProductListPage para garantir compatibilidade com o Card
        const mappedData = data.map(p => ({
            id: p.id_produto,
            nome: p.nome,
            fabricante: p.fabricante,
            categoria: p.categoria,
            descricao: p.descricao,
            imagem_url: p.imagem_url,
            price_low: parseFloat(p.price_low) || null 
        }));

        setFavoriteProducts(mappedData);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
        fetchFavoriteDetails();
    } else {
        setLoading(false); // Para permitir o redirect do outro useEffect
    }

  }, [favorites, isLoggedIn]); // Roda de novo se a lista de IDs favoritos mudar

  // --- RENDERIZAÇÃO ---

  if (loading) {
    return (
      <div className="page-container" style={{textAlign: 'center', marginTop: '50px'}}>
        <i className="fas fa-spinner fa-spin fa-2x"></i>
        <p>Carregando os seus favoritos...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="favorites-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1><i className="fas fa-heart" style={{color: '#e53e3e'}}></i> Meus Favoritos</h1>
        <p>Gerencie os produtos que você está de olho.</p>
      </div>

      {favoriteProducts.length > 0 ? (
        // Reutilizamos o ProductGrid (passamos selectedProducts vazio pois não estamos a comparar aqui)
        <ProductGrid 
          products={favoriteProducts} 
          selectedProducts={[]} // Não usamos a seleção de comparação aqui por enquanto
          onProductSelect={() => {}} // Função vazia
        />
      ) : (
        <div className="empty-state" style={{textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '12px'}}>
          <i className="far fa-heart" style={{fontSize: '4rem', color: '#cbd5e0', marginBottom: '1rem'}}></i>
          <h3>Sua lista está vazia</h3>
          <p>Você ainda não favoritou nenhum produto.</p>
          <Link to="/produtos" className="cta-button" style={{display: 'inline-block', marginTop: '1rem'}}>
             Explorar Produtos
          </Link>
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;