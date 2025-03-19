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
