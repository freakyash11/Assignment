import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}

export function TaskItem({ task, isSelected, onSelect, onToggle }: TaskItemProps) {
  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isDuePast = task.dueDate && isPast(new Date(task.dueDate)) && task.status === 'todo';

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group p-4 rounded-lg border cursor-pointer transition-all duration-200',
        isSelected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-transparent hover:bg-accent/50',
        task.status === 'done' && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.status === 'done'}
          onCheckedChange={() => onToggle()}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 transition-all duration-200"
        />
        
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'font-medium text-foreground leading-snug',
              task.status === 'done' && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </p>
          
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {task.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs',
                  isDuePast ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                <Calendar className="w-3 h-3" />
                {formatDueDate(task.dueDate)}
              </span>
            )}
            
            {task.tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                {task.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{task.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
