import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@renderer/contexts/auth-context'
import { useCenter } from '@renderer/contexts/center-context'
import { getTeachersServiceAll, ITeacher } from '@renderer/services/teacher-service'
import { getGradesServiceAll, IGrade } from '@renderer/services/grade-service'
import { getCoursesAll, ICourse } from '@renderer/services/course-service'
import { createClassService } from '@renderer/services/class-service'
import Swal from 'sweetalert2'
import { getCurrentSchoolYearService } from '@renderer/services/school-year-service'

const classSchema = yup
  .object({
    className: yup.string().required(),
    grade: yup.string().required(),
    period: yup.string().oneOf(['morning', 'moon', 'evening']).required(),
    classLimit: yup.number().required(),
    course: yup.string().required(),
    students: yup.array().of(yup.string().required()),
    teachers: yup.array().of(yup.string().required()).required(),
    center: yup.string().required(),
    userId: yup.string().required(),
    schedule: yup.string().required(),
    schoolYear: yup.string().required()
  })
  .required()

type FormData = yup.InferType<typeof classSchema>

export const FormCreateClass: React.FC<{ onClose: () => void }> = (props) => {
  const [teachers, setTeachers] = useState<ITeacher[] | null>(null)
  const [grades, setGrades] = useState<IGrade[] | null>(null)
  const [courses, setCourses] = useState<ICourse[] | null>(null)
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>()
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>()

  const { user } = useAuth()
  const { center } = useCenter()

  useEffect(() => {
    const fetchTeachers = async (): Promise<void> => {
      const data = await getTeachersServiceAll(center?._id as string)
      setTeachers(Object(data))
      if (data) setSelectedTeachers([data[0]?._id as string]) // Seleccionar o primeiro professor
    }
    const fetchGrades = async (): Promise<void> => {
      const data = await getGradesServiceAll(center?._id as string)
      setGrades(Object(data))
      if (data) setSelectedGrade(data[0]._id) // Seleccionar o primeiro nível
    }
    const fetchCourses = async (): Promise<void> => {
      const data = await getCoursesAll(center?._id as string)
      setCourses(Object(data))
      if (data) setSelectedCourse(data[0]._id) // Seleccionar o primeiro curso
    }

    fetchTeachers()
    fetchGrades()
    fetchCourses()
    fetchCurrentYear()
  }, [center?._id])

  async function fetchCurrentYear(): Promise<void> {
    const year = await getCurrentSchoolYearService(center?._id as string)
    setValue('schoolYear', year?._id as string)
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(classSchema),
    defaultValues: {
      teachers: selectedTeachers,
      grade: selectedGrade,
      course: selectedCourse
    }
  })

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await createClassService(data)
      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'turma criada com sucesso',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'h-44 p-2',
          title: 'text-sm',
          icon: 'text-xs'
        },
        timerProgressBar: true
      })
      props.onClose()
    } catch (error) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Ocoreeu um erro',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'h-44 p-2',
          title: 'text-sm',
          icon: 'text-xs'
        },
        timerProgressBar: true
      })
      console.error('Erro ao criar turma: ', error)
      throw error
    }
  }
  return (
    <>
      <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-gray-200" htmlFor="className">
            Nome da Turma
          </label>
          <input
            type="text"
            id="className"
            {...register('className')}
            className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
            placeholder="Exemplo: Matemática 8ª Nível"
          />
          {errors.className && <p className="text-red-500">{errors.className?.message}</p>}
        </div>
        <div>
          <label className="text-gray-200" htmlFor="teachers">
            Professor(es)
          </label>
          <select
            id="teachers"
            multiple
            {...register('teachers')}
            defaultValue={selectedTeachers}
            className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
          >
            {teachers?.map((teacher) => (
              <option key={teacher?._id} value={teacher?._id}>
                {teacher?.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-200" htmlFor="grade">
            Nível
          </label>
          <select
            id="grade"
            {...register('grade')}
            defaultValue={selectedGrade}
            className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
          >
            {grades?.map((grade) => (
              <option key={grade?._id} value={grade?._id}>
                {grade?.grade}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-200" htmlFor="period">
              Período
            </label>
            <select
              id="period"
              {...register('period')}
              className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
            >
              <option value="morning">Manhã</option>
              <option value="moon">Tarde</option>
              <option value="evening">Noite</option>
            </select>
          </div>
          <div>
            <label className="text-gray-200" htmlFor="schedule">
              Horário
            </label>
            <input
              id="schedule"
              {...register('schedule')}
              type="text"
              className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
              placeholder="Ex.: 7h-10h"
            />
            {errors.schedule && <p className="text-red-500">{errors.schedule?.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-200" htmlFor="classLimit">
              Limite de Alunos
            </label>
            <input
              id="classLimit"
              {...register('classLimit')}
              min={20}
              defaultValue={20}
              type="number"
              className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
              placeholder="min: 20"
            />
            {errors.classLimit && <p className="text-red-500">{errors.classLimit?.message}</p>}
          </div>
          <div>
            <label className="text-gray-200" htmlFor="course">
              Curso
            </label>
            <select
              id="course"
              {...register('course')}
              defaultValue={selectedCourse}
              className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
            >
              {courses?.map((course) => (
                <option key={course?._id} value={course?._id}>
                  {course?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <input type="hidden" {...register('center')} value={center?._id as string} />
          <input type="hidden" {...register('userId')} value={user?._id} />
          <input type="hidden" {...register('schoolYear')} value={user?._id} />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md"
          >
            Criar
          </button>
        </div>
      </form>
    </>
  )
}
