import { PRIORITY_LABEL, PRIORITY_STYLE, STATUSES, STATUS_LABEL, STATUS_STYLE } from '../constants';
import type { Task, TaskStatus } from '../types/task';
import { btn } from '../ui';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

function formatDate(isoDate: string | null): string {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'Done') return false;
  const today = new Date().toLocaleDateString('en-CA'); // yyyy-MM-dd no
  return task.dueDate.slice(0, 10) < today;
}

const TH = 'px-3 py-2.5 font-semibold';
const TD = 'px-3 py-3';

export function TaskTable({ tasks, onEdit, onDelete, onStatusChange }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className={TH}>Tarefa</th>
            <th className={TH}>Status</th>
            <th className={TH}>Prioridade</th>
            <th className={TH}>Prazo</th>
            <th className={TH} aria-label="Ações" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {tasks.map((task) => {
            const overdue = isOverdue(task);
            return (
              <tr key={task.id} className="align-top hover:bg-slate-50">
                <td className={TD}>
                  <div className="font-semibold">{task.title}</div>
                  {task.description && (
                    <div className="mt-0.5 max-w-prose text-slate-500">{task.description}</div>
                  )}
                </td>
                <td className={TD}>
                  <select
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold focus:outline-2 focus:outline-brand-600 ${STATUS_STYLE[task.status]}`}
                    aria-label={`Status de ${task.title}`}
                    value={task.status}
                    onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </td>
                <td className={TD}>
                  <span className={`font-semibold ${PRIORITY_STYLE[task.priority]}`}>
                    {PRIORITY_LABEL[task.priority]}
                  </span>
                </td>
                <td className={`${TD} ${overdue ? 'font-semibold text-red-700' : ''}`}>
                  {formatDate(task.dueDate)}
                  {overdue && ' (atrasada)'}
                </td>
                <td className={`${TD} whitespace-nowrap text-right`}>
                  <button type="button" className={btn('ghost', 'sm')} onClick={() => onEdit(task)}>
                    Editar
                  </button>{' '}
                  <button type="button" className={btn('danger', 'sm')} onClick={() => onDelete(task)}>
                    Excluir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}