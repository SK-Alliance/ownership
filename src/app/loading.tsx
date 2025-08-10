'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-main flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        {/* Main Loading Spinner */}
        <div className="relative">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-2 border-accent-green/20 border-t-accent-green"
          />
          
          {/* Inner Logo */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-elevated">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          
          {/* Glow Effect */}
          <div 
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(107, 239, 165, 0.2) 0%, transparent 70%)',
              filter: 'blur(10px)'
            }}
          />
        </div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-main mb-2">Auctor</h1>
          <p className="text-muted text-sm">Verifying digital provenance...</p>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2
              }}
              className="w-2 h-2 bg-accent-green rounded-full"
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1 bg-gradient-to-r from-accent-green to-transparent rounded-full"
        />
      </div>
    </div>
  );
}
