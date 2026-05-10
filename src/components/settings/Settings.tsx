import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { api } from '../../lib/api';

export const SettingsPanel: React.FC = () => {
  const { tasks } = useTaskStore();
  const { categories } = useCategoryStore();
  const { settings } = useSettingsStore();

  const handleExport = async () => {
    try {
      const data = {
        tasks,
        categories,
        settings,
        exportDate: new Date().toISOString()
      };
      
      const jsonStr = JSON.stringify(data, null, 2);
      
      const filePath = await save({
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }],
        defaultPath: `todo-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
      });

      if (filePath) {
        await writeTextFile(filePath, jsonStr);
        toast.success(`Backup exported successfully to ${filePath}`);
      }
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Unknown error');
      toast.error(`Failed to export backup: ${errMsg}`);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (!data.tasks || !data.categories) {
          throw new Error("Invalid backup format");
        }
        
        // Perform bulk import
        await api.importData(data.tasks, data.categories);
        
        // Reload stores
        await useCategoryStore.getState().loadCategories();
        await useTaskStore.getState().loadTasks();
        
        toast.success("Data imported successfully!");

      } catch (error) {
        toast.error("Failed to import backup");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore</CardTitle>
          <CardDescription>Export your data to a JSON file or restore from a previous backup.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
            <div>
              <h3 className="font-medium">Export Data</h3>
              <p className="text-sm text-muted-foreground">Download all your tasks, categories, and settings.</p>
            </div>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
            <div>
              <h3 className="font-medium">Import Data</h3>
              <p className="text-sm text-muted-foreground">Restore your data from a JSON backup file.</p>
            </div>
            <div className="relative">
              <Button variant="outline" className="w-32">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImport}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
