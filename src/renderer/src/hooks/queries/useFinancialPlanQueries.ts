import {
  useQuery,
  UseQueryResult
} from '@tanstack/react-query'
import {
  getFinancialPlanForStudentService,
  IFinancialPlanToShow
} from '@renderer/services/financial-plan-services'

// Query Keys
export const financialPlanKeys = {
  all: ['financialPlans'] as const,
  list: (centerId: string, enrollmentId: string, schoolYearId: string) =>
    [...financialPlanKeys.all, 'list', centerId, enrollmentId, schoolYearId] as const
}

// Queries
export const useFinancialPlansQuery = (
  centerId?: string,
  enrollmentId?: string,
  schoolYearId?: string
): UseQueryResult<IFinancialPlanToShow[], Error> => {
  return useQuery({
    queryKey: financialPlanKeys.list(centerId ?? '', enrollmentId ?? '', schoolYearId ?? ''),
    queryFn: async () => {
      if (!centerId || !enrollmentId || !schoolYearId) {
        throw new Error('Center ID, Enrollment ID, and School Year ID required')
      }
      return getFinancialPlanForStudentService(centerId, enrollmentId, {
        status: 'all',
        schoolYear: schoolYearId
      })
    },
    enabled: !!centerId && !!enrollmentId && !!schoolYearId
  })
}
