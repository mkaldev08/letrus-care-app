import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Rings } from 'react-loader-spinner'
import { verifyOTPService } from '@renderer/services/user'
import { useNavigate } from 'react-router'
// Importe seu serviço de verificação
// import { verifyOtpService } from '@renderer/services/auth'

const schema = yup
  .object({
    otp: yup
      .string()
      .required('Informe o código')
      .matches(/^\d{6}$/, 'O código deve ter 6 dígitos numéricos')
  })
  .required()

type FormData = yup.InferType<typeof schema>

export const VerifyOtp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const navigate = useNavigate()
  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const userId = localStorage.getItem('reqUserId')
      const status = await verifyOTPService(data.otp, userId as string)
      if (status === 200) {
        console.log('Código verificado com sucesso')
        localStorage.removeItem('reqUserId')
        navigate('/new-password')
      }
    } catch (error) {
      setErrorMessage('Erro ao verificar código')
      throw error
    }
  }

  return (
    <>
      <h2 className="font-bold text-gray-200 text-2xl mt-10 mb-12 max-md:mt-12 max-md:mb-8">
        Verifique seu código
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col">
        <label className="text-gray-200" htmlFor="otp">
          Código OTP
        </label>
        <input
          {...register('otp')}
          placeholder="Ex: 123456"
          id="otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 outline-none text-gray-100 text-base font-normal placeholder:text-gray-400 transition-colors"
        />
        {errors.otp && <span className="text-red-500">{errors.otp.message}</span>}
        {errorMessage && <span className="text-red-500">{errorMessage}</span>}

        <button
          type="submit"
          className="flex items-center justify-center bg-orange-700 w-full h-12 p-3 text-white shadow-shape rounded-md"
        >
          {isSubmitting ? (
            <Rings height="32" width="32" color="#fff" ariaLabel="bars-loading" visible={true} />
          ) : (
            'Verificar'
          )}
        </button>
      </form>
    </>
  )
}
