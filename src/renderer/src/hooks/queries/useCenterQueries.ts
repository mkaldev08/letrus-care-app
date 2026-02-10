import { useMutation, UseMutationResult } from '@tanstack/react-query'
import {
  ICenter,
  editCenterService,
  upload_logoService,
  createCenterService
} from '@renderer/services/center-service'
import { AxiosResponse } from 'axios'
import { queryClient } from '@renderer/lib/react-query'

// Query Keys
export const centerKeys = {
  all: ['centers'] as const,
  detail: (id: string) => [...centerKeys.all, 'detail', id] as const
}

// Create Center Mutation
export const useCreateCenterMutation = (
  createdBy: string
): UseMutationResult<AxiosResponse, Error, ICenter> => {
  return useMutation({
    mutationFn: (data: ICenter) => createCenterService(data, createdBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.all })
    }
  })
}

// Edit Center Mutation
export const useEditCenterMutation = (): UseMutationResult<
  ICenter,
  Error,
  { centerId: string; data: ICenter }
> => {
  return useMutation({
    mutationFn: ({ centerId, data }: { centerId: string; data: ICenter }) =>
      editCenterService(centerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.all })
    }
  })
}

// Upload Center Logo Mutation
export const useUploadCenterLogoMutation = (): UseMutationResult<
  ICenter,
  Error,
  { centerId: string; formData: FormData }
> => {
  return useMutation({
    mutationFn: ({ centerId, formData }: { centerId: string; formData: FormData }) =>
      upload_logoService(centerId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.all })
    }
  })
}
