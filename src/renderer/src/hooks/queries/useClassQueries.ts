import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getClassesService, IResponseClass } from '@renderer/services/class-service'

export const useClassesQuery = (
  centerId?: string,
  schoolYearId?: string
): UseQueryResult<IResponseClass[], Error> => {
  return useQuery({
    queryKey: ['classes', centerId, schoolYearId],
    queryFn: async (): Promise<IResponseClass[]> => {
      if (!centerId || !schoolYearId) {
        throw new Error('ID do Centro e Ano letivo são obrigatórios')
      }
      return getClassesService({ centerId, schoolYearId })
    },
    enabled: !!centerId && !!schoolYearId
  })
}
