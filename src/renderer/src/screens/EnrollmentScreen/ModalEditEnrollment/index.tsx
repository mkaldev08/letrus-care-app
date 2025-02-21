import { useCenter } from '@renderer/contexts/center-context'
import { ICourse, getCoursesAll } from '@renderer/services/course-service'
import { editEnrollment, IEnrollment } from '@renderer/services/enrollment-service'
import { getGradesServiceAll, IGrade } from '@renderer/services/grade-service'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup
  .object({
    fullName: yup
      .string()
      .required('Preecha o Nome Completo')
      .test('fullName', 'Insira um nome completo válido', (value) => {
        // Verifica se o valor contém pelo menos um espaço em branco
        return /\s/.test(value)
      }),
    surname: yup.string(),
    birthDate: yup.date().required('Preecha data de nascimento'),
    gender: yup.string().oneOf(['masculino', 'feminino']).required('Seleciona um género'),
    father: yup
      .string()
      .required('Preecha o nome do Pai')
      .test('father', 'Insira um nome completo válido', (value) => {
        // Verifica se o valor contém pelo menos um espaço em branco
        return /\s/.test(value)
      }),
    mother: yup
      .string()
      .required('Preecha o nome do Mãe')
      .test('mother', 'Insira um nome completo válido', (value) => {
        // Verifica se o valor contém pelo menos um espaço em branco
        return /\s/.test(value)
      }),
    address: yup.string().required('Preecha o Endereço'),
    phoneNumber: yup.string().required('Preecha o Telefone'),
    email: yup.string().email('Email Inválido'),
    grade: yup.string().required('Seleciona um nível'),
    courseId: yup.string().required('Seleciona um curso disponível'),
    doc_file: yup.mixed().nullable(),
    image_file: yup.mixed().nullable(),
    userId: yup.string().required(),
    centerId: yup.string().required()
  })
  .required()

type FormData = yup.InferType<typeof schema>

interface ModalEditEnrollmentProps {
  data: IEnrollment | null
  onClose: () => void
}

