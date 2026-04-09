import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, X, Tag, AlignLeft, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// IMPORTAÇÕES DO FIREBASE (Banco de Dados)
import { db } from '../services/firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

export default function Dashboard({ user }) {
  // 1. ESTADOS
  const [transactions, setTransactions] = useState([]); 
  const [accounts, setAccounts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 

  const [formData, setFormData] = useState({
    type: 'expense', 
    description: '',
    amount: '',
    category: '',
    account: '', 
    date: new Date().toISOString().split('T')[0] 
  });

  // 2. BUSCANDO DADOS (Transações, Contas e Categorias)
  useEffect(() => {
    if (!user?.uid) return;

    // Buscando Transações
    const qTrans = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unTrans = onSnapshot(qTrans, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      txs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(txs);
    });

    // Buscando Contas
    const qAcc = query(collection(db, 'accounts'), where('userId', '==', user.uid));
    const unAcc = onSnapshot(qAcc, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Buscando Categorias
    const qCat = query(collection(db, 'categories'), where('userId', '==', user.uid));
    const unCat = onSnapshot(qCat, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unTrans(); unAcc(); unCat(); };
  }, [user?.uid]);

  // 3. MATEMÁTICA E GRÁFICOS
  const totalIncomes = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
  const balance = totalIncomes - totalExpenses;

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Preparando dados para o Gráfico de Pizza (Agrupando despesas por categoria)
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const chartData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));
  
  // Cores do Gráfico
  const COLORS = ['#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#0ea5e9'];

  // 4. SALVAR TRANSAÇÃO
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: formData.type,
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category,
        account: formData.account, 
        date: formData.date,
        createdAt: new Date().toISOString()
      });

      setFormData({ type: 'expense', description: '', amount: '', category: '', account: '', date: new Date().toISOString().split('T')[0] });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar transação: ", error);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrando listas baseadas no tipo selecionado no modal
  const currentCategories = categories.filter(c => c.type === formData.type);
  const currentAccounts = formData.type === 'expense' ? accounts : [...accounts, { id: 'caixinha', name: 'Poupança / Caixinha' }];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#4c1d95]">Visão Geral</h2>
          <p className="text-[#6b21a8] font-medium opacity-80 mt-1">Acompanhe suas finanças deste mês</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus size={22} />
          Nova Transação
        </button>
      </div>
        
      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl shadow-sm p-6 border-l-[6px] border-[#8b5cf6] hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-[#8b5cf6] group-hover:scale-110 transition-transform">
            <Wallet size={120} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-widest">Saldo Atual</p>
              <h3 className={`text-4xl font-black tracking-tight mt-2 ${balance >= 0 ? 'text-[#8b5cf6]' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </h3>
            </div>
            <div className="p-4 bg-[#f3e8ff] rounded-2xl text-[#8b5cf6] shadow-inner">
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

      {/* SEÇÃO INFERIOR: GRÁFICO E LISTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO DE DESPESAS (Ocupa 1 coluna em telas grandes) */}
        <div className="bg-white rounded-3xl shadow-sm border border-purple-50/50 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-[#4c1d95] mb-6">Despesas por Categoria</h3>
          
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {chartData.length === 0 ? (
              <p className="text-gray-400 text-center font-medium">Nenhuma despesa registrada para exibir no gráfico.</p>
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

        {/* LISTA DE TRANSAÇÕES (Ocupa 2 colunas em telas grandes) */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-purple-50/50 lg:col-span-2">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#4c1d95]">Últimas Movimentações</h3>
            <span className="text-xs font-bold text-[#8b5cf6] bg-purple-50 px-4 py-1.5 rounded-full">{transactions.length} registros</span>
          </div>
          
          {transactions.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-28 h-28 bg-purple-50 rounded-full flex items-center justify-center mb-6 text-[#8b5cf6] opacity-60">
                <Wallet size={56} />
              </div>
              <h4 className="text-2xl font-bold text-[#4c1d95] mb-2">Nenhuma movimentação</h4>
              <p className="text-gray-400 max-w-sm text-lg">Você ainda não registrou nada. Que tal adicionar sua primeira transação?</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
              {transactions.map((t) => (
                <div key={t.id} className="p-6 px-8 flex justify-between items-center hover:bg-purple-50/30 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                      {t.type === 'income' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-lg group-hover:text-[#8b5cf6] transition-colors">{t.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-md">{t.category || 'Geral'}</span>
                        {t.account && (
                          <span className="text-xs font-bold text-[#8b5cf6] bg-purple-50 px-3 py-1 rounded-md flex items-center gap-1.5">
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

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#4c1d95]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] p-6 flex justify-between items-center text-white">
              <h3 className="text-2xl font-bold tracking-wide">Nova Transação</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-8">
              <div className="flex gap-3 mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense', account: '', category: ''})}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${formData.type === 'expense' ? 'bg-white text-rose-500 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Saída (Despesa)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income', account: '', category: ''})}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${formData.type === 'income' ? 'bg-white text-emerald-500 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Entrada (Receita)
                </button>
              </div>

              <div className="space-y-4">
                <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[#8b5cf6] focus-within:bg-white transition-all">
                  <AlignLeft className="text-[#8b5cf6] mr-3" size={20} />
                  <input required type="text" placeholder="Descrição (Ex: Supermercado)"
                    className="w-full bg-transparent border-none outline-none text-[#4c1d95] placeholder-gray-400 font-bold"
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </label>

                <div className="flex gap-4">
                  <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[#8b5cf6] focus-within:bg-white transition-all w-1/2">
                    <DollarSign className="text-[#8b5cf6] mr-2" size={20} />
                    <input required type="number" step="0.01" min="0" placeholder="0.00"
                      className="w-full bg-transparent border-none outline-none text-[#4c1d95] placeholder-gray-400 font-bold"
                      value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </label>

                  <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[#8b5cf6] focus-within:bg-white transition-all w-1/2">
                    <Calendar className="text-[#8b5cf6] mr-2" size={20} />
                    <input required type="date"
                      className="w-full bg-transparent border-none outline-none text-[#4c1d95] font-bold text-sm"
                      value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </label>
                </div>

                {/* SELECT DINÂMICO: CONTAS */}
                <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[#8b5cf6] focus-within:bg-white transition-all">
                  <CreditCard className="text-[#8b5cf6] mr-3" size={20} />
                  <select required 
                    className="w-full bg-transparent border-none outline-none text-[#4c1d95] font-bold appearance-none cursor-pointer"
                    value={formData.account} onChange={(e) => setFormData({...formData, account: e.target.value})}
                  >
                    <option value="" disabled>Selecione a Conta/Destino...</option>
                    {currentAccounts.length === 0 && <option disabled>Nenhuma conta cadastrada</option>}
                    {currentAccounts.map(acc => (
                      <option key={acc.id} value={acc.name}>{acc.name}</option>
                    ))}
                  </select>
                </label>

                {/* SELECT DINÂMICO: CATEGORIAS */}
                <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[#8b5cf6] focus-within:bg-white transition-all">
                  <Tag className="text-[#8b5cf6] mr-3" size={20} />
                  <select required 
                    className="w-full bg-transparent border-none outline-none text-[#4c1d95] font-bold appearance-none cursor-pointer"
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="" disabled>Selecione uma categoria...</option>
                    {currentCategories.length === 0 && <option disabled>Nenhuma categoria cadastrada</option>}
                    {currentCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-10">
                <button type="submit" disabled={isLoading}
                  className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black py-4 rounded-xl uppercase text-sm tracking-widest transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Aguarde...' : 'Salvar Transação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}