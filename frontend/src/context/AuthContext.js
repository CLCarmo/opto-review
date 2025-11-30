import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o "Provedor" (Provider)
export const AuthProvider = ({ children }) => {
    
    // --- ESTADOS ---
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Falha ao ler o localStorage", error);
            return null;
        }
    });

    const [favorites, setFavorites] = useState([]);

    // --- EFEITOS ---

    // 1. Salva User no localStorage sempre que mudar
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // 2. Busca Favoritos na API quando o usuário loga
    useEffect(() => {
        if (user && user.id_usuario) {
            const fetchFavorites = async () => {
                try {
                    // LINK DO RAILWAY CORRIGIDO
                    const response = await fetch(`https://opto-review-production.up.railway.app/api/favoritos/${user.id_usuario}`);
                    if (!response.ok) throw new Error('Falha ao buscar favoritos');
                    
                    const favoriteIds = await response.json();
                    setFavorites(favoriteIds);
                } catch (error) {
                    console.error("Erro ao carregar favoritos:", error.message);
                }
            };
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [user]);

    // --- FUNÇÕES ---

    // Login Síncrono (Recebe dados do LoginPage e salva)
    const login = (userData) => {
        // Remove a senha antes de salvar no estado
        const { senha_hash, ...userToSave } = userData;
        setUser(userToSave);
    };

    const logout = () => {
        setUser(null);
        setFavorites([]);
        localStorage.removeItem('user');
    };

    // Adicionar Favorito (URL CORRIGIDA)
    const addFavorite = useCallback(async (productId) => {
        if (!user) return;
        setFavorites(prev => [...prev, productId]); // Otimista

        try {
            await fetch('https://opto-review-production.up.railway.app/api/favoritos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: user.id_usuario, id_produto: productId }),
            });
        } catch (error) {
            setFavorites(prev => prev.filter(id => id !== productId)); // Reverte erro
        }
    }, [user]);

    // Remover Favorito (URL CORRIGIDA)
    const removeFavorite = useCallback(async (productId) => {
        if (!user) return;
        setFavorites(prev => prev.filter(id => id !== productId)); // Otimista

        try {
            await fetch('https://opto-review-production.up.railway.app/api/favoritos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: user.id_usuario, id_produto: productId }),
            });
        } catch (error) {
            setFavorites(prev => [...prev, productId]); // Reverte erro
        }
    }, [user]);

    // Atualizar Usuário (URL CORRIGIDA)
    // Essa função é usada pelo ProfilePage para salvar avatar/fundo
    const updateUser = async (newData) => {
        if (!user) return;
        
        try {
            // CORREÇÃO: Usar crase (`) e link do Railway
            const response = await fetch(`https://opto-review-production.up.railway.app/api/usuarios/${user.id_usuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
            
            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser); // Atualiza estado
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Atualiza storage
            }
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
        }
    };

    // --- VALOR DO CONTEXTO ---
    const value = {
        user,
        isLoggedIn: !!user,
        login,
        logout,
        favorites,
        addFavorite,
        removeFavorite,
        updateUser 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};