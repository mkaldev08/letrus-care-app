import { yupResolver } from '@hookform/resolvers/yup'
import { Footer } from '@renderer/components/Footer'
import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'
import { useCenter } from '@renderer/contexts/center-context'
import { CircleHelp } from 'lucide-react'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import Logo from '../../assets/logo-vector.png'

import * as yup from 'yup'
import { getCurrentSchoolYearService } from '@renderer/services/school-year-service'

const schema = yup
  .object({
    name: yup.string().required('Preecha o Nome do Centro'),
    address: yup.string().required('Preecha o endereço do centro'),
    phoneNumber: yup.string().required('Preecha o Telefone'),
    email: yup.string().email('Email Inválido'),
    nif: yup.string(),
    documentCode: yup.string()
  })
  .required()
type FormData = yup.InferType<typeof schema>

export const CenterScreen: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { center, editCenterContext, uploadCenterImage, centerImage } = useCenter()

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const { address, email, name, phoneNumber } = data
      await editCenterContext(center?._id as string, {
        address,
        email,
        name,
        phoneNumber
      })

      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Centro Editado com Sucesso!',
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
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Verifique os dados',
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
  //o Logo do centro será usado em todos documentos e apresentado nesta tela, se n definir pega o padrao em Logo
  const [imageFromUser, setImageFromUser] = useState('')
  const [imageFromDB, setImageFromDB] = useState('')

  const [schoolYear, setSchoolYear] = useState('')

  useEffect(() => {
    if (centerImage?.fileData) {
      setImageFromDB(centerImage.fileData)
    }
  }, [centerImage])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectImageForCenter = (): void => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImageFromUser(imageUrl)
    }
  }

  const handleUploadImage = async (): Promise<void> => {
    try {
      const formData = new FormData()
      const file = fileInputRef.current?.files?.[0]

      if (!file) {
        alert('Nenhuma imagem selecionada')
        return
      }

      formData.append('logo', file)
      await uploadCenterImage(center?._id as string, formData)

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

      setImageFromDB(URL.createObjectURL(file))
      setImageFromUser('')
    } catch (error) {
      alert('Erro ao salvar imagem')
      console.error(error)
    }
  }

  async function fetchCurrentYear() {
    const year = await getCurrentSchoolYearService(center?._id as string)
    setSchoolYear(year.description)
  }
  useEffect(() => {
    fetchCurrentYear()
  }, [])

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 justify-center  pt-[62px] lg:pt-[70px] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 pt-4 overflow-auto">
          <div className="flex flex-col flex-1 w-11/12 mx-auto">
            <h2 className="text-3xl text-zinc-400">{center?.name.toLocaleUpperCase()}</h2>
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
                <div className="flex flex-col border shadow-shape border-zinc-700 h-28  bg-transparent rounded-md">
                  <img
                    src={
                      imageFromUser ||
                      (imageFromDB ? `data:${centerImage?.fileType};base64,${imageFromDB}` : Logo)
                    }
                    alt="Logo do Centro"
                    className="w-full h-full"
                  />
                  <input
                    ref={fileInputRef}
                    accept="image/*"
                    type="file"
                    name="logo"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {imageFromUser ? (
                    <button
                      type="submit"
                      className="flex-1 rounded-md bg-orange-700 p-[2px] m-2"
                      onClick={handleUploadImage}
                    >
                      Salvar Imagem
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex-1 rounded-md bg-orange-700 p-[2px] m-2"
                      onClick={handleSelectImageForCenter}
                    >
                      Carregar Imagem
                    </button>
                  )}
                </div>
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
                    className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                  />
                  {errors.address && (
                    <span className="text-red-500">{errors.address?.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-4 w-1/2">
                  <label htmlFor="year-school">
                    Ano Lectivo <span className="text-orange-700">*</span>
                  </label>
                  <input
                    disabled
                    id="year-school"
                    defaultValue={schoolYear}
                    placeholder="Ano Lectivo"
                    type="text"
                    className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
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
                    className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
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
                    autoComplete="tel"
                    type="tel"
                    className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-zinc-500"
                  />
                  {errors.email && <span className="text-red-500">{errors.email?.message}</span>}
                </div>
              </div>
              <button
                type="submit"
                className="bg-orange-700 w-1/6 h-12 p-3 text-white shadow-shape rounded-md self-end"
              >
                Salvar
              </button>
            </form>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
