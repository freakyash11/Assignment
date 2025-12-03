import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface QuickAddProps {
  onAdd: (title: string) => void;
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg border bg-background
          transition-all duration-200
          ${isFocused ? 'border-primary shadow-sm' : 'border-border/50'}
        `}
      >
        <Plus className="w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Add a quick task..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="border-0 p-0 h-auto text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-muted-foreground bg-muted rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </form>
  );
}
