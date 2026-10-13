import { Check, Play, Undo2, type LucideIcon } from 'lucide-react';
import type { TaskPriority, TaskStatus } from './types/task';

export interface StatusAction {
    label: string;
    icon: LucideIcon;
    target: TaskStatus;
    }

export const STATUS_LABEL: Record<TaskStatus, string> = {
  Pending: 'Pendente',
  InProgress: 'Em andamento',
  Done: 'Concluída',
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  Low: 'Baixa',
  Medium: 'Média',
  High: 'Alta',
};

export const STATUSES = Object.keys(STATUS_LABEL) as TaskStatus[];
export const PRIORITIES = Object.keys(PRIORITY_LABEL) as TaskPriority[];

export const PRIORITY_STYLE: Record<TaskPriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-red-100 text-red-700',
};

export const STATUS_ACTIONS: Record<TaskStatus, StatusAction[]> = {
    Pending: [
        {label: 'Iniciar', icon: Play, target: 'InProgress'},
        {label: 'Concluir', icon: Check, target: 'Done'},
    ],
    InProgress: [
        {label: 'Concluir', icon: Check, target: 'Done'},
        {label: 'Voltar para pendente', icon: Undo2, target: 'Pending'}, 
    ],
    Done: [
        {label: 'Reabrir', icon: Undo2, target: 'Pending'},
    ],
};

export const ROW_STYLE: Record<TaskStatus, { row: string; accent: string; title: string }> = {
  Pending:    { row: 'bg-base-100',        accent: 'border-l-slate-300',   title: '' },
  InProgress: { row: 'bg-brand-50/70',     accent: 'border-l-brand-600',   title: '' },
  Done:       { row: 'bg-emerald-50/70',   accent: 'border-l-emerald-500', title: 'line-through text-base-content/50' },
};