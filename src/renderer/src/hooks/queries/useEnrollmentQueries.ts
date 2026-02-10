import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
  changeStatusService,
  confirmationEnrollment,
  createEnrollment,
  getEnrollmentsService,
  getOneEnrollmentService,
  getEnrollmentByStudentService,
  searchEnrollmentsService,
  IEnrollmentForApply,
  IEnrollmentForShow,
  IEnrollmentReceipt
} from '@renderer/services/enrollment-service'
import { queryClient } from '@renderer/lib/react-query'

// Query Keys
export const enrollmentKeys = {
  all: ['enrollments'] as const,
  list: (centerId: string, page: number, query?: string) =>
    [...enrollmentKeys.all, 'list', centerId, page, query] as const,
  detail: (id: string) => [...enrollmentKeys.all, 'detail', id] as const
}

// Queries
export const useEnrollmentsQuery = (
  centerId?: string,
  page: number = 1,
  query: string = ''
): UseQueryResult<{ enrollments: IEnrollmentForShow[]; totalEnrollments: number }> => {
  return useQuery({
    queryKey: enrollmentKeys.list(centerId ?? '', page, query),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      if (query) {
        return searchEnrollmentsService(centerId, query)
      }
      return getEnrollmentsService(centerId, page)
    },
    enabled: !!centerId,
    placeholderData: (previousData) => previousData // Keep previous data while fetching new page
  })
}

export const useEnrollmentQuery = (
  id: string
): UseQueryResult<{ enrollment: IEnrollmentForShow; receipt: IEnrollmentReceipt }> => {
  return useQuery({
    queryKey: enrollmentKeys.detail(id),
    queryFn: () => getOneEnrollmentService(id),
    enabled: !!id
  })
}

// Mutations
export const useCreateEnrollmentMutation = (): UseMutationResult<
  IEnrollmentForShow,
  unknown,
  IEnrollmentForApply
> => {
  return useMutation({
    mutationFn: (data: IEnrollmentForApply) => createEnrollment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all })
    }
  })
}

export const useConfirmEnrollmentMutation = (): UseMutationResult<
  IEnrollmentForShow,
  unknown,
  {
    enrollmentId: string
    data: { centerId: string; classId: string; userId: string }
  }
> => {
  return useMutation({
    mutationFn: ({
      enrollmentId,
      data
    }: {
      enrollmentId: string
      data: { centerId: string; classId: string; userId: string }
    }) => confirmationEnrollment(enrollmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all })
    }
  })
}

export const useChangeEnrollmentStatusMutation = (): UseMutationResult<
  void,
  unknown,
  { id: string; status: string }
> => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => changeStatusService(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all })
    }
  })
}

export const useEnrollmentByStudentQuery = (
  studentId?: string
): UseQueryResult<IEnrollmentForShow, Error> => {
  return useQuery({
    queryKey: enrollmentKeys.detail(studentId ?? ''),
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID required')
      return getEnrollmentByStudentService(studentId)
    },
    enabled: !!studentId
  })
}
