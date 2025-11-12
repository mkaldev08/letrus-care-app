// Tipos para representar respostas de pagamentos/propinas usadas no dashboard
// Gerado a partir do exemplo fornecido pelo usuário

export type PaymentStatus = 'overdue' | 'paid' | 'pending' | 'cancelled' | string

export interface EnrollmentStudentName {
  fullName: string
  surname?: string
}

export interface StudentRef {
  name: EnrollmentStudentName
  _id: string
  studentCode: string
}

export interface ClassRef {
  _id: string
  className: string
}

export interface EnrollmentRef {
  _id: string
  studentId: StudentRef
  classId: ClassRef
}

export interface TuitionPaymentRecord {
  linkedPayment: string | null
  _id: string
  schoolYear: string
  month: string
  year: number
  dueDate: string // ISO date string
  enrollmentId: EnrollmentRef
  centerId: string
  userId: string
  tutionFee: number
  status: PaymentStatus
  // permite campos adicionais retornados pela API
  [key: string]: unknown
}

export type TuitionPaymentResponse = TuitionPaymentRecord[]

export default TuitionPaymentRecord
