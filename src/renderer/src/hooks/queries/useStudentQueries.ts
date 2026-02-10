import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { IStudent, searchStudentService } from '@renderer/services/student'

// Query Keys
export const studentKeys = {
  all: ['students'] as const,
  search: (centerId: string, query: string) =>
    [...studentKeys.all, 'search', centerId, query] as const
}

// Search Students Query
export const useSearchStudentsQuery = (
  centerId: string | undefined,
  query: string
): UseQueryResult<IStudent[] | null, Error> => {
  return useQuery({
    queryKey: studentKeys.search(centerId ?? '', query),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      if (query.length < 3) return null
      return await searchStudentService(centerId, query)
    },
    enabled: !!centerId && query.length >= 3,
    staleTime: 1000 * 60 * 2 // 2 minutes
  })
}
