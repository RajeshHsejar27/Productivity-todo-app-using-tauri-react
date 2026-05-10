import { create } from 'zustand';
import { Task, TaskStatus } from '../types';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { sounds } from '../lib/sounds';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  loadTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api.getTasks();
      set({ tasks, isLoading: false });
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Unknown error');
      set({ error: errMsg, isLoading: false });
    }
  },

  addTask: async (taskData) => {
    const newTask: Omit<Task, 'created_at' | 'updated_at'> = {
      ...taskData,
      id: crypto.randomUUID(),
    };
    try {
      await api.createTask(newTask);
      sounds.playAdd();
      await get().loadTasks();
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Unknown error');
      set({ error: errMsg });
      toast.error(`Failed to add task: ${errMsg}`);
    }
  },

  updateTask: async (task) => {
    try {
      await api.updateTask(task);
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
      }));
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Unknown error');
      set({ error: errMsg });
      toast.error(`Failed to update task: ${errMsg}`);
      await get().loadTasks(); // Revert on failure
    }
  },

  deleteTask: async (id) => {
    try {
      await api.deleteTask(id);
      sounds.playDelete();
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Unknown error');
      set({ error: errMsg });
      toast.error(`Failed to delete task: ${errMsg}`);
      await get().loadTasks();
    }
  },

  toggleTaskStatus: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;
    
    if (newStatus === 'completed') {
      sounds.playComplete();
    }
    
    const updatedTask = { ...task, status: newStatus, completed_at: completedAt };
    await get().updateTask(updatedTask);
  },
}));
