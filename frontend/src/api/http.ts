import axios, { isAxiosError } from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5080',
  headers: { 'Content-Type': 'application/json' },
});

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