import React from 'react';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar will go here if needed, or inside children */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
