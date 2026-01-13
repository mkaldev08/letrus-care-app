import apiManager from './api'

export interface ICourse {
  _id?: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  fee: number
  feeFine: number
  enrollmentFee?: number
  confirmationEnrollmentFee?: number
  centerId: string
  status?: 'active' | 'inactive' | string
  courseType?: 'on_home' | 'on_center' | string
}

export interface ICourseOnEdit {
  name: string
  description: string
  startDate: Date
  endDate: Date
  fee: number
  feeFine: number
  enrollmentFee: number
  confirmationEnrollmentFee: number
  courseType?: 'on_home' | 'on_center' | string
}

export async function createCourse(data: ICourse): Promise<void> {
  try {
    await apiManager.post('/courses/new', data)
  } catch (error) {
    console.log('Erro ao criar curso ', error)
    throw error
  }
}

export const getOneCourseService = async (courseId: string): Promise<ICourse> => {
  try {
    const { data } = await apiManager.get(`/courses/${courseId}`)

    return data
  } catch (error) {
    console.log('Erro ao buscar curso: ', error)
    throw error
  }
}

type IResponse = {
  courses: ICourse[]
  totalCourses: number
}
export async function getCoursesService(centerId: string, page: number): Promise<IResponse> {
  try {
    const { data } = await apiManager.get(`/courses/all/paginated/${centerId}?page=${page}`)
    return data
  } catch (error) {
    console.log('Erro ao buscar cursos', error)
    throw error
  }
}

export async function getCoursesAll(centerId: string): Promise<ICourse[]> {
  try {
    const { data } = await apiManager.get(`/courses/all/${centerId}`)
    return data
  } catch (error) {
    console.log('Erro ao buscar cursos', error)
    throw error
  }
}

export const editCourse = async (courseId: string, data: ICourseOnEdit): Promise<void> => {
  try {
    await apiManager.put(`/courses/edit/${courseId}`, data)
  } catch (error) {
    console.log('Erro ao editar curso: ', error)
    throw error
  }
}

export async function deleteCourseService(id: string): Promise<void> {
  try {
    await apiManager.patch(`/courses/delete/${id}`)
  } catch (error) {
    console.log('Erro ao eliminar curso', error)
    throw error
  }
}
