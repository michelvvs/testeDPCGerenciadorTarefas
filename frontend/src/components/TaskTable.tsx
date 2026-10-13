import { Pencil, Trash2 } from 'lucide-react';
import { PRIORITY_LABEL, PRIORITY_STYLE, ROW_STYLE, STATUS_ACTIONS, STATUS_LABEL } from '../constants';
import type { Task, TaskStatus } from '../types/task';
import { badge } from '../ui';
import { IconButton } from './IconButton';

interface Props {
  tasks: Task[];
  busyIds: ReadonlySet<number>;
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
  const today = new Date().toLocaleDateString('en-CA');
  return task.dueDate.slice(0, 10) < today;
}

const TARGET_VARIANT = {
  Pending: 'ghost',
  InProgress: 'info',
  Done: 'success',
} as const;

const TH = 'px-4 py-3 font-semibold';
const TD = 'px-4 py-3';

export function TaskTable({ tasks, busyIds, onEdit, onDelete, onStatusChange }: Props) {
  return (
    <div className="overflow-x-auto rounded-box border border-base-300">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-base-200/70 text-xs uppercase tracking-wider text-base-content/60">
            <th className={`${TH} w-28`}>Ações</th>
            <th className={TH}>Tarefa</th>
            <th className={`${TH} hidden md:table-cell`}>Descrição</th>
            <th className={TH}>Prioridade</th>
            <th className={TH}>Prazo</th>
            <th className={TH} aria-label="Editar e excluir" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const style = ROW_STYLE[task.status];
            const busy = busyIds.has(task.id);
            const overdue = isOverdue(task);

            return (
              <tr
                key={task.id}
                className={`border-t border-base-300 transition-colors hover:bg-base-200/60 ${style.row}`}
              >
                <td className={`${TD} whitespace-nowrap border-l-4 ${style.accent}`}>
                  <span className="sr-only">{STATUS_LABEL[task.status]}. </span>
                  <div className="flex gap-1.5">
                    {STATUS_ACTIONS[task.status].map(({ label, icon, target }) => (
                      <IconButton
                        key={target}
                        icon={icon}
                        label={label}
                        variant={TARGET_VARIANT[target]}
                        disabled={busy}
                        onClick={() => onStatusChange(task, target)}
                      />
                    ))}
                  </div>
                </td>

                <td className={TD}>
                  <span className={`font-semibold ${style.title}`}>{task.title}</span>
                </td>

                <td className={`${TD} hidden md:table-cell`}>
                  <div className="max-w-xs truncate text-base-content/60" title={task.description ?? undefined}>
                    {task.description ?? '—'}
                  </div>
                </td>

                <td className={TD}>
                  <span className={`${badge} ${PRIORITY_STYLE[task.priority]}`}>
                    {PRIORITY_LABEL[task.priority]}
                  </span>
                </td>

                <td className={`${TD} ${overdue ? 'font-semibold text-red-700' : 'text-base-content/80'}`}>
                  {formatDate(task.dueDate)}
                  {overdue && ' (atrasada)'}
                </td>

                <td className={`${TD} whitespace-nowrap`}>
                  <div className="flex justify-end gap-1.5">
                    <IconButton icon={Pencil} label="Editar" onClick={() => onEdit(task)} />
                    <IconButton icon={Trash2} label="Excluir" variant="danger" onClick={() => onDelete(task)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
