import { PRIORITIES, PRIORITY_LABEL, STATUSES, STATUS_LABEL } from '../constants';
import type { TaskPriority, TaskStatus } from '../types/task';
import { btn, inputClass } from '../ui';

interface Props {
  search: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  onSearch: (value: string) => void;
  onStatus: (value: TaskStatus | '') => void;
  onPriority: (value: TaskPriority | '') => void;
  onClear: () => void;
}

export function FilterBar({ search, status, priority, onSearch, onStatus, onPriority, onClear }: Props) {
  const hasFilters = search !== '' || status !== '' || priority !== '';

  return (
    <div className="mb-4 flex flex-wrap gap-2.5">
      <input
        type="search"
        className={`${inputClass} min-w-56 flex-1`}
        placeholder="Buscar por título ou descrição…"
        aria-label="Buscar tarefas"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        className={inputClass}
        aria-label="Filtrar por status"
        value={status}
        onChange={(e) => onStatus(e.target.value as TaskStatus | '')}
      >
        <option value="">Todos os status</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
        ))}
      </select>
      <select
        className={inputClass}
        aria-label="Filtrar por prioridade"
        value={priority}
        onChange={(e) => onPriority(e.target.value as TaskPriority | '')}
      >
        <option value="">Todas as prioridades</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
        ))}
      </select>
      {hasFilters && (
        <button type="button" className={btn('ghost')} onClick={onClear}>
          Limpar filtros
        </button>
      )}
    </div>
  );
}