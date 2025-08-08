import apiMananger from './api'
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

export const getClassesService = async (centerId: string): Promise<IResponseClass[]> => {
  const { data } = await apiMananger.get(`/classes/all/${centerId}`)
  const typedData: IResponseClass[] = data
  return typedData
}

export const getClassService = async (id: string): Promise<IResponseClass> => {
  try {
    const { data } = await apiMananger.get(`/classes/${id}`)
    const typedData: IResponseClass = data
    return typedData
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const createClassService = async (classData: IClass): Promise<IClass> => {
  try {
    const { data } = await apiMananger.post('/classes/new', classData)
    const typedData: IClass = data
    return typedData
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const editClassService = async (id: string, data: IClassOnEdit): Promise<void> => {
  try {
    console.log('Dados da Class: ', data)
    //period, teachers, classLimit, schedule
    await apiMananger.put(`/classes/edit/${id}`, data)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const addStudentClassService = async (id: string, studentId: string): Promise<void> => {
  try {
    await apiMananger.put(`/classes/add-student/${id}`, { studentId })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateClassStatusService = async (id: string, status: string): Promise<void> => {
  try {
    await apiMananger.patch(`/classes/${id}/status`, { status })
  } catch (error) {
    console.log(error)
    throw error
  }
}
