import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../api/taskService';

export function useTasks({ status, search }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      const qs = params.toString() ? `?${params}` : '';
      const data = await taskService.list(qs);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const t = setTimeout(load, 300); 
    return () => clearTimeout(t);
  }, [load]);

  return { tasks, setTasks, loading, error, reload: load };
}