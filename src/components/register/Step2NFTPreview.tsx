'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Wallet
} from 'lucide-react';
import { NFTImageGenerator } from '@/lib/nft-image-generator';

interface Step2Props {
  formData: {
    title: string;
    category: string;
    brand: string;
    serialNumber: string;
    est_value: number;
  };
  imagePreview: string | null;
  userProfile: any;
  nftPreview?: string | null;
  mintingOption?: 'create_and_mint' | 'create_only';
  onMintingOptionChange?: (option: 'create_and_mint' | 'create_only') => void;
  onBack: () => void;
  onNext: () => void;
  onMintNFT: () => Promise<void>;
  isGeneratingNFT: boolean;
  isMinting?: boolean;
}

export const Step2NFTPreview: React.FC<Step2Props> = ({
  formData,
  imagePreview,
  userProfile,
  nftPreview: externalNftPreview,
  mintingOption = 'create_and_mint',
  onMintingOptionChange,
  onBack,
  onNext,
  onMintNFT,
  isGeneratingNFT,
  isMinting = false
}) => {
  const [nftPreview, setNftPreview] = useState<string | null>(externalNftPreview || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [nftGenerated, setNftGenerated] = useState(false);

  // Update local state when external preview changes
  useEffect(() => {
    if (externalNftPreview) {
      setNftPreview(externalNftPreview);
      setNftGenerated(true);
    }
  }, [externalNftPreview]);

  // Generate NFT preview when component mounts or data changes
  useEffect(() => {
    generateNFTPreview();
  }, [formData, imagePreview, userProfile]);

  const generateNFTPreview = async () => {
    if (!imagePreview || !formData.title || !userProfile?.display_name) {
      return;
    }

    setIsGenerating(true);
    try {
      const nftImageUrl = await NFTImageGenerator.generateNFTImage({
        itemImage: imagePreview,
        itemName: formData.title,
        ownerName: userProfile.display_name
      });

      if (nftImageUrl) {
        setNftPreview(nftImageUrl);
        setNftGenerated(true);
      }
    } catch (error) {
      console.error('Failed to generate NFT preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMintAndContinue = async () => {
    try {
      await onMintNFT();
      onNext();
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      // Show error toast or handle error appropriately
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30">
          <Award className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-2xl font-bold text-main mb-2">NFT Certificate Preview</h2>
        <p className="text-muted">Your digital ownership certificate is ready</p>
      </div>

      {/* NFT Preview */}
      <div className="max-w-md mx-auto">
        <div className="relative rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6 text-center">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-80">
              <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
              <p className="text-main font-medium">Generating NFT Certificate...</p>
              <p className="text-muted text-sm">This may take a few moments</p>
            </div>
          ) : nftPreview ? (
            <div className="space-y-4">
              <img
                src={nftPreview}
                alt="NFT Certificate Preview"
                className="w-full rounded-lg border border-main/10"
              />
              <Badge className="bg-green/20 text-green border-green/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Certificate Generated
              </Badge>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80">
              <Award className="w-12 h-12 text-muted mb-4" />
              <p className="text-main">Generating certificate...</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-main/10">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="px-6 py-3 border-main/20 text-main hover:border-main/40"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          type="button"
          onClick={handleMintAndContinue}
          disabled={!nftGenerated || isGeneratingNFT || isMinting}
          className="px-8 py-3 bg-gradient-to-r from-gold to-gold/80 text-bg-main font-medium rounded-lg hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 disabled:opacity-50"
        >
          {isGeneratingNFT || isMinting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isMinting ? 'Minting NFT...' : 'Generating...'}
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Mint NFT & Continue
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
