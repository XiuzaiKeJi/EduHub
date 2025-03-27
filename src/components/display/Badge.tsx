interface BadgeProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export function Badge({ type = 'info', children }: BadgeProps) {
  const baseStyles = 'px-2 py-1 rounded-full text-xs font-medium';
  const typeStyles = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`${baseStyles} ${typeStyles[type]}`}>
      {children}
    </span>
  );
} 