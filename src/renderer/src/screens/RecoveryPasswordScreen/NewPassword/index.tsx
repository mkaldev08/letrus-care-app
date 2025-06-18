import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Rings } from 'react-loader-spinner'
import { Link } from 'react-router'
import { MoveLeft } from 'lucide-react'
import { LogoLectrus } from '@renderer/components/LogoLectrus'

const schema = yup
  .object({
    password: yup
      .string()
      .min(6, 'Insira uma senha com 6 caracteres no mínimo')
      .required('Preecha sua senha'),
    confPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Senhas devem iguais')
      .required('Confirme sua senha')
  })
  .required()

type FormData = yup.InferType<typeof schema>

export const NewPassword: React.FC = () => {
  const {
    register,
    // handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  // const onSubmit = async (data: FormData): Promise<void> => {}

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
          Redefinir Senha
        </h2>
        <form className="flex gap-3 flex-col">
          <label className="text-gray-200" htmlFor="password">
            Senha
          </label>
          <input
            {...register('password')}
            placeholder="Sua senha"
            id="password"
            autoComplete="new-password webauthn"
            type="password"
            className="w-full h-12 p-3 bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
          />
          {errors.password && <span className="text-red-500">{errors.password?.message}</span>}
          <label className="text-gray-200" htmlFor="confPassword">
            Confirmar Senha
          </label>
          <input
            {...register('confPassword')}
            placeholder="Confirme sua senha"
            id="confPassword"
            autoComplete="current-password webauthn"
            type="password"
            className="w-full h-12 p-3  bg-zinc-950 rounded-md focus:border-0  border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
          />
          {errors.confPassword && (
            <span className="text-red-500">{errors.confPassword?.message}</span>
          )}

          <button
            type="submit"
            className="flex items-center justify-center bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md"
          >
            {isSubmitting ? (
              <Rings height="32" width="32" color="#fff" ariaLabel="bars-loading" visible={true} />
            ) : (
              'Redefinir'
            )}
          </button>
        </form>
      </section>
    </div>
  )
}
