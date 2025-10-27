import apiMananger from './api'
import { IPaymentForShow } from './payment-service'

export interface IFinancialPlan {
  _id?: string
  schoolYear: string
  month: string
  year: number
  enrollmentId: string
  centerId: string
  userId: string
  status: 'paid' | 'pending' | 'overdue'
  dueDate: Date
  tutionFee: number
  linkedPayment?: string
}

export interface IFinancialPlanToShow {
  _id?: string
  schoolYear: string
  month: string
  year: number
  enrollmentId: string
  centerId: string
  userId: string
  status: 'paid' | 'pending' | 'overdue'
  dueDate: Date
  tutionFee: number
  linkedPayment?: IPaymentForShow
}

export async function getFinancialPlanForStudentService(
  centerId: string,
  enrollmentId: string,
  queryConfig: { status: string; schoolYear: string }
): Promise<IFinancialPlanToShow[]> {
  try {
    const { data } = await apiMananger.get(
      `/financial-plan/${centerId}/enrollment/${enrollmentId}?status=${queryConfig.status}&schoolYear=${queryConfig.schoolYear}`
    )
    return data
  } catch (error) {
    console.error('Erro ao buscar plano financeiro do aluno', error)
    throw error
  }
}
