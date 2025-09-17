import apiMananger from './api'

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

export async function getFinancialPlanForStudentService(
  centerId: string,
  enrollmentId: string,
  queryConfig: { status: string; schoolYear: string }
): Promise<IFinancialPlan[]> {
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
