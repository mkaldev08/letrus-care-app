import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
  getDailyPaymentsService,
  getDailyPaymentsWithoutLimitService,
  getActiveStudentsService,
  getActiveStudentsWithoutLimitService,
  getDailyAbsencesService,
  getDailyAbsencesWithoutLimitService,
  getDailyEnrollmentsService,
  getDailyEnrollmentsWithoutLimitService,
  getIncompleteEnrollmentsService,
  getIncompleteEnrollmentsWithoutLimitService
} from '@renderer/services/dashboard-service'
import {
  DailyPaymentResponse,
  StudentResponse,
  AbsenceResponse,
  EnrollmentResponse
} from '@renderer/types/dashboard'

// Query Keys
export const dashboardStatisticsKeys = {
  all: ['dashboard-statistics'] as const,
  dailyPayments: (centerId: string, schoolYearId: string, page: number) =>
    [...dashboardStatisticsKeys.all, 'daily-payments', centerId, schoolYearId, page] as const,
  dailyPaymentsExport: (centerId: string, schoolYearId: string) =>
    [...dashboardStatisticsKeys.all, 'daily-payments-export', centerId, schoolYearId] as const,
  activeStudents: (centerId: string, page: number) =>
    [...dashboardStatisticsKeys.all, 'active-students', centerId, page] as const,
  activeStudentsExport: (centerId: string) =>
    [...dashboardStatisticsKeys.all, 'active-students-export', centerId] as const,
  dailyAbsences: (centerId: string, schoolYearId: string, page: number) =>
    [...dashboardStatisticsKeys.all, 'daily-absences', centerId, schoolYearId, page] as const,
  dailyAbsencesExport: (centerId: string, schoolYearId: string) =>
    [...dashboardStatisticsKeys.all, 'daily-absences-export', centerId, schoolYearId] as const,
  dailyEnrollments: (centerId: string, schoolYearId: string, page: number) =>
    [...dashboardStatisticsKeys.all, 'daily-enrollments', centerId, schoolYearId, page] as const,
  dailyEnrollmentsExport: (centerId: string, schoolYearId: string) =>
    [...dashboardStatisticsKeys.all, 'daily-enrollments-export', centerId, schoolYearId] as const,
  incompleteEnrollments: (centerId: string, schoolYearId: string, page: number) =>
    [
      ...dashboardStatisticsKeys.all,
      'incomplete-enrollments',
      centerId,
      schoolYearId,
      page
    ] as const,
  incompleteEnrollmentsExport: (centerId: string, schoolYearId: string) =>
    [
      ...dashboardStatisticsKeys.all,
      'incomplete-enrollments-export',
      centerId,
      schoolYearId
    ] as const
}

// Daily Payments Hooks
export const useDailyPaymentsQuery = (
  centerId?: string,
  schoolYearId?: string,
  page: number = 1
): UseQueryResult<{ dailyPayments: DailyPaymentResponse; total: number }, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.dailyPayments(centerId ?? '', schoolYearId ?? '', page),
    queryFn: async () => {
      if (!centerId || !schoolYearId) throw new Error('Center ID and School Year ID required')
      return getDailyPaymentsService(centerId, schoolYearId, page)
    },
    enabled: !!centerId && !!schoolYearId,
    placeholderData: (previousData) => previousData
  })
}

export const useDailyPaymentsExportQuery = (
  centerId?: string,
  schoolYearId?: string
): UseQueryResult<DailyPaymentResponse, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.dailyPaymentsExport(centerId ?? '', schoolYearId ?? ''),
    queryFn: async () => {
      if (!centerId || !schoolYearId) throw new Error('Center ID and School Year ID required')
      return getDailyPaymentsWithoutLimitService(centerId, schoolYearId)
    },
    enabled: false // Manual refetch for PDF export
  })
}

