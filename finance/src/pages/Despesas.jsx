import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Tag,
  AlignLeft,
  Calendar,
  DollarSign,
  CreditCard,
  TrendingDown,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { api } from '../services/api';

export default function Despesas({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para controle do filtro de mês (mês atual como padrão)
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
  });

  const loadData = async () => {
    if (!user?.uid) return;
    try {
      const [txs, accs, cats] = await Promise.all([
        api.getTransactions(),
        api.getAccounts(),
        api.getCategories(),
      ]);
      setTransactions(txs);
      setAccounts(accs);
      setCategories(cats);
    } catch (error) {
      console.error('Erro ao carregar lançamentos:', error);
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
    const tDate = new Date(t.date);
    return (
      tDate.getUTCMonth() === currentDate.getMonth() &&
      tDate.getUTCFullYear() === currentDate.getFullYear()
    );
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const expenses = filteredTransactions.filter((t) => t.type === 'expense');
  const incomes = filteredTransactions.filter((t) => t.type === 'income');
  const totalExpenses = expenses.reduce((acc, t) => acc + Number(t.amount), 0);
  const totalIncomes = incomes.reduce((acc, t) => acc + Number(t.amount), 0);

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.createTransaction({
        type: formData.type,
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category,
        account: formData.account,
        date: formData.date,
      });

      setFormData({
        type: 'expense',
        description: '',
        amount: '',
        category: '',
        account: '',
        date: new Date().toISOString().split('T')[0],
      });
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar transação: ', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const openNewExpense = () => {
    setFormData({
      type: 'expense',
      description: '',
      amount: '',
      category: '',
      account: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const currentCategories = categories.filter((c) => c.type === formData.type);
  const currentAccounts =
    formData.type === 'expense'
      ? accounts
      : [...accounts, { id: 'caixinha', name: 'Poupança / Caixinha' }];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-[var(--brand-dark)]">Lançamentos</h2>
          <p className="text-[var(--brand-mid)] font-medium opacity-80 mt-1">
            Registre despesas e receitas e acompanhe o que já foi lançado
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Componente de Filtro de Mês idêntico ao da Dashboard e Transações */}
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

          <button
            onClick={openNewExpense}
            className="flex items-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus size={22} />
            Novo Lançamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl shadow-sm p-6 border-l-[6px] border-rose-400 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-rose-500 group-hover:scale-110 transition-transform">
            <TrendingDown size={120} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-widest">
                Total de Despesas
              </p>
              <h3 className="text-4xl font-black tracking-tight mt-2 text-rose-500">
                {formatCurrency(totalExpenses)}
              </h3>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 shadow-inner">
              <TrendingDown size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border-l-[6px] border-emerald-400 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-widest">
                Total de Receitas
              </p>
              <h3 className="text-4xl font-black tracking-tight mt-2 text-emerald-500">
                {formatCurrency(totalIncomes)}
              </h3>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500 shadow-inner">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[var(--brand-border)]/50">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[var(--brand-dark)]">Lançamentos Registrados</h3>
          <span className="text-xs font-bold text-[var(--brand)] bg-[var(--brand-soft)] px-4 py-1.5 rounded-full">
            {filteredTransactions.length} registros
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-28 h-28 bg-[var(--brand-soft)] rounded-full flex items-center justify-center mb-6 text-[var(--brand)] opacity-70">
              <TrendingDown size={56} />
            </div>
            <h4 className="text-2xl font-bold text-[var(--brand-dark)] mb-2">Nenhum lançamento neste mês</h4>
            <p className="text-gray-400 max-w-sm text-lg mb-6">
              Você ainda não registrou nada neste período. Clique em Novo Lançamento para começar.
            </p>
            <button
              onClick={openNewExpense}
              className="flex items-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-5 py-2.5 rounded-xl font-bold transition-all"
            >
              <Plus size={18} />
              Fazer primeiro lançamento
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
            {filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="p-6 px-8 flex justify-between items-center hover:bg-[var(--brand-soft)]/30 transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${
                      t.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                    }`}
                  >
                    {t.type === 'income' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 text-lg group-hover:text-[var(--brand)] transition-colors">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                        {t.category || 'Geral'}
                      </span>
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
                <span
                  className={`text-xl font-black tracking-tight ${
                    t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[var(--brand-dark)]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            <div className="bg-gradient-to-r from-[var(--brand)] to-[var(--brand-light)] p-6 flex justify-between items-center text-white">
              <h3 className="text-2xl font-bold tracking-wide">Novo Lançamento</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-8">
              <div className="flex gap-3 mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, type: 'expense', account: '', category: '' })
                  }
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                    formData.type === 'expense'
                      ? 'bg-white text-rose-500 shadow-sm border border-gray-100'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Saída (Despesa)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, type: 'income', account: '', category: '' })
                  }
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                    formData.type === 'income'
                      ? 'bg-white text-emerald-500 shadow-sm border border-gray-100'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Entrada (Receita)
                </button>
              </div>

              <div className="space-y-4">
                <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[var(--brand)] focus-within:bg-white transition-all">
                  <AlignLeft className="text-[var(--brand)] mr-3" size={20} />
                  <input
                    required
                    type="text"
                    placeholder="Descrição (Ex: Supermercado)"
                    className="w-full bg-transparent border-none outline-none text-[var(--brand-dark)] placeholder-gray-400 font-bold"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </label>

                <div className="flex gap-4">
                  <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[var(--brand)] focus-within:bg-white transition-all w-1/2">
                    <DollarSign className="text-[var(--brand)] mr-2" size={20} />
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full bg-transparent border-none outline-none text-[var(--brand-dark)] placeholder-gray-400 font-bold"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </label>

                  <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[var(--brand)] focus-within:bg-white transition-all w-1/2">
                    <Calendar className="text-[var(--brand)] mr-2" size={20} />
                    <input
                      required
                      type="date"
                      className="w-full bg-transparent border-none outline-none text-[var(--brand-dark)] font-bold text-sm"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </label>
                </div>

                <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[var(--brand)] focus-within:bg-white transition-all">
                  <CreditCard className="text-[var(--brand)] mr-3" size={20} />
                  <select
                    required
                    className="w-full bg-transparent border-none outline-none text-[var(--brand-dark)] font-bold appearance-none cursor-pointer"
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  >
                    <option value="" disabled>
                      Selecione a Conta/Destino...
                    </option>
                    {currentAccounts.length === 0 && (
                      <option disabled>Nenhuma conta cadastrada</option>
                    )}
                    {currentAccounts.map((acc) => (
                      <option key={acc.id} value={acc.name}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 focus-within:border-[var(--brand)] focus-within:bg-white transition-all">
                  <Tag className="text-[var(--brand)] mr-3" size={20} />
                  <select
                    required
                    className="w-full bg-transparent border-none outline-none text-[var(--brand-dark)] font-bold appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="" disabled>
                      Selecione uma categoria...
                    </option>
                    {currentCategories.length === 0 && (
                      <option disabled>Nenhuma categoria cadastrada</option>
                    )}
                    {currentCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black py-4 rounded-xl uppercase text-sm tracking-widest transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Aguarde...' : formData.type === 'expense' ? 'Salvar Despesa' : 'Salvar Receita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
