'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAuthState, useAuth } from '@campnetwork/origin/react';
import { Sparkles, Shield, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { CONTRACT_CONFIG } from '@/lib/contract-abi';
import { SupabaseStorage } from '@/lib/supabase-storage';

interface MintBothNFTAndIPProps {
  imageFile: File;
  itemData: {
    title: string;
    brand: string;
    category: string;
    serialNumber: string;
    est_value?: number;
  };
  onSuccess?: (result: { 
    nft: { tokenId: string; metadataUrl: string; transactionHash: string } | null;
    ip: { ipId: string; transactionHash?: string } | null;
  }) => void;
  onError?: (error: string) => void;
}

type MintingStep = 'idle' | 'uploading' | 'minting-nft' | 'registering-ip' | 'completed';

export function MintBothNFTAndIP({ imageFile, itemData, onSuccess, onError }: MintBothNFTAndIPProps) {
  const [currentStep, setCurrentStep] = useState<MintingStep>('idle');
  const [nftResult, setNftResult] = useState<{ tokenId: string; metadataUrl: string; transactionHash: string } | null>(null);
  const [ipResult, setIpResult] = useState<{ ipId: string; transactionHash?: string } | null>(null);
  const [uploadResult, setUploadResult] = useState<{ imageUrl: string; metadataUrl: string; success: boolean } | null>(null);
  
  // IP metadata state
  const [ipName, setIpName] = useState(itemData.title || '');
  const [ipDescription, setIpDescription] = useState(
    `Ownership certificate for ${itemData.title} by ${itemData.brand}. Serial: ${itemData.serialNumber}`
  );
  
  // Wagmi hooks for NFT minting
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  
  // Origin SDK hooks for IP registration
  const { authenticated } = useAuthState();
  const auth = useAuth();

  const handleMintBoth = async () => {
    if (!isConnected || !address) {
      onError?.('Please connect your wallet first');
      return;
    }

    if (!authenticated || !auth?.origin) {
      onError?.('Please connect with Origin SDK first');
      return;
    }

    if (!imageFile || !itemData.title || !ipName || !ipDescription) {
      onError?.('Missing required data for minting');
      return;
    }

    try {
      // Step 1: Upload to Supabase
      setCurrentStep('uploading');
      console.log('📦 Uploading to Supabase...');
      
      const uploadRes = await SupabaseStorage.uploadComplete(
        imageFile,
        itemData,
        address
      );
      
      if (!uploadRes.success) {
        throw new Error(`Upload failed: ${uploadRes.error}`);
      }
      
      console.log('✅ Supabase upload successful:', uploadRes.metadataUrl);
      setUploadResult(uploadRes);
      
      // Step 2: Mint NFT on BaseCamp
      setCurrentStep('minting-nft');
      console.log('🏛️ Minting NFT on BaseCamp...');
      
      writeContract({
        ...CONTRACT_CONFIG,
        functionName: 'mintTo',
        args: [address as `0x${string}`, uploadRes.metadataUrl],
      });
      
      // NFT transaction will be handled by useEffect hooks
      // After NFT is successful, we'll proceed to IP registration
      
    } catch (error) {
      console.error('❌ Combined minting failed:', error);
      setCurrentStep('idle');
      onError?.(error instanceof Error ? error.message : 'Minting failed');
    }
  };

  // Handle NFT transaction success
  React.useEffect(() => {
    const registerIP = async () => {
      if (!authenticated || !auth?.origin) {
        onError?.('Origin SDK not available for IP registration');
        return;
      }

      try {
        setCurrentStep('registering-ip');
        console.log('🏛️ Registering IP via Origin SDK...');
        
        if (imageFile.size > 10 * 1024 * 1024) {
          throw new Error('File size must be less than 10MB for Origin SDK');
        }

        const ipMetadata = {
          name: ipName,
          description: ipDescription,
          url: ''
        };

        const licenseTerms = {
          price: BigInt(0),
          duration: 30 * 24 * 60 * 60,
          royaltyBps: 0,
          paymentToken: '0x0000000000000000000000000000000000000000' as `0x${string}`
        };

        let result;
        if (auth.origin?.mintFile) {
          result = await auth.origin.mintFile(imageFile, ipMetadata, licenseTerms);
        } else {
          throw new Error('Origin SDK client not found');
        }
        
        console.log('✅ IP registration successful:', result);
        
        interface IPResult {
          id?: string;
          transactionHash?: string;
        }
        
        const ipRes = {
          ipId: (result && typeof result === 'object' && 'id' in result ? (result as IPResult).id : null) || `ip_${Date.now()}`,
          transactionHash: result && typeof result === 'object' && 'transactionHash' in result ? (result as IPResult).transactionHash : undefined
        };
        setIpResult(ipRes);
        
        setCurrentStep('completed');
        onSuccess?.({
          nft: nftResult,
          ip: ipRes
        });
        
      } catch (error) {
        console.error('❌ IP registration failed:', error);
        setCurrentStep('idle');
        onError?.(error instanceof Error ? error.message : 'IP registration failed');
      }
    };

    if (isConfirmed && hash && uploadResult && currentStep === 'minting-nft') {
      console.log('✅ NFT minting confirmed:', hash);
      setNftResult({
        tokenId: 'pending',
        metadataUrl: uploadResult.metadataUrl,
        transactionHash: hash
      });
      
      registerIP();
    }
  }, [isConfirmed, hash, uploadResult, currentStep, authenticated, auth, imageFile, ipName, ipDescription, onError, onSuccess, nftResult]);

  // Handle NFT transaction errors
  React.useEffect(() => {
    if (writeError && currentStep === 'minting-nft') {
      console.error('❌ NFT minting failed:', writeError);
      setCurrentStep('idle');
      onError?.(writeError.message);
    }
  }, [writeError, currentStep, onError]);


  const isProcessing = currentStep !== 'idle' && currentStep !== 'completed';
  const canStart = isConnected && authenticated && ipName && ipDescription;

  const getStepStatus = (step: string) => {
    if (currentStep === 'completed') return 'completed';
    if (currentStep === step) return 'active';
    if (['uploading', 'minting-nft', 'registering-ip'].indexOf(currentStep) > ['uploading', 'minting-nft', 'registering-ip'].indexOf(step)) return 'completed';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-surface/30 border border-main/20 rounded-lg">
        <h3 className="text-lg font-medium text-main mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <Shield className="w-5 h-5 text-gold" />
          Combined NFT + IP Registration
        </h3>
        <p className="text-muted text-sm mb-4">
          This will create both an NFT on BaseCamp network AND register your IP with Origin SDK for complete protection.
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="font-medium text-main">NFT (Tutorial 1)</div>
            <div className="text-muted">BaseCamp Network</div>
            <div className="text-muted">Supabase Storage</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-main">IP (Tutorial 2)</div>
            <div className="text-muted">Origin SDK</div>
            <div className="text-muted">On-chain Rights</div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {getStepStatus('uploading') === 'completed' ? (
            <CheckCircle2 className="w-5 h-5 text-green" />
          ) : getStepStatus('uploading') === 'active' ? (
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-muted" />
          )}
          <span className={`text-sm ${getStepStatus('uploading') === 'completed' ? 'text-green' : getStepStatus('uploading') === 'active' ? 'text-gold' : 'text-muted'}`}>
            Upload to Supabase
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {getStepStatus('minting-nft') === 'completed' ? (
            <CheckCircle2 className="w-5 h-5 text-green" />
          ) : getStepStatus('minting-nft') === 'active' ? (
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-muted" />
          )}
          <span className={`text-sm ${getStepStatus('minting-nft') === 'completed' ? 'text-green' : getStepStatus('minting-nft') === 'active' ? 'text-gold' : 'text-muted'}`}>
            Mint NFT on BaseCamp
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {getStepStatus('registering-ip') === 'completed' ? (
            <CheckCircle2 className="w-5 h-5 text-green" />
          ) : getStepStatus('registering-ip') === 'active' ? (
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-muted" />
          )}
          <span className={`text-sm ${getStepStatus('registering-ip') === 'completed' ? 'text-green' : getStepStatus('registering-ip') === 'active' ? 'text-gold' : 'text-muted'}`}>
            Register IP with Origin SDK
          </span>
        </div>
      </div>

      {/* IP Metadata Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-main font-medium mb-2">
            IP Name *
          </label>
          <input
            type="text"
            value={ipName}
            onChange={(e) => setIpName(e.target.value)}
            disabled={isProcessing}
            className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all disabled:opacity-50"
            placeholder="e.g., iPhone 14 Pro Ownership Certificate"
            required
          />
        </div>

        <div>
          <label className="block text-main font-medium mb-2">
            IP Description *
          </label>
          <textarea
            value={ipDescription}
            onChange={(e) => setIpDescription(e.target.value)}
            disabled={isProcessing}
            rows={3}
            className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all resize-none disabled:opacity-50"
            placeholder="Detailed description of your intellectual property..."
            required
          />
        </div>
      </div>

      {/* Connection Warnings */}
      {(!isConnected || !authenticated) && (
        <div className="space-y-2">
          {!isConnected && (
            <div className="flex items-center gap-2 p-3 bg-red/10 border border-red/20 rounded-lg text-red text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Please connect your wallet for NFT minting</span>
            </div>
          )}
          {!authenticated && (
            <div className="flex items-center gap-2 p-3 bg-red/10 border border-red/20 rounded-lg text-red text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Please connect with Origin SDK for IP registration</span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleMintBoth}
        disabled={!canStart || isProcessing}
        className="w-full btn-primary py-4 text-lg font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-5 h-5" />
          <Shield className="w-5 h-5" />
          {currentStep === 'uploading' ? 'Uploading to Supabase...' :
           currentStep === 'minting-nft' || isPending || isConfirming ? 'Minting NFT...' :
           currentStep === 'registering-ip' ? 'Registering IP...' :
           currentStep === 'completed' ? 'Both Created Successfully!' :
           'Create Both NFT + IP'}
        </div>
        
        {/* Button glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Transaction Hash Display */}
      {hash && (
        <div className="p-3 bg-green/10 border border-green/20 rounded-lg text-green text-sm">
          <div className="font-medium">NFT Transaction Submitted</div>
          <div className="font-mono text-xs mt-1 break-all">{hash}</div>
        </div>
      )}

      {/* Success Summary */}
      {currentStep === 'completed' && (
        <div className="p-4 bg-green/10 border border-green/20 rounded-lg">
          <div className="font-medium text-green mb-2">🎉 Both NFT and IP Created Successfully!</div>
          <div className="space-y-1 text-sm text-green">
            {nftResult && <div>✅ NFT minted on BaseCamp</div>}
            {ipResult && <div>✅ IP registered with Origin SDK</div>}
          </div>
        </div>
      )}
    </div>
  );
}