import {
  createCenterService,
  editCenterService,
  getCenterService,
  ICenter,
  isCenterExists,
  upload_logoService
} from '@renderer/services/center-service'

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { AxiosResponse } from 'axios'
import { getFromStorage, saveToStorage } from '@renderer/utils/storage'

interface CenterContextData {
  loading: boolean
  center: ICenter | null
  centerImage: { fileData: string; fileType: string } | null
  createCenter: (data: ICenter) => Promise<AxiosResponse>
  centerExistsContext: (userId: string) => Promise<boolean>
  editCenterContext: (centerId: string, data: ICenter) => Promise<void>
  uploadCenterImage: (centerId: string, fileData: FormData) => Promise<void>
}

// Criação do contexto
export const CenterContext = createContext<CenterContextData>({} as CenterContextData)

export const CenterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [center, setCenter] = useState<ICenter | null>(null)
  const [centerImage, setCenterImage] = useState<{ fileData: string; fileType: string } | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Persistência do centro no local storage
  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const storagedCenter: ICenter = getFromStorage('center') as ICenter

      if (storagedCenter) {
        setCenter(storagedCenter)

        if (storagedCenter.fileData && storagedCenter.fileType) {
          setCenterImage({ fileData: storagedCenter.fileData, fileType: storagedCenter.fileType })
        }
      } else if (user) {
        try {
          const response = await getCenterService(user?._id as string)
          setCenter(response.data)
          saveToStorage('center', response.data)

          if (response.data.fileData && response.data.fileType) {
            setCenterImage({ fileData: response.data.fileData, fileType: response.data.fileType })
          }
        } catch (error) {
          console.log('Erro ao fazer fetch do centro:', error)
        }
      }
      setLoading(false)
    }

    loadStorageData()
  }, [user?._id])

  async function createCenter(data: ICenter): Promise<AxiosResponse> {
    try {
      const response = await createCenterService(data, user?._id as string)
      setCenter(response?.data)
      saveToStorage('center', response?.data)
      return response
    } catch (error) {
      console.log('Erro ao criar centro no contexto: ', error)
      throw error
    }
  }

  async function editCenterContext(centerId: string, data: ICenter): Promise<void> {
    try {
      const response = await editCenterService(centerId, data)
      setCenter(response)
      saveToStorage('center', response)

      if (response.fileData && response.fileType) {
        setCenterImage({ fileData: response.fileData, fileType: response.fileType })
      }
    } catch (error) {
      console.log('Erro ao editar centro no contexto: ', error)
      throw error
    }
  }

  async function centerExistsContext(userId: string): Promise<boolean> {
    const cachedCenter: ICenter = getFromStorage('center') as ICenter
    if (cachedCenter) {
      setCenter(cachedCenter)

      if (cachedCenter.fileData && cachedCenter.fileType) {
        setCenterImage({ fileData: cachedCenter.fileData, fileType: cachedCenter.fileType })
      }
      return true
    }

    const { isExists, response } = await isCenterExists(userId)
    if (isExists) {
      saveToStorage('center', response?.data)
      setCenter(response?.data)

      if (response?.data.fileData && response?.data.fileType) {
        setCenterImage({ fileData: response.data.fileData, fileType: response.data.fileType })
      }
    }
    return isExists
  }

  async function uploadCenterImage(centerId: string, fileData: FormData): Promise<void> {
    try {
      const response = await upload_logoService(centerId, fileData)
      setCenter(response)
      saveToStorage('center', response)

      if (response.fileData && response.fileType) {
        setCenterImage({ fileData: response.fileData, fileType: response.fileType })
      }
      if (response.fileData && response.fileType) {
        setCenterImage({ fileData: response.fileData, fileType: response.fileType })
      }
    } catch (error) {
      console.log('Erro ao fazer upload da imagem: ', error)
      throw error
    }
  }

  return (
    <CenterContext.Provider
      value={{
        center,
        centerImage,
        createCenter,
        loading,
        editCenterContext,
        centerExistsContext,
        uploadCenterImage
      }}
    >
      {children}
    </CenterContext.Provider>
  )
}

export function useCenter(): CenterContextData {
  const context = useContext(CenterContext)
  return context
}
