export const THEMES = [
  {
    id: 'violet',
    name: 'Violeta',
    description: 'Roxo clássico do app',
    preview: ['#8b5cf6', '#4c1d95', '#f3e8ff'],
  },
  {
    id: 'ocean',
    name: 'Oceano',
    description: 'Azul e teal frescos',
    preview: ['#0ea5e9', '#0c4a6e', '#e0f2fe'],
  },
  {
    id: 'forest',
    name: 'Floresta',
    description: 'Verde suave e natural',
    preview: ['#10b981', '#064e3b', '#d1fae5'],
  },
  {
    id: 'amber',
    name: 'Âmbar',
    description: 'Tons quentes e solares',
    preview: ['#f59e0b', '#92400e', '#fef3c7'],
  },
  {
    id: 'rose',
    name: 'Rosa',
    description: 'Rosa moderno e leve',
    preview: ['#f43f5e', '#9f1239', '#ffe4e6'],
  },
  {
    id: 'slate',
    name: 'Escuro',
    description: 'Cinza elegante noturno',
    preview: ['#64748b', '#0f172a', '#1e293b'],
  },
];

export const THEME_VARS = {
  violet: {
    '--brand': '#8b5cf6',
    '--brand-hover': '#7c3aed',
    '--brand-dark': '#4c1d95',
    '--brand-mid': '#6b21a8',
    '--brand-light': '#a78bfa',
    '--brand-soft': '#f3e8ff',
    '--brand-border': '#e9d5ff',
    '--app-bg': '#f3e8ff',
    '--surface': '#ffffff',
    '--text-main': '#4c1d95',
    '--text-muted': '#6b7280',
    '--header-bg': 'rgba(255,255,255,0.6)',
  },
  ocean: {
    '--brand': '#0ea5e9',
    '--brand-hover': '#0284c7',
    '--brand-dark': '#0c4a6e',
    '--brand-mid': '#0369a1',
    '--brand-light': '#38bdf8',
    '--brand-soft': '#e0f2fe',
    '--brand-border': '#bae6fd',
    '--app-bg': '#e0f2fe',
    '--surface': '#ffffff',
    '--text-main': '#0c4a6e',
    '--text-muted': '#64748b',
    '--header-bg': 'rgba(255,255,255,0.6)',
  },
  forest: {
    '--brand': '#10b981',
    '--brand-hover': '#059669',
    '--brand-dark': '#064e3b',
    '--brand-mid': '#047857',
    '--brand-light': '#34d399',
    '--brand-soft': '#d1fae5',
    '--brand-border': '#a7f3d0',
    '--app-bg': '#ecfdf5',
    '--surface': '#ffffff',
    '--text-main': '#064e3b',
    '--text-muted': '#6b7280',
    '--header-bg': 'rgba(255,255,255,0.6)',
  },
  amber: {
    '--brand': '#f59e0b',
    '--brand-hover': '#d97706',
    '--brand-dark': '#92400e',
    '--brand-mid': '#b45309',
    '--brand-light': '#fbbf24',
    '--brand-soft': '#fef3c7',
    '--brand-border': '#fde68a',
    '--app-bg': '#fffbeb',
    '--surface': '#ffffff',
    '--text-main': '#92400e',
    '--text-muted': '#78716c',
    '--header-bg': 'rgba(255,255,255,0.6)',
  },
  rose: {
    '--brand': '#f43f5e',
    '--brand-hover': '#e11d48',
    '--brand-dark': '#9f1239',
    '--brand-mid': '#be123c',
    '--brand-light': '#fb7185',
    '--brand-soft': '#ffe4e6',
    '--brand-border': '#fecdd3',
    '--app-bg': '#fff1f2',
    '--surface': '#ffffff',
    '--text-main': '#9f1239',
    '--text-muted': '#6b7280',
    '--header-bg': 'rgba(255,255,255,0.6)',
  },
  slate: {
    '--brand': '#64748b',
    '--brand-hover': '#475569',
    '--brand-dark': '#e2e8f0',
    '--brand-mid': '#cbd5e1',
    '--brand-light': '#94a3b8',
    '--brand-soft': '#334155',
    '--brand-border': '#475569',
    '--app-bg': '#0f172a',
    '--surface': '#1e293b',
    '--text-main': '#e2e8f0',
    '--text-muted': '#94a3b8',
    '--header-bg': 'rgba(30,41,59,0.85)',
  },
};

export function applyTheme(themeId) {
  const vars = THEME_VARS[themeId] || THEME_VARS.violet;
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.setAttribute('data-theme', themeId in THEME_VARS ? themeId : 'violet');
}
