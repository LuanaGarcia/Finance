import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// IMPORTAÇÕES DO FIREBASE
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// COMPONENTES E PÁGINAS
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Contas from './pages/Contas';
import Caixinhas from './pages/Caixinhas';
import Categorias from './pages/Categorias';
import Transacoes from './pages/Transacoes'; // NOSSA NOVA TELA AQUI 👇

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
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
  }

  return (
    <Router>
      <Routes>
        {!currentUser ? (
          <Route path="*" element={<Login />} />
        ) : (
          <Route element={<Layout user={currentUser} onLogout={handleLogout} />}>
            <Route index element={<Dashboard user={currentUser} />} />
            
            {/* ROTA CADASTRADA! */}
            <Route path="transacoes" element={<Transacoes user={currentUser} />} />
            
            <Route path="contas" element={<Contas user={currentUser} />} />
            <Route path="caixinhas" element={<Caixinhas user={currentUser} />} />
            <Route path="categorias" element={<Categorias user={currentUser} />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}