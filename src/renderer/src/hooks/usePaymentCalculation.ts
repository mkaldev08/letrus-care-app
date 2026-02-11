import { useMemo } from 'react'
import { IEnrollmentForShow } from '@renderer/services/enrollment-service'
import { IFinancialPlanToShow } from '@renderer/services/financial-plan-services'

export interface PaymentCalculationResult {
  amount: number
  lateFee: number
  hasPlan: boolean
  planNotFoundWarning: boolean
}

export const usePaymentCalculation = (
  enrollment: IEnrollmentForShow | null,
  paymentMonth: string,
  targetSchoolYear: string,
  financialPlans: IFinancialPlanToShow[]
): PaymentCalculationResult => {
  return useMemo(() => {
    // Initial validation
    if (!enrollment || !paymentMonth || !targetSchoolYear) {
      return {
        amount: 0,
        lateFee: 0,
        hasPlan: false,
        planNotFoundWarning: false
      }
    }

    // Find the financial plan for the selected month and year
    const plan = financialPlans.find(
      (p) => p.month === paymentMonth && p.schoolYear === targetSchoolYear
    )

    // Plan not found - return warning
    if (!plan) {
      return {
        amount: 0,
        lateFee: 0,
        hasPlan: false,
        planNotFoundWarning: true
      }
    }

    // Get tuition fee and fine from enrollment
    const fee = Number(enrollment.tuitionFeeId?.fee) || 0
    const fine = Number(enrollment.tuitionFeeId?.feeFine) || 0

    console.log(enrollment.tuitionFeeId?.feeFine)

    // Check if payment is late based on due date and plan status

    // const due = new Date(plan.dueDate)
    // due.setHours(23, 59, 59, 999)

    // Plan status indicates if there's a fine (overdue means fine applies)
    console.log(plan.status)
    const isLate = plan.status === 'overdue'
    const lateFee = isLate ? fine : 0
    console.log({ fee, fine, isLate, lateFee })

    return {
      lateFee,
      amount: fee + lateFee,
      hasPlan: true,
      planNotFoundWarning: false
    }
  }, [enrollment, paymentMonth, targetSchoolYear, financialPlans])
}
