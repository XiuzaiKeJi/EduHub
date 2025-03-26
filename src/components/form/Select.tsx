import { forwardRef } from 'react'

type Option = {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = {
  label?: string
  error?: string
  options: Option[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'>

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      disabled = false,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${className}
          `}
          disabled={disabled}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select 