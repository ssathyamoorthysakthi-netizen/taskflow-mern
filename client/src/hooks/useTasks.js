import { useCallback, useEffect, useState } from 'react';
import { taskService } from '../services/apiService';

export function useTasks(initialParams = {}) {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchTasks = useCallback(async (override = params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.getTasks(override);
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTasks(params);
  }, [fetchTasks, params]);

  return { tasks, pagination, loading, error, setParams, refetch: () => fetchTasks() };
}