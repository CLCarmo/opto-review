import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o "Provedor" (Provider)
export const AuthProvider = ({ children }) => {
    
    // 3. O Estado Principal (User)
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Falha ao ler o localStorage", error);
            return null;
        }
    });

    // 4. (NOVO) Estado para os Favoritos
    // Vai guardar um array de IDs de produtos, ex: [5, 12, 23]
    const [favorites, setFavorites] = useState([]);

    // 5. Efeito que salva o USER no localStorage (código antigo)
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // 6. (NOVO) Efeito que busca os FAVORITOS quando o user muda
    useEffect(() => {
        // Se o user fizer login...
        if (user && user.id_usuario) {
            const fetchFavorites = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/favoritos/${user.id_usuario}`);
                    if (!response.ok) throw new Error('Falha ao buscar favoritos');
                    
                    const favoriteIds = await response.json(); // Espera [5, 12, 23]
                    setFavorites(favoriteIds);
                    console.log("Favoritos carregados:", favoriteIds);
                } catch (error) {
                    console.error("Erro ao carregar favoritos:", error.message);
                }
            };
            fetchFavorites();
        } 
        // Se o user fizer logout...
        else {
            setFavorites([]); // Limpa a lista de favoritos
        }
    }, [user]); // Dependência: Roda sempre que 'user' mudar

    // 7. Função de Login (código antigo)
    const login = (userData) => {
        const { senha_hash, ...userToSave } = userData;
        setUser(userToSave);
        console.log("Utilizador logado:", userToSave);
    };

    // 8. Função de Logout (código antigo)
    const logout = () => {
        setUser(null);
        // O useEffect acima (item 6) vai limpar os favoritos
        console.log("Utilizador deslogado.");
    };

    // 9. (NOVO) Função para ADICIONAR favorito
    // Usamos useCallback para otimização
    const addFavorite = useCallback(async (productId) => {
        if (!user) return; // Não faz nada se não estiver logado

        // Atualização Otimista: Adiciona o ID à lista *antes* de esperar a API
        // Isto faz a UI (o coração) parecer instantânea
        setFavorites(prevFavorites => [...prevFavorites, productId]);

        try {
            // Chama a nossa nova API (POST)
            await fetch('http://localhost:8080/api/favoritos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id_usuario: user.id_usuario, 
                    id_produto: productId 
                }),
            });
        } catch (error) {
            console.error("Erro ao adicionar favorito:", error.message);
            // Reverte se a API falhar (remove o ID que adicionámos)
            setFavorites(prevFavorites => prevFavorites.filter(id => id !== productId));
        }
    }, [user]); // Dependência: 'user'

    // 10. (NOVO) Função para REMOVER favorito
    const removeFavorite = useCallback(async (productId) => {
        if (!user) return;

        // Atualização Otimista: Remove o ID da lista
        setFavorites(prevFavorites => prevFavorites.filter(id => id !== productId));

        try {
            // Chama a nossa nova API (DELETE)
            await fetch('http://localhost:8080/api/favoritos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id_usuario: user.id_usuario, 
                    id_produto: productId 
                }),
            });
        } catch (error) {
            console.error("Erro ao remover favorito:", error.message);
            // Reverte se a API falhar (adiciona o ID de volta)
            setFavorites(prevFavorites => [...prevFavorites, productId]);
        }
    }, [user]); // Dependência: 'user'


    // 11. O que o Contexto vai partilhar
    const value = {
        user,
        isLoggedIn: !!user,
        login,
        logout,
        favorites, // <-- NOVO
        addFavorite, // <-- NOVO
        removeFavorite // <-- NOVO
    };

    // 12. Retorna o Provedor com o valor partilhado
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 13. Hook Personalizado (código antigo)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};