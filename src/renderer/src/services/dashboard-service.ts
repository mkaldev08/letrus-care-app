import { DashboardContextData } from '@renderer/hooks/useDashboard'
import apiManager from './api'
import { TuitionPaymentResponse } from '@renderer/types/dashboard'
export const getDashboardDataService = async (
  centerId: string,
  schoolYearId: string
): Promise<DashboardContextData> => {
  try {
    const { data } = await apiManager.get(`/dashboard/${centerId}/${schoolYearId}`)
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getOverduePaymentsService = async (
  centerId: string,
  schoolYearId: string,
  page: number
): Promise<{ overduePayments: TuitionPaymentResponse; total: number }> => {
  try {
    const { data } = await apiManager.get(`/dashboard/overdue/${centerId}/${schoolYearId}`, {
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
  centerId: string,
  schoolYearId: string
): Promise<TuitionPaymentResponse> => {
  try {
    const { data } = await apiManager.get(
      `/dashboard/overdue-without-limit/${centerId}/${schoolYearId}`
    )
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}
