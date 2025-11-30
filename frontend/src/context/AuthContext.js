import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

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
                    // ATENÇÃO: Crases (`) usadas aqui
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

    // --- FUNÇÕES DE API ---

    // Função de Login (Chama a API)
    const login = async (email, senha) => {
        try {
            const response = await fetch('https://opto-review-production.up.railway.app/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao fazer login');

            // Salva o usuário no estado (sem a senha)
            setUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Função de Registro (Chama a API)
    const register = async (nome, email, senha) => {
        try {
            const response = await fetch('https://opto-review-production.up.railway.app/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao registrar');

            // Já loga o usuário direto após registrar
            setUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setFavorites([]);
        localStorage.removeItem('user');
    };

    // Adicionar Favorito
    const addFavorite = useCallback(async (productId) => {
        if (!user) return;
        setFavorites(prev => [...prev, productId]); // Atualização Otimista

        try {
            await fetch('https://opto-review-production.up.railway.app/api/favoritos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: user.id_usuario, id_produto: productId }),
            });
        } catch (error) {
            console.error("Erro ao favoritar:", error);
            setFavorites(prev => prev.filter(id => id !== productId)); // Reverte se der erro
        }
    }, [user]);

    // Remover Favorito
    const removeFavorite = useCallback(async (productId) => {
        if (!user) return;
        setFavorites(prev => prev.filter(id => id !== productId)); // Atualização Otimista

        try {
            await fetch('https://opto-review-production.up.railway.app/api/favoritos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: user.id_usuario, id_produto: productId }),
            });
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
            setFavorites(prev => [...prev, productId]); // Reverte se der erro
        }
    }, [user]);

    // Atualizar Usuário
    const updateUser = async (newData) => {
        if (!user) return;
        
        try {
            const response = await fetch(`https://opto-review-production.up.railway.app/api/usuarios/${user.id_usuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
            
            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser); 
                localStorage.setItem('user', JSON.stringify(updatedUser)); 
            }
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
        }
    };

    const value = {
        user,
        isLoggedIn: !!user,
        login,    // Agora exportamos a função que faz o fetch
        register, // Agora exportamos a função que faz o fetch
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