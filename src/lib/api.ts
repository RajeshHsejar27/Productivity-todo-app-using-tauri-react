import Database from "@tauri-apps/plugin-sql";
import { Task, Category, Settings } from "../types";

let db: Database | null = null;

export const getDb = async () => {
  if (!db) {
    db = await Database.load("sqlite:todotracker.db");
  }
  return db;
};

export const api = {
  // Tasks
  getTasks: async (): Promise<Task[]> => {
    const database = await getDb();
    const tasks = await database.select<Task[]>("SELECT * FROM tasks ORDER BY sort_order ASC, due_date ASC");
    // SQLite boolean mapping (0/1 to false/true)
    return tasks.map(t => ({
      ...t,
      is_pinned: Boolean(t.is_pinned),
      reminder_enabled: Boolean(t.reminder_enabled)
    }));
  },
  
  createTask: async (task: Omit<Task, 'created_at' | 'updated_at'>): Promise<void> => {
    const database = await getDb();
    await database.execute(
      `INSERT INTO tasks (id, title, description, due_date, priority, status, category_id, is_pinned, completed_at, sort_order, reminder_enabled) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        task.id, task.title, task.description, task.due_date, task.priority, task.status,
        task.category_id, task.is_pinned ? 1 : 0, task.completed_at, task.sort_order, task.reminder_enabled ? 1 : 0
      ]
    );
  },

  updateTask: async (task: Task): Promise<void> => {
    const database = await getDb();
    await database.execute(
      `UPDATE tasks SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, 
       category_id = $6, is_pinned = $7, completed_at = $8, sort_order = $9, reminder_enabled = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11`,
      [
        task.title, task.description, task.due_date, task.priority, task.status,
        task.category_id, task.is_pinned ? 1 : 0, task.completed_at, task.sort_order, task.reminder_enabled ? 1 : 0, task.id
      ]
    );
  },

  deleteTask: async (id: string): Promise<void> => {
    const database = await getDb();
    await database.execute("DELETE FROM tasks WHERE id = $1", [id]);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const database = await getDb();
    return await database.select<Category[]>("SELECT * FROM categories");
  },

  createCategory: async (category: Category): Promise<void> => {
    const database = await getDb();
    await database.execute(
      "INSERT INTO categories (id, name, color) VALUES ($1, $2, $3)",
      [category.id, category.name, category.color]
    );
  },

  updateCategory: async (category: Category): Promise<void> => {
    const database = await getDb();
    await database.execute(
      "UPDATE categories SET name = $1, color = $2 WHERE id = $3",
      [category.name, category.color, category.id]
    );
  },

  deleteCategory: async (id: string): Promise<void> => {
    const database = await getDb();
    await database.execute("DELETE FROM categories WHERE id = $1", [id]);
  },

  // Settings
  getSettings: async (): Promise<Record<string, string>> => {
    const database = await getDb();
    const rows = await database.select<Settings[]>("SELECT * FROM settings");
    return rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
  },

  saveSetting: async (key: string, value: string): Promise<void> => {
    const database = await getDb();
    await database.execute(
      "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = $2",
      [key, value]
    );
  },

  importData: async (tasks: Task[], categories: Category[]): Promise<void> => {
    const database = await getDb();
    
    for (const c of categories) {
      await database.execute(
        "INSERT INTO categories (id, name, color) VALUES ($1, $2, $3) ON CONFLICT(id) DO UPDATE SET name = $2, color = $3",
        [c.id, c.name, c.color]
      );
    }
    
    for (const t of tasks) {
      await database.execute(
        `INSERT INTO tasks (id, title, description, due_date, priority, status, category_id, is_pinned, completed_at, sort_order, reminder_enabled) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT(id) DO UPDATE SET 
         title = $2, description = $3, due_date = $4, priority = $5, status = $6, 
         category_id = $7, is_pinned = $8, completed_at = $9, sort_order = $10, reminder_enabled = $11`,
        [
          t.id, t.title, t.description, t.due_date, t.priority, t.status,
          t.category_id, t.is_pinned ? 1 : 0, t.completed_at, t.sort_order, t.reminder_enabled ? 1 : 0
        ]
      );
    }
  }
};
