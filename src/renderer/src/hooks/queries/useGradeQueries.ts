import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
  createGrade,
  deleteGradeService,
  editGradeService,
  getGradeService,
  getGradesService,
  IGrade
} from '@renderer/services/grade-service'
import { queryClient } from '@renderer/lib/react-query'

export const gradeKeys = {
  all: ['grades'] as const,
  list: (centerId: string, page: number) => [...gradeKeys.all, 'list', centerId, page] as const,
  detail: (id: string) => [...gradeKeys.all, 'detail', id] as const
}

export const useGradesQuery = (
  centerId?: string,
  page: number = 1
): UseQueryResult<{ grades: IGrade[]; totalGrades: number }, Error> => {
  return useQuery({
    queryKey: gradeKeys.list(centerId ?? '', page),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      return getGradesService(centerId, page)
    },
    enabled: !!centerId,
    placeholderData: (previousData) => previousData
  })
}

export const useGradeQuery = (gradeId?: string): UseQueryResult<IGrade, Error> => {
  return useQuery({
    queryKey: gradeKeys.detail(gradeId ?? ''),
    queryFn: async () => {
      if (!gradeId) throw new Error('Grade ID required')
      return getGradeService(gradeId)
    },
    enabled: !!gradeId
  })
}

export const useCreateGradeMutation = (): UseMutationResult<void, unknown, IGrade> => {
  return useMutation({
    mutationFn: (data: IGrade) => createGrade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all })
    }
  })
}

export const useUpdateGradeMutation = (): UseMutationResult<
  void,
  unknown,
  { id: string; data: IGrade }
> => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IGrade }) => editGradeService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all })
    }
  })
}

export const useDeleteGradeMutation = (): UseMutationResult<void, unknown, string> => {
  return useMutation({
    mutationFn: (id: string) => deleteGradeService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all })
    }
  })
}
