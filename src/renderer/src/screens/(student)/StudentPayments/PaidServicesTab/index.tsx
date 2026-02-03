import Pagination from '@renderer/components/Pagination'
import { ContentLoader } from '@renderer/components/ContentLoader'
import { IFinancialPlanToShow } from '@renderer/services/financial-plan-services'
import { formateCurrency, formatNormaleDate } from '@renderer/utils/format'
import React, { useEffect, useMemo, useState } from 'react'

interface PaidServicesTabProps {
  data: IFinancialPlanToShow[]
  isLoading?: boolean
}

export const PaidServicesTab: React.FC<PaidServicesTabProps> = ({ data, isLoading }) => {
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
    return <div className="p-4 text-center text-zinc-400">Nenhum pagamento encontrado.</div>
  }

  return (
    <div className="overflow-x-auto shadow-md">
      <table className="w-full text-sm text-center">
        <thead className="text-xs uppercase">
          <tr className=" text-white font-bold bg-orange-800">
            <th className="py-3 px-4">Serviço</th>
            <th className="py-3 px-4">Descrição</th>
            <th className="py-3 px-4">Multa</th>
            <th className="py-3 px-4">Data de Pagamento</th>
            <th className="py-3 px-4">Referência</th>
            <th className="py-3 px-4">Mensalidade</th>
            <th className="py-3 px-4">Total Pago</th>
          </tr>
        </thead>
        <tbody className="select-none">
          {paginatedData.map((data, index) => (
            <tr
              key={data._id || index}
              className={`border-b ${index % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-800'} text-white border-zinc-600`}
            >
              <td className="py-3 px-4 text-center">Propina</td>
              <td className="py-3 px-4 text-center">{data.month}</td>
              <td className="py-3 px-4 text-center">
                {formateCurrency(data?.linkedPayment?.lateFee)}
              </td>

              <td className="py-3 px-4 text-center">
                {formatNormaleDate(data?.linkedPayment?.paymentDate as Date)}
              </td>
              <td className="py-3 px-4 text-center">
                {data.month}/{data.year}
              </td>
              <td className="py-3 px-4 text-center">{formateCurrency(data?.tutionFee)}</td>
              <td className="py-3 px-4 text-center">
                {formateCurrency((data?.linkedPayment?.lateFee as number) + data?.tutionFee)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}
