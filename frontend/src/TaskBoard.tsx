import { useState } from 'react';
import { getErrorMessage } from './api/http';
import { tasksApi } from './api/tasks';
import { FilterBar } from './components/FilterBar';
import { Modal } from './components/Modal';
import { Pagination } from './components/Pagination';
import { SummaryCards } from './components/SummaryCards';
import { TaskFormModal } from './components/TaskFormModal';
import { TaskTable } from './components/TaskTable';
import { useDebounce } from './hooks/useDebounce';
import { useTasks } from './hooks/useTasks';
import type { Task, TaskPriority, TaskStatus } from './types/task';
import { alertError, btn } from './ui';
import { Plus } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useAuth } from './auth/useAuth';

interface ToastState {
  type: 'ok' | 'error';
  text: string;
}

const TOAST_STYLE: Record<ToastState['type'], string> = {
  ok: 'bg-emerald-700',
  error: 'bg-red-700',
};

export function TaskBoard() {
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [busyIds, setBusyIds] = useState<ReadonlySet<number>>(new Set());


  const search = useDebounce(searchInput.trim());
  const { data, summary, loading, error, reload } = useTasks({ search, status, priority, page });

  const { user, logout } = useAuth();

  function notify(type: ToastState['type'], text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setFormOpen(true);
  }

  function handleSaved(message: string) {
    setFormOpen(false);
    notify('ok', message);
    reload();
  }

  async function handleStatusChange(task: Task, newStatus: TaskStatus) {
    if (busyIds.has(task.id)) return;
    setBusyIds((prev) => new Set(prev).add(task.id)); 
    try {
      await tasksApi.updateStatus(task.id, newStatus);
      notify('ok', 'Status atualizado.');
      reload();
    } catch (e) {
      notify('error', getErrorMessage(e));
    } finally {
    setBusyIds((prev) => {                               // libera, com sucesso ou erro
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    } 
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await tasksApi.remove(deleting.id);
      notify('ok', 'Tarefa excluída.');
      // se removeu o último item da página, volta uma página
      if (data && data.items.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (e) {
      notify('error', getErrorMessage(e));
    } finally {
      setDeleting(null);
    }
  }

  function clearFilters() {
    setSearchInput('');
    setStatus('');
    setPriority('');
    setPage(1);
  }

  const tasks = data?.items ?? [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-navy-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5 text-lg font-bold">
            <span
              className="grid h-8 w-8 place-items-center rounded-md bg-brand-600"
              aria-hidden="true"
            >
              ✓
            </span>
            <span>Gestão de tarefas - Michel Victor | Domingues e Pinho Contadores</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-300 sm:inline">{user?.name}</span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-2.5 py-1 text-xs hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </button>
          </div>        
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Tarefas</h1>
            <p className="mt-1 text-slate-500">
              Acompanhe, filtre e atualize o andamento das atividades.
            </p>
          </div>
          <button type="button" className={`${btn('primary')} gap-1.5`} onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nova tarefa
          </button>
        </div>

        <SummaryCards summary={summary} />

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <FilterBar
            search={searchInput}
            status={status}
            priority={priority}
            onSearch={(v) => { setSearchInput(v); setPage(1); }}
            onStatus={(v) => { setStatus(v); setPage(1); }}
            onPriority={(v) => { setPriority(v); setPage(1); }}
            onClear={clearFilters}
          />

          {error && (
            <div className={`${alertError} my-2.5`} role="alert">
              {error}{' '}
              <button type="button" className="underline" onClick={reload}>
                Tentar novamente
              </button>
            </div>
          )}

          {loading && !data && <div className="py-9 text-center text-slate-500">Carregando…</div>}

          {data && tasks.length === 0 && !error && (
            <div className="py-9 text-center text-slate-500">Nenhuma tarefa encontrada.</div>
          )}

          {tasks.length > 0 && (
            <TaskTable
            
              tasks={tasks}
              onEdit={openEdit}
              onDelete={setDeleting}
              onStatusChange={handleStatusChange} 
              busyIds={busyIds}            />
          )}

          {data && (
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              totalItems={data.totalItems}
              onChange={setPage}
            />
          )}
        </section>
      </main>

      {formOpen && (
        <TaskFormModal
          key={editing?.id ?? 'new'}
          task={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <Modal title="Excluir tarefa" onClose={() => setDeleting(null)}>
          <p>
            Deseja realmente excluir <strong>{deleting.title}</strong>? Esta ação não pode ser desfeita.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className={btn('ghost')} onClick={() => setDeleting(null)}>
              Cancelar
            </button>
            <button type="button" className={btn('dangerSolid')} onClick={confirmDelete}>
              Excluir
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[60] rounded-lg px-4 py-3 text-white shadow-lg ${TOAST_STYLE[toast.type]}`}
          role="status"
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}