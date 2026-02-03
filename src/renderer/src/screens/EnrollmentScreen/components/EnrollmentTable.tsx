import React from 'react'
import { Eye, DownloadCloud, PenSquare, Trash } from 'lucide-react'
import { TailSpin } from 'react-loader-spinner'
import { IEnrollmentForShow } from '@renderer/services/enrollment-service'
import { formatDate } from '@renderer/utils/format'
import { ContentLoader } from '@renderer/components/ContentLoader'

interface EnrollmentTableProps {
  enrollments: IEnrollmentForShow[] | undefined
  isLoading: boolean
  isLoadingPDF: boolean
  onDetail: (id: string) => void
  onDownloadPDF: (enrollment: IEnrollmentForShow) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const EnrollmentTable: React.FC<EnrollmentTableProps> = ({
  enrollments,
  isLoading,
  isLoadingPDF,
  onDetail,
  onDownloadPDF,
  onEdit,
  onDelete
}) => {
  const ENROLLMENT_STATUS = ['Inscrito', 'Completa', 'Cancelada']

  if (isLoading) {
    return <ContentLoader />
  }

  if (!enrollments || enrollments.length === 0) {
    return <div className="p-4 text-center text-zinc-400">Nenhuma inscrição encontrada.</div>
  }

  return (
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
              Curso
            </th>
            <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
              Nível
            </th>
            <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
              Data de Inscrição
            </th>
            <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
              Status
            </th>
            <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="block md:table-row-group">
          {enrollments.map((row, index) => (
            <tr
              key={index}
              className="bg-zinc-800 border border-zinc-700 block md:table-row hover:bg-zinc-700/50 transition-colors"
            >
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
                {row?.classId?.course?.name}
              </td>
              <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                {row?.classId?.grade?.grade}
              </td>
              <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                {formatDate(row?.enrollmentDate)}
              </td>
              <td
                className={`p-2 md:border md:border-zinc-700 text-center block md:table-cell ${
                  row?.status === 'completed'
                    ? 'text-green-500'
                    : row?.status === 'enrolled'
                      ? 'text-orange-600'
                      : 'text-red-500'
                }`}
              >
                {row?.status === 'enrolled'
                  ? ENROLLMENT_STATUS[0]
                  : row?.status === 'completed'
                    ? ENROLLMENT_STATUS[1]
                    : ENROLLMENT_STATUS[2]}
              </td>
              <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                <div className="flex items-center justify-evenly gap-1">
                  <button
                    onClick={() => onDetail(row?._id as string)}
                    className="bg-zinc-500 text-white px-2 py-1 rounded hover:brightness-125"
                    title="Ver detalhes"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onDownloadPDF(row)}
                    className="bg-orange-200 text-orange-700 px-2 py-1 rounded hover:brightness-125"
                    title="Baixar comprovativo"
                  >
                    {isLoadingPDF ? (
                      <TailSpin width={18} height={18} color="#c2410c" />
                    ) : (
                      <DownloadCloud size={18} />
                    )}
                  </button>

                  <button
                    onClick={() => onEdit(row?._id as string)}
                    className="bg-yellow-700 text-white px-2 py-1 rounded hover:brightness-125"
                    title="Editar"
                  >
                    <PenSquare size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(row?._id as string)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:brightness-125"
                    title="Apagar"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
