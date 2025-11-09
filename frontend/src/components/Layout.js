import React from 'react';
// Importa o Outlet, que é o "espaço reservado" para as páginas
import { Outlet } from 'react-router-dom'; 

// Importa os componentes que acabámos de criar
import Header from './Header';
import Footer from './Footer';

/**
 * Componente Layout
 * Define a estrutura visual principal da aplicação (Header, Conteúdo da Página, Footer).
 * As páginas (HomePage, ProductListPage, etc.) serão renderizadas
 * no lugar do <Outlet />.
 */
function Layout() {
  return (
    <>
      {/* O Header aparecerá em todas as páginas */}
      <Header />

      {/* Usamos a classe 'page-container' que já tinhas no teu
        base.css para centrar e limitar 
        o conteúdo principal.
      */}
      <main className="page-container">
        {/* <Outlet /> é o marcador do React Router. */}
        {/* É aqui que a mágica acontece: */}
        {/* Se estiveres em "/", ele renderiza <HomePage /> aqui. */}
        {/* Se estiveres em "/produtos", ele renderiza <ProductListPage /> aqui. */}
        <Outlet />
      </main>

      {/* O Footer aparecerá em todas as páginas */}
      <Footer />
    </>
  );
}

export default Layout;