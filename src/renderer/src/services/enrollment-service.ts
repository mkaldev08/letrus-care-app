import { AxiosResponse } from 'axios'
import apiMananger from './api'
import { IStudent } from './student'
import { IAuth } from './user'
import { ClassToShow } from './class-service'

export interface IEnrollmentForApply {
  studentId?: string
  classId: string
  name: { fullName: string; surname?: string }
  fullName?: string
  surname?: string
  birthDate: Date
  gender: 'masculino' | 'feminino' | string
  parents: { father: string; mother: string }
  father?: string
  mother?: string
  address: string
  phoneNumber: string
  email?: string
  centerId: string
  userId: string
  doc_file?: File
  image_file?: File
  hasScholarShip?: boolean
}

export interface IEnrollmentForEdit {
  courseId: string
  grade: string
  fullName?: string
  surname?: string
  birthDate: Date
  gender: 'masculino' | 'feminino' | string
  father?: string
  mother?: string
  address: string
  phoneNumber: string
  email?: string
  doc_file?: File
  image_file?: File
}

export interface IEnrollmentForShow {
  _id?: string
  classId: ClassToShow
  doc_file?: File
  image_file?: File
  studentId: IStudent
  enrollmentDate: Date
  status: 'enrolled' | 'completed' | 'dropped' | string
  centerId: string
  userId: IAuth
}

export interface IEnrollment {
  _id?: string
  studentId: string
  courseId: string
  enrollmentDate: Date
  status: 'enrolled' | 'completed' | 'dropped' | string
  centerId: string
  grade: string
  doc_file: string
  image_file: string
  userId: string
}

interface IResponse {
  enrollments: IEnrollmentForShow[]
  totalEnrollments: number
}

export interface IEnrollmentReceipt {
  receiptNumber: string
  enrollmentId: string
}

export const createEnrollment = async (data: IEnrollmentForApply): Promise<AxiosResponse> => {
  const {
    name,
    birthDate,
    gender,
    parents,
    address,
    phoneNumber,
    email,
    centerId,
    classId,
    userId,
    hasScholarShip
  } = data

  try {
    // Cria o estudante
    const { data: studentData } = await apiMananger.post('/students/new', {
      name,
      birthDate,
      gender,
      address,
      phoneNumber,
      email,
      parents,
      centerId,
      userId
    })

    // Usa o ID do estudante recém-criado para criar a inscrição
    const newEnrollment = await apiMananger.post('/enrollments/new', {
      classId,
      centerId,
      studentId: studentData?._id,
      userId,
      hasScholarShip
    })

    return newEnrollment
  } catch (error) {
    console.log('Erro ao criar inscrição:', error)
    throw error
  }
}

export const getEnrollmentsService = async (centerId: string, page: number): Promise<IResponse> => {
  try {
    const { data } = await apiMananger.get(`/enrollments/all/${centerId}?page=${page}`)
    return data
  } catch (error) {
    console.log('Erro ao buscar inscrições: ', error)
    throw error
  }
}

export const getOneEnrollmentService = async (
  enrollmentId: string
): Promise<{ enrollment: IEnrollmentForShow; receipt: IEnrollmentReceipt }> => {
  try {
    const { data } = await apiMananger.get(`/enrollments/${enrollmentId}`)
    return data
  } catch (error) {
    console.log('Erro ao buscar inscrição: ', error)
    throw error
  }
}

export const getEnrollmentByStudentService = async (
  studentId: string
): Promise<IEnrollmentForShow> => {
  try {
    const { data } = await apiMananger.get(`/enrollments/student/${studentId}`)
    return data
  } catch (error) {
    console.log('Erro ao buscar inscrição com estudante: ', error)
    throw error
  }
}

type infoReq = {
  courseId: string
  grade: string
}
export const getStudentsForClassService = async (
  centerId: string,
  info: infoReq
): Promise<IEnrollmentForShow[]> => {
  try {
    const { data } = await apiMananger.get(
      `/enrollments/add-class/${centerId}?courseId=${info.courseId}&grade=${info.grade}`
    )
    return data
  } catch (error) {
    console.log('Erro ao buscar alunos: ', error)
    throw error
  }
}

export const editEnrollment = async (
  enrollmentId: string,
  data: IEnrollmentForEdit,
  studentId: string
): Promise<void> => {
  try {
    const {
      fullName,
      surname,
      birthDate,
      gender,
      address,
      phoneNumber,
      email,
      courseId,
      grade,
      father,
      mother
    } = data
    await apiMananger.put(`/students/edit/${studentId}`, {
      name: { fullName, surname },
      birthDate,
      gender,
      address,
      phoneNumber,
      email,
      parents: { father, mother }
    })
    await apiMananger.put(`/enrollments/edit/${enrollmentId}`, {
      courseId,
      grade
    })
  } catch (error) {
    console.log('Erro ao editar inscrições: ', error)
    throw error
  }
}

export const changeStatusService = async (id: string, status: string): Promise<void> => {
  try {
    await apiMananger.patch(`/enrollments/status/${id}`, { status })
  } catch (error) {
    console.log('Erro ao alterar estado da inscrição: ', error)
    throw error
  }
}
