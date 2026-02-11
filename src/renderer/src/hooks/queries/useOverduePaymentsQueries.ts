import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
  getOverduePaymentsService,
  getOverduePaymentsWithoutLimitService
} from '@renderer/services/dashboard-service'
import type { TuitionPaymentResponse } from '@renderer/types/dashboard'

export const overduePaymentsKeys = {
  all: ['overduePayments'] as const,
  list: (centerId: string, schoolYearId: string, page: number) =>
    [...overduePaymentsKeys.all, 'list', centerId, schoolYearId, page] as const,
  export: (centerId: string, schoolYearId: string) =>
    [...overduePaymentsKeys.all, 'export', centerId, schoolYearId] as const
}

export const useOverduePaymentsQuery = (
  centerId?: string,
  schoolYearId?: string,
  page: number = 1
): UseQueryResult<{ overduePayments: TuitionPaymentResponse; total: number }, Error> => {
  return useQuery({
    queryKey: overduePaymentsKeys.list(centerId ?? '', schoolYearId ?? '', page),
    queryFn: async () => {
      if (!centerId || !schoolYearId) {
        throw new Error('Center ID and School Year ID required')
      }
      return getOverduePaymentsService(centerId, schoolYearId, page)
    },
    enabled: !!centerId && !!schoolYearId,
    placeholderData: (previousData) => previousData
  })
}

export const useOverduePaymentsExportQuery = (
  centerId?: string,
  schoolYearId?: string
): UseQueryResult<TuitionPaymentResponse, Error> => {
  return useQuery({
    queryKey: overduePaymentsKeys.export(centerId ?? '', schoolYearId ?? ''),
    queryFn: async () => {
      if (!centerId || !schoolYearId) {
        throw new Error('Center ID and School Year ID required')
      }
      return getOverduePaymentsWithoutLimitService(centerId, schoolYearId)
    },
    enabled: false
  })
}
