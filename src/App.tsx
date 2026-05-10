import { useEffect } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { useTaskStore } from "./store/taskStore";
import { useCategoryStore } from "./store/categoryStore";
import { useSettingsStore } from "./store/settingsStore";
import { useAppStore } from "./store/appStore";

import { Dashboard } from "./components/dashboard/Dashboard";
import { TaskList } from "./components/tasks/TaskList";
import { SettingsPanel } from "./components/settings/Settings";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { useState } from "react";
import { TaskEditorDialog } from "./components/tasks/TaskEditorDialog";

function App() {
  const { loadTasks } = useTaskStore();
  const { loadCategories, categories } = useCategoryStore();
  const { loadSettings } = useSettingsStore();
  const { currentView, selectedCategoryId, searchQuery } = useAppStore();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  useEffect(() => {
    const initData = async () => {
      await loadSettings();
      await loadCategories();
      await loadTasks();
    };
    initData();
  }, [loadSettings, loadCategories, loadTasks]);

  // Prevent default context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (import.meta.env.PROD) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const getTitle = () => {
    if (currentView === 'overview') return null;
    if (currentView === 'today') return 'Today';
    if (currentView === 'upcoming') return 'Upcoming';
    if (currentView === 'all') return 'All Tasks';
    if (currentView === 'completed') return 'Completed';
    if (currentView === 'category' && selectedCategoryId) {
      return categories.find(c => c.id === selectedCategoryId)?.name || 'Category';
    }
    return currentView;
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {currentView === 'overview' && <Dashboard />}
        
        {currentView !== 'overview' && currentView !== 'settings' && (
          <div className="flex-1 flex flex-col h-full min-h-0">
             <div className="px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-[72px]">
              <div>
                <h1 className="text-2xl font-bold tracking-tight capitalize">{getTitle()}</h1>
              </div>
              <Button onClick={() => setIsNewTaskOpen(true)} className="shrink-0 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
            
            <div className="px-8 mb-4">
              {currentView === 'today' && <p className="text-muted-foreground font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>}
            </div>

            <div className="flex-1 px-8 pb-8 overflow-hidden">
               <div className="h-full bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
                 <TaskList 
                    filter={currentView as any} 
                    categoryId={selectedCategoryId} 
                    searchQuery={searchQuery} 
                 />
               </div>
            </div>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="flex-1 flex flex-col h-full p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>
            <SettingsPanel />
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
      <TaskEditorDialog 
        task={null}
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />
    </MainLayout>
  );
}

export default App;
