import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, Plus, Calendar, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { api } from '../services/api';

export default function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([]);
  
  // Estados para controle do filtro de mês (mês atual como padrão)
  const [currentDate, setCurrentDate] = useState(new Date());

  const loadData = async () => {
    if (!user?.uid) return;
    try {
      const txs = await api.getTransactions();
      setTransactions(txs);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.uid]);

  // Funções para navegar entre os meses no filtro
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Formatação do título do mês (Ex: "Julho de 2026")
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const formattedMonthYear = `${monthNames[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;

  // Filtra as transações correspondentes ao mês/ano selecionado
  const filteredTransactions = transactions.filter(t => {
    if (!t.date) return false;
    // O formato esperado de t.date costuma ser 'YYYY-MM-DD' ou objeto Date
    const tDate = new Date(t.date);
    // Ajuste seguro de timezone se necessário, ou comparação direta de mês/ano:
    return (
      tDate.getUTCMonth() === currentDate.getMonth() &&
      tDate.getUTCFullYear() === currentDate.getFullYear()
    );
  });

  const totalIncomes = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
  const balance = totalIncomes - totalExpenses;

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const chartData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  const COLORS = ['var(--brand)', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#0ea5e9'];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[var(--brand-dark)]">Visão Geral</h2>
          <p className="text-[var(--brand-mid)] font-medium opacity-80 mt-1">Acompanhe suas finanças deste mês</p>
        </div>

        {/* Componente de Filtro de Mês idêntico à tela de transações */}
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-[var(--brand-border)]/50 flex items-center gap-4">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl hover:bg-[var(--brand-soft)] text-[var(--brand)] transition-all"
            title="Mês Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-[var(--brand-dark)] capitalize min-w-[140px] text-center">
            {formattedMonthYear}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl hover:bg-[var(--brand-soft)] text-[var(--brand)] transition-all"
            title="Próximo Mês"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl shadow-sm p-6 border-l-[6px] border-[var(--brand)] hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-[var(--brand)] group-hover:scale-110 transition-transform">
            <Wallet size={120} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-widest">Saldo do Mês</p>
              <h3 className={`text-4xl font-black tracking-tight mt-2 ${balance >= 0 ? 'text-[var(--brand)]' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </h3>
            </div>
            <div className="p-4 bg-[var(--brand-soft)] rounded-2xl text-[var(--brand)] shadow-inner">
              <Wallet size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border-l-[6px] border-emerald-400 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-widest">Receitas</p>
              <h3 className="text-4xl font-black tracking-tight mt-2 text-emerald-500">{formatCurrency(totalIncomes)}</h3>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500 shadow-inner">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border-l-[6px] border-rose-400 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-rose-500 group-hover:scale-110 transition-transform">
            <TrendingDown size={120} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-widest">Despesas</p>
              <h3 className="text-4xl font-black tracking-tight mt-2 text-rose-500">{formatCurrency(totalExpenses)}</h3>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 shadow-inner">
              <TrendingDown size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--brand-border)]/50 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-[var(--brand-dark)] mb-6">Despesas por Categoria</h3>

          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {chartData.length === 0 ? (
              <p className="text-gray-400 text-center font-medium">Nenhuma despesa registrada para exibir no gráfico neste mês.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[var(--brand-border)]/50 lg:col-span-2">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-[var(--brand-dark)]">Movimentações do Mês</h3>
            <span className="text-xs font-bold text-[var(--brand)] bg-[var(--brand-soft)] px-4 py-1.5 rounded-full">{filteredTransactions.length} registros</span>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-28 h-28 bg-[var(--brand-soft)] rounded-full flex items-center justify-center mb-6 text-[var(--brand)] opacity-60">
                <Wallet size={56} />
              </div>
              <h4 className="text-2xl font-bold text-[var(--brand-dark)] mb-2">Nenhuma movimentação neste mês</h4>
              <p className="text-gray-400 max-w-sm text-lg mb-6">Você não possui registros para este período. Que tal adicionar uma transação?</p>
              <Link
                to="/despesas"
                className="flex items-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-5 py-2.5 rounded-xl font-bold transition-all"
              >
                <Plus size={18} />
                Lançar despesa
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
              {filteredTransactions.map((t) => (
                <div key={t.id} className="p-6 px-8 flex justify-between items-center hover:bg-[var(--brand-soft)]/30 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                      {t.type === 'income' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-lg group-hover:text-[var(--brand)] transition-colors">{t.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-md">{t.category || 'Geral'}</span>
                        {t.account && (
                          <span className="text-xs font-bold text-[var(--brand)] bg-[var(--brand-soft)] px-3 py-1 rounded-md flex items-center gap-1.5">
                            <CreditCard size={14} /> {t.account}
                          </span>
                        )}
                        <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                          <Calendar size={14} /> {new Date(t.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xl font-black tracking-tight ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}