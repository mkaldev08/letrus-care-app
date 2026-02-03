import Pagination from '@renderer/components/Pagination'
import { ContentLoader } from '@renderer/components/ContentLoader'
import { IFinancialPlanToShow } from '@renderer/services/financial-plan-services'
import { formateCurrency, formatNormaleDate } from '@renderer/utils/format'
import React, { useEffect, useMemo, useState } from 'react'

interface DuePaymentsTabProps {
  data: IFinancialPlanToShow[]
  isLoading?: boolean
}

export const DuePaymentsTab: React.FC<DuePaymentsTabProps> = ({ data, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
  }, [data, currentPage])
  if (isLoading) {
    return <ContentLoader />
  }

  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-zinc-400">Nenhuma dívida encontrada.</div>
  }

  return (
    <div className="overflow-x-auto shadow-md">
      <table className="w-full text-sm text-center">
        <thead className="text-xs uppercase">
          <tr className=" text-white font-bold bg-orange-800">
            <th className="py-3 px-4">Serviço</th>
            <th className="py-3 px-4">Descrição</th>
            <th className="py-3 px-4">Referência</th>
            <th className="py-3 px-4">Data de Limite</th>
            <th className="py-3 px-4">Mensalidade (sem multa)</th>
            <th className="py-3 px-4">Estado</th>
          </tr>
        </thead>
        <tbody className="select-none">
          {paginatedData.map((payment, index) => (
            <tr
              key={payment._id || index}
              className={`border-b ${index % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-800'} text-white border-zinc-600`}
            >
              <td className="py-3 px-4 text-center">Propina</td>
              <td className="py-3 px-4 text-center">
                {payment.month}/{payment.year}
              </td>
              <td className="py-3 px-4 text-center">
                {payment?.month}/{payment?.year}
              </td>

              <td className="py-3 px-4 text-center">{formatNormaleDate(payment.dueDate)}</td>
              <td className="py-3 px-4 text-center">{formateCurrency(payment.tutionFee)}</td>
              <td
                className={`py-3 px-4 text-center ${
                  payment?.status === 'overdue' ? 'text-red-500' : 'text-yellow-500'
                }`}
              >
                {payment?.status === 'overdue' ? 'Em atraso' : 'Por pagar sem multa'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}
