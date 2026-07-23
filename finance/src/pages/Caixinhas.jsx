import React, { useState, useEffect } from 'react';
import { Plus, X, PiggyBank, Target, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

import { api } from '../services/api';

export default function Caixinhas({ user }) {
  const [caixinhas, setCaixinhas] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [transactionModal, setTransactionModal] = useState({ isOpen: false, type: '', caixinha: null });
  const [isLoading, setIsLoading] = useState(false);

  const [createData, setCreateData] = useState({ name: '', goalAmount: '' });
  const [transactionAmount, setTransactionAmount] = useState('');

  const loadCaixinhas = async () => {
    if (!user?.uid) return;
    try {
      const caixas = await api.getCaixinhas();
      setCaixinhas(caixas);
    } catch (error) {
      console.error('Erro ao carregar caixinhas:', error);
    }
  };

  useEffect(() => {
    loadCaixinhas();
  }, [user?.uid]);

  const handleCreateCaixinha = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.createCaixinha({
        name: createData.name,
        goalAmount: Number(createData.goalAmount),
      });

      setCreateData({ name: '', goalAmount: '' });
      setIsCreateModalOpen(false);
      await loadCaixinhas();
    } catch (error) {
      console.error('Erro ao criar caixinha: ', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { type, caixinha } = transactionModal;
    const amount = Number(transactionAmount);

    try {
      if (type === 'deposit') {
        await api.depositCaixinha(caixinha.id, amount);
      } else if (type === 'withdraw') {
        if (amount > caixinha.currentAmount) {
          alert('Você não tem esse valor todo na caixinha para resgatar!');
          setIsLoading(false);
          return;
        }
        await api.withdrawCaixinha(caixinha.id, amount);
      }

      setTransactionAmount('');
      setTransactionModal({ isOpen: false, type: '', caixinha: null });
      await loadCaixinhas();
    } catch (error) {
      console.error('Erro na transação: ', error);
      alert(error.message || 'Erro ao processar o valor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCaixinha = async (id, currentAmount) => {
    if (currentAmount > 0) {
      alert('Você precisa resgatar todo o dinheiro antes de excluir a caixinha!');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir esta caixinha?')) {
      try {
        await api.deleteCaixinha(id);
        await loadCaixinhas();
      } catch (error) {
        console.error('Erro ao deletar: ', error);
        alert(error.message || 'Erro ao deletar. Tente novamente.');
      }
    }
  };

  // UTILITÁRIOS
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const calculateProgress = (current, goal) => {
    if (goal === 0) return 0;
    const percentage = (current / goal) * 100;
    return percentage > 100 ? 100 : percentage.toFixed(1);
  };

  return (
    <>
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-[var(--brand-dark)]">Minhas Caixinhas</h2>
          <p className="text-[var(--brand-mid)] font-medium opacity-80 mt-1">Guarde dinheiro para seus objetivos e metas</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus size={22} />
          Criar Caixinha
        </button>
      </div>

      {/* LISTA DE CAIXINHAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caixinhas.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl shadow-sm border border-[var(--brand-border)] flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[var(--brand-soft)] rounded-full flex items-center justify-center mb-4 text-[var(--brand)]">
              <PiggyBank size={40} />
            </div>
            <h3 className="text-xl font-bold text-[var(--brand-dark)] mb-2">Nenhuma caixinha criada</h3>
            <p className="text-gray-500">Crie metas para organizar seu dinheiro (Ex: Viagem, Reserva de Emergência).</p>
          </div>
        ) : (
          caixinhas.map((caixa) => {
            const progress = calculateProgress(caixa.currentAmount, caixa.goalAmount);
            const isGoalReached = caixa.currentAmount >= caixa.goalAmount;

            return (
              <div key={caixa.id} className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--brand-border)] hover:shadow-md transition-all relative group flex flex-col">
                
                {/* Botão de Excluir */}
                <button 
                  onClick={() => handleDeleteCaixinha(caixa.id, caixa.currentAmount)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-white rounded-full p-2 hover:bg-red-50"
                  title="Excluir Caixinha"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-4 rounded-2xl ${isGoalReached ? 'bg-emerald-50 text-emerald-500' : 'bg-[var(--brand-soft)] text-[var(--brand)]'}`}>
                    <PiggyBank size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{caixa.name}</h3>
                    <p className="text-sm font-medium text-gray-400">Meta: {formatCurrency(caixa.goalAmount)}</p>
                  </div>
                </div>
                
                {/* Saldo Atual */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Saldo Guardado</p>
                  <p className={`text-3xl font-black ${isGoalReached ? 'text-emerald-500' : 'text-[var(--brand)]'}`}>
                    {formatCurrency(caixa.currentAmount)}
                  </p>
                </div>

                {/* Barra de Progresso */}
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${isGoalReached ? 'bg-emerald-400' : 'bg-gradient-to-r from-[var(--brand)] to-[var(--brand-light)]'}`} 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-6">
                  <span>{progress}% alcançado</span>
                  {isGoalReached && <span className="text-emerald-500">Meta Atingida! 🎉</span>}
                </div>

                {/* Botões de Ação (Guardar / Resgatar) */}
                <div className="mt-auto flex gap-2">
                  <button 
                    onClick={() => setTransactionModal({ isOpen: true, type: 'deposit', caixinha: caixa })}
                    className="flex-1 bg-[var(--brand-soft)] hover:bg-[var(--brand)] text-[var(--brand)] hover:text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <TrendingUp size={16} /> Guardar
                  </button>
                  <button 
                    onClick={() => setTransactionModal({ isOpen: true, type: 'withdraw', caixinha: caixa })}
                    disabled={caixa.currentAmount === 0}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrendingDown size={16} /> Resgatar
                  </button>
                </div>

              </div>
            )
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CRIAR NOVA CAIXINHA */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-[var(--brand-dark)]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            
            <div className="bg-gradient-to-r from-[var(--brand)] to-[var(--brand-light)] p-6 flex justify-between items-center text-white">
              <h3 className="text-2xl font-bold tracking-wide">Criar Caixinha</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCaixinha} className="p-8 space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-gray-600 ml-1">Nome do Objetivo</span>
                <input required type="text" placeholder="Ex: Viagem, Carro Novo, Reserva..."
                  className="mt-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100 focus:border-[var(--brand)] outline-none text-[var(--brand-dark)] font-bold transition-all"
                  value={createData.name} onChange={(e) => setCreateData({...createData, name: e.target.value})}
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-gray-600 ml-1">Meta de Valor (R$)</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Target className="text-gray-400" size={20} />
                  </div>
                  <input required type="number" step="0.01" min="1" placeholder="0.00"
                    className="mt-1 w-full bg-gray-50 pl-11 p-4 rounded-xl border border-gray-100 focus:border-[var(--brand)] outline-none text-[var(--brand-dark)] font-bold transition-all"
                    value={createData.goalAmount} onChange={(e) => setCreateData({...createData, goalAmount: e.target.value})}
                  />
                </div>
              </label>

              <div className="mt-8 pt-4">
                <button type="submit" disabled={isLoading}
                  className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black py-4 rounded-xl uppercase text-sm tracking-widest transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Criando...' : 'Criar Caixinha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: GUARDAR OU RESGATAR DINHEIRO */}
      {/* ========================================================= */}
      {transactionModal.isOpen && (
        <div className="fixed inset-0 bg-[var(--brand-dark)]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden transform transition-all">
            
            <div className={`p-6 flex justify-between items-center text-white ${transactionModal.type === 'deposit' ? 'bg-[var(--brand)]' : 'bg-gray-800'}`}>
              <h3 className="text-xl font-bold">
                {transactionModal.type === 'deposit' ? 'Guardar Dinheiro' : 'Resgatar Dinheiro'}
              </h3>
              <button onClick={() => setTransactionModal({ isOpen: false, type: '', caixinha: null })} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleTransaction} className="p-8">
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-gray-500">Caixinha Selecionada</p>
                <p className="text-xl font-bold text-gray-800">{transactionModal.caixinha?.name}</p>
                <p className="text-xs text-gray-400 mt-1">Saldo atual: {formatCurrency(transactionModal.caixinha?.currentAmount)}</p>
              </div>

              <label className="block mb-6">
                <span className="text-sm font-bold text-gray-600 ml-1">
                  Qual valor deseja {transactionModal.type === 'deposit' ? 'guardar' : 'resgatar'}? (R$)
                </span>
                <input required type="number" step="0.01" min="0.01" placeholder="0.00"
                  className="mt-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100 focus:border-[var(--brand)] outline-none text-[var(--brand-dark)] font-bold text-center text-2xl"
                  value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)}
                />
              </label>

              <button type="submit" disabled={isLoading}
                className={`w-full text-white font-black py-4 rounded-xl uppercase text-sm tracking-widest transition-all shadow-md ${
                  transactionModal.type === 'deposit' ? 'bg-[var(--brand)] hover:bg-[var(--brand-hover)]' : 'bg-gray-800 hover:bg-gray-900'
                } disabled:opacity-50`}
              >
                {isLoading ? 'Processando...' : 'Confirmar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
