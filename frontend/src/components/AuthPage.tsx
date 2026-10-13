import { useState, type FormEvent } from 'react';
import { getErrorMessage } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { alertError, btn, inputClass } from '../ui';

type Mode = 'login' | 'register';

const FIELD = 'flex flex-col gap-1 text-sm text-slate-600';

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
    <div className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2.5 text-lg font-bold text-navy-900">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-600 text-white" aria-hidden="true">
            ✓
          </span>
          TaskManager
        </div>

        <h1 className="mb-4 text-xl font-semibold">{isLogin ? 'Entrar' : 'Criar conta'}</h1>

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
            {!isLogin && <span className="text-xs text-slate-400">Mínimo de 8 caracteres.</span>}
          </label>

          {error && <div className={alertError} role="alert">{error}</div>}

          <button type="submit" className={btn('primary')} disabled={busy}>
            {busy ? 'Aguarde…' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <button
          type="button"
          className="mt-4 w-full text-center text-sm text-brand-600 underline"
          onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(null); }}
        >
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
}