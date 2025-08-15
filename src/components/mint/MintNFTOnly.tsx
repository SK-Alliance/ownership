'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';

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

export function MintNFTOnly({ itemData, onSuccess }: MintNFTOnlyProps) {

  const handleRedirectToMint = () => {
    window.open('/mint', '_blank');
  };

  const handleSkip = () => {
    onSuccess?.({
      tokenId: 'skipped', 
      metadataUrl: 'skipped',
      transactionHash: 'skipped'
    });
  };

  return (
    <div className="p-6 bg-card/30 border border-main/10 rounded-lg text-center space-y-4">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/20">
        <AlertCircle className="w-8 h-8 text-blue-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-main">Updated Minting Experience</h3>
      
      <p className="text-muted text-sm">
        Traditional NFT minting has been moved to our new dedicated mint page for a better experience using Camp Network Origin SDK.
      </p>
      
      <p className="text-muted text-xs">
        Item: <strong>{itemData.title}</strong> - {itemData.category}
      </p>
      
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleRedirectToMint}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Go to Mint Page <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        
        <Button
          onClick={handleSkip}
          variant="outline"
          className="text-muted"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}