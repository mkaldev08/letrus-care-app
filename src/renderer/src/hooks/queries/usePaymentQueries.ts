import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
  getAllPaymentsService,
  getPaymentService,
  searchPaymentsService,
  createPaymentService,
  IPaymentForShow,
  IPaymentReceipt,
  IPayment
} from '@renderer/services/payment-service'
import { queryClient } from '@renderer/lib/react-query'

// Query Keys
export const paymentKeys = {
  all: ['payments'] as const,
  list: (centerId: string, page: number, query?: string) =>
    [...paymentKeys.all, 'list', centerId, page, query] as const,
  detail: (id: string) => [...paymentKeys.all, 'detail', id] as const
}

// Queries
export const usePaymentsQuery = (
  centerId?: string,
  page: number = 1,
  query: string = ''
): UseQueryResult<{ payments: IPaymentForShow[]; totalPayments: number }> => {
  return useQuery({
    queryKey: paymentKeys.list(centerId ?? '', page, query),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      if (query) {
        return searchPaymentsService(centerId, query)
      }
      return getAllPaymentsService(centerId, page)
    },
    enabled: !!centerId,
    placeholderData: (previousData) => previousData // Keep previous data while fetching new page
  })
}

export const usePaymentQuery = (
  paymentId?: string
): UseQueryResult<{ payment: IPaymentForShow; receipt: IPaymentReceipt }, Error> => {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId ?? ''),
    queryFn: async () => {
      if (!paymentId) throw new Error('Payment ID required')
      return getPaymentService(paymentId)
    },
    enabled: !!paymentId
  })
}

// Mutations
export const useCreatePaymentMutation = (): UseMutationResult<void, unknown, IPayment> => {
  return useMutation({
    mutationFn: (data: IPayment) => createPaymentService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
    }
  })
}
