import apiManager from './api'
import { ICourse } from './course-service'
import { IGrade } from './grade-service'
import { IStudent } from './student'
import { ITeacher } from './teacher-service'

export interface IClass {
  _id?: string
  course: string
  period: 'morning' | 'moon' | 'evening' | string
  students?: string[]
  teachers: string[]
  className: string
  center: string
  classLimit?: number
  userId: string
  schedule: string
  grade: string
  schoolYear: string
}

export type ClassToShow = {
  _id?: string
  course: ICourse
  period: 'morning' | 'moon' | 'evening' | string
  students?: string[]
  teachers: string[]
  className: string
  center: string
  classLimit?: number
  userId: string
  schedule: string
  grade: IGrade
  schoolYear: string
}

export interface IClassOnEdit {
  period: 'morning' | 'moon' | 'evening' | string
  teachers: string[]
  classLimit?: number
  schedule: string
  className: string
}

export interface IResponseClass {
  teachers: ITeacher[]
  _id?: string
  course: ICourse
  period: 'morning' | 'moon' | 'evening' | string
  students?: IStudent[]
  className: string
  center: string
  classLimit?: number
  userId: string
  schedule: string
  grade: IGrade
  schoolYear: string
}

type getClassesServiceParams = {
  centerId: string
  schoolYearId: string
}
export const getClassesService = async ({
  centerId,
  schoolYearId
}: getClassesServiceParams): Promise<IResponseClass[]> => {
  const { data } = await apiManager.get(`/classes/all/${centerId}/${schoolYearId}`)
  return data
}

export const getClassService = async (id: string): Promise<IResponseClass> => {
  const { data } = await apiManager.get(`/classes/${id}`)
  return data
}

export const createClassService = async (classData: IClass): Promise<IClass> => {
  const { data } = await apiManager.post('/classes/new', classData)
  return data
}

export const editClassService = async (id: string, data: IClassOnEdit): Promise<void> => {
  //period, teachers, classLimit, schedule
  await apiManager.put(`/classes/edit/${id}`, data)
}

export const addStudentClassService = async (id: string, studentId: string): Promise<void> => {
  await apiManager.put(`/classes/add-student/${id}`, { studentId })
}

export const updateClassStatusService = async (id: string, status: string): Promise<void> => {
  await apiManager.patch(`/classes/${id}/status`, { status })
}
