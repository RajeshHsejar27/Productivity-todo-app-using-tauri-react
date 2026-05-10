import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Task, TaskPriority } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { useCategoryStore } from '../../store/categoryStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TaskEditorDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskEditorDialog: React.FC<TaskEditorDialogProps> = ({ task, isOpen, onClose }) => {
  const { updateTask, addTask, tasks } = useTaskStore();
  const { categories } = useCategoryStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [categoryId, setCategoryId] = useState<string>('none');
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategoryId(task.category_id || 'none');
      setDueDate(task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategoryId('none');
      setDueDate('');
    }
  }, [task, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) return;

    if (task) {
      await updateTask({
        ...task,
        title: title.trim(),
        description: description.trim() || null,
        priority,
        category_id: categoryId === 'none' ? null : categoryId,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
    } else {
      await addTask({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        category_id: categoryId === 'none' ? null : categoryId,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        status: 'pending',
        is_pinned: false,
        completed_at: null,
        sort_order: tasks.length,
        reminder_enabled: false
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Task title" 
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Input 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Task description (optional)" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryId} onValueChange={(val) => setCategoryId(val || 'none')}>
                <SelectTrigger className="truncate">
                  <SelectValue placeholder="Select Category">
                    {categoryId !== 'none' ? categories.find(c => c.id === categoryId)?.name || 'None' : 'None'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Due Date</label>
            <Input 
              type="datetime-local" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
