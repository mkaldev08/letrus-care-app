import React, { useState } from 'react'

import { Sidebar } from '@renderer/components/Sidebar'
import { Modal } from '@renderer/components/Modal'
import { useCenter } from '@renderer/contexts/center-context'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { IGrade } from '@renderer/services/grade-service'
import { formatDate } from '@renderer/utils/format'
import { Rings } from 'react-loader-spinner'
import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import Pagination from '@renderer/components/Pagination'
import { LoaderComponent } from '@renderer/components/Loader'
import { PenBox, Trash } from 'lucide-react'
import {
  useCreateGradeMutation,
  useDeleteGradeMutation,
  useGradeQuery,
  useGradesQuery,
  useUpdateGradeMutation
} from '@renderer/hooks/queries/useGradeQueries'

export const GradeScreen: React.FC = () => {
  const { center } = useCenter()

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (): void => setIsModalOpen(true)
  const closeModal = (): void => setIsModalOpen(false)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const openEditModal = (): void => setIsEditModalOpen(true)
  const closeEditModal = (): void => setIsEditModalOpen(false)

  const handleEdit = (id: string): void => {
    setSelectedGradeId(id)
    openEditModal()
  }

  const { data, isLoading } = useGradesQuery(center?._id, currentPage)
  const { data: gradeInfo } = useGradeQuery(selectedGradeId ?? undefined)
  const createGradeMutation = useCreateGradeMutation()
  const updateGradeMutation = useUpdateGradeMutation()
  const deleteGradeMutation = useDeleteGradeMutation()

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
        await deleteGradeMutation.mutateAsync(id)
      }
    })
  }

  const schema = yup
    .object({
      grade: yup.string().required('Especifique um nível'),
      centerId: yup.string().required()
    })
    .required()
  type FormData = yup.InferType<typeof schema>

  const ModalCreateGrade: React.FC = () => {
    const MySwal = withReactContent(Swal)

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting }
    } = useForm<FormData>({
      resolver: yupResolver(schema)
    })
    const onSubmit = async (data: FormData): Promise<void> => {
      try {
        await createGradeMutation.mutateAsync(data as IGrade)
        closeModal()
        Swal.fire({
          position: 'bottom-end',
          icon: 'success',
          title: 'Nível Adicionado',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'h-44 p-2',
            title: 'text-sm',
            icon: 'text-xs'
          },
          timerProgressBar: true
        })
      } catch (error) {
        MySwal.fire({
          title: 'Erro interno',
          text: 'Erro ao cadastrar nível.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col my-[5%]">
        <label className="text-gray-200" htmlFor="grade">
          Nível
        </label>
        <input
          {...register('grade')}
          placeholder="Ex.: Nível 1 ou 1ª Classe"
          id="grade"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        />
        <span className="text-red-500">{errors.grade?.message}</span>
        <input {...register('centerId')} type="hidden" value={center?._id} required />
        <button
          type="submit"
          disabled={isSubmitting || createGradeMutation.isPending}
          className="bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md disabled:opacity-50"
        >
          {isSubmitting || createGradeMutation.isPending ? (
            <Rings
              height="32"
              width="32"
              color="#fff"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : (
            <span>Criar</span>
          )}
        </button>
      </form>
    )
  }

  interface ModalEditGradeProps {
    data: IGrade
    onClose: () => void
  }

  const ModalEditGrade: React.FC<ModalEditGradeProps> = ({ data: gradeInfo, onClose }) => {
    const MySwal = withReactContent(Swal)

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting }
    } = useForm<FormData>({
      resolver: yupResolver(schema)
    })
    const onSubmit = async (data: FormData): Promise<void> => {
      try {
        if (!gradeInfo?._id) {
          throw new Error('Grade ID required')
        }
        await updateGradeMutation.mutateAsync({
          id: gradeInfo._id as string,
          data: data as IGrade
        })
        onClose()
        Swal.fire({
          position: 'bottom-end',
          icon: 'success',
          title: 'Nível editado',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'h-44 p-2',
            title: 'text-sm',
            icon: 'text-xs'
          },
          timerProgressBar: true
        })
      } catch (error) {
        MySwal.fire({
          title: 'Erro interno',
          text: 'Erro ao editar nível.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col my-[5%]">
        <label className="text-gray-200" htmlFor="grade">
          Nível
        </label>
        <input
          {...register('grade')}
          placeholder="Ex.: Nível 1 ou 1ª Classe"
          defaultValue={gradeInfo?.grade}
          id="grade"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        />
        <span className="text-red-500">{errors.grade?.message}</span>
        <input {...register('centerId')} type="hidden" value={center?._id} required />
        <button
          type="submit"
          disabled={isSubmitting || updateGradeMutation.isPending}
          className="bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md disabled:opacity-50"
        >
          {isSubmitting || updateGradeMutation.isPending ? (
            <Rings
              height="32"
              width="32"
              color="#fff"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : (
            'Salvar'
          )}
        </button>
      </form>
    )
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        {isLoading ? (
          <LoaderComponent />
        ) : (
          <div className="flex flex-col flex-1 overflow-auto pt-4">
            <div className="flex flex-col flex-1 w-11/12 mx-auto">
              <h2 className="text-3xl text-zinc-400">Níveis</h2>
              <article className="text-zinc-600 mt-3">
                <p>Níveis Disponíveis no (a) {center?.name}</p>
              </article>

              {/* Botão para adicionar novo dado  ToDo alinhar a directa*/}
              <button
                onClick={openModal}
                className="bg-orange-700 text-white px-4 py-2 rounded hover:brightness-110 transition-all mt-4 self-end"
              >
                Criar Novo Nível
              </button>
              {/* Tabela */}
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full border-collapse block md:table">
                  <thead className="block md:table-header-group">
                    <tr className="block border border-zinc-700 md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Nome
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Data de Aplicação
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Acções
                      </th>
                    </tr>
                  </thead>

                  <tbody className="block md:table-row-group">
                    {data?.grades ? (
                      data.grades.map((row, index) => (
                        <tr
                          key={index}
                          className="bg-zinc-800 border border-zinc-700 block md:table-row"
                        >
                          <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                            {row?.grade}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                            {formatDate(row?.dateRecorded as Date)}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                            {/* Botões para Ações */}
                            <div className="flex items-center justify-evenly gap-1">
                              <button
                                onClick={() => handleEdit(row?._id as string)}
                                className="bg-yellow-700 text-white px-2 py-1 rounded hover:brightness-125"
                              >
                                <PenBox />
                              </button>
                              <button
                                onClick={() => handleDelete(row?._id as string)}
                                className="bg-red-800 text-white px-2 py-1 rounded hover:brightness-125"
                              >
                                <Trash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center p-4">
                          Nenhum nível encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  totalPages={data?.totalGrades || 1}
                />
              </div>
            </div>
            <Footer />
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <h2 className="text-3xl">Criar Nível</h2>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <ModalCreateGrade />
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <div>
          <h2 className="text-3xl">Editar Nível</h2>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <ModalEditGrade data={gradeInfo as IGrade} onClose={closeEditModal} />
        </div>
      </Modal>
    </div>
  )
}
