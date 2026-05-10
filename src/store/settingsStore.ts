import { create } from 'zustand';
import { api } from '../lib/api';

interface SettingsState {
  settings: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
  updateSetting: (key: string, value: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {},
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await api.getSettings();
      // Apply theme if exists
      if (settings['theme']) {
        if (settings['theme'] === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
         document.documentElement.classList.add('dark'); // Default to dark for this premium look
         api.saveSetting('theme', 'dark');
         settings['theme'] = 'dark';
      }
      set({ settings, isLoading: false });
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Unknown error');
      set({ error: errMsg, isLoading: false });
    }
  },

  updateSetting: async (key, value) => {
    try {
      await api.saveSetting(key, value);
      
      // Apply theme immediately
      if (key === 'theme') {
        if (value === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      set((state) => ({
        settings: { ...state.settings, [key]: value },
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
