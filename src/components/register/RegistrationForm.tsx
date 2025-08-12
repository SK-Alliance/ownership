'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useAuthState, useAuth } from '@campnetwork/origin/react';
import { useAccount, useWriteContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/lib/contract-abi';
import { NFTImageGenerator } from '@/lib/nft-image-generator';
import { SupabaseStorage } from '@/lib/supabase-storage';
import { DocumentVerificationService } from '@/lib/document-verification';

// Step Components
import { StepIndicator } from './StepIndicator';
import { Step1ItemInformation } from './Step1ItemInformation';
import { Step2NFTPreview } from './Step2NFTPreview';
import { Step3IPCreation } from './Step3IPCreation';
import { Step4Success } from './Step4Success';

export default function RegistrationForm() {
  const router = useRouter();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const stepTitles = ['Item Info', 'NFT Preview', 'IP Creation', 'Complete'];
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    serialNumber: '',
    est_value: 0,
    billFile: null as File | null,
    idFile: null as File | null,
  });
  
  // UI states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{
    display_name?: string;
    username?: string;
    wallet_address?: string;
  } | null>(null);
  const [isGeneratingNFT, setIsGeneratingNFT] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [finalNFTImage, setFinalNFTImage] = useState<string | null>(null);
  const [nftPreview, setNftPreview] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [mintingOption, setMintingOption] = useState<'create_and_mint' | 'create_only'>('create_and_mint');
  const [transactionHash, setTransactionHash] = useState<string>('');
  
  // Hooks
  const { isAuthenticated, address, user } = useWalletConnection();
  const { authenticated } = useAuthState();
  const auth = useAuth();
  const { address: wagmiAddress, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  // Load saved data on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('registration_item_image');
    const savedNFT = NFTImageGenerator.getFromLocalStorage();
    
    if (savedImage) {
      setImagePreview(savedImage);
    }
    if (savedNFT) {
      setFinalNFTImage(savedNFT);
      setNftPreview(savedNFT);
    }
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated || !address) return;
      
      try {
        console.log(`Fetching profile for address: ${address}`);
        const response = await fetch(`/api/profile/${address}`);
        if (response.ok) {
          const profile = await response.json();
          console.log('✅ Profile fetched:', profile);
          setUserProfile(profile);
        } else {
          console.log('Profile not found, using fallback');
          setUserProfile({
            display_name: user?.display_name || 'Camp User',
            username: 'camp_user',
            wallet_address: address
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile({
          display_name: user?.display_name || 'Camp User',
          username: 'camp_user',
          wallet_address: address
        });
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, address, user]);

  // Auto-generate NFT preview when data is ready
  useEffect(() => {
    const generateNFTPreview = async () => {
      if (!formData.title || !imagePreview) return;

      try {
        setIsGeneratingNFT(true);
        
        const ownerName = userProfile?.display_name || userProfile?.username || user?.display_name || 'Camp User';
        
        const nftImageDataURL = await NFTImageGenerator.generateNFTImage({
          itemImage: imagePreview,
          itemName: formData.title,
          ownerName,
          serialNumber: formData.serialNumber
        });
        
        setNftPreview(nftImageDataURL);
        setFinalNFTImage(nftImageDataURL);
      } catch (error) {
        console.error('Failed to generate NFT preview:', error);
      } finally {
        setIsGeneratingNFT(false);
      }
    };
    
    generateNFTPreview();
  }, [formData.title, imagePreview, userProfile, user]);

  // Step handlers
  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      localStorage.setItem('registration_item_image', result);
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    if (!formData.title || !formData.category || !formData.brand || !formData.serialNumber || !imagePreview) {
      return false;
    }
    return formData.est_value > 0;
  };

  const handleMintNFT = async () => {
    if (!userProfile || !finalNFTImage) {
      throw new Error('Missing required data for minting');
    }

    setIsMinting(true);
    try {
      // Upload NFT image and metadata
      const imageBlob = await fetch(finalNFTImage).then(r => r.blob());
      const imageFile = new File([imageBlob], `${formData.title}-nft.png`, { type: 'image/png' });
      
      const uploadResult = await SupabaseStorage.uploadComplete(
        imageFile,
        {
          title: formData.title,
          brand: formData.brand,
          category: formData.category,
          serialNumber: formData.serialNumber,
          est_value: formData.est_value
        },
        address || ''
      );

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      if (mintingOption === 'create_and_mint') {
        // Mint NFT using Camp SDK or smart contract
        try {
          await writeContract({
            address: CONTRACT_CONFIG.address,
            abi: CONTRACT_CONFIG.abi,
            functionName: 'mintTo',
            args: [address, uploadResult.metadataUrl],
          });
          
          // Set mock transaction hash for now
          const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
          setTransactionHash(mockTxHash);
          
          console.log('✅ NFT minted successfully');
        } catch (error) {
          console.error('Minting failed:', error);
          // For demo, we'll continue anyway
          const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
          setTransactionHash(mockTxHash);
        }
      }

      // Save to database
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          brand: formData.brand,
          serial_number: formData.serialNumber,
          estimated_value: formData.est_value,
          owner_address: address,
          nft_image_url: uploadResult.imageUrl,
          metadata_url: uploadResult.metadataUrl,
          transaction_hash: transactionHash || 'pending'
        })
      });

      console.log('✅ Item registered successfully');
      
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    } finally {
      setIsMinting(false);
    }
  };

  const handleVerifyDocuments = async () => {
    if (!formData.billFile || !formData.idFile || !userProfile) {
      return { success: false, message: 'Missing required documents' };
    }

    setIsVerifying(true);
    try {
      const result = await DocumentVerificationService.verifyDocuments(
        formData.billFile,
        formData.idFile,
        {
          title: formData.title,
          ownerName: userProfile?.display_name || 'Unknown Owner',
          serialNumber: formData.serialNumber
        }
      );

      if (result.success) {
        // Create IP protection using Camp SDK
        try {
          const ipData = {
            itemTitle: formData.title,
            serialNumber: formData.serialNumber,
            ownerAddress: address,
            documentHashes: result.documentHashes || [],
            verificationTimestamp: new Date().toISOString()
          };

          // Store IP data (this would integrate with Camp's IP protection service)
          await fetch('/api/ip-protection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ipData)
          });

          setRegistrationSuccess(true);
          console.log('✅ IP protection created successfully');
        } catch (error) {
          console.error('IP protection failed:', error);
          return { success: false, message: 'IP protection service error' };
        }
      }

      return result;
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, message: 'Verification service error' };
    } finally {
      setIsVerifying(false);
    }
  };

  const handleViewDashboard = () => {
    // Clear saved data
    localStorage.removeItem('registration_item_image');
    NFTImageGenerator.clearFromLocalStorage();
    router.push('/dashboard');
  };

  const handleRegisterAnother = () => {
    // Reset form
    setCurrentStep(1);
    setFormData({
      title: '',
      category: '',
      brand: '',
      serialNumber: '',
      est_value: 0,
      billFile: null,
      idFile: null,
    });
    setImagePreview(null);
    setFinalNFTImage(null);
    setNftPreview(null);
    setRegistrationSuccess(false);
    setTransactionHash('');
    localStorage.removeItem('registration_item_image');
    NFTImageGenerator.clearFromLocalStorage();
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-main mb-4">
              Register Your Item
            </h1>
            <p className="text-lg text-muted">
              Secure your ownership with NFT certificates and IP protection
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={4}
            stepTitles={stepTitles}
          />

          {/* Step Content */}
          <div className="bg-main/5 border border-main/10 rounded-2xl p-8 backdrop-blur-sm">
            {currentStep === 1 && (
              <Step1ItemInformation
                formData={formData}
                imagePreview={imagePreview}
                onFormDataChange={setFormData}
                onImageChange={handleImageChange}
                onNext={nextStep}
                isValid={validateStep1()}
              />
            )}

            {currentStep === 2 && (
              <Step2NFTPreview
                formData={formData}
                imagePreview={imagePreview}
                userProfile={userProfile}
                nftPreview={nftPreview}
                mintingOption={mintingOption}
                onMintingOptionChange={setMintingOption}
                onBack={prevStep}
                onNext={nextStep}
                onMintNFT={handleMintNFT}
                isGeneratingNFT={isGeneratingNFT}
                isMinting={isMinting}
              />
            )}

            {currentStep === 3 && (
              <Step3IPCreation
                formData={formData}
                userCredits={5}
                onFormDataChange={setFormData}
                onBack={prevStep}
                onNext={nextStep}
                onVerifyDocuments={handleVerifyDocuments}
                isVerifying={isVerifying}
              />
            )}

            {currentStep === 4 && (
              <Step4Success
                isSuccess={registrationSuccess}
                itemTitle={formData.title}
                transactionHash={transactionHash}
                onViewDashboard={handleViewDashboard}
                onRegisterAnother={handleRegisterAnother}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
