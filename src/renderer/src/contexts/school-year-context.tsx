import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  ISchoolYear,
  createSchoolYear,
  editSchoolYearService,
  getCurrentSchoolYearService,
  getSchoolYearService,
  getSchoolYearsService,
  getSchoolYearsServiceAll
} from '@renderer/services/school-year-service'
import { getFromStorage, saveToStorage, removeFromStorage } from '@renderer/utils/storage'

interface SchoolYearContextData {
  loading: boolean
  schoolYears: ISchoolYear[]
  totalSchoolYear: number
  currentSchoolYear: ISchoolYear | null
  selectedSchoolYear: ISchoolYear | null
  setSelectedSchoolYear: (schoolYear: ISchoolYear | null) => void
  fetchSchoolYears: (page: number, centerId: string) => Promise<void>
  fetchAllSchoolYears: (centerId: string) => Promise<void>
  fetchCurrentSchoolYear: (centerId: string) => Promise<ISchoolYear | null>
  getSchoolYearById: (schoolYearId: string) => Promise<ISchoolYear | null>
  createSchoolYear: (data: ISchoolYear, centerId: string) => Promise<void>
  editSchoolYear: (schoolYearId: string, data: ISchoolYear) => Promise<void>
}

export const SchoolYearContext = createContext<SchoolYearContextData>({} as SchoolYearContextData)

export const SchoolYearProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [schoolYears, setSchoolYears] = useState<ISchoolYear[]>([])
  const [totalSchoolYear, setTotalSchoolYear] = useState<number>(0)
  const [currentSchoolYear, setCurrentSchoolYear] = useState<ISchoolYear | null>(null)
  const [selectedSchoolYear, setSelectedSchoolYearState] = useState<ISchoolYear | null>(null)

  useEffect(() => {
    function loadStoredData(): void {
      const storedSelected = getFromStorage('schoolYear')
      if (storedSelected) {
        setSelectedSchoolYearState(storedSelected as ISchoolYear)
        setCurrentSchoolYear(storedSelected as ISchoolYear)
      }
      setLoading(false)
    }
    loadStoredData()
  }, [])

  const setSelectedSchoolYear = (schoolYear: ISchoolYear | null): void => {
    setSelectedSchoolYearState(schoolYear)
    if (schoolYear) {
      saveToStorage('schoolYear', schoolYear)
    } else {
      removeFromStorage('schoolYear')
    }
  }

  const fetchSchoolYears = async (page: number, centerId: string): Promise<void> => {
    setLoading(true)
    try {
      const res = await getSchoolYearsService(page, centerId)
      setSchoolYears(res.schoolYears)
      setTotalSchoolYear(res.totalSchoolYear)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllSchoolYears = async (centerId: string): Promise<void> => {
    setLoading(true)
    try {
      const list = await getSchoolYearsServiceAll(centerId)
      setSchoolYears(list)
      setTotalSchoolYear(list.length)
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentSchoolYear = async (centerId: string): Promise<ISchoolYear | null> => {
    setLoading(true)
    try {
      const current = await getCurrentSchoolYearService(centerId)

      setCurrentSchoolYear(current)
      saveToStorage('schoolYear', current)
      return current
    } catch (error) {
      console.log('Erro ao buscar ano letivo atual', error)

      return null
    } finally {
      setLoading(false)
    }
  }

  const getSchoolYearById = async (schoolYearId: string): Promise<ISchoolYear | null> => {
    try {
      const sy = await getSchoolYearService(schoolYearId)
      return sy
    } catch (error) {
      console.log('Erro ao buscar ano letivo por ID', error)
      return null
    }
  }

  const createSchoolYearAction = async (data: ISchoolYear, centerId: string): Promise<void> => {
    setLoading(true)
    try {
      await createSchoolYear(data, centerId)
    } finally {
      setLoading(false)
    }
  }

  const editSchoolYear = async (schoolYearId: string, data: ISchoolYear): Promise<void> => {
    setLoading(true)
    try {
      await editSchoolYearService(schoolYearId, data)
      if (currentSchoolYear && currentSchoolYear._id === schoolYearId) {
        const updated = { ...currentSchoolYear, ...data }
        setCurrentSchoolYear(updated)
        saveToStorage('schoolYear', updated)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SchoolYearContext.Provider
      value={{
        loading,
        schoolYears,
        totalSchoolYear,
        currentSchoolYear,
        selectedSchoolYear,
        setSelectedSchoolYear,
        fetchSchoolYears,
        fetchAllSchoolYears,
        fetchCurrentSchoolYear,
        getSchoolYearById,
        createSchoolYear: createSchoolYearAction,
        editSchoolYear
      }}
    >
      {children}
    </SchoolYearContext.Provider>
  )
}

export function useSchoolYear(): SchoolYearContextData {
  const context = useContext(SchoolYearContext)
  return context
}
