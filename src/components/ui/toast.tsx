'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const toastVariants = cva(
  'fixed bottom-4 right-4 z-50 flex items-center w-auto max-w-md rounded-md shadow-lg border p-4 transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-900 border-gray-200',
        destructive: 'bg-red-50 text-red-900 border-red-100',
        success: 'bg-green-50 text-green-900 border-green-100',
        warning: 'bg-yellow-50 text-yellow-900 border-yellow-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  onClose?: () => void
}

export const Toast = React.forwardRef<
  HTMLDivElement,
  ToastProps
>(({ title, description, variant, onClose, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={toastVariants({ variant })}
      {...props}
    >
      <div className="flex-1 mr-2">
        {title && <h4 className="mb-1 font-medium text-sm">{title}</h4>}
        {description && <p className="text-xs opacity-90">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-gray-500"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">关闭</span>
        </button>
      )}
    </div>
  )
}) 