'use client';

import React, { useState } from 'react';
import { useAuthState, useAuth } from '@campnetwork/origin/react';
import { Shield, AlertCircle, FileText } from 'lucide-react';

interface RegisterIPOnlyProps {
  imageFile: File;
  itemData: {
    title: string;
    brand: string;
    category: string;
    serialNumber: string;
    est_value?: number;
  };
  onSuccess?: (result: { ipId: string; transactionHash?: string }) => void;
  onError?: (error: string) => void;
}

export function RegisterIPOnly({ imageFile, itemData, onSuccess, onError }: RegisterIPOnlyProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [ipName, setIpName] = useState(itemData.title || '');
  const [ipDescription, setIpDescription] = useState(
    `Ownership certificate for ${itemData.title} by ${itemData.brand}. Serial: ${itemData.serialNumber}`
  );
  
  const { authenticated } = useAuthState();
  const auth = useAuth();

  const handleRegisterIP = async () => {
    if (!authenticated || !auth?.origin) {
      onError?.('Please connect with Origin SDK first');
      return;
    }

    if (!imageFile || !ipName || !ipDescription) {
      onError?.('Missing required data for IP registration');
      return;
    }

    try {
      setIsRegistering(true);
      
      console.log('🏛️ Registering IP via Origin SDK...');
      
      // Check file size (Origin SDK limit: 10MB)
      if (imageFile.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB for Origin SDK');
      }

      // Prepare metadata for IP registration
      const ipMetadata = {
        name: ipName,
        description: ipDescription,
        url: '' // Will be set by Origin SDK after file upload
      };

      // Define license terms (customizable)
      const licenseTerms = {
        price: BigInt(0), // Free for now
        duration: 30 * 24 * 60 * 60, // 30 days in seconds
        royaltyBps: 0, // No royalties (basis points)
        paymentToken: '0x0000000000000000000000000000000000000000' as `0x${string}` // Zero address for native token
      };

      // Register IP using Origin SDK
      let result;
      if (auth.origin?.mintFile) {
        result = await auth.origin.mintFile(imageFile, ipMetadata, licenseTerms);
      } else {
        throw new Error('Origin SDK client not found. Available methods: ' + Object.keys(auth).join(', '));
      }
      
      console.log('✅ IP registration successful:', result);
      
      interface IPResult {
        id?: string;
        transactionHash?: string;
      }
      
      onSuccess?.({
        ipId: (result && typeof result === 'object' && 'id' in result ? (result as IPResult).id : null) || `ip_${Date.now()}`,
        transactionHash: result && typeof result === 'object' && 'transactionHash' in result ? (result as IPResult).transactionHash : undefined
      });
      
    } catch (error) {
      console.error('❌ IP registration failed:', error);
      onError?.(error instanceof Error ? error.message : 'IP registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-surface/30 border border-main/20 rounded-lg">
        <h3 className="text-lg font-medium text-main mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-gold" />
          IP Registration (Tutorial 2 Approach)
        </h3>
        <p className="text-muted text-sm mb-4">
          This will register your intellectual property using the Origin SDK with on-chain protection.
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Network:</span>
            <span className="text-main">Camp Origin SDK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Protection:</span>
            <span className="text-main">On-chain IP Rights</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Duration:</span>
            <span className="text-main">30 days</span>
          </div>
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
            className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all"
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
            rows={3}
            className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all resize-none"
            placeholder="Detailed description of your intellectual property..."
            required
          />
        </div>
      </div>

      {!authenticated && (
        <div className="flex items-center gap-2 p-3 bg-red/10 border border-red/20 rounded-lg text-red text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Please connect with Origin SDK to register IP</span>
        </div>
      )}

      <button
        onClick={handleRegisterIP}
        disabled={!authenticated || isRegistering || !ipName || !ipDescription}
        className="w-full btn-primary py-3 text-lg font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-3">
          <FileText className="w-5 h-5" />
          {isRegistering ? 'Registering IP...' : 'Register IP with Origin SDK'}
        </div>
        
        {/* Button glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* License Terms Info */}
      <div className="p-3 bg-blue/10 border border-blue/20 rounded-lg text-blue text-sm">
        <div className="font-medium mb-1">Current License Terms:</div>
        <ul className="text-xs space-y-1">
          <li>• Free registration (no cost)</li>
          <li>• 30-day protection period</li>
          <li>• 0% royalties</li>
          <li>• Native token payments</li>
        </ul>
      </div>
    </div>
  );
}