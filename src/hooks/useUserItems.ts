import { useState, useEffect } from 'react';
import { useWalletConnection } from './useWalletConnection';

export interface UserItem {
  id: string;
  title: string;
  category: 'electronics' | 'vehicles' | 'jewelry' | 'art' | 'real_estate' | 'other';
  brand: string;
  serial_number: string;
  estimated_value: number;
  owner_id: string;
  owner_wallet_address: string;
  item_image_url: string | null;
  bill_url: string | null;
  id_url: string | null;
  nft_certificate_url: string | null;
  status: 'pending_verification' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface UseUserItemsReturn {
  items: UserItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserItems = (): UseUserItemsReturn => {
  const [items, setItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { address, isConnected } = useWalletConnection();

  const fetchItems = async () => {
    if (!address || !isConnected) {
      setItems([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/items?walletAddress=${encodeURIComponent(address)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch items');
      }

      if (result.success) {
        setItems(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch items');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching user items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [address, isConnected]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchItems,
  };
};
