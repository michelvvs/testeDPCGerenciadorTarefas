import axios, { isAxiosError } from 'axios';
import { clearSession, loadSession } from '../auth/storage';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5080',
  headers: { 'Content-Type': 'application/json' },
});


export const LOGOUT_EVENT = 'auth:logout';

http.interceptors.request.use((config) => {
  const session = loadSession();
  if (session) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const isAuthCall = isAxiosError(error) && error.config?.url?.includes('/api/auth/');
    if (isAxiosError(error) && error.response?.status === 401 && !isAuthCall) {
      clearSession();
      window.dispatchEvent(new Event(LOGOUT_EVENT));
    }
    return Promise.reject(error);
  },
);

interface ProblemDetails {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) return 'Não foi possível conectar ao servidor.';
    const data = error.response.data as ProblemDetails | undefined;
    if (data?.errors) return Object.values(data.errors).flat().join(' ');
    if (data?.detail) return data.detail;
    if (data?.title) return data.title;
  }
  return 'Ocorreu um erro inesperado.';
}