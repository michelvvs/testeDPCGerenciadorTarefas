import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/http';
import { tasksApi } from '../api/tasks';
import type { PagedResult, Task, TaskFiltersState, TaskSummary } from '../types/task';

export function useTasks(filters: TaskFiltersState) {
  const { search, status, priority, page } = filters;

  const [data, setData] = useState<PagedResult<Task> | null>(null);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0); 

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      tasksApi.list({ search, status, priority, page }),
      tasksApi.summary(),
    ])
      .then(([list, sum]) => {
        if (cancelled) return;
        setData(list);
        setSummary(sum);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(getErrorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, status, priority, page, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { data, summary, loading, error, reload };
}