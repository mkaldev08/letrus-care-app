import React, { useEffect, useState } from 'react'
import { Sidebar } from '@renderer/components/Sidebar'
import { useNavigate } from 'react-router'
import { formatDate } from '@renderer/utils/format'
import {
  changeStatusService,
  getEnrollmentsService,
  getOneEnrollmentService,
  IEnrollmentForShow,
  IEnrollmentReceipt
} from '@renderer/services/enrollment-service'
import { useCenter } from '@renderer/contexts/center-context'
import { DownloadCloud, PenSquare, Trash, Eye, Filter, Search } from 'lucide-react'

import { Modal } from '@renderer/components/Modal'
import Swal from 'sweetalert2'
import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import { pdf } from '@react-pdf/renderer'

import { EnrollmentPDF } from '@renderer/reports/models/EnrollmentPDF'
import Pagination from '@renderer/components/Pagination'
import { ContentLoader } from '@renderer/components/ContentLoader'
import { TailSpin } from 'react-loader-spinner'
import { ModalEditEnrollment } from './ModalEditEnrollment'
import { getCurrentSchoolYearService } from '@renderer/services/school-year-service'
import { ICenter } from '@renderer/services/center-service'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const schemaStudentSearch = yup
  .object({
    studentSearch: yup.string().required('Preencha o campo para pesquisar um aluno')
  })
  .required()

type FormSearchData = yup.InferType<typeof schemaStudentSearch>

export const EnrollmentScreen: React.FC = () => {
  const { register, watch } = useForm<FormSearchData>({
    resolver: yupResolver(schemaStudentSearch)
  })

  const studentSearch = watch('studentSearch')

  const navigate = useNavigate()
  const { center } = useCenter()
  const ENROLLMENT_STATUS = ['Inscrito', 'Completa', 'Cancelada']

  const [enrollments, setEnrollments] = useState<IEnrollmentForShow[] | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [enrollmentInfo, setEnrollmentInfo] = useState<IEnrollmentForShow | null>(null)

  const openModal = (): void => setIsModalOpen(true)
  const closeModal = (): void => setIsModalOpen(false)
  const handleEdit = async (id: string): Promise<void> => {
    try {
      const data = await getOneEnrollmentService(id)
      setEnrollmentInfo(data.enrollment)
      openModal()
    } catch (error) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Erro ao carregar informações',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'h-44 p-2', // Define a largura e o padding do card
          title: 'text-sm', // Tamanho do texto do título
          icon: 'text-xs' // Reduz o tamanho do ícone
        },
        timerProgressBar: true // Ativa a barra de progresso
      })
    }
  }
  const handleDelete = async (id: string): Promise<void> => {
    Swal.fire({
      title: 'Tens a certeza?',
      text: 'Esta acção não pode ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await changeStatusService(id, 'dropped')
        await fetchEnrollments(currentPage)
      }
    })
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchEnrollments = async (page: number): Promise<void> => {
    const data = await getEnrollmentsService(center?._id as string, page)
    setEnrollments(data.enrollments)
    setTotalPages(data.totalEnrollments)
  }

  useEffect(() => {
    if (center?._id as string) fetchEnrollments(currentPage)
  }, [center?._id as string, currentPage, isModalOpen])

  type selectedEnrollmentType = {
    enrollment: IEnrollmentForShow
    receipt: IEnrollmentReceipt
  }
  const [selectedEnrollment, setSelectedEnrollment] = useState<selectedEnrollmentType | null>(null)
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false)

  const handleDownloadPDF = async (enrollment: IEnrollmentForShow): Promise<void> => {
    const tmpEnrollment = await getOneEnrollmentService(enrollment?._id as string)
    setSelectedEnrollment(tmpEnrollment)
  }

  useEffect(() => {
    if (selectedEnrollment) {
      const generatePDF = async (): Promise<void> => {
        setIsLoadingPDF(true)
        const year = await getCurrentSchoolYearService(center?._id as string)

        const blob = await pdf(
          <EnrollmentPDF
            selectedEnrollment={selectedEnrollment}
            center={center as ICenter}
            schoolYear={year.description}
          />
        ).toBlob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `comprovativo-inscricao-${
          selectedEnrollment?.enrollment.studentId?.name?.surname
            ? selectedEnrollment?.enrollment.studentId?.name?.surname?.toLowerCase()
            : selectedEnrollment?.enrollment.studentId?.name?.fullName
                ?.toLowerCase()
                ?.split(' ')
                ?.pop()
        }-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setSelectedEnrollment(null)
        setIsLoadingPDF(false)
      }

      generatePDF()
    }
  }, [selectedEnrollment])

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  function handleCreateEnrollmentFlow(): void {
    Swal.fire({
      title: 'Define o Tipo de Inscrição',
      showCancelButton: true,
      confirmButtonText: 'Novo Aluno',
      cancelButtonText: 'Reconfirmação',
      customClass: {
        confirmButton: 'bg-orange-600'
      }
    }).then(async (result) => {
      result.isConfirmed ? navigate('/enrollment/new') : navigate('/enrollment/confirmation')
    })
  }

  function handleStudentDetails(id: string): void {
    navigate(`/enrollment/student/${id}`)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-400">Inscrições</h2>

            <button
              onClick={handleCreateEnrollmentFlow}
              className="bg-orange-700 text-white px-4 py-2 rounded hover:brightness-110 transition-all mt-4 self-end"
            >
              Inscrever Aluno
            </button>

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

            {/* Tabela */}
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
                      Acções
                    </th>
                  </tr>
                </thead>

                <tbody className="block md:table-row-group">
                  {enrollments ? (
                    enrollments.map((row, index) => (
                      <tr
                        key={index}
                        className="bg-zinc-800 border border-zinc-700 block md:table-row"
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
                          {/* Botões para Ações */}
                          <div className="flex items-center justify-evenly gap-1">
                            <button
                              onClick={() => handleStudentDetails(row?._id as string)}
                              className="bg-zinc-500 text-white px-2 py-1 rounded hover:brightness-125"
                            >
                              <Eye />
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(row)}
                              className="bg-orange-200 text-orange-700 px-2 py-1 rounded hover:brightness-125"
                            >
                              {isLoadingPDF ? (
                                <TailSpin width={20} height={20} color="#c2410c " />
                              ) : (
                                <DownloadCloud />
                              )}
                            </button>

                            <button
                              onClick={() => handleEdit(row?._id as string)}
                              className="bg-yellow-700 text-white px-2 py-1 rounded hover:brightness-125"
                            >
                              <PenSquare />
                            </button>
                            <button
                              onClick={() => handleDelete(row?._id as string)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:brightness-125"
                            >
                              <Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td rowSpan={7}>
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
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <div>
                <h2 className="text-3xl">Editar Inscrição</h2>
                <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
                <ModalEditEnrollment data={enrollmentInfo} onClose={closeModal} />
              </div>
            </Modal>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
