import { http } from './http';
import type {
  PagedResult,
  Task,
  TaskFiltersState,
  TaskFormValues,
  TaskStatus,
  TaskSummary,
} from '../types/task';

const PAGE_SIZE = 8;

function toPayload(values: TaskFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim() || null,
    priority: values.priority,
    status: values.status,
    dueDate: values.dueDate || null,
  };
}

export const tasksApi = {
  async list(filters: TaskFiltersState): Promise<PagedResult<Task>> {
    const { data } = await http.get<PagedResult<Task>>('/api/tasks', {
      params: {
        search: filters.search || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        page: filters.page,
        pageSize: PAGE_SIZE,
      },
    });
    return data;
  },

  async summary(): Promise<TaskSummary> {
    const { data } = await http.get<TaskSummary>('/api/tasks/summary');
    return data;
  },

  async create(values: TaskFormValues): Promise<Task> {
    const { data } = await http.post<Task>('/api/tasks', toPayload(values));
    return data;
  },

  async update(id: number, values: TaskFormValues): Promise<Task> {
    const { data } = await http.put<Task>(`/api/tasks/${id}`, toPayload(values));
    return data;
  },

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const { data } = await http.patch<Task>(`/api/tasks/${id}/status`, { status });
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`/api/tasks/${id}`);
  },
};