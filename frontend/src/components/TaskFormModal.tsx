import { useState, type FormEvent } from 'react';
import { getErrorMessage } from '../api/http';
import { tasksApi } from '../api/tasks';
import { PRIORITIES, PRIORITY_LABEL, STATUSES, STATUS_LABEL } from '../constants';
import type { Task, TaskFormValues, TaskPriority, TaskStatus } from '../types/task';
import { alertError, btn, inputClass } from '../ui';
import { Modal } from './Modal';

interface Props {
  task: Task | null; // null = criando
  onClose: () => void;
  onSaved: (message: string) => void;
}

const FIELD = 'flex flex-col gap-1 text-sm text-slate-600';

export function TaskFormModal({ task, onClose, onSaved }: Props) {
  const [values, setValues] = useState<TaskFormValues>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    priority: task?.priority ?? 'Medium',
    status: task?.status ?? 'Pending',
    dueDate: task?.dueDate?.slice(0, 10) ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (values.title.trim().length < 3) {
      setError('O título deve ter ao menos 3 caracteres.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (task) {
        await tasksApi.update(task.id, values);
        onSaved('Tarefa atualizada com sucesso.');
      } else {
        await tasksApi.create(values);
        onSaved('Tarefa criada com sucesso.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={task ? 'Editar tarefa' : 'Nova tarefa'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <label className={FIELD}>
          <span>Título *</span>
          <input
            className={`${inputClass} w-full`}
            value={values.title}
            maxLength={120}
            autoFocus
            onChange={(e) => set('title', e.target.value)}
          />
        </label>

        <label className={FIELD}>
          <span>Descrição</span>
          <textarea
            className={`${inputClass} w-full`}
            rows={3}
            maxLength={1000}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
          <label className={FIELD}>
            <span>Prioridade</span>
            <select
              className={`${inputClass} w-full`}
              value={values.priority}
              onChange={(e) => set('priority', e.target.value as TaskPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
              ))}
            </select>
          </label>

          {task && (
            <label className={FIELD}>
              <span>Status</span>
              <select
                className={`${inputClass} w-full`}
                value={values.status}
                onChange={(e) => set('status', e.target.value as TaskStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </label>
          )}

          <label className={FIELD}>
            <span>Prazo</span>
            <input
              type="date"
              className={`${inputClass} w-full`}
              value={values.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
            />
          </label>
        </div>

        {error && <div className={alertError} role="alert">{error}</div>}

        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className={btn('ghost')} onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className={btn('primary')} disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}