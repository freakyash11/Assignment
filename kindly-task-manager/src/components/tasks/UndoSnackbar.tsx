import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UndoSnackbarProps {
  isVisible: boolean;
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function UndoSnackbar({
  isVisible,
  message,
  onUndo,
  onDismiss,
  duration = 5000,
}: UndoSnackbarProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      setProgress(newProgress);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      } else {
        onDismiss();
      }
    };

    const animationId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, duration, onDismiss]);

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <div className="relative bg-foreground text-background px-4 py-3 rounded-lg shadow-lg flex items-center gap-4 overflow-hidden">
        <span className="text-sm">{message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          className="text-background hover:text-background hover:bg-background/20 h-auto py-1 px-2"
        >
          Undo
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="text-background hover:text-background hover:bg-background/20 h-6 w-6"
        >
          <X className="w-4 h-4" />
        </Button>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-background/20">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
