import React, { useCallback, useEffect, useState } from 'react'
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

const schemaPayment = yup
  .object({
    enrollmentId: yup.string().required('O ID da Matrícula é obrigatório.'),
    amount: yup.number().required('O Valor é obrigatório.'),
    lateFee: yup.number().required('A Multa é obrigatória.'),
    paymentMonthReference: yup.string().required('O Mês de Referência é obrigatório.'),
    targetSchoolYearReference: yup.string().required('O Ano Letivo é obrigatório.'),
    paymentMethod: yup
      .string()
      .oneOf(
        ['Dinheiro', 'Multicaixa Express', 'Transferência Bancária (ATM)'],
        'Método de pagamento inválido.'
      )
      .required('O Método de Pagamento é obrigatório.'),
    centerId: yup.string().required('O ID do Centro é obrigatório.'),
    userId: yup.string().required('O ID do Usuário é obrigatório.'),
    notes: yup.string().nullable()
  })
  .required()

type FormPaymentData = yup.InferType<typeof schemaPayment>

// Componente de formulário de pagamento
interface PaymentFormProps {
  resultsInForm: IStudent | null
}

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  // Hook do formulário de pagamento
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { isSubmitting }
  } = useForm<FormPaymentData>({
    resolver: yupResolver(schemaPayment)
  })

  const { user } = useAuth()
  const { center } = useCenter()
  const navigate = useNavigate()

  const studentData = props.resultsInForm

  const [schoolYears, setSchoolYears] = useState<ISchoolYear[]>([])
  const paymentMethods = ['Dinheiro', 'Multicaixa Express', 'Transferência Bancária (ATM)']
  const [financialPlans, setFinancialPlans] = useState<IFinancialPlanToShow[]>([])
  const [enrollmentByStudent, setEnrollmentByStudent] = useState<IEnrollmentForShow | null>(null)

  const [lateFee, setLateFee] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const paymentMonth = watch('paymentMonthReference')

  const targetSchoolYear = watch('targetSchoolYearReference')

  const getSchoolYears = useCallback(
    async function getSchoolYears(): Promise<void> {
      try {
        const tmp = await getSchoolYearsServiceAll(center?._id as string)

        setSchoolYears(tmp)
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    [center?._id]
  )

  useEffect(() => {
    async function getEnrollmentByStudent(studentId: string): Promise<void> {
      if (studentId) {
        const enrollment = await getEnrollmentByStudentService(studentId)
        setEnrollmentByStudent(enrollment)
      }
    }
    getEnrollmentByStudent(props.resultsInForm?._id as string)
    getSchoolYears()

    setIsLoading(false)
  }, [props.resultsInForm, center, getSchoolYears])

  const getFinancialPlanToPay = useCallback(
    async function getFinancialPlanToPay(
      enrollmentId: string,
      schoolYearArg: string
    ): Promise<void> {
      try {
        const financialPlans = await getFinancialPlanForStudentService(
          center?._id as string,
          enrollmentId,
          { status: 'all', schoolYear: schoolYearArg }
        )
        setFinancialPlans(financialPlans)
      } catch (error) {
        console.error(error)
        setFinancialPlans([])
        throw error
      }
    },
    [center?._id]
  )

  useEffect(() => {
    const studentId = studentData?._id as string
    if (!studentId || !center?._id || !user?._id) return

    setIsLoading(true)

    async function initializeFormData(): Promise<void> {
      try {
        const enrollment = await getEnrollmentByStudentService(studentId)
        setEnrollmentByStudent(enrollment)
        setValue('enrollmentId', enrollment._id as string)

        const years = await getSchoolYearsServiceAll(center?._id as string)
        setSchoolYears(years)

        const currentYear = years.find((year) => year.isCurrent === true)
        const initialYearId = currentYear?._id || years[0]?._id || ''

        setValue('targetSchoolYearReference', initialYearId)
        setValue('centerId', center?._id as string)
        setValue('userId', user?._id as string)
      } catch (error) {
        console.error('Error initializing form data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeFormData()
  }, [studentData?._id, center?._id, user?._id, setValue])

  useEffect(() => {
    const enrollmentId = enrollmentByStudent?._id
    if (!enrollmentId || !targetSchoolYear) {
      setFinancialPlans([])
      return
    }

    getFinancialPlanToPay(enrollmentId, targetSchoolYear)
  }, [enrollmentByStudent, getFinancialPlanToPay, targetSchoolYear])

  useEffect(() => {
    if (financialPlans.length > 0) {
      const currentMonthReference = getValues('paymentMonthReference')
      const firstMonthId = financialPlans[0].month

      const isCurrentMonthInPlans = financialPlans.some(
        (plan) => plan.month === currentMonthReference
      )

      if (!currentMonthReference || !isCurrentMonthInPlans) {
        setValue('paymentMonthReference', firstMonthId)
      }
    } else {
      setValue('paymentMonthReference', '')
    }
  }, [financialPlans, getValues, setValue])

  useEffect(() => {
    async function calculateAmount(): Promise<void> {
      if (!enrollmentByStudent || !paymentMonth || !targetSchoolYear) {
        setLateFee(0)
        setAmount(0)
        setValue('lateFee', 0)
        setValue('amount', 0)
        return
      }

      const today = new Date()
      const currentPlanToPay = financialPlans.find(
        (plan) => plan.schoolYear === targetSchoolYear && plan.month === paymentMonth
      )

      const fee = Number(enrollmentByStudent.classId.course.fee) || 0
      let calculatedLateFee = 0

      if (currentPlanToPay) {
        const referenceDate = new Date(currentPlanToPay.dueDate)
        referenceDate.setHours(23, 59, 59, 999)
        const isLate = today > referenceDate

        const lateFeeRate = enrollmentByStudent.classId.course.feeFine || 0
        calculatedLateFee = isLate ? lateFeeRate : 0
      }

      const totalAmount = fee + calculatedLateFee

      setLateFee(calculatedLateFee)
      setAmount(totalAmount)

      setValue('lateFee', calculatedLateFee)
      setValue('amount', totalAmount)
    }

    calculateAmount()
  }, [enrollmentByStudent, financialPlans, paymentMonth, targetSchoolYear, setValue])

  const onSubmitPaymentForm = async (data: FormPaymentData): Promise<void> => {
    try {
      await createPaymentService(data)
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
      const results = await getStudentPaymentsService(enrollmentByStudent?._id as string)

      if (results.length === 1 || enrollmentByStudent?.status === 'pending') {
        await changeStatusService(enrollmentByStudent?._id as string, 'completed')
      }

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

  if (isLoading || !studentData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Rings height="80" width="80" color="#f97316" ariaLabel="loading" visible={true} />
      </div>
    )
  }

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
            {schoolYears.map((year) => {
              if (year.isCurrent === true) {
                return (
                  <option value={year._id} key={year._id} selected>
                    {year.description}
                  </option>
                )
              }

              return (
                <option value={year._id} key={year._id}>
                  {year.description}
                </option>
              )
            })}
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
            value={formateCurrency(enrollmentByStudent?.classId?.course?.fee)}
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
              disabled={!enrollmentByStudent || isSubmitting}
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
