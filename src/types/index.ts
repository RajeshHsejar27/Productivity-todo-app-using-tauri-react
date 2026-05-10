export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  category_id: string | null;
  is_pinned: boolean;
  completed_at: string | null;
  sort_order: number;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  key: string;
  value: string;
}
