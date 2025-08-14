'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, ExternalLink, Copy, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface NFTCardProps {
  title: string;
  imageUrl: string;
  metadataUrl: string;
  tokenId?: string;
  contractAddress: string;
  explorerUrl: string;
  status: 'minted' | 'pending';
  mintedAt?: string;
  index: number;
}

export function NFTCard({ 
  title, 
  imageUrl, 
  metadataUrl, 
  tokenId, 
  contractAddress, 
  explorerUrl,
  status,
  mintedAt,
  index 
}: NFTCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      className="group relative bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden"
    >
      {/* NFT Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1.5">
          <Trophy className="w-3 h-3" />
          NFT Certificate
        </Badge>
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={`${
          status === 'minted' 
            ? 'bg-green/20 text-green border-green/30' 
            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        } flex items-center gap-1.5`}>
          {status === 'minted' ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Minted
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" />
              Pending
            </>
          )}
        </Badge>
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl || '/placeholder-nft.jpg'}
          alt={title}
          width={300}
          height={192}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-main mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {title} - NFT Certificate
        </h3>

        {/* NFT Details */}
        <div className="space-y-3 mb-4">
          {tokenId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Token ID:</span>
              <div className="flex items-center gap-2">
                <span className="text-main font-mono">#{tokenId}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(tokenId)}
                  className="p-1 h-6 w-6 text-muted hover:text-main"
                >
                  {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Contract:</span>
            <div className="flex items-center gap-2">
              <span className="text-main font-mono text-xs">
                {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(contractAddress)}
                className="p-1 h-6 w-6 text-muted hover:text-main"
              >
                {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>

          {mintedAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Minted:</span>
              <span className="text-main">
                {new Date(mintedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(metadataUrl, '_blank')}
            className="flex-1 text-purple-300 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50"
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Metadata
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`${explorerUrl}/address/${contractAddress}`, '_blank')}
            className="flex-1 text-blue-300 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50"
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Explorer
          </Button>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
    </motion.div>
  );
}