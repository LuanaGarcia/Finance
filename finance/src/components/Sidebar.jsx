import React from 'react';
import { NavLink } from 'react-router-dom';
<<<<<<< HEAD
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Tags,
  ArrowRightLeft,
  TrendingDown,
  Menu,
} from 'lucide-react';

export default function Sidebar({ collapsed, onToggle }) {
  const navItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/despesas', name: 'Lançamentos', icon: TrendingDown },
=======
import { LayoutDashboard, CreditCard, PiggyBank, Tags, LogOut, Wallet, ArrowRightLeft } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  // ADICIONAMOS A ROTA "/transacoes" AQUI 👇
  const navItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
    { path: '/transacoes', name: 'Transações (Extrato)', icon: ArrowRightLeft },
    { path: '/contas', name: 'Contas e Cartões', icon: CreditCard },
    { path: '/caixinhas', name: 'Caixinhas', icon: PiggyBank },
    { path: '/categorias', name: 'Categorias', icon: Tags },
  ];

  return (
<<<<<<< HEAD
    <aside
      className={`${
        collapsed ? 'w-[88px]' : 'w-64'
      } h-screen flex-col hidden md:flex z-20 relative transition-all duration-300 bg-[var(--surface)] shadow-[4px_0_24px_rgba(0,0,0,0.05)]`}
    >
      <div className={`p-4 flex items-center border-b border-[var(--brand-border)] ${collapsed ? 'justify-center' : 'justify-end'}`}>
        <button
          type="button"
          onClick={onToggle}
          className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-soft)] transition-colors"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <Menu size={collapsed ? 24 : 20} />
        </button>
      </div>

      <nav className={`flex-1 py-8 space-y-2 overflow-y-auto ${collapsed ? 'px-3' : 'px-4'}`}>
        {!collapsed && (
          <p className="px-4 text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
            Menu Principal
          </p>
        )}

=======
    <aside className="w-64 bg-white h-screen shadow-[4px_0_24px_rgba(139,92,246,0.05)] flex-col hidden md:flex z-20 relative">
      <div className="p-6 flex items-center gap-3 border-b border-gray-50">
        <div className="p-2 bg-[#8b5cf6] text-white rounded-xl shadow-md">
          <Wallet size={24} />
        </div>
        <h1 className="text-2xl font-black text-[#4c1d95] tracking-tight">Meu<span className="text-[#8b5cf6]">Controle</span></h1>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Menu Principal</p>
        
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
<<<<<<< HEAD
            end={item.path === '/'}
            title={item.name}
            className={({ isActive }) =>
              `flex items-center rounded-xl font-semibold transition-all duration-300 ${
                collapsed ? 'justify-center px-0 py-3.5' : 'gap-3 px-4 py-3'
              } ${
                isActive
                  ? 'bg-[var(--brand)] text-white shadow-md scale-[1.02]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]'
              }`
            }
          >
            <item.icon size={collapsed ? 24 : 20} />
            {!collapsed && item.name}
          </NavLink>
        ))}
      </nav>
=======
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-[#8b5cf6] text-white shadow-md shadow-purple-500/30 scale-[1.02]'
                  : 'text-gray-500 hover:bg-purple-50 hover:text-[#8b5cf6]'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold transition-colors"
        >
          <LogOut size={20} />
          Sair do Sistema
        </button>
      </div>
>>>>>>> b85f6c3a6870a19c4450e173c29bf170fc213c31
    </aside>
  );
}
