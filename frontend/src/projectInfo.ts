const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:5080';

export const PROJECT = {
  name: 'TaskManager',
  purpose: 'Teste técnico · Domingues e Pinho Contadores',
  repositoryUrl: 'https://github.com/michelvvs/testeDPCGerenciadorTarefas',
  apiDocsUrl: `${API_URL.replace(/\/$/, '')}/swagger`,
} as const;

export const AUTHOR = {
  name: 'Michel Victor',
  role: 'Desenvolvedor Fullstack',
  githubUrl: 'https://github.com/michelvvs',
  siteUrl: 'https://michelvvs.com',
} as const;
