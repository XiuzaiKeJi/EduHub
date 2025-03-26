import { forwardRef } from 'react'

type ListItem = {
  id: string | number
  content: React.ReactNode
  actions?: React.ReactNode
}

type ListProps = {
  items: ListItem[]
  loading?: boolean
  emptyText?: string
  className?: string
  divided?: boolean
}

const List = forwardRef<HTMLDivElement, ListProps>(
  (
    {
      items,
      loading = false,
      emptyText = '暂无数据',
      className = '',
      divided = true,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        {loading ? (
          <div className="flex items-center justify-center py-4">
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
        ) : items.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            {emptyText}
          </div>
        ) : (
          <ul className={divided ? 'divide-y divide-gray-200' : ''}>
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center py-4 px-4"
              >
                <div className="flex-1">{item.content}</div>
                {item.actions && (
                  <div className="ml-4 flex items-center space-x-2">
                    {item.actions}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)

List.displayName = 'List'

export default List 