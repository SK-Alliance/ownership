import { supabase } from './supabase'
import { apiClient } from './axios'

// Simple API functions - will be expanded when you define your schema
export const itemsAPI = {
  getAll: () => apiClient.get('/items'),
  getById: (id: string) => apiClient.get(`/items/${id}`),
  create: (data: unknown) => apiClient.post('/items', data),
}

export const uploadsAPI = {
  uploadFile: (formData: FormData) => 
    apiClient.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const verifyAPI = {
  submitDocuments: (data: unknown) => apiClient.post('/verify', data),
  getStatus: (itemId: string) => apiClient.get(`/verify?itemId=${itemId}`),
}

// Direct Supabase exports for when you need them
export { supabase }
