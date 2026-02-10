import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { useCenter } from '@renderer/contexts/center-context'
import { useAuth } from '@renderer/contexts/auth-context'
import { useNavigate } from 'react-router'
import { Rings } from 'react-loader-spinner'
import { useSchoolYear } from '@renderer/contexts/school-year-context'

import { useClassesQuery } from '@renderer/hooks/queries/useClassQueries'
import { useCreateEnrollmentMutation } from '@renderer/hooks/queries/useEnrollmentQueries'

export const studentSchema = yup
  .object({
    fullName: yup
      .string()
      .required('Preencha o Nome Completo')
      .test('fullName', 'Insira um nome completo válido', (value) => {
        // Verifica se o valor contém pelo menos um espaço em branco
        return /\s/.test(value)
      })
      .trim(),
    surname: yup.string().trim(),
    birthDate: yup.date().required('Preencha data de nascimento'),
    gender: yup.string().oneOf(['masculino', 'feminino']).required('Seleciona um género'),
    identityNumber: yup.string().required('Preencha o Número do BI'),
    father: yup
      .string()
      .required('Preencha o nome do Pai')
      .test('father', 'Insira um nome completo válido', (value) => {
        // Verifica se o valor contém pelo menos um espaço em branco
        return /\s/.test(value)
      }),
    mother: yup
      .string()
      .required('Preencha o nome da Mãe')
      .test('mother', 'Insira um nome completo válido', (value) => {
        // Verifica se o valor contém pelo menos um espaço em branco
        return /\s/.test(value)
      }),
    address: yup.string().required('Preencha o Endereço'),
    phoneNumber: yup.string().required('Preencha o Telefone'),
    email: yup.string().email('Email Inválido'),
    hasScholarShip: yup.boolean(),
    classId: yup.string().required('Seleciona uma Turma disponível'),
    doc_file: yup.mixed().nullable(),
    image_file: yup.mixed().nullable(),
    userId: yup.string().required(),
    centerId: yup.string().required()
  })
  .required()
type FormData = yup.InferType<typeof studentSchema>

