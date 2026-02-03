import { useCenter } from '@renderer/contexts/center-context'
import { useSchoolYear } from '@renderer/contexts/school-year-context'
import { useDashboardQueryHelper } from './queries/useDashboardQuery'
import { useEffect } from 'react'
import React from 'react'

type enrollmentGrowth = { month: string; students: number }[]
type PaymentGrowthTopFive = { month: string; totalAmount: number }[]

export interface DashboardContextData {
  totalActiveClassRoom: number
  totalActiveStudent: number
  totalDailyEnrollment: number
  totalIncompleteEnrollment: number
  totalOverdueFee: number
  totalDailyPayment: number
  totalActiveTeachers: number
  totalDailyAbsent: number
  enrollmentGrowth: enrollmentGrowth
  paymentGrowthTopFive: PaymentGrowthTopFive
  isLoading: boolean
  error: string | null
}

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

export function useDashboard(): DashboardContextData {
  const { center } = useCenter()
  const { setSelectedSchoolYear } = useSchoolYear()

  const { data, isLoading, error } = useDashboardQueryHelper(String(center?._id))

  // Sync the school year globally if fetched
  useEffect(() => {
    if (data?.currentYear) {
      setSelectedSchoolYear(data.currentYear)
    }
  }, [data?.currentYear, setSelectedSchoolYear])

  const dashboardData = data?.dashboardData

  return {
    totalActiveClassRoom: dashboardData?.totalActiveClassRoom ?? 0,
    totalActiveStudent: dashboardData?.totalActiveStudent ?? 0,
    totalDailyEnrollment: dashboardData?.totalDailyEnrollment ?? 0,
    totalIncompleteEnrollment: dashboardData?.totalIncompleteEnrollment ?? 0,
    totalOverdueFee: dashboardData?.totalOverdueFee ?? 0,
    totalDailyPayment: dashboardData?.totalDailyPayment ?? 0,
    totalActiveTeachers: dashboardData?.totalActiveTeachers ?? 0,
    totalDailyAbsent: dashboardData?.totalDailyAbsent ?? 0,
    enrollmentGrowth: dashboardData?.enrollmentGrowth ?? [],
    paymentGrowthTopFive: dashboardData?.paymentGrowthTopFive ?? [],
    isLoading,
    error: error ? (error as Error).message : null
  }
}
