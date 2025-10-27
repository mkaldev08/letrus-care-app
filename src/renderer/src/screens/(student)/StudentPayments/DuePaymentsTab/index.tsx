import Pagination from '@renderer/components/Pagination'
import { IFinancialPlanToShow } from '@renderer/services/financial-plan-services'
import { formateCurrency, formatNormaleDate } from '@renderer/utils/format'
import React, { useState } from 'react'

export const DuePaymentsTab: React.FC<{ data: IFinancialPlanToShow[] }> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(1)
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
          {data?.length > 0 ? (
            data.map((payment, index) => (
              <tr
                key={index}
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
