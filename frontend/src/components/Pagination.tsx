import { btn } from '../ui';

interface Props {
  page: number;
  totalPages: number;
  totalItems: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, totalItems, onChange }: Props) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
      <span>{totalItems} tarefa(s)</span>
      <div className="flex items-center gap-2.5">
        <button type="button" className={btn('ghost')} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          ← Anterior
        </button>
        <span>Página {page} de {Math.max(totalPages, 1)}</span>
        <button
          type="button"
          className={btn('ghost')}
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}