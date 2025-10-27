import Pagination from '@renderer/components/Pagination'
import { IFinancialPlanToShow } from '@renderer/services/financial-plan-services'
import { formateCurrency, formatNormaleDate } from '@renderer/utils/format'
import React, { useState } from 'react'

export const PaidServicesTab: React.FC<{ data: IFinancialPlanToShow[] }> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(1)
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
          {data?.length > 0 ? (
            data.map((data, index) => (
              <tr
                key={index}
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
            ))
          ) : (
            <tr className="bg-zinc-800 text-white">
              <td colSpan={8} className="py-3 px-4 text-center">
                Nenhum historico de pagamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}
