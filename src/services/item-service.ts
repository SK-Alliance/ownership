import apiClient from '@/lib/api-client';
import { RegisterItemRequest, RegisterItemResponse } from '@/types/api';

class ItemService {
  /**
   * Register a new item with file uploads
   */
  async registerItem(params: RegisterItemRequest & { walletAddress: string }): Promise<RegisterItemResponse> {
    try {
      const formData = new FormData();
      
      formData.append('title', params.title);
      formData.append('category', params.category);
      formData.append('est_value', params.est_value.toString());
      formData.append('wallet_address', params.walletAddress);
      
      if (params.billFile) {
        formData.append('billFile', params.billFile);
      }
      
      if (params.idFile) {
        formData.append('idFile', params.idFile);
      }

      const response = await apiClient.post<RegisterItemResponse>('/items/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for file uploads
      });

      return response.data;
    } catch (error: unknown) {
      console.error('Item registration service error:', error);
      
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      return {
        success: false,
        error: 'Failed to register item. Please try again.'
      };
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than 10MB`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only JPG, PNG, and PDF files are allowed'
      };
    }

    return { isValid: true };
  }

  /**
   * Validate registration data
   */
  validateRegistrationData(data: RegisterItemRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('Title is required');
    } else if (data.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }

    if (!data.category?.trim()) {
      errors.push('Category is required');
    }

    if (!data.est_value || data.est_value <= 0) {
      errors.push('Estimated value must be greater than 0');
    }

    // Validate files if provided
    if (data.billFile) {
      const billValidation = this.validateFile(data.billFile);
      if (!billValidation.isValid && billValidation.error) {
        errors.push(`Bill document: ${billValidation.error}`);
      }
    }

    if (data.idFile) {
      const idValidation = this.validateFile(data.idFile);
      if (!idValidation.isValid && idValidation.error) {
        errors.push(`ID document: ${idValidation.error}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const itemService = new ItemService();
export default itemService;