export const Panel: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(studentSchema)
  })

  const { center } = useCenter()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { currentSchoolYear } = useSchoolYear()
  const {
    data: classRooms,
    isLoading: isLoadingClasses,
    error: errorClasses
  } = useClassesQuery(String(center?._id), String(currentSchoolYear?._id))

  const createEnrollmentMutation = useCreateEnrollmentMutation()

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const {
        father,
        mother,
        address,
        birthDate,
        gender,
        fullName,
        surname,
        phoneNumber,
        email,
        classId,
        userId,
        centerId,
        identityNumber
      } = data

      // if (!data.doc_file || !data.image_file) {
      //   throw new Error('Arquivos obrigatórios')
      // }

      const createdEnrollment = await createEnrollmentMutation.mutateAsync({
        address,
        centerId,
        classId,
        name: {
          fullName,
          surname
        },
        parents: {
          father,
          mother
        },
        phoneNumber,
        userId,
        birthDate: birthDate,
        email,
        gender,
        doc_file: data.doc_file as File,
        image_file: data.image_file as File,
        hasScholarShip: data.hasScholarShip,
        identityNumber
      })

      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Inscrição Salva, baixe a ficha e pague a propina!!',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'h-44 p-2', // Define a largura e o padding do card
          title: 'text-sm', // Tamanho do texto do título
          icon: 'text-xs' // Reduz o tamanho do ícone
        },
        timerProgressBar: true // Ativa a barra de progresso
      })

      await navigate('/payments/new', { state: { enrollment: createdEnrollment } })
    } catch (error: unknown) {
      type errorTyped = {
        response?: { data?: { message?: string } }
        request?: { message?: string }
        message?: string
      }
      const err = error as errorTyped

      if (err.response?.data?.message) {
        Swal.fire({
          position: 'bottom-end',
          icon: 'error',
          title: err.response.data.message,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'h-44 p-2', // Define a largura e o padding do card
            title: 'text-sm', // Tamanho do texto do título
            icon: 'text-xs' // Reduz o tamanho do ícone
          },
          timerProgressBar: true // Ativa a barra de progresso
        })
      } else {
        Swal.fire({
          position: 'bottom-end',
          icon: 'error',
          title: 'Erro de conexão com o servidor',
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
  }

  const [activeForm, setActiveForm] = useState<'student' | 'contact' | 'enrollment'>('student')

  const ContactForm: React.FC = () => {
    return (
      <>
        <label htmlFor="phoneNumber">
          Telefone <span className="text-orange-700">*</span>
        </label>
        <input
          id="phoneNumber"
          {...register('phoneNumber')}
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
          autoComplete="email"
          type="email"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.email && <span className="text-red-500">{errors.email?.message}</span>}
      </>
    )
  }
  const StudentForm: React.FC = () => {
    return (
      <>
        <label htmlFor="fullName">
          Nome Completo <span className="text-orange-700">*</span>
        </label>
        <input
          id="fullName"
          {...register('fullName')}
          placeholder="Nome Completo do Aluno"
          autoComplete="fullName webauthn"
          type="text"
          className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.fullName && <span className="text-red-500">{errors.fullName?.message}</span>}
        <label htmlFor="surname">Alcunha</label>
        <input
          id="surname"
          {...register('surname')}
          placeholder="Alcunha"
          autoComplete="fullName webauthn"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.surname && <span className="text-red-500">{errors.surname?.message}</span>}
        <label htmlFor="identityNumber">
          Número do BI <span className="text-orange-700">*</span>
        </label>
        <input
          id="identityNumber"
          {...register('identityNumber')}
          placeholder="Número do Bilhete de Identidade"
          autoComplete="identity-number"
          type="text"
          className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
          required
        />
        {errors.identityNumber && (
          <span className="text-red-500">{errors.identityNumber?.message}</span>
        )}
        <label htmlFor="birthDate">
          Data de Nascimento <span className="text-orange-700">*</span>
        </label>
        <input
          id="birthDate"
          {...register('birthDate')}
          placeholder="Nasceu em"
          autoComplete="bday-day"
          type="date"
          className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
          required
        />
        {errors.birthDate && <span className="text-red-500">{errors.birthDate?.message}</span>}
        <select
          {...register('gender')}
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
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
          placeholder="Endereço Completo onde moram com o Aluno"
          autoComplete="address-level1"
          type="text"
          className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
        />
        {errors.address && <span className="text-red-500">{errors.address?.message}</span>}
      </>
    )
  }
  const EnrollmentForm: React.FC = () => {
    return (
      <>
        <div className="flex flex-col gap-12 justify-between">
          <div className="flex flex-col gap-4 ">
            <label htmlFor="classId">
              Turma <span className="text-orange-700">*</span>
            </label>
            {isLoadingClasses && <div className="text-sm text-zinc-400">Carregando turmas...</div>}
            {errorClasses && (
              <div className="text-sm text-red-500">
                Erro ao carregar turmas: {errorClasses.message}
              </div>
            )}
            <select
              id="classId"
              {...register('classId')}
              disabled={isLoadingClasses || !!errorClasses}
              className="flex-1 w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option selected>Selecione uma turma</option>
              {classRooms?.map((room, index) => (
                <option value={room?._id} key={index}>
                  {room?.className}
                </option>
              ))}
            </select>
            {errors.classId && <span className="text-red-500">{errors.classId?.message}</span>}
          </div>
          <div className="flex flex-col justify-between gap-4">
            <label htmlFor="doc_file">Cópia do Documento de Identidade (tamanho máx. 1MB)</label>
            <input
              id="doc_file"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              {...register('doc_file')}
              className="flex-1 w-full h-12 p-3  bg-zinc-950 border rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
            />
            <label htmlFor="image_file">Foto 4x4 (tamanho máx. 1MB)</label>
            <input
              id="image_file"
              type="file"
              accept=".png,.jpg,.jpeg"
              {...register('image_file')}
              className="flex-1 w-full h-12 p-3  bg-zinc-950 rounded-md  border focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
            />
          </div>
          {/* TODO: colocar resumo financeiro de tudo que sera pago
           <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <label htmlFor="enrollmentFee">Taxa de Inscrição (Kz)</label>
              <input
                id="enrollmentFee"
                type="number"
                disabled
                defaultValue={0}
                className="w-full h-12 p-3  bg-zinc-950 rounded-md  border focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
              />
            </div>
          </div> */}
          <input type="hidden" value={user?._id} {...register('userId')} />
          <input type="hidden" value={center?._id} {...register('centerId')} />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isLoadingClasses || !!errorClasses}
          className="flex items-center justify-center bg-orange-700 w-1/6 h-12 p-3 mt-6 text-white shadow-shape rounded-md self-end hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <Rings height="32" width="32" color="#fff" ariaLabel="bars-loading" visible={true} />
          ) : (
            'Finalizar'
          )}
        </button>
      </>
    )
  }

  return (
    <div className="border rounded mt-6 border-zinc-800">
      <nav>
        <ul className="flex items-center justify-around bg-zinc-800 h-12 gap-24">
          <li
            className={`text-zinc-400 flex-1 h-full flex items-center justify-center cursor-pointer bg-zinc-800 hover:brightness-150 ${activeForm === 'student' && 'brightness-150'}`}
            onClick={() => {
              setActiveForm('student')
            }}
          >
            Dados Pessoais
          </li>
          <li
            className={`text-zinc-400 flex-1 h-full flex items-center justify-center cursor-pointer bg-zinc-800 hover:brightness-150 ${activeForm === 'contact' && 'brightness-150'}`}
            onClick={() => {
              setActiveForm('contact')
            }}
          >
            Contactos
          </li>
          <li
            className={`text-zinc-400 flex-1 h-full flex items-center justify-center cursor-pointer bg-zinc-800 hover:brightness-150 ${activeForm === 'enrollment' && 'brightness-150'}`}
            onClick={() => {
              setActiveForm('enrollment')
            }}
          >
            Dados da Inscrição
          </li>
        </ul>
      </nav>
      <div className="px-8 my-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-3 flex-col my-2"
          encType="multipart/form-data"
        >
          {activeForm === 'student' ? (
            <StudentForm />
          ) : activeForm === 'contact' ? (
            <ContactForm />
          ) : (
            <EnrollmentForm />
          )}
        </form>
      </div>
    </div>
  )
}
