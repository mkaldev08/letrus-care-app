import apiManager from './api'

export interface IAttendance {
  _id?: string
  student: string
  classId: string
  date: Date
  status: 'present' | 'absent' | string
  note?: string
  isJustified?: boolean
  topic: string
}
//ToDo studant não ter falta e presença na mesma aula e no mesmo dia
export async function createAttendanceServicePerStudent(data: IAttendance): Promise<void> {
  try {
    await apiManager.post('/attendances/new', data)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function editAttendanceServicePerStudent(
  id: string,
  data: IAttendance
): Promise<void> {
  try {
    await apiManager.put(`/attendances/edit/${id}`, data)
  } catch (error) {
    console.log(error)
    throw error
  }
}
