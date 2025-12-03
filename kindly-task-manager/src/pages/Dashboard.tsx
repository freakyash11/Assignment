import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QuickAdd } from '@/components/tasks/QuickAdd';
import { FilterTabs } from '@/components/tasks/FilterTabs';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { UndoSnackbar } from '@/components/tasks/UndoSnackbar';
import { useTasks } from '@/hooks/useTasks';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');
  const {
    tasks,
    deletedTask,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    undoDelete,
    toggleStatus,
    clearDeletedTask,
  } = useTasks();

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const handleQuickAdd = async (title: string) => {
    try {
      await addTask({
        title,
        description: '',
        tags: [],
        status: 'todo',
      });
      toast({
        title: 'Saved — your task is ready.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add task',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (id: string, updates: any) => {
    try {
      await updateTask(id, updates);
      toast({
        title: 'Task updated.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setSelectedTaskId(null);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load tasks</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="flex">
        {/* Main content */}
        <main className="flex-1 p-6 lg:pr-0">
          <div className="max-w-2xl mx-auto lg:mx-0 space-y-6">
            {/* Welcome */}
            <div>
              <h1 className="text-2xl font-medium">Welcome back.</h1>
              <p className="text-muted-foreground mt-1">
                {counts.todo === 0
                  ? "You're all caught up!"
                  : `You have ${counts.todo} task${counts.todo === 1 ? '' : 's'} to complete.`}
              </p>
            </div>

            {/* Quick add */}
            <QuickAdd onAdd={handleQuickAdd} />

            {/* Filter tabs */}
            <FilterTabs value={filter} onChange={setFilter} counts={counts} />

            {/* Task list */}
            <TaskList
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={setSelectedTaskId}
              onToggleTask={handleToggleStatus}
              filter={filter}
            />
          </div>
        </main>

        {/* Detail panel (desktop) */}
        <aside
          className={`
            hidden lg:block w-[400px] border-l border-border/50 bg-card/30 h-[calc(100vh-4rem)] sticky top-16
            transition-all duration-300
            ${selectedTaskId ? 'opacity-100' : 'opacity-50'}
          `}
        >
          <TaskDetail
            task={selectedTask}
            onClose={() => setSelectedTaskId(null)}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            onToggle={handleToggleStatus}
          />
        </aside>

        {/* Detail panel (mobile overlay) */}
        {selectedTaskId && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background animate-fade-in">
            <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
              <h2 className="font-medium">Task Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTaskId(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="h-[calc(100vh-4rem)]">
              <TaskDetail
                task={selectedTask}
                onClose={() => setSelectedTaskId(null)}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleStatus}
              />
            </div>
          </div>
        )}
      </div>

      {/* Undo snackbar */}
      <UndoSnackbar
        isVisible={!!deletedTask}
        message="Task deleted."
        onUndo={() => {
          undoDelete();
          toast({ title: 'Task restored.' });
        }}
        onDismiss={clearDeletedTask}
      />
    </div>
  );
}