import { useState, useEffect } from 'react';
import { getUserSessionCookies } from '@/lib/auth-cookies';

export interface MintedNFT {
  id: string;
  userId: string;
  itemName: string;
  model?: string;
  manufacturer?: string;
  category: string;
  description?: string;
  estimatedValue: number;
  imageUrl?: string;
  imageFileName?: string;
  imageFileSize?: number;
  imageFileType?: string;
  
  // Blockchain data
  tokenId?: string;
  contractAddress?: string;
  transactionHash?: string;
  blockchainNetwork: string;
  ipfsMetadataUrl?: string;
  ipfsImageUrl?: string;
  
  // License terms
  commercialUse: boolean;
  derivatives: boolean;
  attribution: boolean;
  
  // Timestamps
  mintedAt: string;
  updatedAt: string;
  
  // User info
  user: {
    id: string;
    walletAddress: string;
    displayName?: string;
    email?: string;
  };
}

interface FetchMintedNFTsResponse {
  success: boolean;
  data: MintedNFT[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

export function useMintedNFTs() {
  const [nfts, setNfts] = useState<MintedNFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMintedNFTs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user wallet address from session cookies
      const sessionData = getUserSessionCookies();
      if (!sessionData?.walletAddress) {
        setNfts([]);
        return;
      }

      // Fetch minted NFTs for this user
      const response = await fetch(
        `/api/nft/minted?wallet_address=${encodeURIComponent(sessionData.walletAddress)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result: FetchMintedNFTsResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch minted NFTs');
      }

      setNfts(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching NFTs';
      setError(errorMessage);
      console.error('Error fetching minted NFTs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchMintedNFTs();
  };

  useEffect(() => {
    fetchMintedNFTs();
  }, []);

  return {
    nfts,
    isLoading,
    error,
    refetch
  };
}
