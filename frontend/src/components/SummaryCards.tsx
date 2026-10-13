import { CircleCheck, Hourglass, ListTodo, Play, type LucideIcon } from 'lucide-react';
import type { TaskSummary } from '../types/task';

interface Props {
  summary: TaskSummary | null;
}

interface CardConfig {
  label: string;
  icon: LucideIcon;
  value: number | undefined;
  gradient: string;
  showShare: boolean;
}

export function SummaryCards({ summary }: Props) {
  const total = summary?.total ?? 0;

  const items: CardConfig[] = [
    {
      label: 'Total',
      icon: ListTodo,
      value: summary?.total,
      gradient: 'from-brand-600 to-navy-900',
      showShare: false,
    },
    {
      label: 'Pendentes',
      icon: Hourglass,
      value: summary?.pending,
      gradient: 'from-amber-500 to-orange-600',
      showShare: true,
    },
    {
      label: 'Em andamento',
      icon: Play,
      value: summary?.inProgress,
      gradient: 'from-accent-500 to-brand-600',
      showShare: true,
    },
    {
      label: 'Concluídas',
      icon: CircleCheck,
      value: summary?.done,
      gradient: 'from-emerald-500 to-teal-600',
      showShare: true,
    },
  ];

  const caption = (item: CardConfig): string => {
    if (!item.showShare) return 'todas as tarefas';
    if (total === 0 || item.value === undefined) return ' ';
    return `${Math.round((item.value / total) * 100)}% do total`;
  };

  return (
    <div className="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`relative overflow-hidden rounded-box bg-linear-to-br p-4 text-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md ${item.gradient}`}
          >
            <Icon
              aria-hidden="true"
              strokeWidth={1.5}
              className="pointer-events-none absolute -bottom-4 -right-3 h-24 w-24 -rotate-12 opacity-20"
            />

            <div className="relative">
              <span className="text-sm font-medium text-white/90">{item.label}</span>
              <strong className="mt-1 block text-4xl font-bold leading-none tabular-nums">
                {item.value ?? '–'}
              </strong>
              <span className="mt-2 block text-xs text-white/80">{caption(item)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
