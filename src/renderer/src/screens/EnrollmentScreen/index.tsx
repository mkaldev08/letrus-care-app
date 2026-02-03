import React, { useEffect, useState } from 'react'
import { Sidebar } from '@renderer/components/Sidebar'
import { useNavigate } from 'react-router'
import {
  getOneEnrollmentService,
  getStudentEnrollmentContext,
  IEnrollmentForShow,
  IEnrollmentReceipt
} from '@renderer/services/enrollment-service'
import { useCenter } from '@renderer/contexts/center-context'

import { Modal } from '@renderer/components/Modal'
import Swal from 'sweetalert2'
import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import { pdf } from '@react-pdf/renderer'

import { EnrollmentPDF } from '@renderer/reports/models/EnrollmentPDF'
import Pagination from '@renderer/components/Pagination'
import { ModalEditEnrollment } from './ModalEditEnrollment'
import { getCurrentSchoolYearService } from '@renderer/services/school-year-service'
import { ICenter } from '@renderer/services/center-service'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  useEnrollmentsQuery,
  useChangeEnrollmentStatusMutation
} from '@renderer/hooks/queries/useEnrollmentQueries'
import { EnrollmentTable } from './components/EnrollmentTable'
import { useDebounce } from 'use-debounce'
import { SearchBar } from '@renderer/components/shared/SearchBar'
import { PageHeader } from '@renderer/components/shared/PageHeader'

const schemaStudentSearch = yup
  .object({
    studentSearch: yup.string()
  })
  .required()

type FormSearchData = yup.InferType<typeof schemaStudentSearch>

export const EnrollmentScreen: React.FC = () => {
  const { register, watch } = useForm<FormSearchData>({
    resolver: yupResolver(schemaStudentSearch)
  })

  // State
  const studentSearch = watch('studentSearch') || ''
  const [debouncedSearch] = useDebounce(studentSearch, 500)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [enrollmentInfo, setEnrollmentInfo] = useState<IEnrollmentForShow | null>(null)

  // PDF State
  const [selectedEnrollment, setSelectedEnrollment] = useState<{
    enrollment: IEnrollmentForShow
    receipt: IEnrollmentReceipt
  } | null>(null)
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false)

  // Hooks
  const navigate = useNavigate()
  const { center } = useCenter()

  // Queries & Mutations
  const { data, isLoading } = useEnrollmentsQuery(center?._id, currentPage, debouncedSearch)
  const changeStatusMutation = useChangeEnrollmentStatusMutation()

  // Handlers
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
          popup: 'h-44 p-2',
          title: 'text-sm',
          icon: 'text-xs'
        },
        timerProgressBar: true
      })
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    Swal.fire({
      title: 'Tens a certeza?',
      text: 'Esta ação não pode ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await changeStatusMutation.mutateAsync({ id, status: 'dropped' })
          Swal.fire('Cancelada!', 'A inscrição foi cancelada.', 'success')
        } catch (error) {
          Swal.fire('Erro!', 'Não foi possível cancelar a inscrição.', 'error')
        }
      }
    })
  }

  const handleCreateEnrollmentFlow = (): void => {
    Swal.fire({
      title: 'Define o Tipo de Inscrição',
      showCancelButton: true,
      confirmButtonText: 'Re-confirmação',
      cancelButtonText: 'Novo Aluno',
      allowEscapeKey: false,
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'bg-orange-600'
      }
    }).then(async (result) => {
      result.isConfirmed
        ? await navigate('/enrollment/confirmation')
        : await navigate('/enrollment/new')
    })
  }

  const handleStudentDetails = (id: string): void => {
    navigate(`/student/${id}/show`, { state: { enrollmentId: id } })
  }

  // Request PDF Generation
  const handleDownloadPDF = async (enrollment: IEnrollmentForShow): Promise<void> => {
    try {
      const tmpEnrollment = await getOneEnrollmentService(enrollment?._id as string)
      setSelectedEnrollment(tmpEnrollment)
    } catch (error) {
      console.error('Error fetching enrollment details for PDF', error)
    }
  }

  // Effect to generate PDF when enrollment is selected
  useEffect(() => {
    if (selectedEnrollment) {
      const generatePDF = async (): Promise<void> => {
        try {
          setIsLoadingPDF(true)
          const year = await getCurrentSchoolYearService(center?._id as string)
          const financialStatusData = await getStudentEnrollmentContext(
            String(selectedEnrollment.enrollment._id)
          )

          const blob = await pdf(
            <EnrollmentPDF
              selectedEnrollment={selectedEnrollment}
              center={center as ICenter}
              schoolYear={year.description}
              financialStatusData={financialStatusData}
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
        } catch (error) {
          console.error('PDF Generation Error', error)
          Swal.fire('Erro', 'Falha ao gerar o PDF', 'error')
        } finally {
          setSelectedEnrollment(null)
          setIsLoadingPDF(false)
        }
      }

      generatePDF()
    }
  }, [center, selectedEnrollment])

  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <PageHeader
              title="Inscrições"
              actionLabel="Inscrever Aluno"
              onActionClick={handleCreateEnrollmentFlow}
              showAction={true}
            />

            <SearchBar
              register={register}
              fieldName="studentSearch"
              placeholder="Buscar por aluno, BI ou código..."
            />

            <EnrollmentTable
              enrollments={data?.enrollments}
              isLoading={isLoading}
              isLoadingPDF={isLoadingPDF}
              onDetail={handleStudentDetails}
              onDownloadPDF={handleDownloadPDF}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalEnrollments ?? 1}
              onPageChange={setCurrentPage}
            />

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
