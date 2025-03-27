import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

interface RetryButtonProps {
  onClick: () => void;
}

export function RetryButton({ onClick }: RetryButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-1"
    >
      <ReloadIcon className="h-4 w-4" />
      重试
    </Button>
  );
} 