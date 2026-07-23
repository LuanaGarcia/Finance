import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

<<<<<<< HEAD
import { api, getToken, clearToken } from './services/api';
import { applyTheme } from './themes';
=======
// IMPORTAÇÕES DO FIREBASE
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// COMPONENTES E PÁGINAS
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Contas from './pages/Contas';
import Caixinhas from './pages/Caixinhas';
import Categorias from './pages/Categorias';
<<<<<<< HEAD
import Transacoes from './pages/Transacoes';
import Despesas from './pages/Despesas';
import Configuracoes from './pages/Configuracoes';
=======
import Transacoes from './pages/Transacoes'; // NOSSA NOVA TELA AQUI 👇
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email, name: user.displayName || "Usuário" });
      } else {
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  if (loadingAuth) {
    return <div className="flex h-screen w-screen items-center justify-center bg-[#f3e8ff] text-[#8b5cf6] font-bold text-xl animate-pulse">Carregando Sistema...</div>;
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
  }

  return (
    <Router>
      <Routes>
        {!currentUser ? (
<<<<<<< HEAD
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
=======
          <Route path="*" element={<Login />} />
        ) : (
          <Route element={<Layout user={currentUser} onLogout={handleLogout} />}>
            <Route index element={<Dashboard user={currentUser} />} />
            
            {/* ROTA CADASTRADA! */}
            <Route path="transacoes" element={<Transacoes user={currentUser} />} />
            
            <Route path="contas" element={<Contas user={currentUser} />} />
            <Route path="caixinhas" element={<Caixinhas user={currentUser} />} />
            <Route path="categorias" element={<Categorias user={currentUser} />} />

>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
