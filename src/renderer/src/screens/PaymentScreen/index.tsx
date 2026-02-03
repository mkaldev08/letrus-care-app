import React, { useEffect, useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { Sidebar } from '@renderer/components/Sidebar'
import { useNavigate } from 'react-router'
import { IPaymentForShow } from '@renderer/services/payment-service'
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
import { usePaymentsQuery, usePaymentQuery } from '@renderer/hooks/queries/usePaymentQueries'
import { useDebounce } from 'use-debounce'
import { PaymentTable } from './components/PaymentTable'
import { SearchBar } from '@renderer/components/shared/SearchBar'
import { PageHeader } from '@renderer/components/shared/PageHeader'

const schemaStudentSearch = yup
  .object({
    studentSearch: yup.string()
  })
  .required()

type FormSearchData = yup.InferType<typeof schemaStudentSearch>

export const PaymentScreen: React.FC = () => {
  // Hooks
  const navigate = useNavigate()
  const { center } = useCenter()
  const { register, watch } = useForm<FormSearchData>({
    resolver: yupResolver(schemaStudentSearch)
  })

  // State
  const studentSearch = watch('studentSearch') || ''
  const [debouncedSearch] = useDebounce(studentSearch, 500)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | undefined>(undefined)
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)

  // Queries
  const { data, isLoading } = usePaymentsQuery(center?._id, currentPage, debouncedSearch)
  const { data: paymentData } = usePaymentQuery(selectedPaymentId)

  // Handlers
  const handleDownloadPDF = async (payment: IPaymentForShow): Promise<void> => {
    setSelectedPaymentId(payment._id)
  }

  // Effect to generate PDF when payment data is fetched
  useEffect(() => {
    if (paymentData) {
      const generatePDF = async (): Promise<void> => {
        try {
          setIsLoadingPDF(true)
          const year = await getCurrentSchoolYearService(center?._id as string)

          const blob = await pdf(
            <PaymentPDF
              selectedPayment={{
                payment: paymentData.payment,
                receipt: paymentData.receipt
              }}
              center={center as ICenter}
              schoolYear={year.description}
            />
          ).toBlob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `recibo-pagamento-${
            paymentData.payment?.enrollmentId?.studentId?.name?.surname
              ? paymentData.payment?.enrollmentId?.studentId?.name?.surname?.toLowerCase()
              : paymentData.payment?.enrollmentId?.studentId?.name?.fullName
                  ?.split(' ')
                  ?.pop()
                  ?.toLowerCase()
          }-${Date.now()}.pdf`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        } catch (error) {
          console.error('PDF Generation Error', error)
        } finally {
          setSelectedPaymentId(undefined)
          setIsLoadingPDF(false)
        }
      }

      generatePDF()
    }
  }, [paymentData, center])

  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <PageHeader
              title="Pagamentos"
              description="Mantém controlo das contribuições dos alunos"
              actionLabel="Novo Pagamento"
              onActionClick={() => navigate('/payments/new')}
            />

            <SearchBar
              register={register}
              fieldName="studentSearch"
              placeholder="Buscar por aluno ou código..."
            />

            <PaymentTable
              payments={data?.payments}
              isLoading={isLoading}
              isLoadingPDF={isLoadingPDF}
              onDownloadPDF={handleDownloadPDF}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPayments ?? 1}
              onPageChange={setCurrentPage}
            />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
