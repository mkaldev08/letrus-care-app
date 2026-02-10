import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
  createTeacher,
  getTeachersService,
  updateTeacherStatusService,
  editTeacherService,
  ITeacherForShow,
  ITeacher
} from '@renderer/services/teacher-service'
import { queryClient } from '@renderer/lib/react-query'

export const teacherKeys = {
  all: ['teachers'] as const,
  list: (centerId: string, page: number) => [...teacherKeys.all, 'list', centerId, page] as const,
  detail: (id: string) => [...teacherKeys.all, 'detail', id] as const
}

export const useTeachersQuery = (
  centerId?: string,
  page: number = 1
): UseQueryResult<{ teachers: ITeacherForShow[]; totalTeachers: number }, Error> => {
  return useQuery({
    queryKey: teacherKeys.list(centerId ?? '', page),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      return getTeachersService(centerId, page)
    },
    enabled: !!centerId,
    placeholderData: (previousData) => previousData
  })
}

export const useCreateTeacherMutation = (): UseMutationResult<number, unknown, ITeacher> => {
  return useMutation({
    mutationFn: (data: ITeacher) => createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all })
    }
  })
}

export const useUpdateTeacherMutation = (): UseMutationResult<
  ITeacher,
  unknown,
  { id: string; data: ITeacher }
> => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ITeacher }) => editTeacherService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all })
    }
  })
}

export const useUpdateTeacherStatusMutation = (): UseMutationResult<
  ITeacher,
  unknown,
  { id: string; status: string }
> => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateTeacherStatusService(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all })
    }
  })
}
