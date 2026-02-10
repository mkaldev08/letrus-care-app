import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Rings } from 'react-loader-spinner'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useCenter } from '@renderer/contexts/center-context'
import { useAuth } from '@renderer/contexts/auth-context'
import { getCoursesAll, ICourse } from '@renderer/services/course-service'
import { useCreateTeacherMutation } from '@renderer/hooks/queries/useTeacherQueries'

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

interface ModalCreateTeacherProps {
  onClose: () => void
}

export const ModalCreateTeacher: React.FC<ModalCreateTeacherProps> = ({ onClose }) => {
  const MySwal = withReactContent(Swal)
  const { center } = useCenter()
  const { user } = useAuth()
  const createTeacherMutation = useCreateTeacherMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const [courses, setCourses] = useState<ICourse[] | null>(null)

  useEffect(() => {
    async function getCourses(): Promise<void> {
      const data = await getCoursesAll(center?._id as string)
      setCourses(data)
    }

    getCourses()
  }, [center?._id])

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const { courses: selectedCourses } = data
      if (selectedCourses.length < 1) {
        throw new Error('Selecione pelo menos um curso')
      }

      await createTeacherMutation.mutateAsync(data)
      onClose()

      MySwal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Professor Adicionado',
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
        text: 'Erro ao cadastrar professor.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

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

      <label htmlFor="email">
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
        disabled={isSubmitting || createTeacherMutation.isPending}
        className="flex items-center justify-center bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md disabled:opacity-50"
      >
        {isSubmitting || createTeacherMutation.isPending ? (
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
