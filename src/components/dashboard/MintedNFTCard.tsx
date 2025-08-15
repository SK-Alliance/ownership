'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye,
  Tag,
  ExternalLink, 
  Calendar, 
  Wallet, 
  Hash, 
  DollarSign, 
  User,
  Copy,
  CheckCircle,
  Image as ImageIcon,
  X
} from 'lucide-react';
import type { MintedNFT } from '@/hooks/useMintedNFTs';

interface MintedNFTCardProps {
  nft: MintedNFT;
  index: number;
}

export function MintedNFTCard({ nft, index }: MintedNFTCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={() => setShowModal(true)}
        className="group relative overflow-hidden rounded-xl bg-white border-2 border-yellow-400 shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      >
        {/* NFT Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {nft.imageUrl || nft.ipfsImageUrl ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              )}
              <img
                src={nft.ipfsImageUrl || nft.imageUrl || '/placeholder-nft.jpg'}
                alt={nft.itemName}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
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
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No Image</p>
              </div>
            </div>
          )}
        </div>

        {/* NFT Details */}
        <div className="p-4">
          {/* Item Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors">
            {nft.itemName}
          </h3>
          
          {/* Model and Category */}
          <div className="space-y-2">
            {nft.model && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Model:</span>
                <span className="text-sm font-medium text-gray-800">{nft.model}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Category:</span>
              <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600">
                {nft.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-white text-center">
            <Eye className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">View Details</p>
          </div>
        </div>
      </motion.div>

      {/* Custom Centered NFT Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-700 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
              <div>
                <h2 className="text-xl font-bold text-white">NFT Details</h2>
                <p className="text-xs text-purple-300 mt-1">Digital Ownership Certificate</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-70px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5">
            {/* Image Section */}
            <div className="space-y-3">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-800 border border-purple-500/30">
                {nft.imageUrl || nft.ipfsImageUrl ? (
                  <>
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-500" />
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
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                      <Tag className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No Image Available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="flex gap-2">
                {nft.ipfsMetadataUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 bg-gray-800/50"
                    onClick={() => window.open(nft.ipfsMetadataUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Metadata
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-gray-800/50"
                  onClick={() => window.open('https://basecamp.cloud.blockscout.com/', '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Explorer
                </Button>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{nft.itemName}</h3>
                {nft.description && (
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">
                    {nft.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10 text-xs">
                    {nft.category}
                  </Badge>
                  {nft.manufacturer && (
                    <Badge variant="outline" className="border-blue-500/50 text-blue-300 bg-blue-500/10 text-xs">
                      {nft.manufacturer}
                    </Badge>
                  )}
                  {nft.model && (
                    <Badge variant="outline" className="border-green-500/50 text-green-300 bg-green-500/10 text-xs">
                      Model: {nft.model}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-3 rounded-lg border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium text-green-300">Estimated Value</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">
                    {formatValue(nft.estimatedValue)}
                  </span>
                </div>
              </div>

              {/* Blockchain Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-purple-300">Blockchain Details</h4>
                
                {/* Token ID */}
                <div className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <Hash className="w-3 h-3 text-blue-400" />
                    <span className="text-xs font-medium text-blue-300">Token ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-300">
                      {nft.tokenId ? truncateAddress(nft.tokenId) : 'Pending...'}
                    </span>
                    {nft.tokenId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-700"
                        onClick={() => copyToClipboard(nft.tokenId!, 'tokenId')}
                      >
                        {copiedField === 'tokenId' ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Contract Address */}
                {nft.contractAddress && (
                  <div className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-3 h-3 text-purple-400" />
                      <span className="text-xs font-medium text-purple-300">Contract</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-300">
                        {truncateAddress(nft.contractAddress)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-700"
                        onClick={() => copyToClipboard(nft.contractAddress!, 'contract')}
                      >
                        {copiedField === 'contract' ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Network */}
                <div className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <span className="text-xs font-medium text-cyan-300">Network</span>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                    {nft.blockchainNetwork}
                  </Badge>
                </div>
              </div>

              {/* Owner & License Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-orange-300">Ownership & License</h4>
                
                {/* Owner */}
                <div className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-medium text-yellow-300">Owner</span>
                  </div>
                  <span className="text-xs text-gray-300">
                    {nft.user.displayName || truncateAddress(nft.user.walletAddress)}
                  </span>
                </div>

                {/* License */}
                <div className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <span className="text-xs font-medium text-pink-300">License Terms</span>
                  <span className="text-xs text-gray-300">
                    {getLicenseText()}
                  </span>
                </div>

                {/* Minted Date */}
                <div className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    <span className="text-xs font-medium text-indigo-300">Minted On</span>
                  </div>
                  <span className="text-xs text-gray-300">
                    {formatDate(nft.mintedAt)}
                  </span>
                </div>
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
