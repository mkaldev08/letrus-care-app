import { useCenter } from '@renderer/contexts/center-context'
import { useSchoolYear } from '@renderer/contexts/school-year-context'
import { getDashboardDataService } from '@renderer/services/dashboard-service'
import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'

type StudentGrowth = { month: string; students: number }[]
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
  studentGrowth: StudentGrowth
  paymentGrowthTopFive: PaymentGrowthTopFive
  isLoading: boolean
  error: string | null
}

export const DashBoardContext = createContext<DashboardContextData>({} as DashboardContextData)

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentGrowth, setStudentGrowth] = useState<StudentGrowth>([])
  const [paymentGrowthTopFive, setPaymentGrowthTopFive] = useState<PaymentGrowthTopFive>([])

  const [totalActiveClassRoom, setTotalActiveClassRoom] = useState(0)
  const [totalActiveStudent, setTotalActiveStudent] = useState(0)
  const [totalDailyEnrollment, setTotalDailyEnrollment] = useState(0)
  const [totalIncompleteEnrollment, setTotalIncompleteEnrollment] = useState(0)
  const [totalOverdueFee, setTotalOverdueFee] = useState(0)
  const [totalDailyPayment, setTotalDailyPayment] = useState(0)
  const [totalActiveTeachers, setTotalActiveTeachers] = useState(0)
  const [totalDailyAbsent, setTotalDailyAbsent] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { center } = useCenter()
  const { fetchCurrentSchoolYear, setSelectedSchoolYear, currentSchoolYear } = useSchoolYear()
  async function fetchDashboardData(): Promise<void> {
    try {
      setIsLoading(true)
      setError(null)

      const current = await fetchCurrentSchoolYear(center?._id as string)
      setSelectedSchoolYear(current)

      const data = await getDashboardDataService(
        center?._id as string,
        currentSchoolYear?._id as string
      )

      setTotalActiveClassRoom(data.totalActiveClassRoom)
      setTotalActiveStudent(data.totalActiveStudent)
      setTotalDailyEnrollment(data.totalDailyEnrollment)
      setTotalIncompleteEnrollment(data.totalIncompleteEnrollment)
      setTotalOverdueFee(data.totalOverdueFee)
      setTotalDailyPayment(data.totalDailyPayment)
      setTotalActiveTeachers(data.totalActiveTeachers)
      setTotalDailyAbsent(data.totalDailyAbsent)
      setStudentGrowth(data.studentGrowth)
      setPaymentGrowthTopFive(data.paymentGrowthTopFive)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <DashBoardContext.Provider
      value={{
        totalActiveClassRoom,
        totalActiveStudent,
        totalDailyEnrollment,
        totalIncompleteEnrollment,
        totalOverdueFee,
        totalDailyPayment,
        totalActiveTeachers,
        totalDailyAbsent,
        studentGrowth,
        paymentGrowthTopFive,
        isLoading,
        error
      }}
    >
      {children}
    </DashBoardContext.Provider>
  )
}

export function useDashboard(): DashboardContextData {
  return useContext(DashBoardContext)
}
