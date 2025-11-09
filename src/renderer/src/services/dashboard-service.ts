import { DashboardContextData } from '@renderer/hooks/useDashboard'
import apiMananger from './api'
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
): Promise<{ overduePayments: []; total: number }> => {
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
