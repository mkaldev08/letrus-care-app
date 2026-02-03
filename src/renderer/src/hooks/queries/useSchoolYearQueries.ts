import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
  getSchoolYearsServiceAll,
  getCurrentSchoolYearService,
  ISchoolYear
} from '@renderer/services/school-year-service'

// Query Keys
export const schoolYearKeys = {
  all: ['schoolYears'] as const,
  list: (centerId: string) => [...schoolYearKeys.all, 'list', centerId] as const,
  current: (centerId: string) => [...schoolYearKeys.all, 'current', centerId] as const
}

// Queries
export const useSchoolYearsQuery = (centerId?: string): UseQueryResult<ISchoolYear[], Error> => {
  return useQuery({
    queryKey: schoolYearKeys.list(centerId ?? ''),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      return getSchoolYearsServiceAll(centerId)
    },
    enabled: !!centerId
  })
}

export const useCurrentSchoolYearQuery = (
  centerId?: string
): UseQueryResult<ISchoolYear, Error> => {
  return useQuery({
    queryKey: schoolYearKeys.current(centerId ?? ''),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      return getCurrentSchoolYearService(centerId)
    },
    enabled: !!centerId
  })
}
