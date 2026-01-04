import axios from 'axios'
import apiManager from './api'

export interface IStudent {
  _id?: string
  name: { fullName: string; surname?: string }
  birthDate: Date
  gender: 'masculino' | 'feminino' | string
  parents: { father: string; mother: string }
  address: string
  phoneNumber: string
  email?: string
  centerId: string
  endStudiedDate: Date
  studentCode: string
  identityNumber: string
}

export const searchStudentService = async (
  centerId: string,
  query: string
): Promise<IStudent[] | null> => {
  try {
    const { data } = await apiManager.get(`/students/search/${centerId}?query=${query}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    } else {
      console.log('Erro ao pesquisar aluno: ', error)
      throw error
    }
  }
}

export const getStudentById = async (id: string): Promise<IStudent | null> => {
  try {
    const { data } = await apiManager.get(`/students/${id}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    } else {
      console.log('Erro ao buscar aluno: ')
      throw error
    }
  }
}
