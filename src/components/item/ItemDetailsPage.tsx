'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import ItemMetadata from '@/components/item/ItemMetadata';
import CoOwnerManager from '@/components/item/CoOwnerManager';
import VerificationTimeline from '@/components/item/VerificationTimeline';
import { ItemDetails, GetItemDetailsResponse, AddCoOwnerRequest, DownloadPPDResponse } from '@/types/item';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ItemDetailsPage({ itemId }: { itemId: string }) {
  const router = useRouter();

  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // Mock current user wallet (replace with actual auth)
  const currentUserWallet = "0x742d35Cc6634C0532925a3b8D40645857f15739e";

  const fetchItemDetails = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await mockFetchItemDetails(itemId);
      
      if (response.success && response.data) {
        setItem(response.data);
        setIsOwner(response.data.creatorWallet.toLowerCase() === currentUserWallet.toLowerCase());
      } else {
        setError(response.error || 'Failed to fetch item details');
      }
    } catch (err) {
      setError('Failed to load item details');
      console.error('Error fetching item:', err);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetchItemDetails();
  }, [fetchItemDetails]);

  const handleDownloadPPD = async (itemId: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await mockDownloadPPD(itemId);
      
      if (response.success && response.downloadUrl) {
        // Create download link
        const link = document.createElement('a');
        link.href = response.downloadUrl;
        link.download = `ppd-${itemId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(response.error || 'Failed to download PPD');
      }
    } catch (err) {
      console.error('Error downloading PPD:', err);
      alert('Failed to download PPD');
    }
  };

  const handleAddCoOwner = async (itemId: string, walletAddress: string, permissions: string[]) => {
    try {
      // TODO: Replace with actual API call
      const request: AddCoOwnerRequest = { itemId, walletAddress, permissions };
      const response = await mockAddCoOwner(request);
      
      if (response.success && response.data) {
        // Update local state
        setItem(prev => prev ? {
          ...prev,
          coOwners: [...prev.coOwners, response.data!],
          verificationHistory: [
            ...prev.verificationHistory,
            {
              id: `event-${Date.now()}`,
              type: 'co_owner_added',
              date: new Date().toISOString(),
              description: `Co-owner ${walletAddress} was added`,
              actor: currentUserWallet,
              details: { permissions }
            }
          ]
        } : null);
      } else {
        alert('Failed to add co-owner');
      }
    } catch (err) {
      console.error('Error adding co-owner:', err);
      alert('Failed to add co-owner');
    }
  };

  const handleRemoveCoOwner = async (itemId: string, walletAddress: string) => {
    try {
      // TODO: Replace with actual API call
      await mockRemoveCoOwner(itemId, walletAddress);
      
      // Update local state
      setItem(prev => prev ? {
        ...prev,
        coOwners: prev.coOwners.filter(co => co.walletAddress !== walletAddress),
        verificationHistory: [
          ...prev.verificationHistory,
          {
            id: `event-${Date.now()}`,
            type: 'co_owner_removed',
            date: new Date().toISOString(),
            description: `Co-owner ${walletAddress} was removed`,
            actor: currentUserWallet,
            details: {}
          }
        ]
      } : null);
    } catch (err) {
      console.error('Error removing co-owner:', err);
      alert('Failed to remove co-owner');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-semibold text-main mb-2">Item Not Found</h1>
          <p className="text-muted mb-6">
            {error || 'The item you are looking for does not exist or has been removed.'}
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-gold hover:bg-gold/90 text-bg-main"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="mb-6 bg-main/5 border-main/20 text-main hover:bg-main/10 hover:border-gold/30 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Item Metadata */}
            <ItemMetadata 
              item={item} 
              onDownloadPPD={handleDownloadPPD}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Co-owner Manager */}
              <CoOwnerManager
                coOwners={item.coOwners}
                itemId={item.id}
                onAddCoOwner={handleAddCoOwner}
                onRemoveCoOwner={handleRemoveCoOwner}
                isOwner={isOwner}
              />

              {/* Verification Timeline */}
              <VerificationTimeline 
                events={item.verificationHistory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock API functions (replace with actual API calls)
async function mockFetchItemDetails(itemId: string): Promise<GetItemDetailsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data structure - replace with actual API call
  const mockItem: ItemDetails = {
    id: itemId,
    name: '', // Will be populated by actual API
    description: '',
    category: '',
    status: 'registered',
    creatorWallet: '',
    originHash: '',
    registrationDate: '',
    coOwners: [],
    metadata: {
      additionalData: {}
    },
    verificationHistory: []
  };

  return {
    success: true,
    data: mockItem
  };
}

async function mockDownloadPPD(itemId: string): Promise<DownloadPPDResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    downloadUrl: `/api/items/${itemId}/ppd` // Replace with actual download endpoint
  };
}

async function mockAddCoOwner(request: AddCoOwnerRequest) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    data: {
      walletAddress: request.walletAddress,
      addedDate: new Date().toISOString(),
      permissions: request.permissions
    }
  };
}

async function mockRemoveCoOwner(_itemId: string, _walletAddress: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}
