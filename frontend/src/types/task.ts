export type TaskStatus = 'Pending' | 'InProgress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskSummary {
  pending: number;
  inProgress: number;
  done: number;
  total: number;
}

export interface TaskFiltersState {
  search: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  page: number;
}