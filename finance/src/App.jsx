import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { api, getToken, clearToken } from './services/api';
import { applyTheme } from './themes';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Contas from './pages/Contas';
import Caixinhas from './pages/Caixinhas';
import Categorias from './pages/Categorias';
import Transacoes from './pages/Transacoes';
import Despesas from './pages/Despesas';
import Configuracoes from './pages/Configuracoes';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    applyTheme(currentUser?.theme || 'violet');
  }, [currentUser?.theme]);

  useEffect(() => {
    const boot = async () => {
      const token = getToken();
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const { user } = await api.me();
        setCurrentUser(user);
      } catch {
        clearToken();
        setCurrentUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    boot();
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleUserUpdate = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    applyTheme('violet');
  };

  if (loadingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--app-bg)] text-[var(--brand)] font-bold text-xl animate-pulse">
        Carregando Sistema...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!currentUser ? (
          <Route path="*" element={<Login onAuthSuccess={handleAuthSuccess} />} />
        ) : (
          <Route element={<Layout user={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />}>
            <Route index element={<Dashboard user={currentUser} />} />
            <Route path="despesas" element={<Despesas user={currentUser} />} />
            <Route path="transacoes" element={<Transacoes user={currentUser} />} />
            <Route path="contas" element={<Contas user={currentUser} />} />
            <Route path="caixinhas" element={<Caixinhas user={currentUser} />} />
            <Route path="categorias" element={<Categorias user={currentUser} />} />
            <Route
              path="configuracoes"
              element={<Configuracoes />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}
