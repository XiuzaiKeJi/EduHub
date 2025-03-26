import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/index'

const cardVariants = cva(
  'rounded-lg shadow-sm',
  {
    variants: {
      bordered: {
        true: 'border border-gray-200',
        false: 'border-0'
      }
    },
    defaultVariants: {
      bordered: true
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  isLoading?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, bordered, children, isLoading, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ bordered }), className)}
        {...props}
      >
        {isLoading ? (
          <div className="p-4">
            <div 
              role="status"
              aria-label="加载中"
              className="animate-pulse space-y-4"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <div className="px-4 py-3 border-b border-gray-200">
    <h3
      ref={ref}
      className={cn('text-lg font-medium text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  </div>
))
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-4', className)}
    {...props}
  >
    {children}
  </div>
))
CardContent.displayName = 'CardContent'

const CardCover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-t-lg overflow-hidden', className)}
    {...props}
  >
    {children}
  </div>
))
CardCover.displayName = 'CardCover'

const CardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t border-gray-200 px-4 py-3 flex items-center space-x-4', className)}
    {...props}
  >
    {children}
  </div>
))
CardActions.displayName = 'CardActions'

export { CardTitle, CardContent, CardCover, CardActions }
export default Card 