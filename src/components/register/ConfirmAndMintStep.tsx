'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegistrationStore } from '@/lib/stores/registration-store';
import { Shield, Package, FileText, DollarSign, Calendar, Hash, Check, Zap } from 'lucide-react';

export default function ConfirmAndMintStep() {
  const { itemDetails, proofFiles } = useRegistrationStore();

  const totalFiles = [
    proofFiles.receipt,
    proofFiles.identification,
    ...proofFiles.additionalDocs
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-main/20 bg-surface/50 backdrop-blur-md">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-green/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green/30"
          >
            <Shield className="w-8 h-8 text-green" />
          </motion.div>
          <CardTitle className="text-2xl font-clash text-main">
            Confirm & Mint
          </CardTitle>
          <CardDescription className="text-muted">
            Review your details and create your IP certificate
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Item Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-main flex items-center gap-2">
              <Package className="w-5 h-5 text-gold" />
              Item Summary
            </h3>
            
            <div className="bg-bg-main/50 border border-main/20 rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-xl font-clash text-main mb-2">{itemDetails.name || 'Untitled Item'}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full uppercase tracking-wider">
                      {itemDetails.category || 'Uncategorized'}
                    </span>
                  </div>
                  {itemDetails.description && (
                    <p className="text-muted text-sm leading-relaxed">{itemDetails.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-main/10">
                {itemDetails.value && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green" />
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider">Value</p>
                      <p className="text-sm font-medium text-main">{itemDetails.value}</p>
                    </div>
                  </div>
                )}
                
                {itemDetails.purchaseDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue" />
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider">Purchase Date</p>
                      <p className="text-sm font-medium text-main">
                        {new Date(itemDetails.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {itemDetails.serialNumber && (
                  <div className="flex items-center gap-2 col-span-2">
                    <Hash className="w-4 h-4 text-blue" />
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider">Serial/Model</p>
                      <p className="text-sm font-medium text-main">{itemDetails.serialNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Proof Documents Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-main flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue" />
              Uploaded Documents
            </h3>
            
            <div className="bg-bg-main/50 border border-main/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted">Total Files Uploaded</span>
                <span className="text-lg font-semibold text-green">{totalFiles}</span>
              </div>
              
              <div className="space-y-3">
                {proofFiles.receipt && (
                  <div className="flex items-center gap-3 p-3 bg-green/5 border border-green/20 rounded-lg">
                    <div className="w-8 h-8 bg-green/20 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-main">Purchase Receipt</p>
                      <p className="text-xs text-muted">{proofFiles.receipt.name}</p>
                    </div>
                  </div>
                )}
                
                {proofFiles.identification && (
                  <div className="flex items-center gap-3 p-3 bg-green/5 border border-green/20 rounded-lg">
                    <div className="w-8 h-8 bg-green/20 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-main">Identification</p>
                      <p className="text-xs text-muted">{proofFiles.identification.name}</p>
                    </div>
                  </div>
                )}
                
                {proofFiles.additionalDocs.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue/5 border border-blue/20 rounded-lg">
                    <div className="w-8 h-8 bg-blue/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-main">Additional Document</p>
                      <p className="text-xs text-muted">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-main flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold" />
              What Happens Next
            </h3>
            
            <div className="bg-gold/5 border border-gold/20 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-main">Verification Process</p>
                    <p className="text-xs text-muted">We'll verify your documents and ownership proof</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-main">Blockchain Minting</p>
                    <p className="text-xs text-muted">Your IP certificate will be minted on Camp Network</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-main">Certificate Ready</p>
                    <p className="text-xs text-muted">You'll receive your tamperproof ownership certificate</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Final Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-start gap-3 p-4 bg-green/5 border border-green/20 rounded-lg"
          >
            <div className="w-6 h-6 bg-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-green" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-main">Ready to Mint</p>
              <p className="text-xs text-muted">
                By proceeding, you confirm that all information is accurate and you own the rights to this item.
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
