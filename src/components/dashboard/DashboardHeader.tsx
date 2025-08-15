'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuthState, useAuth, useProvider } from '@campnetwork/origin/react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getTierColor } from '@/data/dashboard';
import { Shield, Trophy, Calendar } from 'lucide-react';

interface DashboardUser {
  walletAddress: string;
  username: string;
  fullName: string;
  email: string;
  xpPoints: number;
  tier: 'New User' | 'Verified Collector' | 'Power Owner';
  listingCredits: {
    used: number;
    total: number;
    resetDate: string;
  };
}

export default function DashboardHeader() {
  const { authenticated } = useAuthState();
  const auth = useAuth();
  const { provider } = useProvider();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState<string | null>(null);

  // Enhanced address detection (same as Profile component)
  useEffect(() => {
    const getWalletAddress = async () => {
      if (!authenticated) {
        setAddress(null);
        return;
      }
      
      try {
        let walletAddress = null;
        
        // Method 3: Try window.ethereum as fallback
        if (!walletAddress && typeof window !== 'undefined' && window.ethereum) {
          try {
            const accounts = await (window.ethereum as { request: (args: { method: string }) => Promise<string[]> }).request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              walletAddress = accounts[0];
            }
          } catch (error) {
            console.log('Window ethereum address retrieval failed:', error);
          }
        }
        
        console.log('Dashboard detected wallet address:', walletAddress);
        setAddress(walletAddress || '0x1234567890123456789012345678901234567890');
        
      } catch (error) {
        console.error('Error getting wallet address:', error);
        setAddress('0x1234567890123456789012345678901234567890');
      }
    };
    
    getWalletAddress();
  }, [authenticated, auth, provider]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authenticated || !address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch user profile from our API
        const response = await fetch(`/api/profile/${address}`);
        
        if (response.ok) {
          const profileData = await response.json();
          
          // Calculate tier based on XP points
          const calculateTier = (xp: number): 'New User' | 'Verified Collector' | 'Power Owner' => {
            if (xp >= 51) return 'Power Owner';
            if (xp >= 21) return 'Verified Collector';
            return 'New User';
          };

          const dashboardUser: DashboardUser = {
            walletAddress: profileData.walletAddress,
            username: profileData.username || '',
            fullName: profileData.fullName || '',
            email: profileData.email || '',
            xpPoints: profileData.xpPoints || 0,
            tier: calculateTier(profileData.xpPoints || 0),
            listingCredits: {
              used: 3, // TODO: Implement actual listing credits tracking
              total: 10,
              resetDate: '2024-02-15'
            }
          };

          setUser(dashboardUser);
        } else if (response.status === 404) {
          // User profile not found - create a default dashboard user
          const defaultUser: DashboardUser = {
            walletAddress: address,
            username: '',
            fullName: '',
            email: '',
            xpPoints: 0,
            tier: 'New User',
            listingCredits: {
              used: 0,
              total: 10,
              resetDate: '2024-02-15'
            }
          };
          setUser(defaultUser);
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        // Fallback user on error
        const fallbackUser: DashboardUser = {
          walletAddress: address,
          username: '',
          fullName: '',
          email: '',
          xpPoints: 0,
          tier: 'New User',
          listingCredits: {
            used: 0,
            total: 10,
            resetDate: '2024-02-15'
          }
        };
        setUser(fallbackUser);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authenticated, address]);

  if (isLoading) {
    return (
      <div className="relative rounded-card border border-main/20 overflow-hidden backdrop-blur-xl mb-8 p-8 mx-0.5 md:mx-[18px] xl:mx-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-main/10 animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-48 h-6 bg-main/10 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-main/10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const maxXP = 100;

  // Format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get display name with fallback
  const displayName = user.fullName || user.username || formatAddress(user.walletAddress);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative rounded-card border border-main/20 overflow-hidden backdrop-blur-xl mb-8 mx-0.5 md:mx-[18px] xl:mx-6"
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

      <div className="relative z-10 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* User Info Section */}
          <div className="flex items-center gap-6">
            <Avatar className="w-16 h-16 ring-2 ring-gold/20">
              <AvatarFallback className="bg-gradient-to-br from-gold/20 to-gold/10 text-gold text-lg font-bold">
                {user.walletAddress.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-clash text-main">
                  Welcome back! {displayName && (
                    <span className="text-gold">{displayName}</span>
                  )}
                </h1>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Badge 
                    className={`${getTierColor(user.tier)} text-bg-main font-medium px-3 py-1 border-0`}
                  >
                    <Trophy className="w-3 h-3 mr-1" />
                    {user.tier}
                  </Badge>
                </motion.div>
              </div>
              
              <div className="flex items-center gap-2 text-muted text-sm">
                <Shield className="w-4 h-4" />
                <code className="bg-main/10 px-2 py-1 rounded font-mono">
                  {formatAddress(user.walletAddress)}
                </code>
              </div>
            </div>
          </div>

          {/* Listing Credits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 lg:items-center"
          >
            <div className="text-center lg:text-right">
              <div className="text-sm text-muted mb-1">Listing Credits</div>
              <div className="text-xl font-semibold text-main">
                {user.listingCredits.used} of {user.listingCredits.total}
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-1 text-xs text-muted mt-1">
                <Calendar className="w-3 h-3" />
                <span>Resets Sep 1</span>
              </div>
              
            </div>
              <div className="text-right mx-4">
              <div className="text-2xl font-bold text-main">{user.xpPoints}</div>
              <div className="text-sm text-muted">/ {maxXP} XP</div>
            </div>
          </motion.div>
        </div>

      
      </div>
    </motion.div>
  );
}
