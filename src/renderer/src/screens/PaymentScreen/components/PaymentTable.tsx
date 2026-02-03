import React from 'react'
import { DownloadCloud } from 'lucide-react'
import { TailSpin } from 'react-loader-spinner'
import { IPaymentForShow } from '@renderer/services/payment-service'
import { formateCurrency, formatNormaleDate } from '@renderer/utils/format'
import { ContentLoader } from '@renderer/components/ContentLoader'

interface PaymentTableProps {
  payments: IPaymentForShow[] | undefined
  isLoading: boolean
  isLoadingPDF: boolean
  onDownloadPDF: (payment: IPaymentForShow) => void
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  isLoading,
  isLoadingPDF,
  onDownloadPDF
}) => {
  const STATUS = ['Pago', 'Pendente', 'Atrasado']

  if (isLoading) {
    return <ContentLoader />
  }

  if (!payments || payments.length === 0) {
    return <div className="p-4 text-center text-zinc-400">Nenhum pagamento encontrado.</div>
  }

  return (
    <div className="overflow-x-auto mt-4 shadow-md">
      <table className="w-full text-sm text-center">
        <thead className="text-xs uppercase">
          <tr className="text-white font-bold bg-orange-800">
            <th className="py-3 px-4">Aluno</th>
            <th className="py-3 px-4">Código</th>
            <th className="py-3 px-4">Valor</th>
            <th className="py-3 px-4">Mês</th>
            <th className="py-3 px-4">Ano</th>
            <th className="py-3 px-4">Data de Pagamento</th>
            <th className="py-3 px-4">Estado</th>
            <th className="py-3 px-4">Ações</th>
          </tr>
        </thead>
        <tbody className="select-none">
          {payments.map((payment, index) => (
            <tr
              key={payment._id || index}
              className={`border-b ${index % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-800'} text-white border-zinc-600 hover:bg-zinc-700/50 transition-colors`}
            >
              <td className="py-3 px-4 text-center">
                {payment.enrollmentId?.studentId?.name?.surname
                  ? payment.enrollmentId?.studentId?.name?.surname
                  : payment.enrollmentId?.studentId?.name?.fullName?.split(' ')?.pop()}
              </td>
              <td className="py-3 px-4 text-center">
                {payment.enrollmentId?.studentId?.studentCode}
              </td>
              <td className="py-3 px-4 text-center">{formateCurrency(payment?.amount)}</td>
              <td className="py-3 px-4 text-center">{payment?.paymentMonthReference}</td>
              <td className="py-3 px-4 text-center">{payment?.paymentYearReference}</td>
              <td className="py-3 px-4 text-center">
                {formatNormaleDate(payment.paymentDate as Date)}
              </td>
              <td
                className={`py-3 px-4 text-center ${
                  payment?.status === 'paid'
                    ? 'text-green-500'
                    : payment?.status === 'pending'
                      ? 'text-orange-600'
                      : 'text-red-600'
                }`}
              >
                {payment.status === 'paid'
                  ? STATUS[0]
                  : payment.status === 'pending'
                    ? STATUS[1]
                    : STATUS[2]}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onDownloadPDF(payment)}
                  className="bg-orange-200 text-orange-700 px-2 py-1 rounded hover:brightness-125 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoadingPDF}
                  title="Baixar recibo"
                >
                  {isLoadingPDF ? (
                    <TailSpin width={18} height={18} color="#c2410c" />
                  ) : (
                    <DownloadCloud size={18} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
