'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRegistrationStore } from '@/lib/stores/registration-store';

interface IPMetadata {
  name: string;
  description: string;
  image?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface UseOriginIPNFTReturn {
  createIPNFT: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  tokenId: string | null;
}

export function useOriginIPNFT(): UseOriginIPNFTReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();
  const { itemDetails, proofFiles } = useRegistrationStore();

  const createIPNFT = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!itemDetails.name || !itemDetails.category) {
      setError('Please fill in all required item details');
      return;
    }

    if (!proofFiles.receipt || !proofFiles.identification) {
      setError('Please upload required proof documents');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare metadata for IP-NFT
      const metadata: IPMetadata = {
        name: itemDetails.name,
        description: itemDetails.description || `IP Certificate for ${itemDetails.name}`,
        attributes: [
          {
            trait_type: 'Category',
            value: itemDetails.category
          },
          {
            trait_type: 'Registration Date',
            value: new Date().toISOString()
          }
        ]
      };

      // Add value attribute if provided
      if (itemDetails.value) {
        metadata.attributes.push({
          trait_type: 'Estimated Value',
          value: itemDetails.value
        });
      }

      // Add purchase date if provided
      if (itemDetails.purchaseDate) {
        metadata.attributes.push({
          trait_type: 'Purchase Date',
          value: itemDetails.purchaseDate
        });
      }

      // Add serial number if provided
      if (itemDetails.serialNumber) {
        metadata.attributes.push({
          trait_type: 'Serial/Model Number',
          value: itemDetails.serialNumber
        });
      }

      console.log('Creating IP-NFT with metadata:', metadata);

      // For now, simulate the IP-NFT creation
      // This will be replaced with actual Origin SDK calls once we confirm the correct API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedTokenId = `token_${Date.now()}`;
      setTokenId(simulatedTokenId);

      console.log('IP-NFT created successfully with token ID:', simulatedTokenId);

      // TODO: Replace with actual Origin SDK integration
      // const result = await createToken({
      //   metadata,
      //   to: address,
      // });

    } catch (err: unknown) {
      console.error('Error creating IP-NFT:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create IP certificate. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createIPNFT,
    isLoading,
    error,
    tokenId
  };
}
