import React, { useState } from 'react';
import { useAppStore, ViewType } from '../../store/appStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useSettingsStore } from '../../store/settingsStore';
import { 
  Home, Calendar, CalendarDays, CheckSquare, ListTodo, 
  Settings, Plus, Moon, Sun, Search, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { useTaskStore } from '../../store/taskStore';
import { CategoryDialog } from '../categories/CategoryDialog';

export const Sidebar: React.FC = () => {
  const { currentView, selectedCategoryId, setView, isSidebarCollapsed, toggleSidebar, setSearchQuery, searchQuery } = useAppStore();
  const { categories } = useCategoryStore();
  const { settings, updateSetting } = useSettingsStore();
  const { tasks } = useTaskStore();
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const isDark = settings['theme'] === 'dark';

  const toggleTheme = () => {
    updateSetting('theme', isDark ? 'light' : 'dark');
  };

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'today', label: 'Today', icon: <Calendar className="w-4 h-4" />, count: tasks.filter(t => t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString() && t.status !== 'completed').length },
    { id: 'upcoming', label: 'Upcoming', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'all', label: 'All Tasks', icon: <ListTodo className="w-4 h-4" />, count: tasks.filter(t => t.status !== 'completed').length },
    { id: 'completed', label: 'Completed', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  return (
    <div className={cn(
      "h-full bg-card border-r border-border flex flex-col transition-all duration-300",
      isSidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between h-[72px]">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2 font-bold text-xl text-foreground">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span>ToDo</span>
          </div>
        )}
        {isSidebarCollapsed && (
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary mx-auto">
            <CheckSquare className="w-5 h-5" />
          </div>
        )}
        
        <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={toggleSidebar}>
          {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </Button>
      </div>

      {/* Search */}
      {!isSidebarCollapsed && (
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search tasks..." 
              className="pl-9 bg-muted/50 border-transparent hover:border-border focus-visible:ring-1 focus-visible:bg-background transition-all h-9 text-sm rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 mb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                currentView === item.id && !selectedCategoryId
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                isSidebarCollapsed && "justify-center px-0"
              )}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isSidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-xs font-medium bg-muted/80 text-foreground px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="px-3">
          {!isSidebarCollapsed && (
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Categories
            </div>
          )}
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setView('category', category.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  selectedCategoryId === category.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  isSidebarCollapsed && "justify-center px-0"
                )}
                title={isSidebarCollapsed ? category.name : undefined}
              >
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                {!isSidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{category.name}</span>
                )}
              </button>
            ))}
          </div>

          {!isSidebarCollapsed && (
            <Button variant="ghost" className="w-full justify-start mt-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" size="sm" onClick={() => setCategoryDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border flex flex-col gap-2">
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start text-muted-foreground", isSidebarCollapsed && "justify-center px-0")}
          onClick={() => setView('settings')}
          title={isSidebarCollapsed ? "Settings" : undefined}
        >
          <Settings className={cn("w-4 h-4", !isSidebarCollapsed && "mr-2")} />
          {!isSidebarCollapsed && "Settings"}
        </Button>
        
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start text-muted-foreground", isSidebarCollapsed && "justify-center px-0")}
          onClick={toggleTheme}
          title={isSidebarCollapsed ? "Toggle Theme" : undefined}
        >
          {isDark ? (
             <Sun className={cn("w-4 h-4", !isSidebarCollapsed && "mr-2")} />
          ) : (
             <Moon className={cn("w-4 h-4", !isSidebarCollapsed && "mr-2")} />
          )}
          {!isSidebarCollapsed && (isDark ? "Light Mode" : "Dark Mode")}
        </Button>
      </div>

      <CategoryDialog isOpen={isCategoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} />
    </div>
  );
};
