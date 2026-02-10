import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Rings } from 'react-loader-spinner'
import { useCreateSchoolYearMutation } from '@renderer/hooks/queries/useSchoolYearQueries'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useCenter } from '@renderer/contexts/center-context'

const schema = yup
  .object({
    description: yup.string().required('Especifique um nome'),
    startDate: yup.date().required(),
    endDate: yup.date().required(),
    isCurrent: yup.boolean().default(false)
  })
  .required()
type FormData = yup.InferType<typeof schema>

export const ModalCreateSchoolYear: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const MySwal = withReactContent(Swal)
  const { center } = useCenter()
  const createSchoolYearMutation = useCreateSchoolYearMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await createSchoolYearMutation.mutateAsync({
        data,
        centerId: center?._id as string
      })
      onClose()
      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Ano registado',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'h-44 p-2', // Define a largura e o padding do card
          title: 'text-sm', // Tamanho do texto do título
          icon: 'text-xs' // Reduz o tamanho do ícone
        },
        timerProgressBar: true
      })
    } catch (error) {
      MySwal.fire({
        title: 'Erro interno',
        text: 'Erro ao cadastrar ano letivo.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col my-[5%]">
      <label className="text-gray-200" htmlFor="description">
        Descrição
      </label>
      <input
        {...register('description')}
        placeholder="Ex.: 2019-20"
        id="description"
        type="text"
        className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
      />
      <span className="text-red-500">{errors.description?.message}</span>

      <label className="text-gray-200" htmlFor="startDate">
        Data de Inicio
      </label>
      <input
        {...register('startDate')}
        id="startDate"
        type="date"
        className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
      />
      <span className="text-red-500">{errors.startDate?.message}</span>
      <label className="text-gray-200" htmlFor="endDate">
        Data de Término
      </label>
      <input
        {...register('endDate')}
        id="endDate"
        type="date"
        className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
      />
      <span className="text-red-500">{errors.endDate?.message}</span>
      <button
        type="submit"
        disabled={isSubmitting || createSchoolYearMutation.isPending}
        className="flex items-center justify-center bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md disabled:opacity-50"
      >
        {isSubmitting || createSchoolYearMutation.isPending ? (
          <Rings height="32" width="32" color="#fff" ariaLabel="bars-loading" visible={true} />
        ) : (
          'Criar'
        )}
      </button>
    </form>
  )
}
