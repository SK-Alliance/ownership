import { useState, useEffect } from 'react'
import { itemsAPI, uploadsAPI } from '../services'

// Simple hook for API calls
export function useItems() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await itemsAPI.getAll()
        setData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch items')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  return { data, loading, error }
}

// Hook for file uploads
export function useFileUpload() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (file: File) => {
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await uploadsAPI.uploadFile(formData)
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { uploadFile, loading, error }
}
