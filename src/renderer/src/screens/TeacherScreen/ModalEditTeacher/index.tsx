import { yupResolver } from '@hookform/resolvers/yup'
import { useCenter } from '@renderer/contexts/center-context'
import { getCoursesAll, ICourse } from '@renderer/services/course-service'
import { ITeacher, ITeacherForShow } from '@renderer/services/teacher-service'
import { useUpdateTeacherMutation } from '@renderer/hooks/queries/useTeacherQueries'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Rings } from 'react-loader-spinner'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as yup from 'yup'
const schema = yup
  .object({
    fullName: yup.string().required('Preencha este campo'),
    birthDate: yup.date().required('Preencha este campo'),
    address: yup.string().required('Preencha este campo'),
    phoneNumber: yup.string().required('Preencha este campo'),
    email: yup.string().required('Preencha este campo'),
    hireDate: yup.date(),
    courses: yup.array().of(yup.string()).min(1),
    teacherCode: yup.string()
  })
  .required()
type FormData = yup.InferType<typeof schema>

interface ModalEditTeacherProps {
  teacher: ITeacherForShow
  onClose: () => void
}
export const ModalEditTeacher: React.FC<ModalEditTeacherProps> = ({
  teacher,
  onClose
}: ModalEditTeacherProps) => {
  const { center } = useCenter()

  const [selectedCourses, setSelectedCourses] = useState([] as string[])

  const MySwal = withReactContent(Swal)
  const updateTeacherMutation = useUpdateTeacherMutation()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      courses: getCoursesId(teacher.courses as ICourse[])
    }
  })

  function getCoursesId(course: ICourse[]): string[] {
    if (!course || course.length === 0) {
      return []
    }

    const coursesId = new Array<string>()
    course?.forEach((t) => coursesId.push(t?._id as string))
    return coursesId
  }

  // Atualiza os professores selecionados da turma
  useEffect(() => {
    if (teacher?.courses) {
      const coursesId = teacher.courses.map((c) => (c as ICourse)?._id)
      setSelectedCourses(coursesId as string[])
      setValue('courses', coursesId as string[]) // Atualiza o campo corretamente
    }
  }, [teacher, setValue])

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await updateTeacherMutation.mutateAsync({
        id: teacher?._id as string,
        data: data as ITeacher
      })
      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'alterações salvas',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'h-44 p-2', // Define a largura e o padding do card
          title: 'text-sm', // Tamanho do texto do título
          icon: 'text-xs' // Reduz o tamanho do ícone
        },
        timerProgressBar: true
      })
      onClose()
    } catch (error) {
      MySwal.fire({
        title: 'Erro interno',
        text: 'Erro ao editar professor.',
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
  }, [center?._id])

  return (
    !!teacher && (
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col my-[5%]">
        <label className="text-gray-200" htmlFor="fullName">
          Nome Completo <span className="text-orange-700">*</span>
        </label>
        <input
          {...register('fullName')}
          placeholder="Digite o Nome Completo"
          id="fullName"
          type="text"
          defaultValue={teacher.fullName}
          className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        />
        <label htmlFor="address">
          Endereço <span className="text-orange-700">*</span>
        </label>
        <input
          id="address"
          {...register('address')}
          placeholder="Endereço Completo"
          defaultValue={teacher.address}
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
          defaultValue={new Date(teacher?.birthDate).toISOString().split('T')[0]}
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
          defaultValue={teacher.phoneNumber}
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
          defaultValue={teacher.email}
          type="email"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-400"
        />
        {errors.email && <span className="text-red-500">{errors.email?.message}</span>}
        <label htmlFor="hireDate">Data de Contratação</label>
        <input
          id="hireDate"
          {...register('hireDate')}
          placeholder="Iniciou em"
          defaultValue={new Date(teacher?.hireDate as Date).toISOString().split('T')[0]}
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
          multiple
          className="flex-1 w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
          value={selectedCourses}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, (option) => option.value)
            setSelectedCourses(values)
            setValue('courses', values)
          }}
        >
          {courses?.map((course, index) => (
            <option value={course?._id} key={index}>
              {course?.name}
            </option>
          ))}
        </select>
        {errors.courses && <span className="text-red-500">{errors.courses?.message}</span>}
        <button
          type="submit"
          disabled={isSubmitting || updateTeacherMutation.isPending}
          className="flex items-center justify-center bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md disabled:opacity-50"
        >
          {isSubmitting || updateTeacherMutation.isPending ? (
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
            <span>Salvar</span>
          )}
        </button>
      </form>
    )
  )
}
