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
import { btn } from './ui';
import { ListChecks, LogOut, Plus } from 'lucide-react';
import { useAuth } from './auth/useAuth';
import { Alert } from './components/Alert';

interface ToastState {
  type: 'ok' | 'error';
  text: string;
}

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
    setBusyIds((prev) => {
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
  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? '';

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-field bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-btn"
              aria-hidden="true"
            >
              <ListChecks className="h-5 w-5" />
            </span>
            <span className="line-clamp-2 text-sm font-bold leading-tight text-navy-900 sm:text-base">
              Gestão de tarefas - Michel Victor | Domingues e Pinho Contadores
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden items-center gap-2 text-sm font-medium sm:flex">
              <span
                className="grid h-8 w-8 place-items-center rounded-selector bg-brand-100 text-xs font-bold text-brand-700"
                aria-hidden="true"
              >
                {initial}
              </span>
              {user?.name}
            </span>
            <button type="button" onClick={logout} className={btn('ghost', 'sm')}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
            <p className="mt-1 text-base-content/60">
              Acompanhe, filtre e atualize o andamento das atividades.
            </p>
          </div>
          <button type="button" className={`${btn('primary')} gap-1.5`} onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nova tarefa
          </button>
        </div>

        <SummaryCards summary={summary} />

        <section className="rounded-box border border-base-300 bg-base-100 p-4 shadow-soft sm:p-5">
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
            <Alert className="my-3">
              {error}{' '}
              <button type="button" className="font-semibold underline" onClick={reload}>
                Tentar novamente
              </button>
            </Alert>
          )}

          {loading && !data && <div className="py-10 text-center text-base-content/60">Carregando…</div>}

          {data && tasks.length === 0 && !error && (
            <div className="py-10 text-center text-base-content/60">Nenhuma tarefa encontrada.</div>
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
        <div className="fixed bottom-5 right-5 z-[60] w-[min(22rem,calc(100vw-2.5rem))] animate-pop shadow-pop motion-reduce:animate-none">
          <Alert tone={toast.type === 'ok' ? 'success' : 'error'} className="bg-base-100">
            {toast.text}
          </Alert>
        </div>
      )}
    </div>
  );
}