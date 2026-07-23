<<<<<<< HEAD
﻿import React, { useState, useEffect } from 'react';
import { Plus, X, Tags, Trash2, Edit, TrendingDown, TrendingUp } from 'lucide-react';

import { api } from '../services/api';
=======
import React, { useState, useEffect } from 'react';
import { Plus, X, Tags, Trash2, Edit, TrendingDown, TrendingUp } from 'lucide-react';

// IMPORTAÇÕES DO FIREBASE
import { db } from '../services/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31

export default function Categorias({ user }) {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
<<<<<<< HEAD
    type: 'expense',
  });

  const loadCategories = async () => {
    if (!user?.uid) return;
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  useEffect(() => {
    loadCategories();
=======
    type: 'expense'
  });

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, 'categories'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = [];
      snapshot.forEach((document) => {
        cats.push({ id: document.id, ...document.data() });
      });
      cats.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(cats);
    });

    return () => unsubscribe();
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
  }, [user?.uid]);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
<<<<<<< HEAD
      await api.createCategory({
        name: formData.name,
        type: formData.type,
      });
      setFormData({ name: '', type: 'expense' });
      setIsModalOpen(false);
      await loadCategories();
    } catch (error) {
      console.error('Erro ao criar: ', error);
      alert('Erro ao salvar. Tente novamente.');
=======
      await addDoc(collection(db, 'categories'), {
        userId: user.uid,
        name: formData.name,
        type: formData.type,
        createdAt: new Date().toISOString()
      });
      setFormData({ name: '', type: 'expense' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar: ", error);
      alert("Erro ao salvar. Tente novamente.");
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
<<<<<<< HEAD
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.deleteCategory(id);
        await loadCategories();
      } catch (error) {
        console.error('Erro ao deletar: ', error);
        alert('Erro ao deletar. Tente novamente.');
=======
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (error) {
        console.error("Erro ao deletar: ", error);
        alert("Erro ao deletar. Tente novamente.");
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
      }
    }
  };

  const openEditModal = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, type: category.type });
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
<<<<<<< HEAD
      await api.updateCategory(editingId, {
        name: formData.name,
        type: formData.type,
      });
      setIsEditModalOpen(false);
      setEditingId(null);
      await loadCategories();
    } catch (error) {
      console.error('Erro ao atualizar: ', error);
      alert('Erro ao atualizar. Tente novamente.');
=======
      const catRef = doc(db, 'categories', editingId);
      await updateDoc(catRef, {
        name: formData.name,
        type: formData.type
      });
      setIsEditModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Erro ao atualizar: ", error);
      alert("Erro ao atualizar. Tente novamente.");
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
    } finally {
      setIsLoading(false);
    }
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
<<<<<<< HEAD
          <h2 className="text-3xl font-black text-[var(--brand-dark)]">Categorias</h2>
          <p className="text-[var(--brand-mid)] font-medium opacity-80 mt-1">Organize suas movimentações financeiras</p>
=======
          <h2 className="text-3xl font-black text-[#4c1d95]">Categorias</h2>
          <p className="text-[#6b21a8] font-medium opacity-80 mt-1">Organize suas movimentações financeiras</p>
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', type: 'expense' });
            setIsModalOpen(true);
          }}
<<<<<<< HEAD
          className="flex items-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
=======
          className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
        >
          <Plus size={22} />
          Nova Categoria
        </button>
      </div>

      {/* LISTA DE CATEGORIAS (DIVIDIDA EM DUAS COLUNAS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUNA: DESPESAS */}
