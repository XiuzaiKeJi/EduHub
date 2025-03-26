import React from 'react'
import { cn } from '@/lib/utils'

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, isOpen, onClose, title, footer, children, size = 'md', ...props }, ref) => {
    if (!isOpen) return null

    return (
      <div
        ref={ref}
        role="dialog"
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
          className
        )}
        onClick={onClose}
        {...props}
      >
        <div
          className={cn(
            'bg-white rounded-lg shadow-lg mx-4',
            {
              'max-w-sm': size === 'sm',
              'max-w-md': size === 'md',
              'max-w-lg': size === 'lg',
              'max-w-xl': size === 'xl',
            }
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              {title ? (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              ) : (
                <div />
              )}
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <span className="sr-only">关闭</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {children}
            {footer && (
              <div className="mt-6 flex justify-end space-x-3">{footer}</div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

export default Modal 