import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
  createSchoolYear,
  editSchoolYearService,
  getSchoolYearsServiceAll,
  getSchoolYearsService,
  getCurrentSchoolYearService,
  ISchoolYear
} from '@renderer/services/school-year-service'
import { queryClient } from '@renderer/lib/react-query'

// Query Keys
export const schoolYearKeys = {
  all: ['schoolYears'] as const,
  list: (centerId: string) => [...schoolYearKeys.all, 'list', centerId] as const,
  listPaged: (centerId: string, page: number) =>
    [...schoolYearKeys.all, 'listPaged', centerId, page] as const,
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

export const useSchoolYearsPagedQuery = (
  centerId?: string,
  page: number = 1
): UseQueryResult<{ schoolYears: ISchoolYear[]; totalSchoolYear: number }, Error> => {
  return useQuery({
    queryKey: schoolYearKeys.listPaged(centerId ?? '', page),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      return getSchoolYearsService(page, centerId)
    },
    enabled: !!centerId,
    placeholderData: (previousData) => previousData
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

export const useCreateSchoolYearMutation = (): UseMutationResult<
  void,
  unknown,
  { data: ISchoolYear; centerId: string }
> => {
  return useMutation({
    mutationFn: ({ data, centerId }: { data: ISchoolYear; centerId: string }) =>
      createSchoolYear(data, centerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.all })
    }
  })
}

export const useUpdateSchoolYearMutation = (): UseMutationResult<
  void,
  unknown,
  { id: string; data: ISchoolYear }
> => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ISchoolYear }) =>
      editSchoolYearService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.all })
    }
  })
}
