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

// Payment types
export type PaymentMethod = 'Dinheiro' | 'Multicaixa Express' | 'Transferência Bancária (ATM)'
export type ObligationType = 'enrollment' | 'monthly' | 'adjustment'

export interface DailyPaymentRecord {
  _id: string
  enrollmentId: EnrollmentRef
  amount: number
  paymentDate: string
  paymentMethod: PaymentMethod
  status: PaymentStatus
  centerId: string
  userId: string
  lateFee: number
  obligationType: ObligationType
  [key: string]: unknown
}

export type DailyPaymentResponse = DailyPaymentRecord[]

// Student types
export interface StudentRecord {
  _id: string
  name: EnrollmentStudentName
  birthDate: string
  gender: 'masculino' | 'feminino' | string
  parents: { father: string; mother: string }
  address: string
  phoneNumber: string
  email?: string
  centerId: string
  endStudiedDate?: string
  studentCode: string
  identityNumber?: string
  status: 'active' | 'inactive' | string
  [key: string]: unknown
}

export type StudentResponse = StudentRecord[]

// Attendance types
export interface AbsenceRecord {
  _id: string
  enrollmentId: EnrollmentRef
  classId: string
  date: string
  status: 'present' | 'absent' | string
  note?: string
  isJustified: boolean
  topic: string
  [key: string]: unknown
}

export type AbsenceResponse = AbsenceRecord[]

// Enrollment types
export type EnrollmentStatus = 'enrolled' | 'dropped' | 'completed' | string

export interface EnrollmentRecord {
  _id: string
  studentId: StudentRef
  classId: ClassRef
  enrollmentDate: string
  status: EnrollmentStatus
  centerId: string
  [key: string]: unknown
}

export type EnrollmentResponse = EnrollmentRecord[]

export default TuitionPaymentRecord
