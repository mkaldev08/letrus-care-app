import { DashboardContextData } from '@renderer/hooks/useDashboard'
import apiManager from './api'
import {
  TuitionPaymentResponse,
  DailyPaymentResponse,
  StudentResponse,
  AbsenceResponse,
  EnrollmentResponse
} from '@renderer/types/dashboard'

export const getDashboardDataService = async (
  centerId: string,
  schoolYearId: string
): Promise<DashboardContextData> => {
  try {
    const { data } = await apiManager.get(`/dashboard/${centerId}/${schoolYearId}`)
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getOverduePaymentsService = async (
  centerId: string,
  schoolYearId: string,
  page: number
): Promise<{ overduePayments: TuitionPaymentResponse; total: number }> => {
  try {
    const { data } = await apiManager.get(`/dashboard/overdue/${centerId}/${schoolYearId}`, {
      params: {
        page
      }
    })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getOverduePaymentsWithoutLimitService = async (
  centerId: string,
  schoolYearId: string
): Promise<TuitionPaymentResponse> => {
  try {
    const { data } = await apiManager.get(
      `/dashboard/overdue-without-limit/${centerId}/${schoolYearId}`
    )
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getDailyPaymentsService = async (
  centerId: string,
  schoolYearId: string,
  page: number
): Promise<{ dailyPayments: DailyPaymentResponse; total: number }> => {
  try {
    const { data } = await apiManager.get(`/dashboard/daily-payments/${centerId}/${schoolYearId}`, {
      params: {
        page
      }
    })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getDailyPaymentsWithoutLimitService = async (
  centerId: string,
  schoolYearId: string
): Promise<DailyPaymentResponse> => {
  try {
    const { data } = await apiManager.get(
      `/dashboard/daily-payments-without-limit/${centerId}/${schoolYearId}`
    )
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getActiveStudentsService = async (
  centerId: string,
  page: number
): Promise<{ students: StudentResponse; total: number }> => {
  try {
    const { data } = await apiManager.get(`/dashboard/active-students/${centerId}`, {
      params: {
        page
      }
    })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getActiveStudentsWithoutLimitService = async (
  centerId: string
): Promise<StudentResponse> => {
  try {
    const { data } = await apiManager.get(`/dashboard/active-students-without-limit/${centerId}`)
    console.log('students ', data)
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getDailyAbsencesService = async (
  centerId: string,
  schoolYearId: string,
  page: number
): Promise<{ absences: AbsenceResponse; total: number }> => {
  try {
    const { data } = await apiManager.get(`/dashboard/daily-absences/${centerId}/${schoolYearId}`, {
      params: {
        page
      }
    })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getDailyAbsencesWithoutLimitService = async (
  centerId: string,
  schoolYearId: string
): Promise<AbsenceResponse> => {
  try {
    const { data } = await apiManager.get(
      `/dashboard/daily-absences-without-limit/${centerId}/${schoolYearId}`
    )
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getDailyEnrollmentsService = async (
  centerId: string,
  schoolYearId: string,
  page: number
): Promise<{ enrollments: EnrollmentResponse; total: number }> => {
  try {
    const { data } = await apiManager.get(
      `/dashboard/daily-enrollments/${centerId}/${schoolYearId}`,
      {
        params: {
          page
        }
      }
    )
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getDailyEnrollmentsWithoutLimitService = async (
  centerId: string,
  schoolYearId: string
): Promise<EnrollmentResponse> => {
  try {
    const { data } = await apiManager.get(
      `/dashboard/daily-enrollments-without-limit/${centerId}/${schoolYearId}`
    )
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getIncompleteEnrollmentsService = async (
  centerId: string,
  schoolYearId: string,
  page: number
): Promise<{ enrollments: EnrollmentResponse; total: number }> => {
  try {
    const { data } = await apiManager.get(
      `/dashboard/incomplete-enrollments/${centerId}/${schoolYearId}`,
      {
        params: {
          page
        }
      }
    )
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getIncompleteEnrollmentsWithoutLimitService = async (
  centerId: string,
  schoolYearId: string
): Promise<EnrollmentResponse> => {
  try {
    const { data } = await apiManager.get(
      `/dashboard/incomplete-enrollments-without-limit/${centerId}/${schoolYearId}`
    )
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}
