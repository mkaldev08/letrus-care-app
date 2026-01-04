import apiManager from './api'

export interface ISchoolYear {
  _id?: string
  description: string
  startDate: Date
  endDate: Date
  isCurrent: boolean
}

export async function createSchoolYear(data: ISchoolYear, centerId: string): Promise<void> {
  try {
    await apiManager.post(`school-year/new/${centerId}`, data)
  } catch (error) {
    console.log('Erro ao criar ano letivo: ', error)
    throw error
  }
}

type IResponse = {
  schoolYears: ISchoolYear[]
  totalSchoolYear: number
}

export async function getSchoolYearsService(page: number, centerId: string): Promise<IResponse> {
  try {
    const { data } = await apiManager.get(`school-year/all/${centerId}?page=${page}`)
    const typeData: IResponse = data
    return typeData
  } catch (error) {
    console.log('Erro ao buscar...')
    throw error
  }
}

export async function getCurrentSchoolYearService(centerId: string): Promise<ISchoolYear> {
  try {
    const { data } = await apiManager.get(`school-year/current/${centerId}`)
    return data
  } catch (error) {
    console.log('Erro ao buscar ano letivo atual')
    throw error
  }
}

export async function getSchoolYearsServiceAll(centerId: string): Promise<ISchoolYear[]> {
  try {
    const { data } = await apiManager.get(`school-year/${centerId}`)

    return data
  } catch (error) {
    console.error('Erro ao buscar...')
    throw error
  }
}

export async function getSchoolYearService(schoolYearId: string): Promise<ISchoolYear> {
  try {
    const { data } = await apiManager.get(`school-year/${schoolYearId}`)
    return data
  } catch (error) {
    console.error('Erro ao buscar ...')
    throw error
  }
}

export async function editSchoolYearService(
  schoolYearId: string,
  data: ISchoolYear
): Promise<void> {
  try {
    await apiManager.put(`school-year/edit/${schoolYearId}`, data)
  } catch (error) {
    console.log('Erro ao editar: ', error)
    throw error
  }
}
