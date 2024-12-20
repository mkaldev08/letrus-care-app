import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@renderer/contexts/auth-context'
import { useCenter } from '@renderer/contexts/center-context'
import { getEnrollmentByStudentService } from '@renderer/services/enrollment-service'
import { createPaymentService } from '@renderer/services/payment-service'
import { formateCurrency } from '@renderer/utils/format'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import * as yup from 'yup'
import { getMonths, getYearsInterval } from '@renderer/utils/date'

const schemaPayment = yup
  .object({
    enrollmentId: yup.string().required(),
    amount: yup.number().required(),
    paymentMonthReference: yup.string().required(),
    paymentYearReference: yup.number().required(),
    paymentMethod: yup
      .string()
      .oneOf(['Dinheiro', 'Multicaixa Express', 'Transferência Bancária (ATM)'])
      .required(),
    centerId: yup.string().required(),
    userId: yup.string().required(),
    notes: yup.string()
  })
  .required()

type FormPaymentData = yup.InferType<typeof schemaPayment>

// Componente de formulário de pagamento
interface PaymentFormProps {
  resultsInForm: object | null
}
export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  // Hook do formulário de pagamento
  const { register, handleSubmit, setValue } = useForm<FormPaymentData>({
    resolver: yupResolver(schemaPayment)
  })

  const yearsList = getYearsInterval() // Obter lista de anos
  const monthsList = getMonths() // Obter lista de meses

  const { user } = useAuth()
  const { center } = useCenter()

  const paymentMethods = ['Dinheiro', 'Multicaixa Express', 'Transferência Bancária (ATM)']
  const [enrollmentByStudent, setEnrollmentByStudent] = useState<object | null>(null)
  const onSubmitPaymentForm = async (data: FormPaymentData): Promise<void> => {
    console.log('Dados submetidos:', data)
    try {
      await createPaymentService(data)
      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Pagamento Efeito com sucesso, baixe o comprovativo!!',
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
      const errorMessage = error?.response?.data?.message || 'Erro inesperado'
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: errorMessage,
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: 'h-44 p-2', title: 'text-sm', icon: 'text-xs' },
        timerProgressBar: true
      })
      console.log('Erro ao realizar pagamento no front: ', error)
    }
  }

  useEffect(() => {
    async function getEnrollmentByStudent(studentId: string): Promise<void> {
      if (studentId) {
        const enrollment = await getEnrollmentByStudentService(studentId)
        setEnrollmentByStudent(enrollment)
      }
    }
    getEnrollmentByStudent(props.resultsInForm?._id)
  }, [props.resultsInForm])

  useEffect(() => {
    const totalAmount = Number(
      enrollmentByStudent?.courseId?.fee + enrollmentByStudent?.courseId?.feeFine
    )
    setValue('amount', totalAmount)

    if (enrollmentByStudent?._id) {
      setValue('enrollmentId', enrollmentByStudent?._id)
    }
  }, [enrollmentByStudent, setValue])

  // Limpa Todos os Campos
  // function resetStatesAndFields(): void {
  //   setIsSelected(false)
  //   setResults(null)
  //   setEnrollmentByStudent(null)
  //   resetSearch()
  // }

  return (
    <>
      <form className="flex flex-col gap-4 flex-1" onSubmit={handleSubmit(onSubmitPaymentForm)}>
        {/* Informações do Aluno */}
        <h3 className="text-xl text-zinc-100 space-y-2">Dados do Estudante</h3>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-300" htmlFor="fullName">
            Nome Completo
          </label>
          <input
            id="fullName"
            placeholder="Nome Completo do Aluno"
            type="text"
            value={props.resultsInForm?.name?.fullName}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
            disabled
          />
          <label className="text-zinc-300" htmlFor="studentCode">
            Código do Aluno
          </label>
          <input
            id="studentCode"
            placeholder="Código do Aluno"
            type="text"
            value={props.resultsInForm?.studentCode}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
            disabled
          />
        </div>
        Dados do Pagamento
        <h3 className="text-xl text-zinc-100 space-y-2">Detalhes do Pagamento</h3>
        <div className="flex flex-col gap-2">
          {/* Mês de Referência */}
          <label className="text-zinc-300" htmlFor="month-select">
            Mês de Referência
          </label>
          <select
            id="month-select"
            defaultValue={monthsList[new Date().getMonth()]}
            {...register('paymentMonthReference')}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
          >
            {monthsList.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Ano de Referência */}
          <label className="text-zinc-300" htmlFor="year-select">
            Ano de Referência
          </label>
          <select
            id="year-select"
            defaultValue={new Date().getFullYear()}
            {...register('paymentYearReference')}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
          >
            {yearsList.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Valor a Pagar */}
          <label className="text-zinc-300">Propina</label>
          <input
            value={formateCurrency(enrollmentByStudent?.courseId?.fee)}
            disabled
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
            placeholder="Exemplo: 150.00"
          />
          <label className="text-zinc-300">Multa</label>
          <input
            value={formateCurrency(enrollmentByStudent?.courseId?.feeFine)}
            disabled
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
            placeholder="Exemplo: 150.00"
          />
          <label className="text-zinc-300">Valor a Pagar</label>
          <input
            disabled
            {...register('amount')}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
            placeholder="Exemplo: 150.00"
          />

          {/* Método de Pagamento */}
          <label className="text-zinc-300" htmlFor="payment-method">
            Método de Pagamento
          </label>
          <select
            id="payment-method"
            {...register('paymentMethod')}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          {/* Observações */}
          <label className="text-zinc-300" htmlFor="notes">
            Observações
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            className="w-full p-2 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
            placeholder="Insira detalhes adicionais sobre o pagamento, se necessário."
          ></textarea>
        </div>
        {/* Dados Ocultos */}
        <input
          type="hidden"
          defaultValue={enrollmentByStudent?._id}
          {...register('enrollmentId')}
        />
        <input type="hidden" defaultValue={center?._id} {...register('centerId')} />
        <input type="hidden" defaultValue={user?._id} {...register('userId')} />
        {/* Botões */}
        <div className="flex gap-8 items-center">
          <button
            type="submit"
            className="bg-orange-600 text-white rounded-md py-2 mt-4 hover:bg-orange-700 transition-all p-2"
          >
            Confirmar Pagamento
          </button>
          <button
            type="reset"
            // onClick={resetStatesAndFields}
            className="bg-red-600 text-white rounded-md py-2 mt-4 hover:bg-red-700 transition-all p-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  )
}
