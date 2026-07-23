import React, { useEffect, useRef, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Wallet, LogOut, Settings, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

function UserAvatar({ user, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-9 h-9 text-sm' : 'w-11 h-11 text-lg';

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name || 'Avatar'}
        className={`${sizeClass} rounded-full object-cover shadow-md border-2 border-white`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-tr from-[var(--brand)] to-[var(--brand-light)] text-white flex items-center justify-center font-bold shadow-md border-2 border-white`}
    >
      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
    </div>
  );
}

export default function Layout({ user, onLogout, onUserUpdate }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(Boolean(user?.sidebarCollapsed));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setSidebarCollapsed(Boolean(user?.sidebarCollapsed));
  }, [user?.sidebarCollapsed]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSidebar = async () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      const { user: updated } = await api.updateProfile({ sidebarCollapsed: next });
      onUserUpdate?.(updated);
    } catch (error) {
      console.error('Erro ao salvar preferência da barra:', error);
      setSidebarCollapsed(!next);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--app-bg)] font-sans overflow-hidden transition-colors duration-300">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
      />

      <div className="flex-1 flex flex-col overflow-y-auto relative min-w-0">
        <header
          className="sticky top-0 z-10 border-b py-4 px-4 md:px-8 flex justify-between items-center gap-4 backdrop-blur-md"
          style={{
            background: 'var(--header-bg)',
            borderColor: 'var(--brand-border)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-[var(--brand)] text-white rounded-xl shadow-md shrink-0">
              <Wallet size={22} />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[var(--brand-dark)] tracking-tight">
              Meu<span className="text-[var(--brand)]">Controle</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Bem-vindo(a)
              </p>
              <span className="font-black text-[var(--brand-dark)]">{user?.name || 'Usuário'}</span>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-1.5 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Menu do usuário"
              >
                <UserAvatar user={user} />
                <ChevronDown
                  size={16}
                  className={`text-[var(--text-muted)] transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[var(--surface)] shadow-xl border border-[var(--brand-border)] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[var(--brand-border)]">
                    <p className="font-bold text-[var(--brand-dark)] truncate">{user?.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/configuracoes"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[var(--text-muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] transition-colors font-semibold"
                  >
                    <Settings size={18} />
                    Configurações
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 transition-colors font-bold"
                  >
                    <LogOut size={18} />
                    Sair do Sistema
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <Outlet context={{ user, onUserUpdate }} />
        </div>
      </div>
    </div>
  );
}
