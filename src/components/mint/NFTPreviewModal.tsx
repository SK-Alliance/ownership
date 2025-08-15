'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@campnetwork/origin/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalHeader, ModalBody, ModalTitle } from '@/components/ui/modal';
import { 
  Award, 
  Sparkles, 
  Loader2,
  X,
  Wallet,
  CheckCircle
} from 'lucide-react';
import { NFTImageGenerator } from '@/lib/nft-image-generator';
import { useCampMinting } from './useCampMinting';
import { MintFormData } from './MintForm';
import { getUserSessionCookies } from '@/lib/auth-cookies';

interface NFTPreviewData {
  itemImage: string;
  itemName: string;
  ownerName: string;
  model?: string;
  manufacturer?: string;
  category?: string;
  estimatedValue?: number;
  description?: string;
}

interface NFTPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: NFTPreviewData;
  formData: MintFormData;
  isMinting?: boolean;
  mintingProgress?: string;
}

export const NFTPreviewModal: React.FC<NFTPreviewModalProps> = ({
  isOpen,
  onClose,
  previewData,
  formData,
  isMinting: externalIsMinting = false,
  mintingProgress: externalMintingProgress = ''
}) => {
  const [nftPreview, setNftPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [nftGenerated, setNftGenerated] = useState(false);
  const [mintingSuccess, setMintingSuccess] = useState(false);
  
  const router = useRouter();
  const { authenticated } = useAuthState();
  const { mintWithOrigin, isMinting: internalIsMinting, mintingProgress: internalMintingProgress } = useCampMinting();
  
  // Use internal minting state or external props
  const isMinting = internalIsMinting || externalIsMinting;
  const mintingProgress = internalMintingProgress || externalMintingProgress;

  // Generate NFT preview when modal opens or data changes
  const generateNFTPreview = useCallback(async () => {
    if (!previewData.itemImage || !previewData.itemName || !previewData.ownerName) {
      return;
    }

    setIsGenerating(true);
    setNftGenerated(false);
    
    try {
      const nftImageUrl = await NFTImageGenerator.generateNFTImage({
        itemImage: previewData.itemImage,
        itemName: previewData.itemName,
        ownerName: previewData.ownerName
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
  }, [previewData.itemImage, previewData.itemName, previewData.ownerName]);

  // Handle minting internally
  const handleMint = async () => {
    // Additional validation before minting
    if (!authenticated) {
      return;
    }
    
    const sessionData = getUserSessionCookies();
    if (!sessionData?.walletAddress) {
      return;
    }
    
    const success = await mintWithOrigin(formData);
    if (success) {
      setMintingSuccess(true);
      setTimeout(() => {
        onClose();
        setMintingSuccess(false);
        // Redirect to dashboard after successful minting
        router.push('/dashboard');
      }, 2000);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateNFTPreview();
    }
  }, [isOpen, generateNFTPreview]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="max-w-2xl"
    >
      <ModalHeader>
        <div className="flex items-center justify-between">
          <ModalTitle>NFT Certificate Preview</ModalTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted hover:text-main hover:bg-surface/50 p-2 h-auto rounded-md"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-muted mt-2">Your digital ownership proof is ready</p>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          {/* NFT Preview */}
          <div className="flex justify-center">
            <div className="relative rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6 text-center max-w-md w-full">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-80">
                  <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
                  <p className="text-main font-medium">Generating NFT...</p>
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
                    Ownership NFT Generated
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-80">
                  <Award className="w-12 h-12 text-muted mb-4" />
                  <p className="text-main">Generating Ownership Proof (NFT)...</p>
                </div>
              )}
            </div>
          </div>

          {/* Minting Action */}
          <div className="space-y-4">
            {isMinting ? (
              <div className="text-center py-6">
                <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                <p className="text-main font-medium mb-2">Minting Your NFT...</p>
                {mintingProgress && (
                  <p className="text-muted text-sm">{mintingProgress}</p>
                )}
              </div>
            ) : mintingSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-green mx-auto mb-4" />
                <p className="text-main font-medium mb-2">NFT Minted Successfully!</p>
                <p className="text-muted text-sm">Your ownership certificate is now live on Camp Network</p>
              </div>
            ) : (
              <>
                <Button
                  onClick={handleMint}
                  disabled={!nftGenerated || isGenerating || !authenticated || !getUserSessionCookies()?.walletAddress}
                  className="w-full py-3 bg-gradient-to-r from-gold to-gold/80 text-bg-main font-medium hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 disabled:opacity-50"
                  size="lg"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  {!authenticated || !getUserSessionCookies()?.walletAddress 
                    ? 'Connect Wallet to Mint' 
                    : 'Mint Now'}
                </Button>
                {(!authenticated || !getUserSessionCookies()?.walletAddress) && (
                  <p className="text-sm text-muted text-center mt-2">
                    Please connect your wallet to Camp Network before minting
                  </p>
                )}
              </>
            )}
            
            <p className="text-center text-muted text-sm">
              This will create an NFT which will be saved in your account.
            </p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
