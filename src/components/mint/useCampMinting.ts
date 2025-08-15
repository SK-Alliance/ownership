'use client';

import { useState } from 'react';
import { useAuth, useAuthState } from '@campnetwork/origin/react';
import { toast } from 'sonner';
import { MintFormData } from './MintForm';
import { storeMintedNFT, prepareMintedNFTData } from '@/lib/minted-nft-api';
import { getUserSessionCookies } from '@/lib/auth-cookies';
import { getOrCreateUser } from '@/lib/user-management';

interface LicenseTerms {
  price: bigint; // Price in wei
  duration: number; // Duration in seconds  
  royaltyBps: number; // Royalty in basis points (0-10000)
  paymentToken: `0x${string}`; // Payment token address (address(0) for native currency)
}

interface MintHookReturn {
  mintWithOrigin: (formData: MintFormData) => Promise<boolean>;
  isMinting: boolean;
  mintingProgress: string;
}

export const useCampMinting = (): MintHookReturn => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintingProgress, setMintingProgress] = useState('');
  
  const auth = useAuth();
  const { authenticated } = useAuthState();

  const mintWithOrigin = async (formData: MintFormData): Promise<boolean> => {
    // Validation checks
    if (!authenticated) {
      toast.error('Please connect to Camp Network first');
      return false;
    }

    if (!auth || typeof auth !== 'object' || !('origin' in auth) || !auth.origin) {
      toast.error('Camp Network SDK not initialized. Please connect to Camp Network first.');
      return false;
    }

    // Check if we have session data with wallet address
    const sessionData = getUserSessionCookies();
    if (!sessionData?.walletAddress) {
      toast.error('Wallet address not available. Please reconnect your wallet.');
      return false;
    }

    if (!formData.image) {
      toast.error('Please select an image to mint');
      return false;
    }

    // Validate form data
    if (!formData.itemName || !formData.model || !formData.manufacturer || 
        !formData.category || !formData.description || formData.estimatedValue <= 0) {
      toast.error('Please fill in all required fields');
      return false;
    }

    setIsMinting(true);
    
    try {
      setMintingProgress('Preparing metadata...');
      
      // Check file size (max 10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (formData.image.size > maxSizeInBytes) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Define license terms for the IP-NFT
      const licenseTerms: LicenseTerms = {
        price: BigInt(0), // Free access
        duration: 30 * 24 * 60 * 60, // 30 days in seconds
        royaltyBps: 0, // 0% royalty
        paymentToken: '0x0000000000000000000000000000000000000000' as `0x${string}` // Native currency
      };

      // Create comprehensive metadata
      const metadata = {
        name: formData.itemName,
        description: formData.description,
        image: '', // Will be set by mintFile
        external_url: window.location.origin,
        attributes: [
          {
            trait_type: 'Model',
            value: formData.model
          },
          {
            trait_type: 'Manufacturer',
            value: formData.manufacturer
          },
          {
            trait_type: 'Category',
            value: formData.category
          },
          {
            trait_type: 'Estimated Value',
            value: `$${formData.estimatedValue}`
          },
          {
            trait_type: 'Creation Date',
            value: new Date().toISOString().split('T')[0]
          },
          {
            trait_type: 'Network',
            value: 'Camp Network'
          },
          {
            trait_type: 'Type',
            value: 'Ownership Certificate'
          }
        ]
      };

      setMintingProgress('Uploading to IPFS and minting IP-NFT...');
      console.log('Minting IP-NFT with Origin SDK...', {
        file: formData.image.name,
        metadata,
        licenseTerms
      });

      // Mint using Origin SDK - this handles IPFS upload and NFT minting
      let result;
      try {
        result = await auth.origin.mintFile(
          formData.image,
          metadata,
          licenseTerms
        );
      } catch (mintError: unknown) {
        console.error('❌ Origin SDK minting error:', mintError);
        
        const error = mintError as Error;
        
        // Handle specific wallet connection errors
        if (error?.message?.includes('WalletClient not connected') || 
            error?.message?.includes('not connected') ||
            error?.message?.includes('wallet') ||
            (error as { code?: string })?.code === 'WALLET_NOT_CONNECTED') {
          throw new Error('Wallet connection lost. Please reconnect your wallet and try again.');
        }
        
        // Handle other known errors
        if (error?.message?.includes('User rejected')) {
          throw new Error('Transaction was rejected by user.');
        }
        
        if (error?.message?.includes('insufficient funds')) {
          throw new Error('Insufficient funds to complete the transaction.');
        }
        
        // Generic error fallback
        throw new Error(error?.message || 'Failed to mint NFT. Please try again.');
      }
      
      console.log('✅ IP-NFT minted successfully:', result);
      
      setMintingProgress('Storing NFT data...');
      
      // Get user session data
      const sessionData = getUserSessionCookies();
      
      if (sessionData?.walletAddress) {
        // Get or create user in database and get proper user ID
        const userResult = await getOrCreateUser(
          sessionData.walletAddress,
          {
            display_name: sessionData.fullName,
            email: sessionData.email
          }
        );

        if (userResult.success && userResult.user_id) {
          // Prepare NFT data for storage with database user ID
          const nftData = prepareMintedNFTData(
            userResult.user_id, // Use actual database user ID
            {
              itemName: formData.itemName,
              model: formData.model,
              manufacturer: formData.manufacturer,
              category: formData.category,
              estimatedValue: formData.estimatedValue,
              description: formData.description,
              image: formData.image || undefined
            },
            {
              token_id: result?.toString() || 'unknown',
              contract_address: 'Camp Network Contract', // Default since SDK doesn't return this
              transaction_hash: undefined, // Will be populated if available
              ipfs_metadata_url: undefined, // Will be populated if available
              ipfs_image_url: undefined // Will be populated if available
            }
          );

          // Store NFT data in database
          const storeResult = await storeMintedNFT(nftData);
          
          if (!storeResult.success) {
            console.warn('⚠️ NFT minted successfully but failed to store in database:', storeResult.error);
            // Don't fail the entire process, just log the warning
          } else {
            console.log('✅ NFT data stored in database successfully');
          }
        } else {
          console.warn('⚠️ Failed to get/create user in database:', userResult.error);
        }
      } else {
        console.warn('⚠️ No session data found, cannot store NFT in database');
      }
      
      setMintingProgress('Finalizing...');
      
      toast.success('NFT minted successfully! Your ownership certificate is now live on Camp Network.');
      
      return true;
      
    } catch (error: unknown) {
      console.error('❌ Minting failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to mint NFT. Please try again.';
      toast.error(`Minting failed: ${errorMessage}`);
      return false;
    } finally {
      setIsMinting(false);
      setMintingProgress('');
    }
  };

  return {
    mintWithOrigin,
    isMinting,
    mintingProgress
  };
};
