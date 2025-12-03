import { cn } from '@/lib/utils';

type FilterValue = 'all' | 'todo' | 'done';

interface FilterTabsProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  counts: { all: number; todo: number; done: number };
}

const tabs: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To do' },
  { value: 'done', label: 'Done' },
];

export function FilterTabs({ value, onChange, counts }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
            value === tab.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.label}
          <span
            className={cn(
              'text-xs px-1.5 py-0.5 rounded-full',
              value === tab.value
                ? 'bg-primary/10 text-primary'
                : 'bg-background/50 text-muted-foreground'
            )}
          >
            {counts[tab.value]}
          </span>
        </button>
      ))}
    </div>
  );
}
