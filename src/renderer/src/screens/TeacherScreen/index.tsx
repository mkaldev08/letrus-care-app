import { yupResolver } from '@hookform/resolvers/yup'
import { Modal } from '@renderer/components/Modal'
import { Sidebar } from '@renderer/components/Sidebar'
import { useCenter } from '@renderer/contexts/center-context'
import {
  createTeacher,
  getTeachersService,
  ITeacherForShow,
  updateTeacherStatusService
} from '@renderer/services/teacher-service'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Rings } from 'react-loader-spinner'
import { useAuth } from '@renderer/contexts/auth-context'
import { getCoursesAll, ICourse } from '@renderer/services/course-service'
import { formatDate } from '@renderer/utils/format'
import { LoaderComponent } from '@renderer/components/Loader'
import { Footer } from '@renderer/components/Footer'
import { HeaderMain } from '@renderer/components/HeaderMain'
import Pagination from '@renderer/components/Pagination'
import { ModalEditTeacher } from './ModalEditTeacher'
import { Eye, PenBox, Trash } from 'lucide-react'

export const TeacherScreen: React.FC = () => {
  const { center } = useCenter()
  const { user } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (): void => setIsModalOpen(true)
  const closeModal = (): void => setIsModalOpen(false)

  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [selectTeacher, setSelectTeacher] = useState({} as ITeacherForShow)

  const [teachers, setTeachers] = useState<ITeacherForShow[] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const openEditModal = (): void => setIsModalEditOpen(true)
  const closeEditModal = (): void => setIsModalEditOpen(false)

  const handleEdit = (teacher: ITeacherForShow): void => {
    setSelectTeacher(teacher)
    openEditModal()
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
        await updateTeacherStatusService(id, 'inactive')
        await getTeachers(currentPage)
      }
    })
  }

  async function getTeachers(page: number): Promise<void> {
    const data = await getTeachersService(center?._id as string, page)
    setTeachers(data?.teachers)
    setTotalPages(data?.totalTeachers)
    setIsLoaderTeacherList(false)
  }

  useEffect(() => {
    getTeachers(currentPage)
  }, [isModalEditOpen, isModalOpen, currentPage])

  const schema = yup
    .object({
      fullName: yup.string().required('Preecha este campo'),
      birthDate: yup.date().required('Preecha este campo'),
      address: yup.string().required('Preecha este campo'),
      phoneNumber: yup.string().required('Preecha este campo'),
      email: yup.string().required('Preecha este campo'),
      hireDate: yup.date(),
      centerId: yup.string().required('Preecha este campo'),
      user: yup.string().required('Preecha este campo'),
      courses: yup.array().required(),
      teacherCode: yup.string()
    })
    .required()
  type FormData = yup.InferType<typeof schema>

  const ModalCreateTeacher: React.FC = () => {
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
        const { courses } = data
        if (courses.length < 1) {
          throw new Error('Selecione pelo menos um curso')
        } else {
          await createTeacher(data)
          closeModal()
          Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: 'professor Adicionado',
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
      } catch (error) {
        MySwal.fire({
          title: 'Erro interno',
          text: 'Erro ao cadastrar professor.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    }

    const [courses, setCourses] = useState<ICourse[] | null>(null)

    useEffect(() => {
      async function getCourses(): Promise<void> {
        const data = await getCoursesAll(center?._id as string)
        setCourses(data)
      }

      getCourses()
    }, [])

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col my-[5%]">
        <label className="text-gray-200" htmlFor="fullName">
          Nome Completo <span className="text-orange-700">*</span>
        </label>
        <input
          {...register('fullName')}
          placeholder="Digite o Nome Completo"
          id="fullName"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        />
        <label htmlFor="address">
          Endereço <span className="text-orange-700">*</span>
        </label>
        <input
          id="address"
          {...register('address')}
          placeholder="Endereço Completo"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-400"
        />
        {errors.address && <span className="text-red-500">{errors.address?.message}</span>}
        <label htmlFor="birthDate">
          Data de Nascimento <span className="text-orange-700">*</span>
        </label>
        <input
          id="birthDate"
          {...register('birthDate')}
          placeholder="Nasceu em"
          autoComplete="bday-day"
          type="date"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-400"
          required
        />
        <label htmlFor="phoneNumber">
          Telefone <span className="text-orange-700">*</span>
        </label>
        <input
          id="phoneNumber"
          {...register('phoneNumber')}
          placeholder="Número de Telefone"
          autoComplete="tel"
          type="tel"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-400"
        />
        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber?.message}</span>}
        <label htmlFor="phoneNumber">
          E-mail <span className="text-orange-700">*</span>
        </label>
        <input
          {...register('email')}
          placeholder="E-mail"
          autoComplete="email"
          type="email"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-400"
        />
        {errors.email && <span className="text-red-500">{errors.email?.message}</span>}
        <label htmlFor="hireDate">Data de Contratação</label>
        <input
          id="hireDate"
          {...register('hireDate')}
          placeholder="Iniciou em"
          type="date"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-400"
          required
        />
        <label htmlFor="course">
          Cursos <span className="text-orange-700">*</span>
        </label>
        <select
          id="course"
          {...register('courses')}
          multiple={true}
          className="flex-1 w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        >
          {courses?.map((course, index) => (
            <option value={course?._id} key={index}>
              {course?.name}
            </option>
          ))}
        </select>
        {errors.courses && <span className="text-red-500">{errors.courses?.message}</span>}
        <input {...register('centerId')} type="hidden" value={center?._id} required />
        <input {...register('user')} type="hidden" value={user?._id} required />
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

  const TEACHER_STATUS = ['activo', 'inactivo']
  const [isLoaderTeacherList, setIsLoaderTeacherList] = useState<boolean>(true)

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <HeaderMain isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        {isLoaderTeacherList ? (
          <LoaderComponent />
        ) : (
          <div className="flex flex-col flex-1 overflow-auto pt-4">
            <div className="flex flex-col flex-1 w-11/12 mx-auto">
              <h2 className="text-3xl text-zinc-400">Professores</h2>
              <article className="text-zinc-600 mt-3">
                <p>Professores Qualificados no (a) {center?.name}</p>
              </article>

              {/* Botão para adicionar novo dado  ToDo alinhar a directa*/}
              <button
                onClick={openModal}
                className="bg-orange-700 text-white px-4 py-2 rounded hover:brightness-110 transition-all mt-4 self-end"
              >
                Novo Professor
              </button>
              {/* Tabela */}
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full border-collapse block md:table">
                  <thead className="block md:table-header-group">
                    <tr className="block border border-zinc-700 md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Código
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Nome Completo
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Cursos Leccionados
                      </th>
                      <th className="bg-orange-800 text-white p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                        Data de Contrato
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
                    {teachers &&
                      teachers.map((row, index) => (
                        <tr
                          key={index}
                          className="bg-zinc-800 border border-zinc-700 block md:table-row"
                        >
                          <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                            {row?.teacherCode}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-left block md:table-cell">
                            {row?.fullName}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                            <select className="bg-transparent border-none outline-none">
                              {row?.courses?.map((course, index) => (
                                <option key={index} className="bg-zinc-800">
                                  {course?.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                            {formatDate(row?.hireDate as Date)}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                            {row?.status === 'active'
                              ? TEACHER_STATUS[0]
                              : row?.status === 'inactive' && TEACHER_STATUS[1]}
                          </td>
                          <td className="p-2 md:border md:border-zinc-700 text-center block md:table-cell">
                            {/* Botões para Ações */}
                            <div className="flex items-center justify-evenly gap-1">
                              <button className="bg-zinc-500 text-zinc-100 px-2 py-1 rounded hover:brightness-125">
                                <Eye />
                              </button>
                              <button
                                className="bg-orange-200 text-orange-700 px-2 py-1 rounded hover:brightness-125"
                                onClick={() => handleEdit(row)}
                              >
                                <PenBox />
                              </button>
                              <button
                                className="bg-red-600 text-white px-2 py-1 rounded hover:brightness-125"
                                onClick={() => handleDelete(row?._id as string)}
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
          <h2 className="text-3xl">Criar Professor</h2>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <ModalCreateTeacher />
        </div>
      </Modal>

      <Modal isOpen={isModalEditOpen} onClose={closeEditModal}>
        <div>
          <h2 className="text-3xl">Editar Professor</h2>
          <div className="bg-orange-700 text-orange-700 h-2 mt-2 w-16" />
          <ModalEditTeacher onClose={closeEditModal} teacher={selectTeacher} />
        </div>
      </Modal>
    </div>
  )
}
