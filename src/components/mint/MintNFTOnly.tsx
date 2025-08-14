'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Sparkles, AlertCircle } from 'lucide-react';
import { CONTRACT_CONFIG } from '@/lib/contract-abi';
import { SupabaseStorage } from '@/lib/supabase-storage';

interface MintNFTOnlyProps {
  imageFile: File;
  itemData: {
    title: string;
    brand: string;
    category: string;
    serialNumber: string;
    est_value?: number;
  };
  onSuccess?: (result: { tokenId: string; metadataUrl: string; transactionHash: string }) => void;
  onError?: (error: string) => void;
}

export function MintNFTOnly({ imageFile, itemData, onSuccess, onError }: MintNFTOnlyProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMintNFT = async () => {
    if (!isConnected || !address) {
      onError?.('Please connect your wallet first');
      return;
    }

    if (!imageFile || !itemData.title) {
      onError?.('Missing required data for minting');
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload image and metadata to Supabase
      console.log('📦 Uploading to Supabase...');
      const uploadResult = await SupabaseStorage.uploadComplete(
        imageFile,
        itemData,
        address
      );
      
      if (!uploadResult.success) {
        throw new Error(`Upload failed: ${uploadResult.error}`);
      }
      
      console.log('✅ Supabase upload successful:', uploadResult.metadataUrl);
      setIsUploading(false);
      setIsMinting(true);
      
      // Mint NFT on BaseCamp using Wagmi
      writeContract({
        ...CONTRACT_CONFIG,
        functionName: 'mintTo',
        args: [address as `0x${string}`, uploadResult.metadataUrl],
      });
      
    } catch (error) {
      console.error('❌ NFT minting failed:', error);
      setIsUploading(false);
      setIsMinting(false);
      onError?.(error instanceof Error ? error.message : 'Minting failed');
    }
  };

  // Handle successful transaction
  React.useEffect(() => {
    if (isConfirmed && hash) {
      setIsMinting(false);
      onSuccess?.({
        tokenId: 'pending', // Will be extracted from transaction receipt in real implementation
        metadataUrl: 'stored_metadata_url',
        transactionHash: hash
      });
    }
  }, [isConfirmed, hash, onSuccess]);

  // Handle transaction errors
  React.useEffect(() => {
    if (writeError) {
      setIsMinting(false);
      onError?.(writeError.message);
    }
  }, [writeError, onError]);

  const isProcessing = isUploading || isMinting || isPending || isConfirming;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-surface/30 border border-main/20 rounded-lg">
        <h3 className="text-lg font-medium text-main mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          NFT Minting (Tutorial 1 Approach)
        </h3>
        <p className="text-muted text-sm mb-4">
          This will mint an NFT on the BaseCamp network using Wagmi + RainbowKit, uploading metadata to Supabase storage.
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Network:</span>
            <span className="text-main">BaseCamp Testnet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Storage:</span>
            <span className="text-main">Supabase</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Contract:</span>
            <span className="text-main font-mono text-xs">{CONTRACT_CONFIG.address}</span>
          </div>
        </div>
      </div>

      {!isConnected && (
        <div className="flex items-center gap-2 p-3 bg-red/10 border border-red/20 rounded-lg text-red text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Please connect your wallet to mint NFT</span>
        </div>
      )}

      <button
        onClick={handleMintNFT}
        disabled={!isConnected || isProcessing}
        className="w-full btn-primary py-3 text-lg font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-5 h-5" />
          {isUploading ? 'Uploading to Supabase...' :
           isMinting || isPending ? 'Minting NFT...' :
           isConfirming ? 'Confirming Transaction...' :
           'Mint NFT on BaseCamp'}
        </div>
        
        {/* Button glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {hash && (
        <div className="p-3 bg-green/10 border border-green/20 rounded-lg text-green text-sm">
          <div className="font-medium">Transaction Submitted</div>
          <div className="font-mono text-xs mt-1 break-all">{hash}</div>
        </div>
      )}
    </div>
  );
}