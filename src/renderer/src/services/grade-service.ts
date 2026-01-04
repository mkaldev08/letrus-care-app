import apiManager from './api'

export interface IGrade {
  _id?: string
  grade: string
  centerId: string
  dateRecorded?: Date
}

export async function createGrade(data: IGrade): Promise<void> {
  try {
    await apiManager.post('/grades/new', data)
  } catch (error) {
    console.log('Erro ao criar nível ', error)
    throw error
  }
}

type IResponse = {
  grades: IGrade[]
  totalGrades: number
}

export async function getGradesService(centerId: string, page: number): Promise<IResponse> {
  try {
    const { data } = await apiManager.get(`/grades/all/paginated/${centerId}?page=${page}`)
    const typeData: IResponse = data
    return typeData
  } catch (error) {
    console.log('Erro ao buscar níveis', error)
    throw error
  }
}

export async function getGradesServiceAll(centerId: string): Promise<IGrade[]> {
  try {
    const { data } = await apiManager.get(`/grades/all/${centerId}`)
    const typeData: IGrade[] = data
    return typeData
  } catch (error) {
    console.log('Erro ao buscar níveis', error)
    throw error
  }
}

export async function getGradeService(gradeId: string): Promise<IGrade> {
  try {
    const { data } = await apiManager.get(`/grades/${gradeId}`)
    const typeData: IGrade = data
    return typeData
    return data
  } catch (error) {
    console.log('Erro ao buscar nível', error)
    throw error
  }
}

export async function editGradeService(gradeId: string, data: IGrade): Promise<void> {
  try {
    await apiManager.put(`/grades/edit/${gradeId}`, data)
  } catch (error) {
    console.log('Erro ao editar nível', error)
    throw error
  }
}

export async function deleteGradeService(id: string): Promise<void> {
  try {
    await apiManager.delete(`/grades/delete/${id}`)
  } catch (error) {
    console.log('Erro ao eliminar níveis', error)
    throw error
  }
}
