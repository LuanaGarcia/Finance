const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:3001/api`
    : 'http://localhost:3001/api');
const TOKEN_KEY = 'finance_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Erro na requisição');
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  getAccounts: () => request('/accounts'),
  createAccount: (body) => request('/accounts', { method: 'POST', body: JSON.stringify(body) }),
  updateAccount: (id, body) => request(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAccount: (id) => request(`/accounts/${id}`, { method: 'DELETE' }),

  getCategories: () => request('/categories'),
  createCategory: (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  getTransactions: () => request('/transactions'),
  createTransaction: (body) => request('/transactions', { method: 'POST', body: JSON.stringify(body) }),
  updateTransaction: (id, body) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  getCaixinhas: () => request('/caixinhas'),
  createCaixinha: (body) => request('/caixinhas', { method: 'POST', body: JSON.stringify(body) }),
  depositCaixinha: (id, amount) =>
    request(`/caixinhas/${id}/deposit`, { method: 'POST', body: JSON.stringify({ amount }) }),
  withdrawCaixinha: (id, amount) =>
    request(`/caixinhas/${id}/withdraw`, { method: 'POST', body: JSON.stringify({ amount }) }),
  deleteCaixinha: (id) => request(`/caixinhas/${id}`, { method: 'DELETE' }),
};
