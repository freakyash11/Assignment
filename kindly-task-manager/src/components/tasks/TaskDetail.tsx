import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TaskDetail({ task, onClose, onUpdate, onDelete, onToggle }: TaskDetailProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setTagsInput(task.tags.join(', '));
      setDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
    }
  }, [task]);

  if (!task) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a task to view details</p>
      </div>
    );
  }

  const handleSave = () => {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onUpdate(task.id, {
      title,
      description: description || undefined,
      tags,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    });
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={task.status === 'done'}
            onCheckedChange={() => onToggle(task.id)}
          />
          <span className="text-sm text-muted-foreground">
            {task.status === 'done' ? 'Completed' : 'In progress'}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="text-lg font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleSave}
            placeholder="Add a description..."
            className="min-h-[120px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Due date
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onBlur={handleSave}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onBlur={handleSave}
            placeholder="work, urgent, personal"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete task
        </Button>
      </div>
    </div>
  );
}
