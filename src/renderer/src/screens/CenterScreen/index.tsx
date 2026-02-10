import { yupResolver } from '@hookform/resolvers/yup'
import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'
import { PageHeader } from '@renderer/components/shared/PageHeader'
import { CenterLogoUpload } from '@renderer/components/CenterLogoUpload'
import { useCenter } from '@renderer/contexts/center-context'
import { CircleHelp } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import * as yup from 'yup'
import { useCurrentSchoolYearQuery } from '@renderer/hooks/queries/useSchoolYearQueries'
import {
  useEditCenterMutation,
  useUploadCenterLogoMutation
} from '@renderer/hooks/queries/useCenterQueries'

const schema = yup
  .object({
    name: yup.string().required('Preencha o Nome do Centro'),
    address: yup.string().required('Preencha o endereço do centro'),
    phoneNumber: yup.string().required('Preencha o Telefone'),
    email: yup.string().email('Email Inválido'),
    nif: yup.string(),
    documentCode: yup.string()
  })
  .required()
type CenterFormData = yup.InferType<typeof schema>

export const CenterScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { center, centerImage } = useCenter()

  // React Query hooks
  const editCenterMutation = useEditCenterMutation()
  const uploadLogoMutation = useUploadCenterLogoMutation()
  const { data: currentSchoolYear } = useCurrentSchoolYearQuery(center?._id)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CenterFormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: CenterFormData): Promise<void> => {
    if (!center?._id) return

    try {
      const { address, email, name, phoneNumber } = data
      await editCenterMutation.mutateAsync({
        centerId: center._id,
        data: { address, email, name, phoneNumber }
      })

      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Centro editado com sucesso!',
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
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Erro ao editar centro',
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

  const handleUploadImage = async (formData: FormData): Promise<void> => {
    if (!center?._id) return

    try {
      await uploadLogoMutation.mutateAsync({
        centerId: center._id,
        formData
      })

      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Imagem carregada com sucesso',
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
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Erro ao carregar imagem',
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

  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <PageHeader title={center?.name.toLocaleUpperCase() ?? 'Centro'} />

            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col my-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10/12">
                  <label htmlFor="center-name">
                    Nome <span className="text-orange-700">*</span>
                  </label>
                  <input
                    id="center-name"
                    defaultValue={center?.name}
                    {...register('name')}
                    placeholder="Ex.: Centro ABC"
                    type="text"
                    className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0 border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                  />
                  <span className="text-red-500">{errors.name?.message}</span>
                </div>
                <CenterLogoUpload
                  centerImage={centerImage}
                  onUpload={handleUploadImage}
                  isUploading={uploadLogoMutation.isPending}
                />
              </div>
              <div className="flex items-center gap-12 justify-between my-4">
                <div className="flex flex-col gap-4 w-1/2">
                  <label htmlFor="center-address">
                    Endereço <span className="text-orange-700">*</span>
                  </label>
                  <input
                    id="center-address"
                    defaultValue={center?.address}
                    {...register('address')}
                    placeholder="Endereço do Centro"
                    type="text"
                    className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0 border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                  />
                  {errors.address && (
                    <span className="text-red-500">{errors.address?.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-4 w-1/2">
                  <label htmlFor="year-school">
                    Ano Letivo <span className="text-orange-700">*</span>
                  </label>
                  <input
                    disabled
                    id="year-school"
                    value={currentSchoolYear?.description ?? ''}
                    placeholder="Ano Letivo"
                    type="text"
                    className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0 border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-12 justify-between my-4">
                <div className="flex flex-col gap-4 w-1/2">
                  <label htmlFor="center-code" className="flex gap-1">
                    Código do Centro{' '}
                    <span className="text-orange-700 hover:cursor-pointer">
                      <CircleHelp size={16} />
                    </span>
                  </label>
                  <input
                    defaultValue={center?.documentCode}
                    disabled
                    id="center-code"
                    {...register('documentCode')}
                    placeholder="Ex.: ABC"
                    type="text"
                    className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0 border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                  />
                  {errors.documentCode && (
                    <span className="text-red-500">{errors.documentCode?.message}</span>
                  )}
                  <label htmlFor="center-nif" className="flex gap-1">
                    NIF{' '}
                    <span className="text-orange-700 hover:cursor-pointer">
                      <CircleHelp size={16} />
                    </span>
                  </label>
                  <input
                    id="center-nif"
                    {...register('nif')}
                    defaultValue={center?.nif}
                    disabled
                    placeholder="número de contribuinte"
                    type="text"
                    className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                  />
                  {errors.nif && <span className="text-red-500">{errors.nif?.message}</span>}
                </div>
                <div className="flex flex-col gap-4 w-1/2">
                  <label htmlFor="center-phone">
                    Telefone <span className="text-orange-700">*</span>
                  </label>
                  <input
                    id="center-phone"
                    {...register('phoneNumber')}
                    defaultValue={center?.phoneNumber}
                    placeholder="Número de Telefone"
                    autoComplete="tel"
                    type="tel"
                    className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0 border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-500">{errors.phoneNumber?.message}</span>
                  )}
                  <label htmlFor="center-email">
                    Email <span className="text-orange-700">*</span>
                  </label>
                  <input
                    id="center-email"
                    {...register('email')}
                    defaultValue={center?.email}
                    placeholder="E-mail"
                    autoComplete="email"
                    type="email"
                    className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0 border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                  />
                  {errors.email && <span className="text-red-500">{errors.email?.message}</span>}
                </div>
              </div>
              <button
                type="submit"
                disabled={editCenterMutation.isPending}
                className="bg-orange-700 w-1/6 h-12 p-3 text-white shadow-shape rounded-md self-end hover:bg-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editCenterMutation.isPending ? 'Salvando...' : 'Salvar'}
              </button>
            </form>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
