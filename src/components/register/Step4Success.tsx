'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Award, 
  ExternalLink,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

interface Step4Props {
  isSuccess: boolean;
  itemTitle: string;
  transactionHash?: string;
  completionType?: 'mint_only' | 'mint_and_ip' | 'ip_only';
  onViewDashboard: () => void;
  onRegisterAnother: () => void;
}

export const Step4Success: React.FC<Step4Props> = ({
  itemTitle,
  transactionHash,
  completionType = 'mint_only',
  onViewDashboard,
  onRegisterAnother
}) => {
  // Get appropriate messages based on completion type
  const getSuccessMessages = () => {
    switch (completionType) {
      case 'mint_only':
        return {
          title: 'NFT Certificate Minted!',
          description: 'Your ownership certificate has been successfully minted as an NFT on Camp Network.',
          badgeText: 'NFT Minted'
        };
      case 'mint_and_ip':
        return {
          title: 'NFT + IP Certificate Created!',
          description: 'Your NFT has been minted and intellectual property protection has been established.',
          badgeText: 'NFT + IP Created'
        };
      case 'ip_only':
        return {
          title: 'IP Certificate Created!',
          description: 'Your intellectual property has been successfully registered and protected.',
          badgeText: 'IP Protected'
        };
    }
  };
  
  const messages = getSuccessMessages();
  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green/20 to-green/10 border border-green/30">
          <CheckCircle className="w-12 h-12 text-green" />
        </div>
        <h2 className="text-3xl font-bold text-main mb-3">{messages.title}</h2>
        <p className="text-lg text-muted max-w-md mx-auto">
          Congratulations! {messages.description}
        </p>
      </div>

      {/* Success Details */}
      <div className="max-w-lg mx-auto space-y-6">
        {/* Item Confirmed */}
        <div className="p-6 bg-gradient-to-r from-green/5 to-green/10 border border-green/20 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-green" />
            </div>
            <div>
              <h3 className="font-semibold text-main">Item Registered</h3>
              <p className="text-sm text-muted">{itemTitle}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {(completionType === 'mint_only' || completionType === 'mint_and_ip') && (
              <div className="flex items-center justify-between">
                <span className="text-muted">NFT Certificate:</span>
                <Badge className="bg-green/20 text-green border-green/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Minted
                </Badge>
              </div>
            )}
            {(completionType === 'ip_only' || completionType === 'mint_and_ip') && (
              <div className="flex items-center justify-between">
                <span className="text-muted">IP Protection:</span>
                <Badge className="bg-green/20 text-green border-green/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Registered
                </Badge>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted">Status:</span>
              <Badge className="bg-green/20 text-green border-green/30">
                Active
              </Badge>
            </div>
            {transactionHash && (
              <div className="flex items-center justify-between">
                <span className="text-muted">Transaction:</span>
                <a 
                  href={`https://basecamp.cloud.blockscout.com/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 text-xs font-mono flex items-center"
                >
                  {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="p-6 bg-main/5 border border-main/10 rounded-xl">
          <h3 className="font-semibold text-main mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-gold" />
            Whats Next?
          </h3>
          <div className="space-y-3 text-sm text-muted">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
              <span>Your item is now protected by blockchain-verified ownership</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
              <span>NFT certificate has been added to your wallet</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
              <span>Track your item provenance and history</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
              <span>Share verified ownership proof with others</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="p-4 bg-gradient-to-r from-gold/5 to-gold/10 border border-gold/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-gold" />
            <span className="font-medium text-main">View in Dashboard</span>
          </div>
          <p className="text-sm text-muted mb-3">
            Track all your registered items, view certificates, and manage your IP portfolio.
          </p>
          <Button
            onClick={onViewDashboard}
            className="w-full bg-gradient-to-r from-gold to-gold/80 text-bg-main font-medium rounded-lg hover:shadow-lg hover:shadow-gold/25 transition-all duration-200"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Go to Dashboard
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-main/10">
        <Button
          onClick={onRegisterAnother}
          variant="outline"
          className="px-6 py-3 border-main/20 text-main hover:border-main/40"
        >
          Register Another Item
        </Button>
        
        <Link href="/profile">
          <Button className="px-6 py-3 bg-main text-bg-main hover:bg-main/90">
            View Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