export const ModalEditEnrollment: React.FC<ModalEditEnrollmentProps> = ({
  data: enrollmentInfo,
  onClose: closeModal
}) => {
  const MySwal = withReactContent(Swal)
  const { center } = useCenter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: FormData): Promise<void> => {
    const {
      fullName,
      surname,
      birthDate,
      gender,
      address,
      phoneNumber,
      email,
      father,
      mother,
      courseId,
      grade
    } = data
    try {
      await editEnrollment(
        enrollmentInfo?._id as string,
        {
          fullName,
          surname,
          birthDate,
          gender,
          address,
          phoneNumber,
          email,
          father,
          mother,
          courseId,
          grade
        },
        enrollmentInfo?.studentId?._id
      )
      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Editado com sucesso',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'h-44 p-2', // Define a largura e o padding do card
          title: 'text-sm', // Tamanho do texto do título
          icon: 'text-xs' // Reduz o tamanho do ícone
        },
        timerProgressBar: true // Ativa a barra de progresso
      })
      closeModal()
    } catch (error) {
      MySwal.fire({
        title: 'Erro interno',
        text: `Erro ao Editar inscrição de ${enrollmentInfo?.studentId?.name?.fullName}`,
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

  const [grades, setGrades] = useState<IGrade[] | null>(null)

  useEffect(() => {
    async function getGrades(): Promise<void> {
      const data = await getGradesServiceAll(center?._id as string)
      setGrades(data)
    }

    getGrades()
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-[5%]">
      <div className="flex flex-col overflow-y-auto gap-2">
        <label htmlFor="fullName">
          Nome Completo <span className="text-orange-700">*</span>
        </label>
        <input
          id="fullName"
          {...register('fullName')}
          defaultValue={enrollmentInfo?.studentId?.name.fullName}
          placeholder="Nome Completo do Aluno"
          autoComplete="fullName webauthn"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.fullName && <span className="text-red-500">{errors.fullName?.message}</span>}
        <label htmlFor="surname">Alcunha</label>
        <input
          id="surname"
          defaultValue={enrollmentInfo?.studentId?.name?.surname}
          {...register('surname')}
          placeholder="Alcunha"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.surname && <span className="text-red-500">{errors.surname?.message}</span>}
        <label htmlFor="birthDate">
          Data de Nascimento <span className="text-orange-700">*</span>
        </label>
        <input
          id="birthDate"
          {...register('birthDate')}
          placeholder="Nasceu em"
          autoComplete="bday-day"
          defaultValue={
            enrollmentInfo?.studentId?.birthDate
              ? new Date(enrollmentInfo.studentId.birthDate).toISOString().split('T')[0]
              : ''
          }
          type="date"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
          required
        />
        {errors.birthDate && <span className="text-red-500">{errors.birthDate?.message}</span>}

        <label htmlFor="gender">
          Género <span className="text-orange-700">*</span>
        </label>
        <select
          {...register('gender')}
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
          defaultValue={enrollmentInfo?.studentId?.gender}
        >
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
        </select>
        {errors.gender && <span className="text-red-500">{errors.gender?.message}</span>}

        <label htmlFor="father">
          Nome do Pai <span className="text-orange-700">*</span>
        </label>
        <input
          id="father"
          {...register('father')}
          placeholder="Nome do Pai"
          defaultValue={enrollmentInfo?.studentId?.parents.father}
          autoComplete="additional-name"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.father && <span className="text-red-500">{errors.father?.message}</span>}
        <label htmlFor="mother">
          Nome da Mãe <span className="text-orange-700">*</span>
        </label>
        <input
          {...register('mother')}
          id="mother"
          placeholder="Nome da Mãe"
          defaultValue={enrollmentInfo?.studentId?.parents.mother}
          autoComplete="additional-name"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.mother && <span className="text-red-500">{errors.mother?.message}</span>}
        <label htmlFor="address">
          Endereço <span className="text-orange-700">*</span>
        </label>
        <input
          id="address"
          {...register('address')}
          defaultValue={enrollmentInfo?.studentId?.address}
          placeholder="Endereço Completo onde moram com o Aluno"
          autoComplete="address-level1"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.address && <span className="text-red-500">{errors.address?.message}</span>}
        <label htmlFor="courseId">
          Curso <span className="text-orange-700">*</span>
        </label>
        <select
          id="courseId"
          {...register('courseId')}
          className="flex-1 w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
          defaultValue={enrollmentInfo?.courseId?._id}
        >
          {courses?.map((course, index) => (
            <option value={course?._id} key={index}>
              {course?.name}
            </option>
          ))}
        </select>
        {errors.courseId && <span className="text-red-500">{errors.courseId?.message}</span>}
        <label htmlFor="grade">
          Nível <span className="text-orange-700">*</span>
        </label>
        <select
          id="grade"
          {...register('grade')}
          className="flex-1 w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
          defaultValue={enrollmentInfo?.grade?._id}
        >
          {grades?.map((grade, index) => (
            <option value={grade?._id} key={index}>
              {grade?.grade}
            </option>
          ))}
        </select>
        {errors.grade && <span className="text-red-500">{errors.grade?.message}</span>}
        <label htmlFor="phoneNumber">
          Telefone <span className="text-orange-700">*</span>
        </label>
        <input
          id="phoneNumber"
          {...register('phoneNumber')}
          defaultValue={enrollmentInfo?.studentId?.phoneNumber}
          placeholder="Número de Telefone"
          autoComplete="tel"
          type="tel"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber?.message}</span>}
        <label htmlFor="phoneNumber">E-mail</label>
        <input
          {...register('email')}
          placeholder="E-mail"
          defaultValue={enrollmentInfo?.studentId?.email}
          autoComplete="email"
          type="email"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.email && <span className="text-red-500">{errors.email?.message}</span>}
        <div className="flex w-1/3 gap-6 self-end justify-end">
          <button
            type="reset"
            className="bg-transparent border-zinc-400 border-2  h-12 p-3 mt-6 text-white shadow-shape rounded-md hover:brightness-110"
            onClick={() => {
              closeModal()
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-orange-700 h-12 p-3 mt-6 text-white shadow-shape rounded-md hover:brightness-110"
          >
            Salvar
          </button>
        </div>
      </div>
    </form>
  )
}
