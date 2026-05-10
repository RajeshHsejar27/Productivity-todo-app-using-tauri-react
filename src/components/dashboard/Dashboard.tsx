import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { Card, CardContent } from '../ui/card';
import { CheckCircle2, Circle, ListTodo, Target } from 'lucide-react';
import { TaskList } from '../tasks/TaskList';

export const Dashboard: React.FC = () => {
  const { tasks } = useTaskStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const todayTasks = tasks.filter(t => t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString()).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const stats = [
    { label: 'Today', value: todayTasks, icon: <Target className="w-5 h-5 text-blue-500" /> },
    { label: 'Completed', value: completedTasks, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
    { label: 'Pending', value: pendingTasks, icon: <Circle className="w-5 h-5 text-amber-500" /> },
    { label: 'Progress', value: `${progress}%`, icon: <ListTodo className="w-5 h-5 text-violet-500" /> },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Let's get things done!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border shadow-sm hover:shadow-md transition-all rounded-xl">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="p-2 bg-muted rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{stat.value}</span>
                {stat.label !== 'Progress' && <span className="text-sm text-muted-foreground font-medium">tasks</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex-1 min-h-0 bg-card rounded-xl border border-border shadow-sm flex flex-col mt-2 overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
          <h2 className="font-semibold text-lg">Recent Tasks</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <TaskList filter="overview" />
        </div>
      </div>
    </div>
  );
};
