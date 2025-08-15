'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Calendar, 
  Wallet, 
  Hash, 
  DollarSign, 
  Tag,
  User,
  Copy,
  CheckCircle,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useState } from 'react';
import type { MintedNFT } from '@/hooks/useMintedNFTs';

interface NFTDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: MintedNFT;
}

export function NFTDetailsModal({ isOpen, onClose, nft }: NFTDetailsModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const truncateAddress = (address: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getLicenseText = () => {
    const licenses = [];
    if (nft.commercialUse) licenses.push('Commercial Use');
    if (nft.derivatives) licenses.push('Derivatives');
    if (nft.attribution) licenses.push('Attribution Required');
    return licenses.length > 0 ? licenses.join(', ') : 'Standard License';
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl m-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">NFT Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 border-2 border-yellow-400">
              {nft.imageUrl || nft.ipfsImageUrl ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    </div>
                  )}
                  <img
                    src={nft.ipfsImageUrl || nft.imageUrl || '/placeholder-nft.jpg'}
                    alt={nft.itemName}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-nft.jpg';
                      setImageLoaded(true);
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                  <div className="text-center">
                    <Tag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg text-gray-500">No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-3">
              {nft.ipfsMetadataUrl && (
                <Button
                  variant="outline"
                  className="flex-1 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => window.open(nft.ipfsMetadataUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Metadata
                </Button>
              )}
              {nft.transactionHash && (
                <Button
                  variant="outline"
                  className="flex-1 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => window.open(`https://explorer.camp-network.com/tx/${nft.transactionHash}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Explorer
                </Button>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{nft.itemName}</h3>
              {nft.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {nft.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                  {nft.category}
                </Badge>
                {nft.manufacturer && (
                  <Badge variant="outline">
                    {nft.manufacturer}
                  </Badge>
                )}
                {nft.model && (
                  <Badge variant="outline">
                    Model: {nft.model}
                  </Badge>
                )}
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Estimated Value</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatValue(nft.estimatedValue)}
                </span>
              </div>
            </div>

            {/* Blockchain Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Blockchain Details</h4>
              
              {/* Token ID */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Token ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-800">
                    {nft.tokenId ? truncateAddress(nft.tokenId) : 'Pending...'}
                  </span>
                  {nft.tokenId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard(nft.tokenId!, 'tokenId')}
                    >
                      {copiedField === 'tokenId' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Contract Address */}
              {nft.contractAddress && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Contract</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-800">
                      {truncateAddress(nft.contractAddress)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard(nft.contractAddress!, 'contract')}
                    >
                      {copiedField === 'contract' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Network */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Network</span>
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  {nft.blockchainNetwork}
                </Badge>
              </div>
            </div>

            {/* Owner & License Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Ownership & License</h4>
              
              {/* Owner */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Owner</span>
                </div>
                <span className="text-sm text-gray-800">
                  {nft.user.displayName || truncateAddress(nft.user.walletAddress)}
                </span>
              </div>

              {/* License */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">License Terms</span>
                <span className="text-sm text-gray-800">
                  {getLicenseText()}
                </span>
              </div>

              {/* Minted Date */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Minted On</span>
                </div>
                <span className="text-sm text-gray-800">
                  {formatDate(nft.mintedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      )}
    </>
  );
}
