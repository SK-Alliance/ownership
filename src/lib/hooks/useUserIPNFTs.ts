'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

interface IPNFTToken {
  tokenId: string;
  metadata: {
    name: string;
    description: string;
    image?: string;
    attributes?: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  owner: string;
  createdAt?: string;
}

interface UseUserIPNFTsReturn {
  tokens: IPNFTToken[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserIPNFTs(): UseUserIPNFTsReturn {
  const [tokens, setTokens] = useState<IPNFTToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();

  const fetchTokens = useCallback(async () => {
    if (!isConnected || !address) {
      setTokens([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching IP-NFT tokens for address:', address);
      
      // For now, simulate fetching user tokens
      // This will be replaced with actual Origin SDK calls once we confirm the correct API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTokens: IPNFTToken[] = [
        {
          tokenId: 'token_1708123456789',
          metadata: {
            name: 'Vintage Rolex Watch',
            description: 'IP Certificate for Vintage Rolex Watch',
            attributes: [
              { trait_type: 'Category', value: 'Watches' },
              { trait_type: 'Estimated Value', value: '$15,000' },
              { trait_type: 'Registration Date', value: '2024-02-17T10:30:56.789Z' }
            ]
          },
          owner: address,
          createdAt: '2024-02-17T10:30:56.789Z'
        }
      ];
      
      setTokens(mockTokens);
      console.log('Retrieved mock tokens:', mockTokens);

      // TODO: Replace with actual Origin SDK integration
      // const userTokens = await getTokensByOwner(address);
      // setTokens(userTokens || []);
      
    } catch (err: unknown) {
      console.error('Error fetching IP-NFT tokens:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch IP certificates';
      setError(errorMessage);
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return {
    tokens,
    isLoading,
    error,
    refetch: fetchTokens
  };
}
