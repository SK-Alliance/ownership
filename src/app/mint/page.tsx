'use client';

import React, { useState } from 'react';
import { useAuth, useAuthState } from '@campnetwork/origin/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MintForm, NFTPreviewModal, ExtraInfo, MintFormData } from '@/components/mint';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { getUserSessionCookies } from '@/lib/auth-cookies';

export default function MintPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<MintFormData | null>(null);

  // Hooks
  const { authenticated, loading } = useAuthState();
  const auth = useAuth();

  // Function to safely get user details from session cookies
  const getUserFromCookies = () => {
    try {
      return getUserSessionCookies();
    } catch (error) {
      console.warn('Error reading user cookies:', error);
      return { username: '', fullName: '', email: '', walletAddress: '' };
    }
  };

  // Determine user profile for NFT preview  
  const getUserDisplayName = () => {
    // Try to get from cookies first
    const { username, fullName } = getUserFromCookies();

    if (fullName.trim()) {
      return fullName.trim();
    }

    if (username.trim()) {
      return username.trim();
    }

    // Fallback to auth object (safe access)
    try {
      if (auth && typeof auth === 'object') {
        const authObj = auth as unknown as Record<string, unknown>;
        const user = authObj?.user as Record<string, unknown>;
        if (user?.displayName && typeof user.displayName === 'string') {
          return user.displayName;
        }
        if (user?.username && typeof user.username === 'string') {
          return user.username;
        }
      }
    } catch (error) {
      console.warn('Error accessing auth user data:', error);
    }

    return authenticated ? 'Camp User' : 'Unknown Owner';
  };

  // Check if user is connected to Camp Network
  const isConnected = authenticated;

  const handlePreview = (formData: MintFormData) => {
    setCurrentFormData(formData);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-bg-main py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-main mb-2">
              Quick Mint (NFT)
            </h1>
            <p className="text-lg text-muted">
              Mint your work or belongings as digital collectibles and make it part of your onchain story! </p>
            <p className='text-sm text-muted'> No verification needed.
            </p>
          </div>


          {/* Connection Status */}
          <div className="mb-8">
            {!isConnected && (
              <Alert className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please connect your wallet to start minting NFTs.
                </AlertDescription>
              </Alert>
            )}

            {isConnected && !authenticated && !loading && (
              <Alert className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please connect to Camp Network to access Origin Protocol features.
                </AlertDescription>
              </Alert>
            )}

            {isConnected && authenticated && (
              <Alert className="max-w-2xl mx-auto bg-green/10 border-green/20 text-green">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  ✓ Connected to Camp Network and ready to mint!
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Main Form */}
          <MintForm
            onSubmit={handlePreview}
            onPreview={handlePreview}
          />

          {currentFormData && (
            <NFTPreviewModal
              isOpen={showPreview}
              onClose={() => setShowPreview(false)}
              previewData={{
                itemImage: URL.createObjectURL(currentFormData.image!),
                itemName: currentFormData.itemName,
                ownerName: getUserDisplayName(),
                model: currentFormData.model,
                manufacturer: currentFormData.manufacturer,
                category: currentFormData.category,
                estimatedValue: currentFormData.estimatedValue,
                description: currentFormData.description,
              }}
              formData={currentFormData}
            />
          )}

          <ExtraInfo />
        </div>
      </div>
    </div>
  );
}