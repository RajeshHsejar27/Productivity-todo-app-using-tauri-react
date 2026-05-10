import { create } from 'zustand';

export type ViewType = 'overview' | 'today' | 'upcoming' | 'all' | 'completed' | 'settings' | 'category';

interface AppState {
  currentView: ViewType;
  selectedCategoryId: string | null;
  searchQuery: string;
  isSidebarCollapsed: boolean;
  setView: (view: ViewType, categoryId?: string) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'overview',
  selectedCategoryId: null,
  searchQuery: '',
  isSidebarCollapsed: false,
  setView: (view, categoryId = undefined) => set({ currentView: view, selectedCategoryId: categoryId || null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
