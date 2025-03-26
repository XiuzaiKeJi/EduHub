import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', className = '', children, ...props }, ref) => {
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded-md',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-indigo-500',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    ]

    const variantClasses = {
      primary: ['bg-indigo-600', 'text-white', 'hover:bg-indigo-700'],
      secondary: ['bg-white', 'text-gray-700', 'border', 'border-gray-300', 'hover:bg-gray-50'],
      danger: ['bg-red-600', 'text-white', 'hover:bg-red-700'],
    }

    const sizeClasses = {
      small: ['px-2', 'py-1', 'text-sm'],
      medium: ['px-4', 'py-2'],
      large: ['px-6', 'py-3', 'text-lg'],
    }

    const classes = [
      ...baseClasses,
      ...variantClasses[variant],
      ...sizeClasses[size],
      className
    ].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </button>
    )
  }
) 