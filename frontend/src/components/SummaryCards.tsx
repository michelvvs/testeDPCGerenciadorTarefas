import type { TaskSummary } from '../types/task';

interface Props {
  summary: TaskSummary | null;
}

export function SummaryCards({ summary }: Props) {
  const items = [
    { label: 'Total', value: summary?.total, accent: 'border-t-brand-600' },
    { label: 'Pendentes', value: summary?.pending, accent: 'border-t-amber-500' },
    { label: 'Em andamento', value: summary?.inProgress, accent: 'border-t-blue-500' },
    { label: 'Concluídas', value: summary?.done, accent: 'border-t-emerald-600' },
  ];

  return (
    <div className="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex flex-col gap-1 rounded-lg border border-t-4 border-slate-200 bg-white px-4 py-3.5 ${item.accent}`}
        >
          <span className="text-sm text-slate-500">{item.label}</span>
          <strong className="text-3xl font-semibold">{item.value ?? '–'}</strong>
        </div>
      ))}
    </div>
  );
}