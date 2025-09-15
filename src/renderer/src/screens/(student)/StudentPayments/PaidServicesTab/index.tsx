import Pagination from '@renderer/components/Pagination'
import { useCenter } from '@renderer/contexts/center-context'
import { IPaymentForShow } from '@renderer/services/payment-service'
import { formateCurrency, formatNormaleDate } from '@renderer/utils/format'
import React, { useState } from 'react'

export const PaidServicesTab: React.FC = () => {
  const [filteredPayments, setFilteredPayments] = useState<IPaymentForShow[]>([])
  const { center } = useCenter()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
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
            <th className="py-3 px-4">Valor</th>
          </tr>
        </thead>
        <tbody className="select-none">
          {filteredPayments?.length > 0 ? (
            filteredPayments.map((payment, index) => (
              <tr
                key={index}
                className={`border-b ${index % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-800'} text-white border-zinc-600`}
              >
                <td className="py-3 px-4 text-center">Propina</td>
                <td className="py-3 px-4 text-center">{'N/A'}</td>
                <td className="py-3 px-4 text-center">{formateCurrency(payment?.amount)}</td>

                <td className="py-3 px-4 text-center">
                  {formatNormaleDate(payment.paymentDate as Date)}
                </td>
                <td className="py-3 px-4 text-center">
                  {formatNormaleDate(payment.paymentDate as Date)}
                </td>
                <td className="py-3 px-4 text-center">{formateCurrency(payment?.amount)}</td>
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
