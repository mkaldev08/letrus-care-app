import { AxiosResponse } from 'axios'
import apiManager from './api'

export interface ICenter {
  _id?: string
  name: string
  address: string
  nif?: string
  phoneNumber: string
  email?: string
  documentCode?: string
  createdBy?: string
  fileData?: string
  fileType?: string
}

export const createCenterService = async (
  data: ICenter,
  createdBy: string
): Promise<AxiosResponse> => {
  try {
    const { address, documentCode, email, name, nif, phoneNumber } = data

    const response = await apiManager.post('/centers/new', {
      address,
      createdBy,
      documentCode,
      email,
      name,
      nif,
      phoneNumber
    })
    return response
  } catch (error) {
    console.log('Erro ao criar centro:', error)
    throw error
  }
}

export const getCenterService = async (createdBy: string): Promise<AxiosResponse> => {
  try {
    const response = await apiManager.get(`/centers/user/${createdBy}`)
    return response
  } catch (error) {
    console.log('Erro ao buscar centro:', error)
    throw error
  }
}

type centerFunctionProps = { isExists: boolean; response: AxiosResponse | null }
export const isCenterExists = async (createdBy: string): Promise<centerFunctionProps> => {
  try {
    const response = await getCenterService(createdBy)
    const isExists = !!response.data
    return { isExists, response }
  } catch (error) {
    console.log('Erro ao verificar existencia de centro ', error)

    throw error
  }
}

export const editCenterService = async (centerId: string, data: ICenter): Promise<ICenter> => {
  try {
    const response = await apiManager.put(`/centers/edit/${centerId}`, data)
    const typedResponse: ICenter = response.data
    return typedResponse
  } catch (error) {
    console.log('Erro editar centro ', error)

    throw error
  }
}

export const upload_logoService = async (
  centerId: string,
  data: globalThis.FormData
): Promise<ICenter> => {
  try {
    const response = await apiManager.patch(`/centers/upload_logo/${centerId}`, data)
    const typedResponse: ICenter = response.data
    return typedResponse
  } catch (error) {
    console.log('Erro carregar imagem do centro ', error)
    throw error
  }
}
