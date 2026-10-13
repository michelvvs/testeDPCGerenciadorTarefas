import { useState, type FormEvent } from 'react';
import { getErrorMessage } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { ListChecks } from 'lucide-react';
import { btn, inputClass } from '../ui';
import { Alert } from './Alert';

type Mode = 'login' | 'register';

const FIELD = 'flex flex-col gap-1.5 text-sm font-medium text-base-content/70';

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isLogin = mode === 'login';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (isLogin) await login(email, password);
      else await register(name, email, password);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-linear-to-br from-brand-50 via-base-200 to-base-200 p-4">
      <div className="w-full max-w-sm animate-pop rounded-box border border-base-300 bg-base-100 p-7 shadow-soft motion-reduce:animate-none">
        <div className="mb-6 flex items-center gap-3 text-lg font-bold text-navy-900">
          <span
            className="grid h-10 w-10 place-items-center rounded-field bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-btn"
            aria-hidden="true"
          >
            <ListChecks className="h-5 w-5" />
          </span>
          TaskManager
        </div>

        <h1 className="mb-4 text-xl font-bold tracking-tight">{isLogin ? 'Entrar' : 'Criar conta'}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <label className={FIELD}>
              <span>Nome</span>
              <input
                className={`${inputClass} w-full`}
                value={name}
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}

          <label className={FIELD}>
            <span>E-mail</span>
            <input
              type="email"
              className={`${inputClass} w-full`}
              value={email}
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className={FIELD}>
            <span>Senha</span>
            <input
              type="password"
              className={`${inputClass} w-full`}
              value={password}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isLogin && <span className="text-xs font-normal text-base-content/50">Mínimo de 8 caracteres.</span>}
          </label>

          {error && <Alert>{error}</Alert>}

          <button type="submit" className={btn('primary')} disabled={busy}>
            {busy ? 'Aguarde…' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <button
          type="button"
          className="mt-5 w-full text-center text-sm font-semibold text-brand-600 hover:underline"
          onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(null); }}
        >
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
}