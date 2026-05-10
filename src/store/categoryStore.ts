import { create } from 'zustand';
import { Category } from '../types';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  loadCategories: () => Promise<void>;
  addCategory: (name: string, color: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await api.getCategories();
      // Initialize default categories if empty
      if (categories.length === 0) {
        const defaults = [
          { id: crypto.randomUUID(), name: 'Personal', color: '#3b82f6' }, // blue-500
          { id: crypto.randomUUID(), name: 'Work', color: '#f59e0b' },     // amber-500
          { id: crypto.randomUUID(), name: 'Learning', color: '#10b981' }, // emerald-500
          { id: crypto.randomUUID(), name: 'Shopping', color: '#8b5cf6' }, // violet-500
        ];
        for (const cat of defaults) {
          await api.createCategory(cat);
        }
        set({ categories: defaults, isLoading: false });
      } else {
        set({ categories, isLoading: false });
      }
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Unknown error');
      set({ error: errMsg, isLoading: false });
    }
  },

  addCategory: async (name, color) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    try {
      await api.createCategory(newCategory);
      set((state) => ({ categories: [...state.categories, newCategory] }));
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Unknown error');
      set({ error: errMsg });
      toast.error(`Failed to add category: ${errMsg}`);
    }
  },

  updateCategory: async (category) => {
    try {
      await api.updateCategory(category);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === category.id ? category : c)),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
