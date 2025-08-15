'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth, useAuthState } from '@campnetwork/origin/react';
import { toast } from 'sonner';
import { uploadFileToIPFS } from '@/lib/utils/upload';
import { Loader2, Shield } from 'lucide-react';

interface MintButtonProps {
  image: File | null;
  ipName: string;
  ipDescription: string;
}

interface LicenseTerms {
  price: number;
  duration: number; // in seconds
  royaltyBps: number;
  paymentToken: string;
}

interface OriginSDK {
  registerIP?: (params: { metadata: unknown; license: unknown }) => Promise<unknown>;
  createIP?: (params: { metadata: unknown; license: unknown }) => Promise<unknown>;
  mintFile?: (file: File, metadata: unknown, license: unknown) => Promise<unknown>;
}

interface AuthWithOrigin {
  origin?: OriginSDK;
}

export const MintButton: React.FC<MintButtonProps> = ({
  image,
  ipName,
  ipDescription
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const auth = useAuth();
  const { authenticated } = useAuthState();

  // Define license terms - can be customized
  const licenseTerms: LicenseTerms = {
    price: 0, // Free
    duration: 30 * 24 * 60 * 60, // 30 days in seconds
    royaltyBps: 0, // 0% royalty
    paymentToken: '0x0000000000000000000000000000000000000000' // ETH/native token
  };

  const handleRegisterIP = async () => {
    // Check if user is connected
    if (!authenticated) {
      toast.error('Please connect to Camp Network first');
      return;
    }

    // Check if origin is instantiated
    if (!auth || typeof auth !== 'object' || !('origin' in auth) || !(auth as AuthWithOrigin).origin) {
      toast.error('Origin SDK not initialized. Please try connecting again.');
      return;
    }

    // Check required fields
    if (!image) {
      toast.error('Please select an image to register');
      return;
    }

    if (!ipName || !ipDescription) {
      toast.error('Please provide IP name and description');
      return;
    }

    setIsRegistering(true);
    
    try {
      console.log('Starting IP registration process...');
      
      // Upload image to IPFS to get URL
      const uploadResult = await uploadFileToIPFS(image);
      
      if (!uploadResult.success || !uploadResult.ipfsUrl) {
        throw new Error(uploadResult.error || 'Failed to upload image to IPFS');
      }

      console.log('Image uploaded to IPFS:', uploadResult.ipfsUrl);

      // Convert image to file object if needed
      const imageBlob = await fetch(URL.createObjectURL(image)).then(r => r.blob());
      const imageFile = new File([imageBlob], image.name, { type: image.type });

      // Check file size (max 10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > maxSizeInBytes) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Define license terms
      const license = {
        price: licenseTerms.price,
        duration: licenseTerms.duration,
        royaltyBps: licenseTerms.royaltyBps,
        paymentToken: licenseTerms.paymentToken
      };

      // Define metadata for IP-NFT
      const metadata = {
        name: ipName,
        description: ipDescription,
        image: uploadResult.ipfsUrl, // Use the IPFS URL
        attributes: [
          {
            trait_type: "Creation Date",
            value: new Date().toISOString().split('T')[0]
          },
          {
            trait_type: "File Type",
            value: imageFile.type
          },
          {
            trait_type: "IP Type",
            value: "Digital Asset"
          }
        ]
      };

      console.log('Registering IP-NFT with Origin SDK...', {
        metadata,
        license
      });

      // Register IP using Origin SDK - try different function names
      const authWithOrigin = auth as AuthWithOrigin;
      console.log('Available Origin functions:', Object.keys(authWithOrigin.origin || {}));
      
      let result;
      if (authWithOrigin.origin?.registerIP) {
        result = await authWithOrigin.origin.registerIP({
          metadata: metadata,
          license: license
        });
      } else if (authWithOrigin.origin?.createIP) {
        result = await authWithOrigin.origin.createIP({
          metadata: metadata,
          license: license
        });
      } else if (authWithOrigin.origin?.mintFile) {
        // Fallback to original mintFile approach
        result = await authWithOrigin.origin.mintFile(imageFile, metadata, license);
      } else {
        throw new Error('No IP registration function found in Origin SDK');
      }
      
      console.log('✅ IP registration successful:', result);
      
      setRegistrationSuccess(true);
      toast.success('IP registration successful! Your NFT is now live.');
      
    } catch (error: unknown) {
      console.error('❌ IP registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register IP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="text-center space-y-4 p-6 bg-green/5 border border-green/20 rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green/20">
          <Shield className="w-8 h-8 text-green" />
        </div>
        <h3 className="text-lg font-semibold text-main">IP Registration Successful!</h3>
        <p className="text-muted">
          Your NFT is now live and registered as intellectual property on the Camp Network.
        </p>
        <p className="text-sm text-muted">
          You can view your registration history in your Camp Network profile.
        </p>
      </div>
    );
  }

  return (
    <Button
      onClick={handleRegisterIP}
      disabled={!image || !ipName || !ipDescription || isRegistering || !authenticated}
      className="w-full px-8 py-3 bg-gradient-to-r from-green to-green/80 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green/25 transition-all duration-200 disabled:opacity-50"
    >
      {isRegistering ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Registering IP...
        </>
      ) : (
        <>
          <Shield className="w-4 h-4 mr-2" />
          Register IP with Origin SDK
        </>
      )}
    </Button>
  );
};