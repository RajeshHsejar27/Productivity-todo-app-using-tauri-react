import React, { useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useCategoryStore } from '../../store/categoryStore';
import { TaskPriority } from '../../types';
import { Checkbox } from '../ui/checkbox';
import { cn } from '../../lib/utils';
import { MoreHorizontal, Plus, CheckSquare } from 'lucide-react';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { format } from 'date-fns';
import { TaskEditorDialog } from './TaskEditorDialog';
import { Task } from '../../types';

interface TaskListProps {
  filter: 'overview' | 'today' | 'upcoming' | 'all' | 'completed' | 'category';
  categoryId?: string | null;
  searchQuery?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ filter, categoryId, searchQuery }) => {
  const { tasks, toggleTaskStatus, deleteTask } = useTaskStore();
  const { categories } = useCategoryStore();
  
  // New task input state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { addTask } = useTaskStore();

  let filteredTasks = tasks;

  if (searchQuery) {
    filteredTasks = filteredTasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (filter === 'today') {
    filteredTasks = filteredTasks.filter(t => t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString());
  } else if (filter === 'completed') {
    filteredTasks = filteredTasks.filter(t => t.status === 'completed');
  } else if (filter === 'category' && categoryId) {
    filteredTasks = filteredTasks.filter(t => t.category_id === categoryId);
  } else if (filter === 'overview') {
    filteredTasks = filteredTasks.slice(0, 10); // Show recent 10 tasks on overview
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await addTask({
      title: newTaskTitle.trim(),
      description: null,
      due_date: filter === 'today' ? new Date().toISOString() : null,
      priority: 'medium',
      status: 'pending',
      category_id: categoryId || null,
      is_pinned: false,
      completed_at: null,
      sort_order: tasks.length,
      reminder_enabled: false
    });
    setNewTaskTitle('');
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch(priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-emerald-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <CheckSquare className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-medium text-foreground">No tasks found</p>
            <p className="text-sm mt-1">Get started by creating a new task.</p>
          </div>
        )}
        <div className="space-y-1.5">
          {filteredTasks.map((task) => {
            const category = categories.find(c => c.id === task.category_id);
            return (
              <div 
                key={task.id} 
                onDoubleClick={() => setEditingTask(task)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors cursor-default",
                  task.status === 'completed' && "opacity-60 bg-muted/20"
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Checkbox 
                    checked={task.status === 'completed'} 
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                    className="w-5 h-5 rounded-full border-muted-foreground/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                      "text-sm font-medium truncate transition-all",
                      task.status === 'completed' && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-xs text-muted-foreground truncate">{task.description}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {category && (
                    <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-muted-foreground">{category.name}</span>
                    </div>
                  )}

                  <div className="hidden md:flex items-center gap-1.5 text-xs">
                    <div className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))} />
                    <span className="text-muted-foreground capitalize">{task.priority}</span>
                  </div>

                  {task.due_date && (
                    <span className="text-xs text-muted-foreground hidden md:inline-block">
                      {format(new Date(task.due_date), 'h:mm a')}
                    </span>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTask(task)}>Edit Task</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteTask(task.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filter !== 'completed' && filter !== 'overview' && (
        <div className="p-4 border-t border-border mt-auto bg-muted/10">
          <form onSubmit={handleCreateTask} className="relative flex items-center">
            <Plus className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Add task quickly..." 
              className="pl-9 bg-background border-border hover:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary transition-all shadow-sm rounded-lg"
              value={newTaskTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
            />
          </form>
        </div>
      )}
      
      <TaskEditorDialog 
        task={editingTask} 
        isOpen={!!editingTask} 
        onClose={() => setEditingTask(null)} 
      />
    </div>
  );
};
