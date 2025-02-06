import { cn } from '@/lib/utils'
import { SpinnerIcon } from '@/icons/spinner-icon'

type SpinnerProps = {
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Spinner = ({ color, size = 'md', className }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div role="status" className={cn('relative', className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <SpinnerIcon
          className={cn(
            sizeClasses[size],
            'animate-spin',
            'text-primary/20 dark:text-primary/10',
            'fill-primary dark:fill-primary-foreground'
          )}
        />
      </div>
    </div>
  )
}
