import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useCategoryStore } from '../../store/categoryStore';

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export const CategoryDialog: React.FC<CategoryDialogProps> = ({ isOpen, onClose }) => {
  const { addCategory } = useCategoryStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleSave = async () => {
    if (!name.trim()) return;
    await addCategory(name.trim(), color);
    setName('');
    setColor(PRESET_COLORS[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Category Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Finance, Health" 
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-offset-background' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c, outlineColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>Add Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
