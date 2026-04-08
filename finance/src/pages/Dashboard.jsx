import React from 'react';
import { LogOut, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      {/* Header Roxo */}
      <header className="bg-purple-700 shadow-md py-4 px-8 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Wallet size={28} />
          <h1 className="text-xl font-bold">MeuControle</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Olá, {user.name}</span>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-purple-900 mb-6">Visão Geral do Mês</h2>
        
        {/* Cards de Resumo Financeiro (Usando Tailwind) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Saldo Atual</p>
                <h3 className="text-2xl font-bold text-purple-700">R$ 2.450,00</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                <Wallet size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Receitas</p>
                <h3 className="text-2xl font-bold text-green-600">R$ 4.000,00</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg text-green-600">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Despesas</p>
                <h3 className="text-2xl font-bold text-red-600">R$ 1.550,00</h3>
              </div>
              <div className="p-3 bg-red-100 rounded-lg text-red-600">
                <TrendingDown size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Espaço para os futuros Gráficos */}
        <div className="bg-white rounded-xl shadow-sm p-6 h-64 flex items-center justify-center border border-purple-100">
          <p className="text-purple-400 font-medium text-center">
            Área reservada para os Gráficos de Categorias (Recharts / Chart.js) <br/> 
            Vamos adicionar isso na próxima etapa do TCC!
          </p>
        </div>
      </main>
    </div>
  );
}
