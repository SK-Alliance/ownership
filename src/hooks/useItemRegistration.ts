import { useState } from 'react';
import { useAccount } from 'wagmi';
import { itemService } from '@/services/item-service';
import { RegisterItemRequest, RegisterItemResponse } from '@/types/api';
import { useUserStore } from '@/lib/stores/user-store';

interface UseItemRegistrationReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  registerItem: (data: RegisterItemRequest) => Promise<RegisterItemResponse | null>;
  reset: () => void;
  validateData: (data: RegisterItemRequest) => { isValid: boolean; errors: string[] };
}

export function useItemRegistration(): UseItemRegistrationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { address } = useAccount();
  const { user } = useUserStore();

  const registerItem = async (data: RegisterItemRequest): Promise<RegisterItemResponse | null> => {
    if (!address) {
      setError('Please connect your wallet first');
      return null;
    }

    if (!user) {
      setError('User data not available. Please reconnect your wallet.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate data first
      const validation = itemService.validateRegistrationData(data);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return null;
      }

      // Register item
      const result = await itemService.registerItem({
        ...data,
        walletAddress: address
      });

      if (result.success) {
        setSuccess(true);
        return result;
      } else {
        setError(result.error || 'Registration failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  };

  const validateData = (data: RegisterItemRequest) => {
    return itemService.validateRegistrationData(data);
  };

  return {
    isLoading,
    error,
    success,
    registerItem,
    reset,
    validateData
  };
}
