import { Task } from '@/types';
import { TaskItem } from './TaskItem';
import { Plus } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  filter: 'all' | 'todo' | 'done';
}

export function TaskList({
  tasks,
  selectedTaskId,
  onSelectTask,
  onToggleTask,
  filter,
}: TaskListProps) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Plus className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          {filter === 'all'
            ? 'No tasks yet — add your first quick task.'
            : filter === 'todo'
            ? 'All caught up! No pending tasks.'
            : 'No completed tasks yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={selectedTaskId === task.id}
          onSelect={() => onSelectTask(task.id)}
          onToggle={() => onToggleTask(task.id)}
        />
      ))}
    </div>
  );
}
