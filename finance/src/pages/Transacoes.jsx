import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Trash2, Edit, Calendar, CreditCard, Tag, AlignLeft, DollarSign, X, ArrowRightLeft } from 'lucide-react';

// IMPORTAÇÕES DO FIREBASE
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function Transacoes({ user }) {
  // 1. ESTADOS
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  
  // Controle de Mês/Ano atual na tela
  const [currentDate, setCurrentDate] = useState(new Date());

  // Controle do Modal de Edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    account: '',
    date: ''
  });

  // 2. BUSCANDO DADOS DO FIREBASE
  useEffect(() => {
    if (!user?.uid) return;

    // Buscando Transações (Trazemos todas e filtramos no JS, ou poderíamos filtrar no banco)
    const qTrans = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unTrans = onSnapshot(qTrans, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      txs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(txs);
    });

    // Buscando Contas (para o select de edição)
    const qAcc = query(collection(db, 'accounts'), where('userId', '==', user.uid));
    const unAcc = onSnapshot(qAcc, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Buscando Categorias (para o select de edição)
    const qCat = query(collection(db, 'categories'), where('userId', '==', user.uid));
    const unCat = onSnapshot(qCat, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unTrans(); unAcc(); unCat(); };
  }, [user?.uid]);

  // 3. LÓGICA DE FILTRO POR MÊS
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Formata o mês para exibição (Ex: "Abril 2026")
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  
  // Extrai o ano e mês para filtrar (Ex: "2026-04")
  const filterMonthString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  // Filtra as transações para mostrar apenas as do mês selecionado
  const filteredTransactions = transactions.filter(t => t.date.startsWith(filterMonthString));

  // Totais do mês selecionado
  const totalIncomes = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
  const balance = totalIncomes - totalExpenses;

  // 4. FUNÇÕES DE CRUD (EXCLUIR E ATUALIZAR)
  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await deleteDoc(doc(db, 'transactions', id));
      } catch (error) {
        console.error("Erro ao deletar transação:", error);
        alert("Erro ao excluir. Tente novamente.");
      }
    }
  };

  const openEditModal = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      account: transaction.account,
      date: transaction.date
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const transRef = doc(db, 'transactions', editingId);
      await updateDoc(transRef, {
        type: formData.type,
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category,
        account: formData.account,
        date: formData.date
      });

      setIsEditModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Erro ao atualizar transação: ", error);
      alert("Erro ao atualizar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Utilitários
  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  
  const currentCategories = categories.filter(c => c.type === formData.type);
  const currentAccounts = formData.type === 'expense' ? accounts : [...accounts, { id: 'caixinha', name: 'Poupança / Caixinha' }];

  return (
    <>
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#4c1d95]">Extrato Completo</h2>
          <p className="text-[#6b21a8] font-medium opacity-80 mt-1">Gerencie todas as suas movimentações</p>
        </div>

        {/* NAVEGADOR DE MESES */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-purple-50">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-purple-50 text-[#8b5cf6] rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-[#4c1d95] min-w-[140px] text-center capitalize text-lg">
            {monthName}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-purple-50 text-[#8b5cf6] rounded-xl transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* RESUMO RÁPIDO DO MÊS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-50 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Entradas</p>
            <p className="text-xl font-black text-emerald-500">{formatCurrency(totalIncomes)}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><TrendingUp size={20} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-50 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saídas</p>
            <p className="text-xl font-black text-rose-500">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><TrendingDown size={20} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-50 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Balanço do Mês</p>
            <p className={`text-xl font-black ${balance >= 0 ? 'text-[#8b5cf6]' : 'text-rose-500'}`}>{formatCurrency(balance)}</p>
          </div>
          <div className="p-3 bg-[#f3e8ff] text-[#8b5cf6] rounded-xl"><ArrowRightLeft size={20} /></div>
        </div>
      </div>

      {/* LISTA COMPLETA DE TRANSAÇÕES */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-purple-50">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-[#4c1d95]">Lançamentos de {monthName}</h3>
          <span className="text-xs font-bold text-[#8b5cf6] bg-purple-50 px-4 py-1.5 rounded-full">{filteredTransactions.length} registros</span>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 text-[#8b5cf6] opacity-60">
              <Calendar size={48} />
            </div>
            <h4 className="text-2xl font-bold text-[#4c1d95] mb-2">Mês sem movimentação</h4>
            <p className="text-gray-400 max-w-sm text-lg">Nenhum registro encontrado para este período.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredTransactions.map((t) => (
              <div key={t.id} className="p-5 px-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-purple-50/30 transition-all group gap-4 md:gap-0">
                
                {/* Lado Esquerdo: Ícone e Infos */}
                <div className="flex items-center gap-5">
                  <div className={`p-3.5 rounded-2xl shadow-sm transition-transform group-hover:scale-105 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                    {t.type === 'income' ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 text-lg group-hover:text-[#8b5cf6] transition-colors">{t.description}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{t.category || 'Geral'}</span>
                      {t.account && (
                        <span className="text-xs font-bold text-[#8b5cf6] bg-purple-50 px-2 py-1 rounded-md flex items-center gap-1">
                          <CreditCard size={12} /> {t.account}
                        </span>
                      )}
                      <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                        <Calendar size={12} /> {new Date(t.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Lado Direito: Valor e Botões */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pl-16 md:pl-0">
                  <span className={`text-xl font-black tracking-tight ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </span>
                  
                  {/* Botões de Ação */}
                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(t)}
                      className="text-gray-400 hover:text-[#8b5cf6] p-2 rounded-lg hover:bg-purple-50 transition-colors"
                      title="Editar Transação"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTransaction(t.id)}
                      className="text-gray-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Excluir Transação"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* MODAL DE EDIÇÃO                                                   */}
      {/* ================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#4c1d95]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] p-6 flex justify-between items-center text-white">
              <h3 className="text-2xl font-bold tracking-wide">Editar Transação</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateTransaction} className="p-8">
              <div className="flex gap-3 mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${formData.type === 'expense' ? 'bg-white text-rose-500 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Saída (Despesa)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income'})}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${formData.type === 'income' ? 'bg-white text-emerald-500 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Entrada (Receita)
                </button>
              </div>

              <div className="space-y-4">
                <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[#8b5cf6] focus-within:bg-white transition-all">
                  <AlignLeft className="text-[#8b5cf6] mr-3" size={20} />
                  <input required type="text" placeholder="Descrição"
                    className="w-full bg-transparent border-none outline-none text-[#4c1d95] font-bold"
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </label>

                <div className="flex gap-4">
                  <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[#8b5cf6] focus-within:bg-white transition-all w-1/2">
                    <DollarSign className="text-[#8b5cf6] mr-2" size={20} />
                    <input required type="number" step="0.01" min="0" placeholder="0.00"
                      className="w-full bg-transparent border-none outline-none text-[#4c1d95] font-bold"
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

                <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[#8b5cf6] focus-within:bg-white transition-all">
                  <CreditCard className="text-[#8b5cf6] mr-3" size={20} />
                  <select required 
                    className="w-full bg-transparent border-none outline-none text-[#4c1d95] font-bold appearance-none cursor-pointer"
                    value={formData.account} onChange={(e) => setFormData({...formData, account: e.target.value})}
                  >
                    <option value="" disabled>Selecione a Conta/Destino...</option>
                    {currentAccounts.map(acc => (
                      <option key={acc.id} value={acc.name}>{acc.name}</option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[#8b5cf6] focus-within:bg-white transition-all">
                  <Tag className="text-[#8b5cf6] mr-3" size={20} />
                  <select required 
                    className="w-full bg-transparent border-none outline-none text-[#4c1d95] font-bold appearance-none cursor-pointer"
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="" disabled>Selecione uma categoria...</option>
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
                  {isLoading ? 'Atualizando...' : 'Atualizar Transação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
