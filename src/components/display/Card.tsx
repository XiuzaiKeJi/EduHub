import { forwardRef } from 'react'

type CardProps = {
  title?: React.ReactNode
  cover?: React.ReactNode
  actions?: React.ReactNode
  loading?: boolean
  className?: string
  bordered?: boolean
  children: React.ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      cover,
      actions,
      loading = false,
      className = '',
      bordered = true,
      children,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg shadow-sm
          ${bordered ? 'border border-gray-200' : ''}
          ${className}
        `}
      >
        {loading ? (
          <div className="p-4">
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="ml-2 text-sm text-gray-500">加载中...</span>
            </div>
          </div>
        ) : (
          <>
            {cover && <div className="rounded-t-lg overflow-hidden">{cover}</div>}
            {title && (
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              </div>
            )}
            <div className="p-4">{children}</div>
            {actions && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center justify-end space-x-2">
                  {actions}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card 