import apiManager from './api'
import { ICourse } from './course-service'

export interface ITeacher {
  _id?: string
  fullName: string
  birthDate: Date
  address: string
  phoneNumber: string
  email: string
  hireDate?: Date
  centerId: string
  user: string
  courses: string[]
  teacherCode?: string
  status?: 'active' | 'inactive' | string
}

export interface ITeacherForShow {
  _id?: string
  fullName: string
  birthDate: Date
  address: string
  phoneNumber: string
  email: string
  hireDate?: Date
  centerId: string
  user: string
  courses: ICourse[]
  teacherCode?: string
  status?: 'active' | 'inactive' | string
}

export async function createTeacher(data: ITeacher): Promise<number> {
  try {
    await apiManager.post('/teachers/new', data)
    return 201
  } catch (error) {
    console.log('Erro ao criar professor', error)
    throw error
  }
}

interface IResponseTeacher {
  teachers: ITeacherForShow[]
  totalTeachers: number
}

export async function getTeachersService(
  centerId: string,
  page: number
): Promise<IResponseTeacher> {
  try {
    const { data } = await apiManager.get(`/teachers/all/paginated/${centerId}?page=${page}`)
    return data
  } catch (error) {
    console.log('Erro ao buscar professores', error)
    throw error
  }
}

export async function getTeachersServiceAll(centerId: string): Promise<ITeacherForShow[]> {
  try {
    const { data } = await apiManager.get(`/teachers/all/${centerId}`)
    return data
  } catch (error) {
    console.log('Erro ao buscar professores', error)
    throw error
  }
}

export async function editTeacherService(id: string, data: ITeacher): Promise<ITeacher> {
  try {
    const response = await apiManager.put(`/teachers/edit/${id}`, data)
    return response.data
  } catch (error) {
    console.log('Erro ao editar professor', error)
    throw error
  }
}

export async function updateTeacherStatusService(id: string, status: string): Promise<ITeacher> {
  try {
    const response = await apiManager.patch(`/teachers/${id}/${status}`)
    return response.data
  } catch (error) {
    console.log('Erro ao editar professor', error)
    throw error
  }
}
