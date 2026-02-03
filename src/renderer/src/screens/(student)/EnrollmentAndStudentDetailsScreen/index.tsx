import React, { useState } from 'react'
import { Footer } from '@renderer/components/Footer'
import { StudentSidebar } from '@renderer/components/StudentSidebar'
import { Header } from '@renderer/components/Header'
import { useParams } from 'react-router'
import { Edit, FileDown, Printer } from 'lucide-react' // ícones
import { formatDate } from '@renderer/utils/format'
import { ContentLoader } from '@renderer/components/ContentLoader'
import { useEnrollmentQuery } from '@renderer/hooks/queries/useEnrollmentQueries'

export const EnrollmentAndStudentDetailsScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { enrollmentId } = useParams<string>()
  const { data, isLoading } = useEnrollmentQuery(enrollmentId || '')
  const enrollment = data?.enrollment

  const handleEdit = (): void => {
    console.log('Editar aluno')
  }

  const handleExportPDF = (): void => {
    console.log('Exportar ficha em PDF')
  }

  const handlePrint = (): void => {
    window.print()
  }

  if (isLoading) {
    return <ContentLoader />
  }

  if (!enrollment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-zinc-500">Carregando detalhes do aluno...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center pt-[62px] lg:pt-[70px] overflow-hidden">
        <StudentSidebar isOpen={isSidebarOpen} enrollmentId={enrollmentId || ''} />
        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl text-zinc-300">Aluno</h2>
                <p className="text-zinc-600 mt-1">Detalhes do estudante e matrícula</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md shadow"
                >
                  <Edit size={16} /> Editar
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md shadow"
                >
                  <FileDown size={16} /> Exportar PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md shadow"
                >
                  <Printer size={16} /> Imprimir
                </button>
              </div>
            </div>

            {/* conteúdo principal */}
            <div className="grid grid-cols-3 gap-6">
              {/* Coluna Esquerda - dados */}
              <div className="col-span-2 space-y-6">
                <div className="bg-zinc-900 p-4 rounded-xl shadow">
                  <h3 className="text-lg text-zinc-400 mb-3">Informações Pessoais</h3>
                  <p>
                    <span className="font-semibold">Nome:</span>{' '}
                    {enrollment.studentId.name.fullName}
                  </p>
                  <p>
                    <span className="font-semibold">BI: </span>{' '}
                    {enrollment.studentId.identityNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Data de Nascimento:</span>{' '}
                    {formatDate(enrollment.studentId.birthDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Género:</span> {enrollment.studentId.gender}
                  </p>
                  <p>
                    <span className="font-semibold">Código:</span>{' '}
                    {enrollment.studentId.studentCode}
                  </p>
                </div>

                <div className="bg-zinc-900 p-4 rounded-xl shadow">
                  <h3 className="text-lg text-zinc-400 mb-3">Contactos</h3>
                  <p>
                    <span className="font-semibold">Endereço:</span> {enrollment.studentId.address}
                  </p>
                  <p>
                    <span className="font-semibold">Telefone:</span>{' '}
                    {enrollment.studentId.phoneNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {enrollment.studentId.email}
                  </p>
                </div>

                <div className="bg-zinc-900 p-4 rounded-xl shadow">
                  <h3 className="text-lg text-zinc-400 mb-3">Encarregados</h3>
                  <p>
                    <span className="font-semibold">Pai:</span>{' '}
                    {enrollment.studentId.parents.father}
                  </p>
                  <p>
                    <span className="font-semibold">Mãe:</span>{' '}
                    {enrollment.studentId.parents.mother}
                  </p>
                </div>

                <div className="bg-zinc-900 p-4 rounded-xl shadow">
                  <h3 className="text-lg text-zinc-400 mb-3">Matrícula</h3>
                  <p>
                    <span className="font-semibold">Curso:</span> {enrollment.classId.course.name} -{' '}
                    {enrollment.classId.grade.grade}
                  </p>
                  <p>
                    <span className="font-semibold">Data:</span>{' '}
                    {formatDate(enrollment.enrollmentDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Estado:</span>{' '}
                    {enrollment.status === 'completed'
                      ? 'Concluído'
                      : enrollment.status === 'dropped'
                        ? 'Desistiu'
                        : 'Matriculado'}
                  </p>
                  <p>
                    <span className="font-semibold">Bolsa:</span>{' '}
                    {enrollment.hasScholarShip ? 'Sim' : 'Não'}
                  </p>
                </div>
              </div>

              {/* Coluna Direita - foto */}
              <div className="bg-zinc-900 p-4 rounded-xl shadow flex flex-col items-center justify-center">
                <img
                  src={'https://via.placeholder.com/150'}
                  alt="Foto do Aluno"
                  className="w-40 h-40 rounded-full object-cover mb-4"
                />
                <button className="bg-orange-700 px-4 py-2 rounded-md text-white text-sm">
                  Alterar Foto
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
