'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

type MintingOption = 'mint_only' | 'mint_and_ip' | 'ip_only';

interface UserProfile {
  display_name?: string;
  username?: string;
  wallet_address?: string;
}

interface Step2Props {
  formData: {
    title: string;
    category: string;
    brand: string;
    serialNumber: string;
    est_value: number;
  };
  imagePreview: string | null;
  userProfile: UserProfile | null;
  nftPreview?: string | null;
  mintingOption?: MintingOption;
  onMintingOptionChange?: (option: MintingOption) => void;
  onBack: () => void;
  onNext: () => void;
  onMintNFT: (option: MintingOption) => Promise<void>;
  isGeneratingNFT: boolean;
  isMinting?: boolean;
}

export const Step2NFTPreview: React.FC<Step2Props> = ({
  formData,
  imagePreview,
  userProfile,
  nftPreview: externalNftPreview,
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
  const generateNFTPreview = useCallback(async () => {
    if (!imagePreview || !formData.title || !userProfile?.display_name) {
      return;
    }

    setIsGenerating(true);
    try {
      const nftImageUrl = await NFTImageGenerator.generateNFTImage({
        itemImage: imagePreview,
        itemName: formData.title,
        ownerName: userProfile?.display_name || 'Unknown Owner'
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
  }, [imagePreview, formData.title, userProfile?.display_name]);

  useEffect(() => {
    generateNFTPreview();
  }, [generateNFTPreview]);

  const handleOptionSelect = async (option: MintingOption) => {
    try {
      await onMintNFT(option);
      onNext();
    } catch (error) {
      console.error('Failed to process option:', error);
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

      {/* Minting Options */}
      <div className="space-y-6 pt-6 border-t border-main/10">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-main mb-2">Choose Your Action</h3>
          <p className="text-muted text-sm">Select how you want to proceed with your ownership certificate</p>
        </div>

        <div className="grid gap-4 max-w-2xl mx-auto">
          {/* Option 1: Only Mint NFT */}
          <Button
            type="button"
            onClick={() => handleOptionSelect('mint_only')}
            disabled={!nftGenerated || isGeneratingNFT || isMinting}
            className="p-6 h-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 disabled:opacity-50 text-left"
          >
            <div className="flex items-start gap-4">
              <Wallet className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-lg">Only Mint NFT</div>
                <div className="text-blue-100 text-sm mt-1">
                  Mint your ownership certificate as an NFT on Camp Network. Quick and simple.
                </div>
              </div>
              <ArrowRight className="w-5 h-5 mt-1 ml-auto flex-shrink-0" />
            </div>
          </Button>

          {/* Option 2: Mint NFT + Create IP */}
          <Button
            type="button"
            onClick={() => handleOptionSelect('mint_and_ip')}
            disabled={!nftGenerated || isGeneratingNFT || isMinting}
            className="p-6 h-auto bg-gradient-to-r from-gold to-gold/80 text-bg-main font-medium rounded-lg hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 disabled:opacity-50 text-left"
          >
            <div className="flex items-start gap-4">
              <div className="flex gap-2 mt-1 flex-shrink-0">
                <Wallet className="w-5 h-5" />
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-lg">Mint NFT + Create IP</div>
                <div className="text-bg-main/80 text-sm mt-1">
                  Mint NFT and create intellectual property protection using Origin Protocol.
                </div>
              </div>
              <ArrowRight className="w-5 h-5 mt-1 ml-auto flex-shrink-0" />
            </div>
          </Button>

          {/* Option 3: Only Create IP */}
          <Button
            type="button"
            onClick={() => handleOptionSelect('ip_only')}
            disabled={!nftGenerated || isGeneratingNFT || isMinting}
            className="p-6 h-auto bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-600/25 transition-all duration-200 disabled:opacity-50 text-left"
          >
            <div className="flex items-start gap-4">
              <Award className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-lg">Only Create IP</div>
                <div className="text-purple-100 text-sm mt-1">
                  Focus on intellectual property protection using Origin Protocol&apos;s IP-NFT system.
                </div>
              </div>
              <ArrowRight className="w-5 h-5 mt-1 ml-auto flex-shrink-0" />
            </div>
          </Button>
        </div>

        {/* Back Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6 py-3 border-main/20 text-main hover:border-main/40"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Loading State */}
        {(isGeneratingNFT || isMinting) && (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 text-gold animate-spin mx-auto mb-2" />
            <p className="text-main font-medium">
              {isMinting ? 'Processing your request...' : 'Generating certificate...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
