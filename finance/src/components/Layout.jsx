import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Wallet } from 'lucide-react';

export default function Layout({ user, onLogout }) {
  return (
    <div className="flex h-screen bg-[#f3e8ff] font-sans overflow-hidden">
      {/* O Menu na Esquerda */}
      <Sidebar onLogout={onLogout} />

      {/* A Área de Conteúdo na Direita */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* Header Superior Dinâmico */}
        <header className="bg-white/60 backdrop-blur-md sticky top-0 z-10 border-b border-purple-100 py-4 px-8 flex justify-between items-center">
          
          {/* Logo só aparece aqui no celular, pois no PC já tem no Sidebar */}
          <div className="md:hidden flex items-center gap-2 text-[#8b5cf6]">
            <Wallet size={24} />
            <h1 className="font-bold">MeuControle</h1>
          </div>
          
          <div className="hidden md:block">
             {/* Você pode colocar uma barra de busca aqui no futuro */}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Bem-vindo(a)</p>
              <span className="font-black text-[#4c1d95]">{user?.name || 'Usuário'}</span>
            </div>
            {/* Círculo com a Inicial do Usuário */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#c084fc] text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

        </header>

        {/* ======================================================= */}
        {/* AQUI É A MÁGICA: O Outlet é onde as páginas são jogadas */}
        {/* ======================================================= */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}