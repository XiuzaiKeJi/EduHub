import { forwardRef } from 'react'

type Column<T> = {
  key: string
  title: string
  render?: (value: any, record: T) => React.ReactNode
  sortable?: boolean
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyText?: string
  className?: string
  onSort?: (key: string, order: 'asc' | 'desc') => void
}

const Table = forwardRef(<T extends { id: string | number }>(
  {
    columns,
    data,
    loading = false,
    emptyText = '暂无数据',
    className = '',
    onSort,
  }: TableProps<T>,
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <div ref={ref} className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`
                  px-3 py-3.5 text-left text-sm font-semibold text-gray-900
                  ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                `}
                onClick={() => column.sortable && onSort?.(column.key, 'asc')}
              >
                {column.title}
                {column.sortable && (
                  <span className="ml-2 text-gray-400">↑↓</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-4 text-sm text-center text-gray-500"
              >
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
                  <span className="ml-2">加载中...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-4 text-sm text-center text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record) => (
              <tr key={record.id}>
                {columns.map((column) => (
                  <td
                    key={`${record.id}-${column.key}`}
                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                  >
                    {column.render
                      ? column.render(record[column.key as keyof T], record)
                      : record[column.key as keyof T]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
})

Table.displayName = 'Table'

export default Table 