<<<<<<< HEAD
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--brand-border)] overflow-hidden">
=======
        <div className="bg-white rounded-3xl shadow-sm border border-purple-50 overflow-hidden">
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
          <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-500 rounded-lg">
              <TrendingDown size={20} />
            </div>
            <h3 className="text-lg font-bold text-rose-600">Categorias de Despesa</h3>
          </div>
          <div className="p-2">
            {expenseCategories.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">Nenhuma categoria de despesa cadastrada.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {expenseCategories.map(cat => (
                  <li key={cat.id} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3 text-gray-700 font-medium">
                      <Tags size={16} className="text-rose-400" />
                      {cat.name}
                    </div>
                    <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
<<<<<<< HEAD
                      <button onClick={() => openEditModal(cat)} className="text-gray-300 hover:text-[var(--brand)] p-2 rounded-lg hover:bg-[var(--brand-soft)]">
=======
                      <button onClick={() => openEditModal(cat)} className="text-gray-300 hover:text-[#8b5cf6] p-2 rounded-lg hover:bg-purple-50">
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* COLUNA: RECEITAS */}
<<<<<<< HEAD
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--brand-border)] overflow-hidden">
=======
        <div className="bg-white rounded-3xl shadow-sm border border-purple-50 overflow-hidden">
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
          <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-500 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-bold text-emerald-600">Categorias de Receita</h3>
          </div>
          <div className="p-2">
            {incomeCategories.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">Nenhuma categoria de receita cadastrada.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {incomeCategories.map(cat => (
                  <li key={cat.id} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3 text-gray-700 font-medium">
                      <Tags size={16} className="text-emerald-400" />
                      {cat.name}
                    </div>
                    <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
<<<<<<< HEAD
                      <button onClick={() => openEditModal(cat)} className="text-gray-300 hover:text-[var(--brand)] p-2 rounded-lg hover:bg-[var(--brand-soft)]">
=======
                      <button onClick={() => openEditModal(cat)} className="text-gray-300 hover:text-[#8b5cf6] p-2 rounded-lg hover:bg-purple-50">
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      {/* MODAIS COMPARTILHADOS */}
      {(isModalOpen || isEditModalOpen) && (
<<<<<<< HEAD
        <div className="fixed inset-0 bg-[var(--brand-dark)]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            
            <div className="bg-gradient-to-r from-[var(--brand)] to-[var(--brand-light)] p-6 flex justify-between items-center text-white">
=======
        <div className="fixed inset-0 bg-[#4c1d95]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] p-6 flex justify-between items-center text-white">
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
              <h3 className="text-2xl font-bold tracking-wide">
                {isEditModalOpen ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={isEditModalOpen ? handleUpdateCategory : handleSaveCategory} className="p-8">
              
              <div className="flex gap-3 mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${formData.type === 'expense' ? 'bg-white text-rose-500 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Para Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income'})}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${formData.type === 'income' ? 'bg-white text-emerald-500 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Para Receita
                </button>
              </div>

              <label className="block mb-8">
                <span className="text-sm font-bold text-gray-600 ml-1">Nome da Categoria</span>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<<<<<<< HEAD
                    <Tags className="text-[var(--brand)]" size={20} />
                  </div>
                  <input required type="text" placeholder="Ex: Supermercado, Aluguel, Salário..."
                    className="w-full bg-gray-50 pl-12 p-4 rounded-xl border border-gray-100 focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-soft)] outline-none text-[var(--brand-dark)] font-bold transition-all"
=======
                    <Tags className="text-[#8b5cf6]" size={20} />
                  </div>
                  <input required type="text" placeholder="Ex: Supermercado, Aluguel, Salário..."
                    className="w-full bg-gray-50 pl-12 p-4 rounded-xl border border-gray-100 focus:border-[#8b5cf6] focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none text-[#4c1d95] font-bold transition-all"
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </label>

              <button type="submit" disabled={isLoading}
<<<<<<< HEAD
                className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black py-4 rounded-xl uppercase text-sm tracking-widest transition-all hover:shadow-lg disabled:opacity-50"
=======
                className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black py-4 rounded-xl uppercase text-sm tracking-widest transition-all hover:shadow-lg disabled:opacity-50"
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
              >
                {isLoading ? 'Aguarde...' : (isEditModalOpen ? 'Atualizar Categoria' : 'Salvar Categoria')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
