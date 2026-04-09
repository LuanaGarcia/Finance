import React, { useState, useEffect } from 'react';
import { Plus, X, CreditCard, Landmark, Wallet, Trash2, Edit } from 'lucide-react';

// IMPORTAÇÕES DO FIREBASE
import { db } from '../services/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function Contas({ user }) {
  // 1. ESTADOS
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Conta Corrente',
    balance: ''
  });

  // 2. BUSCANDO AS CONTAS NO FIREBASE
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, 'accounts'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const accs = [];
      snapshot.forEach((document) => {
        accs.push({ id: document.id, ...document.data() });
      });
      accs.sort((a, b) => a.name.localeCompare(b.name));
      setAccounts(accs);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // 3. SALVAR NOVA CONTA
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'accounts'), {
        userId: user.uid,
        name: formData.name,
        type: formData.type,
        balance: Number(formData.balance),
        createdAt: new Date().toISOString()
      });

      setFormData({ name: '', type: 'Conta Corrente', balance: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar conta: ", error);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. EXCLUIR CONTA
  const handleDeleteAccount = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta conta? As transações vinculadas a ela não serão apagadas automaticamente.")) {
      try {
        await deleteDoc(doc(db, 'accounts', id));
      } catch (error) {
        console.error("Erro ao deletar: ", error);
        alert("Erro ao deletar. Tente novamente.");
      }
    }
  };

  // 5. ABRIR EDIÇÃO E ATUALIZAR
  const openEditModal = (account) => {
    setEditingId(account.id);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accountRef = doc(db, 'accounts', editingId);
      await updateDoc(accountRef, {
        name: formData.name,
        type: formData.type,
        balance: Number(formData.balance)
      });

      setIsEditModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Erro ao atualizar conta: ", error);
      alert("Erro ao atualizar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Utilitários
  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getAccountIcon = (type) => {
    switch(type) {
      case 'Cartão de Crédito': return <CreditCard size={28} className="text-rose-500" />;
      case 'Dinheiro': return <Wallet size={28} className="text-emerald-500" />;
      default: return <Landmark size={28} className="text-[#8b5cf6]" />;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#4c1d95]">Minhas Contas</h2>
          <p className="text-[#6b21a8] font-medium opacity-80 mt-1">Gerencie seus bancos, cartões e carteira</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', type: 'Conta Corrente', balance: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus size={22} />
          Nova Conta
        </button>
      </div>

      {/* LISTA DE CONTAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl shadow-sm border border-purple-50 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-[#8b5cf6]">
              <Landmark size={40} />
            </div>
            <h3 className="text-xl font-bold text-[#4c1d95] mb-2">Nenhuma conta cadastrada</h3>
            <p className="text-gray-500">Cadastre seus bancos ou cartões para começar a organizar seu dinheiro.</p>
          </div>
        ) : (
          accounts.map((acc) => (
            <div key={acc.id} className="bg-white p-6 rounded-3xl shadow-sm border border-purple-50 hover:shadow-md transition-all relative group">
              {/* Botões de Ação (Aparecem no Hover) */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => openEditModal(acc)}
                  className="text-gray-300 hover:text-[#8b5cf6] bg-white rounded-full p-2 hover:bg-purple-50 transition-colors shadow-sm border border-gray-100"
                  title="Editar Conta"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteAccount(acc.id)}
                  className="text-gray-300 hover:text-red-500 bg-white rounded-full p-2 hover:bg-red-50 transition-colors shadow-sm border border-gray-100"
                  title="Excluir Conta"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${
                  acc.type === 'Cartão de Crédito' ? 'bg-rose-50' : 
                  acc.type === 'Dinheiro' ? 'bg-emerald-50' : 'bg-[#f3e8ff]'
                }`}>
                  {getAccountIcon(acc.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 truncate pr-16">{acc.name}</h3>
                  <p className="text-sm font-medium text-gray-400">{acc.type}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {acc.type === 'Cartão de Crédito' ? 'Limite Disponível' : 'Saldo Atual'}
                </p>
                <p className={`text-2xl font-black ${
                  acc.type === 'Cartão de Crédito' ? 'text-rose-500' : 'text-[#8b5cf6]'
                }`}>
                  {formatCurrency(acc.balance)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAIS COMPARTILHADOS (Criar e Editar) */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-[#4c1d95]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] p-6 flex justify-between items-center text-white">
              <h3 className="text-2xl font-bold tracking-wide">
                {isEditModalOpen ? 'Editar Conta' : 'Nova Conta'}
              </h3>
              <button onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={isEditModalOpen ? handleUpdateAccount : handleSaveAccount} className="p-8 space-y-5">
              
              <label className="block">
                <span className="text-sm font-bold text-gray-600 ml-1">Nome da Instituição</span>
                <input required type="text" placeholder="Ex: Nubank, Itaú, Carteira..."
                  className="mt-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100 focus:border-[#8b5cf6] focus:ring-4 focus:ring-purple-50 outline-none text-[#4c1d95] font-bold transition-all"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-gray-600 ml-1">Tipo de Conta</span>
                <select required 
                  className="mt-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100 focus:border-[#8b5cf6] focus:ring-4 focus:ring-purple-50 outline-none text-[#4c1d95] font-bold transition-all cursor-pointer"
                  value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Conta Corrente">Conta Corrente</option>
                  <option value="Poupança">Poupança</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Dinheiro">Dinheiro (Espécie)</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-gray-600 ml-1">
                  {formData.type === 'Cartão de Crédito' ? 'Limite do Cartão (R$)' : 'Saldo Atual (R$)'}
                </span>
                <input required type="number" step="0.01" placeholder="0.00"
                  className="mt-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100 focus:border-[#8b5cf6] focus:ring-4 focus:ring-purple-50 outline-none text-[#4c1d95] font-bold transition-all"
                  value={formData.balance} onChange={(e) => setFormData({...formData, balance: e.target.value})}
                />
              </label>

              <div className="mt-8 pt-4">
                <button type="submit" disabled={isLoading}
                  className="w-full bg-[#8b5cf6] border border-[#8b5cf6] hover:bg-white hover:text-[#8b5cf6] text-white font-black py-4 rounded-xl uppercase text-sm tracking-widest transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Aguarde...' : (isEditModalOpen ? 'Atualizar Conta' : 'Salvar Conta')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
