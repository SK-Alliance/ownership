'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ItemDetails } from '@/types/item';
import { 
  ShieldCheck, 
  ShieldX, 
  Download,
  Hash,
  Wallet,
  Calendar,
  DollarSign,
  Clock,
  Package
} from 'lucide-react';

interface ItemMetadataProps {
  item: ItemDetails;
  onDownloadPPD: (itemId: string) => void;
}

export default function ItemMetadata({ item, onDownloadPPD }: ItemMetadataProps) {
  const getStatusIcon = (status: ItemDetails['status']) => {
    switch (status) {
      case 'verified':
        return <ShieldCheck className="w-4 h-4" />;
      case 'rejected':
        return <ShieldX className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ItemDetails['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green/20 text-green border-green/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatValue = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Card 
        className="relative border border-main/20 overflow-hidden backdrop-blur-xl"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.03) 30%, 
            rgba(255, 255, 255, 0.01) 70%,
            transparent 100%
          )`
        }}
      >
        {/* Glass morphism overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 50%, 
              transparent 100%
            )`,
            backdropFilter: 'blur(20px)'
          }}
        />

        {/* Top highlight edge */}
        <div 
          className="absolute top-0 left-4 right-4 h-px"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, 0.2), 
              transparent
            )`
          }}
        />

        <div className="relative z-10">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-gold" />
                  <Badge 
                    className={`${getStatusColor(item.status)} font-medium flex items-center gap-1.5 px-3 py-1`}
                  >
                    {getStatusIcon(item.status)}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-clash text-main leading-tight">
                  {item.name}
                </CardTitle>
                <p className="text-muted leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => onDownloadPPD(item.id)}
                  className="relative px-6 py-3 rounded-lg border border-gold/30 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-glow-gold"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(255, 214, 107, 0.15) 0%, 
                      rgba(255, 214, 107, 0.08) 50%, 
                      transparent 100%
                    )`
                  }}
                >
                  {/* Button glass overlay */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(255, 214, 107, 0.2) 0%, 
                        rgba(255, 214, 107, 0.1) 50%, 
                        transparent 100%
                      )`
                    }}
                  />
                  
                  <div className="relative z-10 flex items-center gap-2">
                    <Download className="w-4 h-4 text-gold" />
                    <span className="text-gold font-medium">Download PPD</span>
                  </div>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Estimated Value */}
              {item.estimatedValue && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="p-4 rounded-lg bg-main/5 border border-main/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green" />
                    <span className="text-sm font-medium text-muted">Estimated Value</span>
                  </div>
                  <p className="text-xl font-semibold text-main">
                    {formatValue(item.estimatedValue, item.currency)}
                  </p>
                </motion.div>
              )}

              {/* Creator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="p-4 rounded-lg bg-main/5 border border-main/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-blue" />
                  <span className="text-sm font-medium text-muted">Creator</span>
                </div>
                <code className="text-sm text-main font-mono bg-main/10 px-2 py-1 rounded">
                  {formatAddress(item.creatorWallet)}
                </code>
              </motion.div>

              {/* Registration Date */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="p-4 rounded-lg bg-main/5 border border-main/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-muted">Registered</span>
                </div>
                <p className="text-sm text-main">
                  {formatDate(item.registrationDate)}
                </p>
              </motion.div>

              {/* Origin Hash */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="p-4 rounded-lg bg-main/5 border border-main/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-muted">Origin ID</span>
                </div>
                <code className="text-xs text-main font-mono bg-main/10 px-2 py-1 rounded break-all">
                  {item.originHash.slice(0, 16)}...
                </code>
              </motion.div>
            </div>

            {/* Additional Metadata */}
            {Object.keys(item.metadata.additionalData).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="space-y-3"
              >
                <h4 className="text-lg font-semibold text-main">Additional Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.metadata.fileType && (
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-main/5 border border-main/10">
                      <span className="text-sm text-muted">File Type</span>
                      <span className="text-sm font-medium text-main">{item.metadata.fileType}</span>
                    </div>
                  )}
                  {item.metadata.fileSize && (
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-main/5 border border-main/10">
                      <span className="text-sm text-muted">File Size</span>
                      <span className="text-sm font-medium text-main">
                        {(item.metadata.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                  {item.metadata.dimensions && (
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-main/5 border border-main/10">
                      <span className="text-sm text-muted">Dimensions</span>
                      <span className="text-sm font-medium text-main">{item.metadata.dimensions}</span>
                    </div>
                  )}
                  {item.metadata.duration && (
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-main/5 border border-main/10">
                      <span className="text-sm text-muted">Duration</span>
                      <span className="text-sm font-medium text-main">{item.metadata.duration}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
