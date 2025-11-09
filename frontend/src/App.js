import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- NOSSAS IMPORTAÇÕES ---
import Layout from './components/Layout'; 
import HomePage from './components/HomePage'; 
import ProductListPage from './components/ProductListPage'; 
import ProductDetailPage from './components/ProductDetailPage';
import ComparePage from './components/ComparePage'; 
import UpgradePage from './components/UpgradePage';
import GlossaryPage from './components/GlossaryPage';
import AboutPage from './components/AboutPage'; 
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          <Route index element={<HomePage />} />
          <Route path="produtos" element={<ProductListPage />} />
          <Route path="produtos/:produtoId" element={<ProductDetailPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="upgrade" element={<UpgradePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="login" element={<LoginPage />} />
          {/* ... resto das rotas ... */}

        </Route> 
        
      </Routes>
    </Router>
  );
}

export default App;