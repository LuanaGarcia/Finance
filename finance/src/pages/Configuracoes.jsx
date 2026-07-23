import React, { useEffect, useRef, useState } from 'react';
import { Camera, Check, Settings, Trash2, User } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../services/api';
import { THEMES, applyTheme } from '../themes';

function resizeImage(file, maxSize = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Configuracoes() {
  const { user, onUserUpdate } = useOutletContext();
  const fileRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [theme, setTheme] = useState(user?.theme || 'violet');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setAvatar(user?.avatar || null);
    setTheme(user?.theme || 'violet');
  }, [user]);

  const saveProfile = async (payload, { themeOnly = false } = {}) => {
    setError('');
    setMessage('');
    if (themeOnly) setIsSavingTheme(true);
    else setIsSavingProfile(true);

    try {
      const { user: updated } = await api.updateProfile(payload);
      onUserUpdate(updated);
      setMessage(themeOnly ? 'Tema atualizado!' : 'Perfil atualizado!');
    } catch (err) {
      setError(err.message || 'Não foi possível salvar.');
    } finally {
      setIsSavingProfile(false);
      setIsSavingTheme(false);
    }
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Informe um nome.');
      return;
    }
    await saveProfile({ name: name.trim() });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Selecione uma imagem válida.');
      return;
    }

    try {
      const dataUrl = await resizeImage(file);
      setAvatar(dataUrl);
      await saveProfile({ avatar: dataUrl });
    } catch {
      setError('Erro ao processar a imagem.');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatar(null);
    await saveProfile({ avatar: null });
  };

  const handleThemeSelect = async (themeId) => {
    setTheme(themeId);
    applyTheme(themeId);
    await saveProfile({ theme: themeId }, { themeOnly: true });
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[var(--brand-dark)]">Configurações</h2>
        <p className="font-medium opacity-80 mt-1 text-[var(--brand-mid)]">
          Personalize seu perfil e a aparência do sistema
        </p>
      </div>

      {(message || error) && (
        <div
          className={`mb-6 max-w-3xl rounded-2xl px-4 py-3 text-sm font-semibold ${
            error ? 'bg-red-50 text-red-600' : 'bg-[var(--brand-soft)] text-[var(--brand-dark)]'
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-5xl">
        <section className="bg-[var(--surface)] rounded-3xl shadow-sm border border-[var(--brand-border)] p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[var(--brand-soft)] text-[var(--brand)] rounded-2xl">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--brand-dark)]">Perfil</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 mb-6">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[var(--brand-border)] shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--brand)] to-[var(--brand-light)] text-white flex items-center justify-center font-black text-3xl border-4 border-white shadow-md">
                  {(name || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[var(--brand)] text-white shadow-md hover:bg-[var(--brand-hover)] transition-colors"
                title="Alterar foto"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2.5 rounded-xl font-bold text-sm bg-[var(--brand-soft)] text-[var(--brand)] hover:opacity-90 transition-opacity"
              >
                Escolher foto
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Remover foto
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveName} className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold ml-1" style={{ color: 'var(--text-muted)' }}>
                Nome
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full bg-[var(--brand-soft)]/40 p-4 rounded-xl border border-[var(--brand-border)] focus:border-[var(--brand)] outline-none text-[var(--brand-dark)] font-bold transition-all"
                placeholder="Seu nome"
              />
            </label>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black py-3.5 rounded-xl uppercase text-sm tracking-widest transition-all disabled:opacity-50"
            >
              {isSavingProfile ? 'Salvando...' : 'Salvar nome'}
            </button>
          </form>
        </section>

        <section className="bg-[var(--surface)] rounded-3xl shadow-sm border border-[var(--brand-border)] p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[var(--brand-soft)] text-[var(--brand)] rounded-2xl">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--brand-dark)]">Temas</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Escolha a aparência do sistema
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map((item) => {
              const selected = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isSavingTheme}
                  onClick={() => handleThemeSelect(item.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    selected
                      ? 'border-[var(--brand)] ring-2 ring-[var(--brand)]/30 bg-[var(--brand-soft)]'
                      : 'border-[var(--brand-border)] hover:border-[var(--brand)] bg-[var(--surface)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1.5">
                      {item.preview.map((color) => (
                        <span
                          key={color}
                          className="w-5 h-5 rounded-full border border-white shadow-sm"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    {selected && (
                      <span className="p-1 rounded-full bg-[var(--brand)] text-white">
                        <Check size={14} />
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-[var(--brand-dark)]">{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
