import { DollarSign, FileDown } from 'lucide-react'
import { Layout } from './layout'
import React, { useEffect, useState } from 'react'
import { ContentLoader } from '@renderer/components/ContentLoader'
import Pagination from '@renderer/components/Pagination'
import { useCenter } from '@renderer/contexts/center-context'
import {
  getOverduePaymentsService,
  getOverduePaymentsWithoutLimitService
} from '@renderer/services/dashboard-service'
import { pdf } from '@react-pdf/renderer'
import { OverDuePaymentsPDF } from '@renderer/reports/models/OverDuePaymentsPDF'
import { Rings } from 'react-loader-spinner'
import type { TuitionPaymentResponse } from '@renderer/types/dashboard'
import { useAuth } from '@renderer/contexts/auth-context'
import { useSchoolYear } from '@renderer/contexts/school-year-context'
export const OverDuePayments: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [overduePaymentsList, setOverduePaymentList] = useState<TuitionPaymentResponse | null>(null)

  const [isLoadingPDF, setIsLoadingPDF] = useState(false)

  const { center } = useCenter()
  const { user } = useAuth()
  const { fetchCurrentSchoolYear, setSelectedSchoolYear, currentSchoolYear } = useSchoolYear()

  useEffect(() => {
    async function fetchOverduePayments(): Promise<void> {
      try {
        const current = await fetchCurrentSchoolYear(center?._id as string)
        setSelectedSchoolYear(current)
        const data = await getOverduePaymentsService(
          String(center?._id),
          String(currentSchoolYear?._id),
          currentPage
        )
        setOverduePaymentList(data.overduePayments)
        setTotalPages(Math.ceil(data.total))
      } catch (error) {
        if (process.env.NODE_ENV === 'development')
          console.error('Erro ao buscar pagamentos em atraso:', error)
        throw error
      }
    }

    fetchOverduePayments()
  }, [currentPage, center, fetchCurrentSchoolYear, setSelectedSchoolYear, currentSchoolYear?._id])

  async function handleDownloadPDF(): Promise<void> {
    setIsLoadingPDF(true)
    try {
      const result = await getOverduePaymentsWithoutLimitService(
        String(center?._id),
        String(currentSchoolYear?._id)
      )
      const blob = await pdf(
        <OverDuePaymentsPDF data={result} center={center!} user={user!} />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `propinas-em-atraso-alunos-${center!.documentCode}-${new Date().toLocaleDateString()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setIsLoadingPDF(false)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao gerar o PDF:', error)
      throw error
    } finally {
      setIsLoadingPDF(false)
    }
  }

  return (
    <Layout>
      <h2 className="text-3xl text-zinc-400 mb-4">Pagamento Atrasado</h2>
      <div className="flex justify-end gap-3">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md shadow"
        >
          {!isLoadingPDF ? (
            <span className="flex w-full items-center gap-2">
              <FileDown size={16} /> Exportar PDF
            </span>
          ) : (
            <Rings height="32" width="32" color="#fff" ariaLabel="bars-loading" visible={true} />
          )}
        </button>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border-collapse block md:table">
          <thead className="block md:table-header-group">
            <tr className="block border border-zinc-700 md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Nº de Inscrição
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Nome Completo
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Turma
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Mês/Ano
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Acções
              </th>
            </tr>
          </thead>

          <tbody className="block md:table-row-group">
            {overduePaymentsList ? (
              overduePaymentsList.map((row, index) => (
                <tr key={index} className="bg-zinc-800 border border-zinc-700 block md:table-row">
                  <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                    {row?.enrollmentId.studentId?.studentCode}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                    {row?.enrollmentId.studentId?.name.fullName}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    {row?.enrollmentId.classId?.className}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    {row?.month}/{row?.year}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    <div className="flex items-center justify-evenly gap-1">
                      <button className="flex gap-2 bg-green-700 text-white px-2 py-1 rounded hover:brightness-125">
                        <DollarSign />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td rowSpan={5}>
                  <ContentLoader />
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
    </Layout>
  )
}
