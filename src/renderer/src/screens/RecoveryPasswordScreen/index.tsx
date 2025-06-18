import { LogoLectrus } from '@renderer/components/LogoLectrus'
import React, { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Rings } from 'react-loader-spinner'
import * as yup from 'yup'
import { findUserService } from '@renderer/services/user'

import { MoveLeft } from 'lucide-react'
import { Link } from 'react-router'
import { Modal } from '@renderer/components/Modal'
import { VerifyOtp } from './VerifyOtp'

const schema = yup
  .object({
    username: yup.string().required('Preecha seu username').trim().lowercase()
  })
  .required()
type FormData = yup.InferType<typeof schema>

export const RecoveryPasswordScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = (): void => setIsModalOpen(true)
  const closeModal = (): void => setIsModalOpen(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const userId = await findUserService(data.username)
      if (userId) openModal()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="justify-center items-center flex w-full h-dvh bg-orange-700 bg-pattern bg-no-repeat bg-center bg-cover">
      <section className="w-1/2 h-auto flex flex-col  text-zinc-100 bg-zinc-800 rounded-lg shadow-md p-10">
        <Link
          to={'/login'}
          className="hover:opacity-80 transition-all bg-orange-700 rounded-md w-10 flex items-center justify-center"
          title="Voltar"
        >
          <MoveLeft />
        </Link>
        <LogoLectrus sizeFont="text-3xl" sizeImage={40} />

        <h2 className="font-bold text-gray-200 text-2xl mt-10 mb-12 max-md:mt-12 max-md:mb-8">
          Encontre seu usuário
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col ">
          <label className="text-gray-200" htmlFor="username">
            Username
          </label>
          <input
            {...register('username')}
            placeholder="Seu nome de usuário"
            id="username"
            autoComplete="username webauthn"
            type="text"
            className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
          />
          <span className="text-red-500">{errors.username?.message}</span>
          <button
            type="submit"
            className="flex items-center justify-center bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md"
          >
            {isSubmitting ? (
              <Rings height="32" width="32" color="#fff" ariaLabel="bars-loading" visible={true} />
            ) : (
              'Encontrar'
            )}
          </button>
        </form>
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <VerifyOtp />
      </Modal>
    </div>
  )
}
