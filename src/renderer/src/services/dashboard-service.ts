import { DashboardContextData } from '@renderer/hooks/useDashboard'
import apiMananger from './api'
import { TuitionPaymentResponse } from '@renderer/types/dashboard'
export const getDashboardDataService = async (centerId: string): Promise<DashboardContextData> => {
  try {
    const { data } = await apiMananger.get(`/dashboard/${centerId}`)
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getOverduePaymentsService = async (
  centerId: string,
  page: number
): Promise<{ overduePayments: TuitionPaymentResponse; total: number }> => {
  try {
    const { data } = await apiMananger.get(`/dashboard/overdue/${centerId}`, {
      params: {
        page
      }
    })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}
export const getOverduePaymentsWithoutLimitService = async (
  centerId: string
): Promise<TuitionPaymentResponse> => {
  try {
    const { data } = await apiMananger.get(`/dashboard/overdue-without-limit/${centerId}`)
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}
