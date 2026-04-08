import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  // 'currentUser' guarda as informações do usuário. Se for null, ninguém logou.
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <>
      {currentUser ? (
        // Se temos um usuário, mostramos o Dashboard
        <Dashboard 
          user={currentUser} 
          onLogout={() => setCurrentUser(null)} 
        />
      ) : (
        // Se NÃO temos usuário, mostramos o Login
        <Login 
          onLoginSuccess={(userData) => setCurrentUser(userData)} 
        />
      )}
    </>
  );
}

