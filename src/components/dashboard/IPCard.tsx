'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink, Copy, CheckCircle, Clock, FileText } from 'lucide-react';
import { useState } from 'react';

interface IPCardProps {
  title: string;
  ipId?: string;
  ipType: 'copyright' | 'trademark' | 'patent' | 'design';
  status: 'registered' | 'pending';
  registeredAt?: string;
  ipfsHash?: string;
  explorerUrl: string;
  index: number;
}

export function IPCard({ 
  title, 
  ipId, 
  ipType,
  status,
  registeredAt,
  ipfsHash,
  explorerUrl,
  index 
}: IPCardProps) {
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

  const getIPTypeColor = (type: string) => {
    switch (type) {
      case 'copyright': return 'text-orange-300 border-orange-500/30 bg-orange-500/20';
      case 'trademark': return 'text-cyan-300 border-cyan-500/30 bg-cyan-500/20';
      case 'patent': return 'text-emerald-300 border-emerald-500/30 bg-emerald-500/20';
      case 'design': return 'text-pink-300 border-pink-500/30 bg-pink-500/20';
      default: return 'text-blue-300 border-blue-500/30 bg-blue-500/20';
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
      className="group relative bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 overflow-hidden"
    >
      {/* IP Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          IP Protection
        </Badge>
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={`${
          status === 'registered' 
            ? 'bg-green/20 text-green border-green/30' 
            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        } flex items-center gap-1.5`}>
          {status === 'registered' ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Registered
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" />
              Pending
            </>
          )}
        </Badge>
      </div>

      {/* Icon Background */}
      <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
        <div className="text-emerald-400/30">
          <Shield className="w-24 h-24" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-main mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors">
          {title} - IP Registration
        </h3>

        {/* IP Type Badge */}
        <div className="mb-4">
          <Badge className={`${getIPTypeColor(ipType)} capitalize`}>
            <FileText className="w-3 h-3 mr-1" />
            {ipType}
          </Badge>
        </div>

        {/* IP Details */}
        <div className="space-y-3 mb-4">
          {ipId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">IP ID:</span>
              <div className="flex items-center gap-2">
                <span className="text-main font-mono">{ipId}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(ipId)}
                  className="p-1 h-6 w-6 text-muted hover:text-main"
                >
                  {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          )}
          
          {ipfsHash && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">IPFS Hash:</span>
              <div className="flex items-center gap-2">
                <span className="text-main font-mono text-xs">
                  {ipfsHash.slice(0, 8)}...{ipfsHash.slice(-6)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(ipfsHash)}
                  className="p-1 h-6 w-6 text-muted hover:text-main"
                >
                  {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          )}

          {registeredAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Registered:</span>
              <span className="text-main">
                {new Date(registeredAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {ipfsHash && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://ipfs.io/ipfs/${ipfsHash}`, '_blank')}
              className="flex-1 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              View on IPFS
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(explorerUrl, '_blank')}
            className="flex-1 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500/50"
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