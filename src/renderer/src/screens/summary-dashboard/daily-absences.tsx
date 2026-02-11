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
  useDailyAbsencesQuery,
  useDailyAbsencesExportQuery
} from '@renderer/hooks/queries/useDashboardStatistics'
import { format } from 'date-fns'
import { DailyAbsencesPDF } from '@renderer/reports/models/DailyAbsencesPDF'

export const DailyAbsences: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)

  const { center } = useCenter()
  const { user } = useAuth()
  const { setSelectedSchoolYear } = useSchoolYear()

  const { data: currentSchoolYear, isLoading: isLoadingSchoolYear } = useCurrentSchoolYearQuery(
    center?._id
  )

  const { data: absencesData, isLoading: isLoadingAbsences } = useDailyAbsencesQuery(
    center?._id,
    currentSchoolYear?._id,
    currentPage
  )

  const { refetch: refetchExport } = useDailyAbsencesExportQuery(
    center?._id,
    currentSchoolYear?._id
  )

  const totalPages = useMemo(() => {
    if (!absencesData?.total) return 1
    return Math.ceil(absencesData.total)
  }, [absencesData?.total])

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
        <DailyAbsencesPDF data={result} center={center} user={user} />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `faltas-diarias-${center.documentCode}-${new Date().toLocaleDateString()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao gerar o PDF:', error)
      throw error
    } finally {
      setIsLoadingPDF(false)
    }
  }

  const absencesList = absencesData?.absences ?? null
  const isLoading = isLoadingSchoolYear || isLoadingAbsences

  return (
    <Layout>
      <h2 className="text-3xl text-zinc-400 mb-4">Faltas Diárias</h2>
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
                Data
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Justificada
              </th>
              <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                Tópico
              </th>
            </tr>
          </thead>

          <tbody className="block md:table-row-group">
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <ContentLoader />
                </td>
              </tr>
            ) : absencesList ? (
              absencesList.map((row, index) => (
                <tr key={index} className="bg-zinc-800 border border-zinc-700 block md:table-row">
                  <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                    {row?.enrollmentId?.studentId?.studentCode}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                    {row?.enrollmentId?.studentId?.name.fullName}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    {row?.enrollmentId?.classId?.className}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    {format(new Date(row?.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    <span
                      className={`px-2 py-1 rounded text-xs ${row?.isJustified ? 'bg-green-700' : 'bg-red-700'}`}
                    >
                      {row?.isJustified ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                    {row?.topic || 'N/A'}
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
