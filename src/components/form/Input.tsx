import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          error
            ? 'border-red-300 text-red-900 placeholder-red-300'
            : 'border-gray-300 placeholder-gray-400'
        } ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input'

export default Input 