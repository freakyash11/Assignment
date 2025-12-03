import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'done';
  priority?: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskInput {
  title: string;
  description: string;
  status: 'todo' | 'done';
  priority?: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/tasks', {
        params: {
          sortBy: 'createdAt',
          order: 'desc',
          limit: 100,
        },
      });
      
      // Map backend status to frontend status
      const mappedTasks = response.data.tasks.map((task: any) => ({
        id: task._id,
        title: task.title,
        description: task.description || '',
        status: task.status === 'completed' ? 'done' : 'todo',
        priority: task.priority,
        tags: task.tags || [],
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }));
      
      setTasks(mappedTasks);
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err);
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (taskInput: TaskInput) => {
    try {
      const response = await api.post('/tasks', {
        title: taskInput.title,
        description: taskInput.description,
        status: taskInput.status === 'done' ? 'completed' : 'pending',
        priority: taskInput.priority || 'medium',
        tags: taskInput.tags,
        dueDate: taskInput.dueDate,
      });

      const newTask: Task = {
        id: response.data.task._id,
        title: response.data.task.title,
        description: response.data.task.description || '',
        status: response.data.task.status === 'completed' ? 'done' : 'todo',
        priority: response.data.task.priority,
        tags: response.data.task.tags || [],
        dueDate: response.data.task.dueDate,
        createdAt: response.data.task.createdAt,
        updatedAt: response.data.task.updatedAt,
      };

      setTasks((prev) => [newTask, ...prev]);
    } catch (err: any) {
      console.error('Failed to add task:', err);
      throw new Error(err.response?.data?.message || 'Failed to add task');
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const response = await api.put(`/tasks/${id}`, {
        title: updates.title,
        description: updates.description,
        status: updates.status === 'done' ? 'completed' : 'pending',
        priority: updates.priority,
        tags: updates.tags,
        dueDate: updates.dueDate,
      });

      const updatedTask: Task = {
        id: response.data.task._id,
        title: response.data.task.title,
        description: response.data.task.description || '',
        status: response.data.task.status === 'completed' ? 'done' : 'todo',
        priority: response.data.task.priority,
        tags: response.data.task.tags || [],
        dueDate: response.data.task.dueDate,
        createdAt: response.data.task.createdAt,
        updatedAt: response.data.task.updatedAt,
      };

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err: any) {
      console.error('Failed to update task:', err);
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    try {
      await api.delete(`/tasks/${id}`);
      
      setDeletedTask(taskToDelete);
      setTasks((prev) => prev.filter((task) => task.id !== id));

      // Clear deleted task after 5 seconds
      setTimeout(() => {
        setDeletedTask(null);
      }, 5000);
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
  }, [tasks]);

  const undoDelete = useCallback(async () => {
    if (!deletedTask) return;

    try {
      // Re-add the task
      await addTask({
        title: deletedTask.title,
        description: deletedTask.description,
        status: deletedTask.status,
        priority: deletedTask.priority,
        tags: deletedTask.tags,
        dueDate: deletedTask.dueDate,
      });
      
      setDeletedTask(null);
    } catch (err) {
      console.error('Failed to undo delete:', err);
    }
  }, [deletedTask, addTask]);

  const toggleStatus = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'done' ? 'todo' : 'done';
    await updateTask(id, { status: newStatus });
  }, [tasks, updateTask]);

  const clearDeletedTask = useCallback(() => {
    setDeletedTask(null);
  }, []);

  return {
    tasks,
    deletedTask,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    undoDelete,
    toggleStatus,
    clearDeletedTask,
    refreshTasks: fetchTasks,
  };
}