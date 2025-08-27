import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useAuth } from '@renderer/contexts/auth-context'
import { Link, useNavigate } from 'react-router'
import { useCenter } from '@renderer/contexts/center-context'
import { Rings } from 'react-loader-spinner'

const schema = yup
  .object({
    username: yup.string().required('Preecha seu username'),
    password: yup.string().required('Preecha sua senha')
  })
  .required()
type FormData = yup.InferType<typeof schema>

export const LoginForm: React.FC = () => {
  const MySwal = withReactContent(Swal)

  const { login, loading } = useAuth()
  const { centerExistsContext } = useCenter()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const response = await login(data)
      if (!loading) {
        // Se o login falhar, o fluxo será interrompido pelo catch
        if (!response?._id) return

        const isExists = await centerExistsContext(response._id)
        if (!isExists) {
          return navigate('/centers/new')
        }

        // Navega para a home
        navigate('/home')
      }
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data?: { error: string } } }
      if (err.response?.status === 401) {
        MySwal.fire({
          title: 'Erro',
          text: `${err.response?.data?.error || 'Erro de autenticação'}`,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return
      }

      if (err.response?.status === 404) {
        return navigate('/centers/new')
      }
      MySwal.fire({
        title: 'Erro',
        text: `Erro Interno`,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  //SEACH: Erro quando uso method Post
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col my-[5%]">
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
      <label className="text-gray-200" htmlFor="password">
        Senha
      </label>
      <input
        {...register('password')}
        placeholder="Sua senha"
        id="password"
        autoComplete="password webauthn"
        type="password"
        className="w-full h-12 p-3  bg-zinc-950 rounded-md  focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
      />
      <span className="text-red-500">{errors.password?.message}</span>
      <Link
        to="/recovery-password"
        target="_self"
        className="text-orange-600 mb-5 w-[63%] max-md:w-[53%]"
      >
        Esqueci minha senha
      </Link>
      <button
        type="submit"
        className="flex items-center justify-center bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md"
      >
        {isSubmitting ? (
          <Rings height="32" width="32" color="#fff" ariaLabel="bars-loading" visible={true} />
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  )
}
