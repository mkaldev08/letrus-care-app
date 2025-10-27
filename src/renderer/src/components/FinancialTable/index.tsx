import React, { useState } from 'react'
import Pagination from '@renderer/components/Pagination'

interface Column<T> {
  key: string
  header: string
  render: (row: T) => React.ReactNode
}

interface FinancialTableProps<T> {
  data: T[]
  columns: Column<T>[]
}

export function FinancialTable<T extends object>({
  data,
  columns
}: FinancialTableProps<T>): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(1)

  return (
    <div className="overflow-x-auto shadow-md">
      <table className="w-full text-sm text-center">
        <thead className="text-xs uppercase">
          <tr className="text-white font-bold bg-orange-800">
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-4">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="select-none">
          {data?.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={index}
                className={`border-b ${index % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-800'} text-white border-zinc-600`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4 text-center">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="bg-zinc-800 text-white">
              <td colSpan={columns.length} className="py-3 px-4 text-center">
                Nenhum histórico encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}
