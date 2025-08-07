'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile } from '@/types/dashboard';
import { getTierColor } from '@/data/dashboard';
import { Shield, Trophy, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  user: UserProfile;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const maxXP = 100;
  const progressPercentage = Math.min((user.totalXP / maxXP) * 100, 100);

  // Format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative rounded-card border border-main/20 overflow-hidden backdrop-blur-xl mb-8"
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
                {user.address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-clash text-main">Welcome back!</h1>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
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
                  {formatAddress(user.address)}
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
          </motion.div>
        </div>

        {/* XP Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-main mb-1">Experience Points</h3>
              <p className="text-sm text-muted">
                Keep registering items to unlock new tiers and benefits
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-main">{user.totalXP}</div>
              <div className="text-sm text-muted">/ {maxXP} XP</div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-main/10"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>New User (0 XP)</span>
              <span>Verified Collector (21+ XP)</span>
              <span>Power Owner (51+ XP)</span>
            </div>
          </div>

          {/* Next Tier Info */}
          {user.tier !== 'Power Owner' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="text-center py-3 px-4 rounded-lg bg-main/5 border border-main/10"
            >
              <span className="text-sm text-muted">
                {user.tier === 'New User' 
                  ? `${21 - user.totalXP} XP to Verified Collector`
                  : `${51 - user.totalXP} XP to Power Owner`
                }
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
