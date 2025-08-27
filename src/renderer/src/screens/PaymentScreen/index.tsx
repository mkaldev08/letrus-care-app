import React, { useEffect, useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { Sidebar } from '@renderer/components/Sidebar'
import { useNavigate } from 'react-router'
import {
  getAllPaymentsService,
  getPaymentService,
  IPaymentForShow,
  IPaymentReceipt,
  searchPaymentsService
} from '@renderer/services/payment-service'
import { formateCurrency, formatNormaleDate } from '@renderer/utils/format'
import { DownloadCloud, Filter, Search } from 'lucide-react'
import { Header } from '@renderer/components/Header'
import { useCenter } from '@renderer/contexts/center-context'
import Pagination from '@renderer/components/Pagination'
import { pdf } from '@react-pdf/renderer'
import { PaymentPDF } from '@renderer/reports/models/PaymentPDF'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { getCurrentSchoolYearService } from '@renderer/services/school-year-service'
import { ICenter } from '@renderer/services/center-service'

const schemaStudentSearch = yup
  .object({
    studentSearch: yup.string().required('Preencha o campo para pesquisar um aluno')
  })
  .required()

type FormSearchData = yup.InferType<typeof schemaStudentSearch>

export const PaymentScreen: React.FC = () => {
  const navigate = useNavigate()

  const { register, watch } = useForm<FormSearchData>({
    resolver: yupResolver(schemaStudentSearch)
  })

  const [filteredPayments, setFilteredPayments] = useState<IPaymentForShow[]>([])
  const { center } = useCenter()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPayments = async (page: number): Promise<void> => {
    try {
      const data = await getAllPaymentsService(center?._id as string, page)
      setFilteredPayments(data.payments)
      setTotalPages(data.totalPayments)
    } catch (error) {
      console.error('Erro ao obter pagamentos:', error)
    }
  }

  // Obtém todos os pagamentos
  useEffect(() => {
    fetchPayments(currentPage)
  }, [currentPage])

  interface selectedPaymentProps {
    payment: IPaymentForShow
    receipt: IPaymentReceipt
  }
  const [selectedPayment, setSelectedPayment] = useState<selectedPaymentProps | null>(null)

  const handleDownloadPDF = async (payment: IPaymentForShow): Promise<void> => {
    const tmpPayment: React.SetStateAction<selectedPaymentProps> = await getPaymentService(
      payment?._id as string
    )

    setSelectedPayment(tmpPayment)
  }

  useEffect(() => {
    if (selectedPayment) {
      const generatePDF = async (): Promise<void> => {
        const year = await getCurrentSchoolYearService(center?._id as string)

        const blob = await pdf(
          <PaymentPDF
            selectedPayment={{
              payment: selectedPayment?.payment,
              receipt: selectedPayment?.receipt
            }}
            center={center as ICenter}
            schoolYear={year.description}
          />
        ).toBlob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `recibo-pagamento-${
          selectedPayment?.payment?.enrollmentId?.studentId?.name?.surname
            ? selectedPayment?.payment?.enrollmentId?.studentId?.name?.surname?.toLowerCase()
            : selectedPayment?.payment?.enrollmentId?.studentId?.name?.fullName
                ?.split(' ')
                ?.pop()
                ?.toLowerCase()
        }-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setSelectedPayment(null)
      }

      generatePDF()
    }
  }, [selectedPayment])

  const STATUS = ['Pago', 'Pendente', 'Atrasado']

  const studentSearch = watch('studentSearch')

  const fetchSearchedPayments = async (query: string): Promise<void> => {
    if (!query) {
      fetchPayments(currentPage)
      return
    }

    try {
      const payments = await searchPaymentsService(center?._id as string, query)
      setFilteredPayments(payments)
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSearchedPayments(studentSearch)
    }, 500)

    return (): void => clearTimeout(delayDebounceFn)
  }, [studentSearch])

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl text-zinc-400">Pagamentos</h2>
                <p className="text-zinc-600 mt-1">Mantém controlo das contribuições dos alunos</p>
              </div>
              <button
                onClick={() => navigate('/payments/new')}
                className="bg-orange-700 text-white px-4 py-2 rounded hover:brightness-110 transition-all"
              >
                Novo Pagamento
              </button>
            </div>

            {/* Barra de Busca */}
            <div className="flex items-center gap-3 mt-6">
              <Search className="text-zinc-500" />
              <input
                {...register('studentSearch')}
                type="search"
                placeholder="Buscar por aluno ou código..."
                className="flex-1 p-2 rounded-md border border-gray-400 bg-zinc-300 text-gray-700 placeholder:text-gray-700"
              />
              <Filter
                className="text-zinc-500 cursor-pointer hover:opacity-90 transition-opacity"
                xlinkTitle="filtrar por"
              />
            </div>

            {/* Tabela de Pagamentos */}
            <div className="overflow-x-auto mt-4 shadow-md">
              <table className="w-full text-sm text-center">
                <thead className="text-xs uppercase">
                  <tr className=" text-white font-bold bg-orange-800">
                    <th className="py-3 px-4">Aluno</th>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4">Mês</th>
                    <th className="py-3 px-4">Ano</th>
                    <th className="py-3 px-4">Data de Pagamento</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Acções</th>
                  </tr>
                </thead>
                <tbody className="select-none">
                  {filteredPayments?.length > 0 ? (
                    filteredPayments.map((payment, index) => (
                      <tr
                        key={index}
                        className={`border-b ${index % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-800'} text-white border-zinc-600`}
                      >
                        <td className="py-3 px-4 text-center">
                          {payment.enrollmentId?.studentId?.name?.surname
                            ? payment.enrollmentId?.studentId?.name?.surname
                            : payment.enrollmentId?.studentId?.name?.fullName?.split(' ')?.pop()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {payment.enrollmentId?.studentId?.studentCode}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {formateCurrency(payment?.amount)}
                        </td>
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
                            onClick={() => handleDownloadPDF(payment)}
                            className="bg-orange-200 text-orange-700 px-2 py-1 rounded hover:brightness-125"
                          >
                            <DownloadCloud />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-zinc-800 text-white">
                      <td colSpan={8} className="py-3 px-4 text-center">
                        Nenhum pagamento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
