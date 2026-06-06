import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach access token from Zustand-persisted store
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('vendorbridge-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.accessToken;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('vendorbridge-auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── API Service Helpers ──────────────────────────────────────────

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: Record<string, unknown>) =>
    api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
};

export const rfqAPI = {
  list: (params?: Record<string, unknown>) => api.get('/rfqs', { params }),
  get: (id: string) => api.get(`/rfqs/${id}`),
  create: (data: Record<string, unknown>) => api.post('/rfqs', data),
  publish: (id: string) => api.post(`/rfqs/${id}/publish`),
  close: (id: string) => api.post(`/rfqs/${id}/close`),
  invite: (id: string, vendorIds: string[]) =>
    api.post(`/rfqs/${id}/invite`, { vendorIds }),
};

export const quotationAPI = {
  list: (params?: Record<string, unknown>) => api.get('/quotations', { params }),
  get: (id: string) => api.get(`/quotations/${id}`),
  submit: (data: Record<string, unknown>) => api.post('/quotations', data),
  accept: (id: string) => api.post(`/quotations/${id}/accept`),
  reject: (id: string) => api.post(`/quotations/${id}/reject`),
};

export const approvalAPI = {
  list: (params?: Record<string, unknown>) => api.get('/approvals', { params }),
  get: (id: string) => api.get(`/approvals/${id}`),
  approve: (id: string, remarks: string) =>
    api.post(`/approvals/${id}/approve`, { remarks }),
  reject: (id: string, remarks: string) =>
    api.post(`/approvals/${id}/reject`, { remarks }),
};

export const purchaseOrderAPI = {
  list: (params?: Record<string, unknown>) =>
    api.get('/purchase-orders', { params }),
  get: (id: string) => api.get(`/purchase-orders/${id}`),
  generate: (quotationId: string) => api.post('/purchase-orders/generate', { quotationId }),
  acknowledge: (id: string) =>
    api.patch(`/purchase-orders/${id}/acknowledge`),
};

export const invoiceAPI = {
  list: (params?: Record<string, unknown>) => api.get('/invoices', { params }),
  get: (id: string) => api.get(`/invoices/${id}`),
  create: (data: Record<string, unknown>) => api.post('/invoices', data),
};

export const vendorAPI = {
  list: (params?: Record<string, unknown>) => api.get('/vendors', { params }),
  get: (id: string) => api.get(`/vendors/${id}`),
  approve: (id: string) => api.post(`/vendors/${id}/approve`),
  reject: (id: string) => api.post(`/vendors/${id}/reject`),
};

export const reportAPI = {
  summary: () => api.get('/reports/summary'),
};

// ─── PDF Download Helper ──────────────────────────────────────────
export async function downloadPDFFromAPI(url: string, filename: string) {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('vendorbridge-auth') : null;
    let token = '';
    if (stored) {
      const parsed = JSON.parse(stored);
      token = parsed?.state?.accessToken ?? '';
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('PDF generation failed');
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    return true;
  } catch (err) {
    console.error('PDF download error:', err);
    return false;
  }
}