// Active Students Hooks
export const useActiveStudentsQuery = (
  centerId?: string,
  page: number = 1
): UseQueryResult<{ students: StudentResponse; total: number }, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.activeStudents(centerId ?? '', page),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      return getActiveStudentsService(centerId, page)
    },
    enabled: !!centerId,
    placeholderData: (previousData) => previousData
  })
}

export const useActiveStudentsExportQuery = (
  centerId?: string
): UseQueryResult<StudentResponse, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.activeStudentsExport(centerId ?? ''),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      return getActiveStudentsWithoutLimitService(centerId)
    },
    enabled: false // Manual refetch for PDF export
  })
}

// Daily Absences Hooks
export const useDailyAbsencesQuery = (
  centerId?: string,
  schoolYearId?: string,
  page: number = 1
): UseQueryResult<{ absences: AbsenceResponse; total: number }, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.dailyAbsences(centerId ?? '', schoolYearId ?? '', page),
    queryFn: async () => {
      if (!centerId || !schoolYearId) throw new Error('Center ID and School Year ID required')
      return getDailyAbsencesService(centerId, schoolYearId, page)
    },
    enabled: !!centerId && !!schoolYearId,
    placeholderData: (previousData) => previousData
  })
}

export const useDailyAbsencesExportQuery = (
  centerId?: string,
  schoolYearId?: string
): UseQueryResult<AbsenceResponse, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.dailyAbsencesExport(centerId ?? '', schoolYearId ?? ''),
    queryFn: async () => {
      if (!centerId || !schoolYearId) throw new Error('Center ID and School Year ID required')
      return getDailyAbsencesWithoutLimitService(centerId, schoolYearId)
    },
    enabled: false // Manual refetch for PDF export
  })
}

// Daily Enrollments Hooks
export const useDailyEnrollmentsQuery = (
  centerId?: string,
  schoolYearId?: string,
  page: number = 1
): UseQueryResult<{ enrollments: EnrollmentResponse; total: number }, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.dailyEnrollments(centerId ?? '', schoolYearId ?? '', page),
    queryFn: async () => {
      if (!centerId || !schoolYearId) throw new Error('Center ID and School Year ID required')
      return getDailyEnrollmentsService(centerId, schoolYearId, page)
    },
    enabled: !!centerId && !!schoolYearId,
    placeholderData: (previousData) => previousData
  })
}

export const useDailyEnrollmentsExportQuery = (
  centerId?: string,
  schoolYearId?: string
): UseQueryResult<EnrollmentResponse, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.dailyEnrollmentsExport(centerId ?? '', schoolYearId ?? ''),
    queryFn: async () => {
      if (!centerId || !schoolYearId) throw new Error('Center ID and School Year ID required')
      return getDailyEnrollmentsWithoutLimitService(centerId, schoolYearId)
    },
    enabled: false // Manual refetch for PDF export
  })
}

// Incomplete Enrollments Hooks
export const useIncompleteEnrollmentsQuery = (
  centerId?: string,
  schoolYearId?: string,
  page: number = 1
): UseQueryResult<{ enrollments: EnrollmentResponse; total: number }, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.incompleteEnrollments(
      centerId ?? '',
      schoolYearId ?? '',
      page
    ),
    queryFn: async () => {
      if (!centerId || !schoolYearId) throw new Error('Center ID and School Year ID required')
      return getIncompleteEnrollmentsService(centerId, schoolYearId, page)
    },
    enabled: !!centerId && !!schoolYearId,
    placeholderData: (previousData) => previousData
  })
}

export const useIncompleteEnrollmentsExportQuery = (
  centerId?: string,
  schoolYearId?: string
): UseQueryResult<EnrollmentResponse, unknown> => {
  return useQuery({
    queryKey: dashboardStatisticsKeys.incompleteEnrollmentsExport(
      centerId ?? '',
      schoolYearId ?? ''
    ),
    queryFn: async () => {
      if (!centerId || !schoolYearId) throw new Error('Center ID and School Year ID required')
      return getIncompleteEnrollmentsWithoutLimitService(centerId, schoolYearId)
    },
    enabled: false // Manual refetch for PDF export
  })
}
