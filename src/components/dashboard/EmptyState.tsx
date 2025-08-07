'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="col-span-full"
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

        <CardContent className="relative z-10 py-16 px-8">
          <div className="text-center space-y-6 max-w-md mx-auto">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative mx-auto w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 214, 107, 0.2) 0%, 
                  rgba(255, 214, 107, 0.1) 50%, 
                  transparent 100%
                )`
              }}
            >
              <div className="absolute inset-2 rounded-full border border-gold/30" />
              <Shield className="w-10 h-10 text-gold" />
              
              {/* Floating sparkles */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-gold/60" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1.1, 1, 1.1],
                }}
                transition={{ 
                  rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="absolute -bottom-1 -left-1"
              >
                <Sparkles className="w-4 h-4 text-gold/40" />
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-clash text-main">
                No Items Registered Yet
              </h3>
              <p className="text-muted leading-relaxed">
                Start building your digital ownership portfolio by registering your first intellectual property asset. 
                Protect your creations and earn XP for every verified item.
              </p>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link href="/register">
                <Button
                  className="relative px-8 py-3 rounded-full border border-gold/30 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-glow-gold"
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
                    <Plus className="w-5 h-5 text-gold" />
                    <span className="text-gold font-medium">Register Your First Item</span>
                  </div>

                  {/* Button highlight edge */}
                  <div 
                    className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, 
                        transparent, 
                        rgba(255, 214, 107, 0.6), 
                        transparent
                      )`
                    }}
                  />
                </Button>
              </Link>
            </motion.div>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="pt-6 space-y-2"
            >
              <div className="text-sm text-muted text-left space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                  <span>Earn XP for verified registrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                  <span>Unlock higher tiers and benefits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                  <span>Generate blockchain certificates</span>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
