import React, { useEffect, useMemo, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@renderer/contexts/auth-context'
import { useCenter } from '@renderer/contexts/center-context'
import {
  changeStatusService,
  getEnrollmentByStudentService,
  IEnrollmentForShow
} from '@renderer/services/enrollment-service'
import { createPaymentService, getStudentPaymentsService } from '@renderer/services/payment-service'
import { formateCurrency } from '@renderer/utils/format'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useNavigate } from 'react-router'
import { IStudent } from '@renderer/services/student'
import { Rings } from 'react-loader-spinner'
import {
  getFinancialPlanForStudentService,
  IFinancialPlanToShow
} from '@renderer/services/financial-plan-services'
import { getSchoolYearsServiceAll, ISchoolYear } from '@renderer/services/school-year-service'
import Swal from 'sweetalert2'

const schemaPayment = yup.object({
  enrollmentId: yup.string().required(),
  amount: yup.number().required(),
  lateFee: yup.number().required(),
  paymentMonthReference: yup.string().required(),
  targetSchoolYearReference: yup.string().required(),
  paymentMethod: yup.string().required(),
  centerId: yup.string().required(),
  userId: yup.string().required(),
  notes: yup.string().nullable()
})

type FormPaymentData = yup.InferType<typeof schemaPayment>

interface PaymentFormProps {
  resultsInForm: IStudent | null
  enrollmentDataFromForm?: IEnrollmentForShow | null
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  resultsInForm,
  enrollmentDataFromForm
}) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { center } = useCenter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm<FormPaymentData>({
    resolver: yupResolver(schemaPayment)
  })

  const [enrollment, setEnrollment] = useState<IEnrollmentForShow | null>(null)
  const [schoolYears, setSchoolYears] = useState<ISchoolYear[]>([])
  const [financialPlans, setFinancialPlans] = useState<IFinancialPlanToShow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const targetSchoolYear = watch('targetSchoolYearReference')
  const paymentMonth = watch('paymentMonthReference')

  useEffect(() => {
    if (!resultsInForm?._id) return

    const loadEnrollment = async (): Promise<void> => {
      if (!enrollmentDataFromForm) {
        const data = await getEnrollmentByStudentService(String(resultsInForm._id))
        console.log('data from Req', data)
        setEnrollment(data)
        setValue('enrollmentId', String(data._id))
        return
      }
      console.log('enrollmentDataFromForm: ', enrollmentDataFromForm)
      setEnrollment(enrollmentDataFromForm)
      setValue('enrollmentId', String(enrollmentDataFromForm._id))
    }

    loadEnrollment()
  }, [resultsInForm?._id, setValue, enrollmentDataFromForm])

  useEffect(() => {
    if (!center?._id) return

    const loadYears = async (): Promise<void> => {
      const years = await getSchoolYearsServiceAll(String(center?._id))
      setSchoolYears(years)

      const current = years.find((y) => y.isCurrent) ?? years[0]
      if (current) {
        setValue('targetSchoolYearReference', String(current._id))
      }
    }

    loadYears()
  }, [center?._id, setValue])

  useEffect(() => {
    if (!enrollment?._id || !targetSchoolYear) return

    const loadPlans = async (): Promise<void> => {
      //FIXME: muda o enrollment a cada vez que muda o ano de referencia (ver como fazer isso de forma mais eficiente)

      const plans = await getFinancialPlanForStudentService(
        String(center?._id),
        String(enrollment?._id),
        { status: 'all', schoolYear: targetSchoolYear }
      )
      setFinancialPlans(plans)
    }

    loadPlans()
  }, [enrollment?._id, targetSchoolYear, center?._id])

  const { amount, lateFee } = useMemo(() => {
    if (!enrollment || !paymentMonth || !targetSchoolYear) {
      return { amount: 0, lateFee: 0 }
    }

    const plan = financialPlans.find(
      (p) => p.month === paymentMonth && p.schoolYear === targetSchoolYear
    )

    if (!plan) {
      return { amount: 0, lateFee: 0 }
    }

    const fee = Number(enrollment.tuitionFeeId?.fee) || 0
    const fine = Number(enrollment.tuitionFeeId?.feeFine) || 0

    const due = new Date(plan.dueDate)
    due.setHours(23, 59, 59, 999)

    const isLate = new Date() > due
    const late = isLate ? fine : 0

    return {
      lateFee: late,
      amount: fee + late
    }
  }, [enrollment, financialPlans, paymentMonth, targetSchoolYear])

  useEffect(() => {
    setValue('lateFee', lateFee)
    setValue('amount', amount)
    setValue('centerId', center?._id as string)
    setValue('userId', user?._id as string)

    setIsLoading(false)
  }, [lateFee, amount, center?._id, user?._id, setValue])

  const onSubmit = async (data: FormPaymentData): Promise<void> => {
    try {
      await createPaymentService(data)

      const payments = await getStudentPaymentsService(String(enrollment?._id))
      if (payments.length === 1 || enrollment?.status === 'pending') {
        await changeStatusService(String(enrollment?._id), 'completed')
      }

      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Sucesso, baixe o comprovativo.',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'h-44 p-2',
          title: 'text-sm',
          icon: 'text-xs'
        },
        timerProgressBar: true
      })

      navigate('/payments')
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erro inesperado'
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: errorMessage,
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: 'h-44 p-2', title: 'text-sm', icon: 'text-xs' },
        timerProgressBar: true
      })
    }
  }

  if (isLoading || !resultsInForm) {
    return (
      <div className="flex justify-center items-center h-full">
        <Rings height="80" width="80" color="#f97316" visible />
      </div>
    )
  }

  return (
    <>
      <form className="flex flex-col gap-4 flex-1" onSubmit={handleSubmit(onSubmit)}>
        {/* Informações do Aluno */}
        <h3 className="text-xl text-zinc-100 space-y-2">Dados do Estudante</h3>
        <label className="text-zinc-300" htmlFor="fullName">
          Nome Completo
        </label>
        <input
          id="fullName"
          placeholder="Nome Completo do Aluno"
          type="text"
          value={resultsInForm?.name?.fullName}
          className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
          disabled
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-300" htmlFor="studentCode">
              Código do Aluno
            </label>
            <input
              id="studentCode"
              placeholder="Código do Aluno"
              type="text"
              value={resultsInForm?.studentCode}
              className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
              disabled
            />
            <label className="text-zinc-300" htmlFor="class">
              Turma
            </label>
            <input
              id="class"
              placeholder="Turma"
              type="text"
              value={enrollment?.classId?.className || ''}
              className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-300" htmlFor="grade">
              Classe
            </label>
            <input
              id="grade"
              placeholder="Classe"
              type="text"
              value={enrollment?.classId?.grade?.grade || ''}
              className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
              disabled
            />
            <label className="text-zinc-300" htmlFor="course">
              Curso
            </label>
            <input
              id="course"
              placeholder="Curso"
              type="text"
              value={enrollment?.classId?.course?.name || ''}
              className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
              disabled
            />
          </div>
        </div>
        <h3 className="text-xl text-zinc-100 space-y-2">Detalhes do Pagamento</h3>
        <div className="flex flex-col gap-2">
          {/* Ano de Referência */}
          <label className="text-zinc-300" htmlFor="year-select">
            Ano de Referência
          </label>
          <select
            id="year-select"
            {...register('targetSchoolYearReference')}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
          >
            {schoolYears.map((y) => (
              <option key={y._id} value={y._id}>
                {y.description}
              </option>
            ))}
          </select>

          {/* Mês de Referência */}
          <label className="text-zinc-300 font-medium" htmlFor="month-select">
            Mês de Referência
          </label>
          <select
            id="month-select"
            {...register('paymentMonthReference')}
            className="w-full h-12 p-3 bg-zinc-950 rounded-lg border border-gray-700 text-gray-100 appearance-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
            disabled={financialPlans.length === 0}
          >
            {financialPlans.length > 0 ? (
              financialPlans.map((plan) => (
                <option key={plan._id} value={plan.month}>
                  {plan.month}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {isLoading ? 'A carregar anos...' : 'Nenhum mês disponível'}
              </option>
            )}
          </select>

          {/* Valor a Pagar */}
          <label className="text-zinc-300">Propina</label>
          <input
            value={formateCurrency(enrollment?.tuitionFeeId.fee)}
            disabled
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
            placeholder="Exemplo: 150.00"
          />
          <label className="text-zinc-300">Multa</label>
          <input
            value={formateCurrency(lateFee)}
            {...register('lateFee')}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
            placeholder="Exemplo: 150.00"
            disabled
          />
          <label className="text-zinc-300">Valor a Pagar</label>
          <input
            value={formateCurrency(amount)}
            {...register('amount')}
            className="w-full h-12 p-3 bg-zinc-950 rounded-md border-gray-700 text-gray-100"
            placeholder="Exemplo: 150.00"
            disabled
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
            <option>Dinheiro</option>
            <option>Multicaixa Express</option>
            <option>Transferência Bancária (ATM)</option>
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
        <input type="hidden" defaultValue={enrollment?._id} {...register('enrollmentId')} />
        <input type="hidden" defaultValue={center?._id} {...register('centerId')} />
        <input type="hidden" defaultValue={user?._id} {...register('userId')} />
        {/* Botões */}
        <div className="flex gap-8 items-center">
          {isSubmitting ? (
            <button
              type="button"
              disabled
              className="bg-orange-600 text-white rounded-md py-2 mt-4 hover:bg-orange-700 transition-all p-2"
            >
              <Rings height="32" width="32" color="#fff" ariaLabel="bars-loading" visible={true} />
            </button>
          ) : (
            <button
              type="submit"
              className="bg-orange-600 text-white rounded-md py-2 mt-4 hover:bg-orange-700 transition-all p-2"
              disabled={!resultsInForm || isSubmitting}
            >
              Confirmar Pagamento
            </button>
          )}
          <button
            type="reset"
            onClick={() => {
              navigate('/payments')
            }}
            className="bg-red-600 text-white rounded-md py-2 mt-4 hover:bg-red-700 transition-all p-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  )
}
