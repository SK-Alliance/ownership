'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export const ExtraInfo: React.FC = () => {
  return (
    <Card className="max-w-2xl mx-auto mt-8 bg-card/30 border-main/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-main flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          How It Works
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-xs mt-0.5">
            1
          </div>
          <p>Fill in your item details and upload an image</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-xs mt-0.5">
            2
          </div>
          <p>Preview your NFT certificate before minting</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-xs mt-0.5">
            3
          </div>
          <p>Mint your ownership certificate using Camp Network&apos;s Origin Protocol</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-xs mt-0.5">
            4
          </div>
          <p>Your NFT represents verifiable proof of ownership on the blockchain</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtraInfo;