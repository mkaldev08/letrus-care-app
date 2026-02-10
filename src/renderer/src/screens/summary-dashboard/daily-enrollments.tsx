import { FileDown } from 'lucide-react'
import { Layout } from './layout'
import React, { useEffect, useMemo, useState } from 'react'
import { ContentLoader } from '@renderer/components/ContentLoader'
import Pagination from '@renderer/components/Pagination'
import { useCenter } from '@renderer/contexts/center-context'
import { pdf } from '@react-pdf/renderer'
import { Rings } from 'react-loader-spinner'
import { useAuth } from '@renderer/contexts/auth-context'
import { useSchoolYear } from '@renderer/contexts/school-year-context'
import { useCurrentSchoolYearQuery } from '@renderer/hooks/queries/useSchoolYearQueries'
import {
  useDailyEnrollmentsQuery,
  useDailyEnrollmentsExportQuery
} from '@renderer/hooks/queries/useDashboardStatistics'
import { format } from 'date-fns'
import { DailyEnrollmentsPDF } from '@renderer/reports/models/DailyEnrollmentsPDF'

export const DailyEnrollments: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)

  const { center } = useCenter()
  const { user } = useAuth()
  const { setSelectedSchoolYear } = useSchoolYear()

  const { data: currentSchoolYear, isLoading: isLoadingSchoolYear } = useCurrentSchoolYearQuery(
    center?._id
  )

  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useDailyEnrollmentsQuery(
    center?._id,
    currentSchoolYear?._id,
    currentPage
  )

  const { refetch: refetchExport } = useDailyEnrollmentsExportQuery(
    center?._id,
    currentSchoolYear?._id
  )

  const totalPages = useMemo(() => {
    if (!enrollmentsData?.total) return 1
    return Math.ceil(enrollmentsData.total)
  }, [enrollmentsData?.total])

  useEffect(() => {
    if (currentSchoolYear) {
      setSelectedSchoolYear(currentSchoolYear)
    }
  }, [currentSchoolYear, setSelectedSchoolYear])

  async function handleDownloadPDF(): Promise<void> {
    setIsLoadingPDF(true)
    try {
      if (!center?._id || !currentSchoolYear?._id || !user) {
        throw new Error('Dados obrigatórios em falta')
      }

      const { data: result } = await refetchExport()
      if (!result) {
        throw new Error('Nenhum dado retornado para exportação')
      }

      const blob = await pdf(
        <DailyEnrollmentsPDF data={result} center={center} user={user} />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inscricoes-diarias-${center.documentCode}-${new Date().toLocaleDateString()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao gerar o PDF:', error)
      throw new Error('Erro ao gerar o PDF')
    } finally {
      setIsLoadingPDF(false)
    }
  }

  const enrollmentsList = enrollmentsData?.enrollments ?? null
  const isLoading = isLoadingSchoolYear || isLoadingEnrollments

  return (
    <Layout>
      <h2 className="text-3xl text-zinc-400 mb-4">Inscrições Diárias</h2>
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
                Código do Aluno
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Nome Completo
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Turma
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Data Inscrição
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="block md:table-row-group">
            {isLoading ? (
              <tr>
                <td colSpan={5}>
                  <ContentLoader />
                </td>
              </tr>
            ) : enrollmentsList ? (
              enrollmentsList.map((row, index) => (
                <tr key={index} className="bg-zinc-800 border border-zinc-700 block md:table-row">
                  <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                    {row?.studentId?.studentCode}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                    {row?.studentId?.name.fullName}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    {row?.classId?.className}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    {format(new Date(row?.enrollmentDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        row?.status === 'completed'
                          ? 'bg-green-700'
                          : row?.status === 'enrolled'
                            ? 'bg-yellow-700'
                            : 'bg-red-700'
                      }`}
                    >
                      {row?.status === 'completed'
                        ? 'Completa'
                        : row?.status === 'enrolled'
                          ? 'Inscrito'
                          : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))
            ) : null}
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
