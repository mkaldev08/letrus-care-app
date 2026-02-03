import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getDashboardDataService } from '@renderer/services/dashboard-service'
import { getCurrentSchoolYearService, ISchoolYear } from '@renderer/services/school-year-service'
import { DashboardContextData } from '../useDashboard'

export const useDashboardQueryHelper = (
  centerId: string
): UseQueryResult<{ dashboardData: DashboardContextData; currentYear: ISchoolYear }> => {
  return useQuery({
    queryKey: ['dashboard', centerId],
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      const currentYear = await getCurrentSchoolYearService(centerId)
      if (!currentYear?._id) throw new Error('No current school year found')

      const dashboardData = await getDashboardDataService(centerId, currentYear._id)
      return { dashboardData, currentYear }
    },
    enabled: !!centerId
  })
}
