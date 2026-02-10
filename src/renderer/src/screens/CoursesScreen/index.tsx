import React, { useEffect, useState } from 'react'
import { Sidebar } from '@renderer/components/Sidebar'
import { useCenter } from '@renderer/contexts/center-context'
import { Modal } from '@renderer/components/Modal'
import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import withReactContent from 'sweetalert2-react-content'
import {
  createCourse,
  deleteCourseService,
  getCoursesService,
  getOneCourseService,
  ICourse
} from '@renderer/services/course-service'
import { formatDate, formateCurrency } from '@renderer/utils/format'
import { LoaderComponent } from '@renderer/components/Loader'
import { Rings } from 'react-loader-spinner'
import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import Pagination from '@renderer/components/Pagination'
import { Eye, PenBox, Trash } from 'lucide-react'
import { ModalEditCourse } from './ModalEditCourse'

export const CoursesScreen: React.FC = () => {
  const { center } = useCenter()

  const [courseInfo, setCourseInfo] = useState<ICourse | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = (): void => setIsModalOpen(true)
  const closeModal = (): void => setIsModalOpen(false)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const openEditModal = (): void => setIsEditModalOpen(true)
  const closeEditModal = (): void => setIsEditModalOpen(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handleEdit = async (id: string): Promise<void> => {
    try {
      const data = await getOneCourseService(id) //busca curso na db
      setCourseInfo(data)
      openEditModal()
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
        await deleteCourseService(id)
        await getCourses(currentPage)
      }
    })
  }
  const schema = yup
    .object({
      name: yup.string().required('Preencha o nome do curso'),
      description: yup.string().required('Preencha a descrição do curso'),
      startDate: yup.date().required(),
      endDate: yup.date().required(),
      fee: yup.number().required('Preencha a propina'),
      feeFine: yup.number().required('Preencha a multa'),
      enrollmentFee: yup.number(),
      confirmationEnrollmentFee: yup
        .number()
        .required('Preencha a taxa de confirmação de inscrição'),
      centerId: yup.string().required(),
      status: yup.string().oneOf(['active', 'inactive']),
      courseType: yup.string().oneOf(['on_home', 'on_center'])
    })
    .required()
  type FormData = yup.InferType<typeof schema>

  const ModalCreateCourse: React.FC = () => {
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
        await createCourse(data)
        closeModal()
        Swal.fire({
          position: 'bottom-end',
          icon: 'success',
          title: 'Curso Adicionado',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'h-44 p-2', // Define a largura e o padding do card
            title: 'text-sm', // Tamanho do texto do título
            icon: 'text-xs' // Reduz o tamanho do ícone
          },
          timerProgressBar: true // Ativa a barra de progresso
        })
      } catch (error) {
        MySwal.fire({
          title: 'Erro interno',
          text: 'Erro ao cadastrar curso.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col my-[5%]">
        <label className="text-gray-200" htmlFor="name">
          Nome do Curso
        </label>
        <input
          {...register('name')}
          placeholder="Nome do curso"
          id="name"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        />
        <span className="text-red-500">{errors.name?.message}</span>

        <label className="text-gray-200" htmlFor="description">
          Descrição
        </label>
        <input
          {...register('description')}
          placeholder="Descrição"
          id="description"
          type="text"
          maxLength={120}
          className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        />
        <span className="text-red-500">{errors.description?.message}</span>
        <label className="text-gray-200" htmlFor="startDate">
          Data de Início
        </label>
        <input
          {...register('startDate')}
          id="startDate"
          type="date"
          required
          className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-200" htmlFor="fee">
              Propina Mensal (Kz)
            </label>
            <input
              {...register('fee')}
              placeholder="Propina"
              id="fee"
              type="number"
              min={0}
              className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-200" htmlFor="enrollmentFee">
              Taxa de Inscrição (Kz)
            </label>
            <input
              {...register('enrollmentFee')}
              placeholder="Taxa de Inscrição"
              id="enrollmentFee"
              type="number"
              min={0}
              className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-200" htmlFor="confirmationEnrollmentFee">
              Taxa de Confirmação de Inscrição (Kz)
            </label>
            <input
              {...register('confirmationEnrollmentFee')}
              placeholder="Taxa de Confirmação de Inscrição"
              id="confirmationEnrollmentFee"
              type="number"
              min={0}
              className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-200" htmlFor="feeFine">
              Multa por atraso (Kz)
            </label>
            <input
              {...register('feeFine')}
              placeholder="Multa"
              id="feeFine"
              type="number"
              min={0}
              className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
            />
            <span className="text-red-500">{errors.feeFine?.message}</span>
          </div>
        </div>
        <label className="text-gray-200" htmlFor="endDate">
          Data de Término
        </label>
        <input
          {...register('endDate')}
          id="endDate"
          type="date"
          required
          className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        />
        <label className="text-gray-200" htmlFor="courseType">
          Modalidade do Curso
        </label>
        <select
          {...register('courseType')}
          id="courseType"
          required
          className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        >
          <option value="on_center" selected>
            Centro
          </option>

          <option value="on_home">Domiciliar</option>
        </select>
        <input {...register('centerId')} type="hidden" value={center?._id} required />
        <button
          type="submit"
          className="flex items-center justify-center bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md"
        >
          {isSubmitting ? (
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
  const [courses, setCourses] = useState<ICourse[] | null>(null)
  const [isLoaderCourseList, setIsLoaderCourseList] = useState(true)

  async function getCourses(page: number): Promise<void> {
    const data = await getCoursesService(center?._id as string, page)
    setCourses(data?.courses)
    setTotalPages(data?.totalCourses)
    setIsLoaderCourseList(false)
  }

  useEffect(() => {
    getCourses(currentPage)
  }, [isEditModalOpen, isModalOpen, currentPage])

  const COURSE_STATUS = ['ativo', 'inativo']
  //Tela Principal
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        {isLoaderCourseList ? (
          <LoaderComponent />
        ) : (
          <div className="flex flex-col flex-1 overflow-auto pt-4">
            <div className="flex flex-col flex-1 w-11/12 mx-auto">
              <h2 className="text-3xl text-zinc-400">Cursos</h2>
              <article className="text-zinc-600 mt-3">
                <p>Cursos de Excelência no (a) {center?.name}</p>
              </article>

              {/* Botão para adicionar novo dado */}
              <button
                onClick={openModal}
                className="bg-orange-700 text-white px-4 py-2 rounded hover:brightness-110 transition-all mt-4 self-end"
              >
                Criar Novo Curso
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
                        Modalidade
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Data de Início
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Data de Termino
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Propina (Kz)
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Taxa de Inscrição (Kz)
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Multa (Kz)
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Taxa de Confirmação de Inscrição (Kz)
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Estado
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="block md:table-row-group">
                    {courses &&
                      courses.map((row, index) => (
                        <tr
                          key={index}
                          className="bg-zinc-800 border border-zinc-700 block md:table-row"
                        >
                          <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                            {row?.name}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                            {row?.courseType == 'on_home' ? 'Domiciliar' : 'Centro'}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                            {formatDate(row?.startDate)}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                            {formatDate(row?.endDate)}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-right block md:table-cell">
                            {formateCurrency(row?.fee)}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-right block md:table-cell">
                            {formateCurrency(row?.enrollmentFee)}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-right block md:table-cell">
                            {formateCurrency(row?.feeFine)}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-right block md:table-cell">
                            {formateCurrency(row?.confirmationEnrollmentFee)}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                            {row?.status === 'active'
                              ? COURSE_STATUS[0]
                              : row?.status === 'inactive' && COURSE_STATUS[1]}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                            {/* Botões para Ações */}
                            <div className="flex items-center justify-evenly gap-2">
                              <button
                                type="button"
                                className="bg-zinc-200 text-zinc-600 px-2 py-1 rounded hover:brightness-125"
                              >
                                <Eye />
                              </button>
                              <button
                                type="submit"
                                onClick={() => handleEdit(row?._id as string)}
                                className="bg-yellow-700 text-white px-2 py-1 rounded hover:brightness-125"
                              >
                                <PenBox />
                              </button>
                              <button
                                type="submit"
                                onClick={() => handleDelete(row?._id as string)}
                                className="bg-red-800 text-white px-2 py-1 rounded hover:brightness-125"
                              >
                                <Trash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <h2 className="text-3xl">Criar Curso</h2>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <ModalCreateCourse />
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <div>
          <h2 className="text-3xl">Editar Curso</h2>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <ModalEditCourse data={courseInfo} onClose={closeEditModal} />
        </div>
      </Modal>
    </div>
  )
}
