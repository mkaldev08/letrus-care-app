import apiMananger from './api'
import { IEnrollmentForShow } from './enrollment-service'
import { IAuth } from './user'

export interface IPayment {
  _id?: string
  enrollmentId: string
  amount: number
  paymentDate?: Date
  paymentMonthReference: string
  paymentYearReference: number
  dueDate?: Date
  status?: 'paid' | 'pending' | 'overdue'
  paymentMethod?: 'Dinheiro' | 'Multicaixa Express' | 'Transferência Bancária (ATM)'
  centerId: string
  userId: string
  lateFee: number
}

export interface IPaymentForShow {
  _id?: string
  enrollmentId: IEnrollmentForShow
  amount: number
  paymentDate?: Date
  paymentMonthReference: string
  paymentYearReference: number
  dueDate?: Date
  status?: 'paid' | 'pending' | 'overdue'
  paymentMethod?: 'Dinheiro' | 'Multicaixa Express' | 'Transferência Bancária (ATM)'
  centerId: string
  userId: IAuth
  lateFee: number
}

export interface IPaymentReceipt {
  receiptNumber: string
  paymentId: string
}

export async function createPaymentService(data): Promise<void> {
  try {
    const {
      enrollmentId,
      amount,
      paymentDate,
      paymentMonthReference,
      targetSchoolYearReference,
      paymentMethod,
      centerId,
      userId,
      lateFee
    } = data
    await apiMananger.post('/payments/new', {
      enrollmentId,
      amount,
      paymentDate,
      paymentMonthReference,
      schoolYearId: targetSchoolYearReference,
      paymentMethod,
      centerId,
      userId,
      lateFee
    })
  } catch (error) {
    console.log('Erro ao fazer pagamento: ', error)
    throw error
  }
}
interface IResponse {
  payments: IPaymentForShow[]
  totalPayments: number
}

export async function getAllPaymentsService(centerId: string, page: number): Promise<IResponse> {
  try {
    const result = await apiMananger.get(`/payments/all/${centerId}?page=${page}`)
    return result.data
  } catch (error) {
    console.log('Erro ao buscar pagamentos: ', error)
    throw error
  }
}

export async function getStudentPaymentsService(enrollmentId: string): Promise<IPayment[]> {
  try {
    const { data: results } = await apiMananger.get(`/payments/student/${enrollmentId}`)
    console.log('Pagamentos do estudante: ', results)
    return results
  } catch (error) {
    console.log('Erro ao buscar pagamentos do estudante: ', error)
    throw error
  }
}

export async function getPaymentService(
  id: string
): Promise<{ payment: IPaymentForShow; receipt: IPaymentReceipt }> {
  try {
    const { data: result } = await apiMananger.get(`/payments/${id}`)
    return result
  } catch (error) {
    console.log('Erro ao buscar pagamento: ', error)
    throw error
  }
}

export const searchPaymentsService = async (
  centerId: string,
  query: string
): Promise<IResponse> => {
  try {
    const { data } = await apiMananger.get(`/payments/search/${centerId}?query=${query}`)
    return data
  } catch (error) {
    console.log('Erro ao pesquisar pagamentos: ', error)
    throw error
  }
}
