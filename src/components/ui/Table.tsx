interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  className?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (row: T) => void
  emptyMessage?: string
}

export function Table<T extends Record<string, any>>({ 
  data, 
  columns, 
  onRowClick,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column, index) => (
              <th 
                key={index}
                className="text-left py-3 px-4 text-sm font-semibold text-text-muted uppercase tracking-wide"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-border last:border-b-0
                  ${onRowClick ? 'cursor-pointer hover:bg-surface/50' : ''}
                  transition-colors
                `}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className={`py-4 px-4 text-text ${column.className || ''}`}
                  >
                    {typeof column.accessor === 'function' 
                      ? column.accessor(row)
                      : row[column.accessor]
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
