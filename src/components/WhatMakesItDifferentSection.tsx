'use client';

import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export default function WhatMakesItDifferentSection() {
  const comparisons = [
    {
      category: "Purpose & Utility",
      others: "NFTs for art, zero real-world use",
      auctor: "IP for actual things, verifiable + transferable"
    },
    {
      category: "Record Storage",
      others: "Your receipts sit in drawers",
      auctor: "Ours are stored as tamperproof ownership records"
    },
    {
      category: "Resale Memory",
      others: "Resale has no memory",
      auctor: "Resale here preserves origin and trust"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const rowVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    },
  };

  return (
    <section className="py-24 bg-surface/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,107,107,0.02),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(107,239,165,0.03),transparent_60%)]" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-green text-sm font-medium uppercase tracking-wider mb-3 block">
                What Makes It Different
              </span>
              <h2 className="text-4xl md:text-5xl font-clash text-main mb-4">
                Beyond NFTs, <span className="text-green">Beyond Hype</span>
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Real ownership for real assets, not just digital collectibles
              </p>
            </motion.div>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            className="relative rounded-card overflow-hidden backdrop-blur-sm border border-main/20"
            style={{
              background: `linear-gradient(135deg, 
                rgba(255, 255, 255, 0.03) 0%, 
                rgba(255, 255, 255, 0.01) 50%, 
                transparent 100%
              )`
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Glass Morphism Overlay */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.08) 0%, 
                  rgba(255, 255, 255, 0.03) 30%, 
                  transparent 100%
                )`,
                backdropFilter: 'blur(15px)'
              }}
            />

            {/* Top Edge Highlight */}
            <div 
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, 
                  transparent, 
                  rgba(255, 255, 255, 0.15), 
                  transparent
                )`
              }}
            />

            <div className="relative z-10">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-6 p-8 border-b border-main/10">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-muted">Category</h3>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-red/20 flex items-center justify-center">
                      <X className="w-4 h-4 text-red" />
                    </div>
                    <h3 className="text-lg font-semibold text-red">Most Apps</h3>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green" />
                    </div>
                    <h3 className="text-lg font-semibold text-green">Auctor</h3>
                  </div>
                </div>
              </div>

              {/* Comparison Rows */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {comparisons.map((comparison, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-3 gap-6 p-8 border-b border-main/5 last:border-b-0 group hover:bg-white/2 transition-all duration-300"
                    variants={rowVariants}
                  >
                    {/* Category */}
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="w-2 h-2 bg-gold rounded-full mb-3 opacity-70" />
                        <h4 className="text-base font-medium text-main mb-1">
                          {comparison.category}
                        </h4>
                      </div>
                    </div>

                    {/* Most Apps (Cross) */}
                    <div className="flex items-center">
                      <div className="w-full p-4 rounded-button border border-red/10 relative overflow-hidden group-hover:border-red/20 transition-colors">
                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: `linear-gradient(135deg, 
                              rgba(255, 107, 107, 0.05) 0%, 
                              transparent 70%
                            )`
                          }}
                        />
                        
                        <div className="relative z-10 flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-red" />
                          </div>
                          <p className="text-sm text-muted leading-relaxed">
                            {comparison.others}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Auctor (Check) */}
                    <div className="flex items-center">
                      <div className="w-full p-4 rounded-button border border-green/10 relative overflow-hidden group-hover:border-green/20 transition-colors">
                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: `linear-gradient(135deg, 
                              rgba(107, 239, 165, 0.08) 0%, 
                              transparent 70%
                            )`
                          }}
                        />
                        
                        <div className="relative z-10 flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-green" />
                          </div>
                          <p className="text-sm text-main font-medium leading-relaxed">
                            {comparison.auctor}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Bottom Glow Effect */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: `linear-gradient(to top, 
                  rgba(107, 239, 165, 0.03) 0%, 
                  transparent 100%
                )`
              }}
            />
          </motion.div>

          {/* Bottom Statement */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="max-w-3xl mx-auto p-6 rounded-card border border-gold/10 relative overflow-hidden backdrop-blur-sm">
              {/* Background gradient */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 214, 107, 0.05) 0%, 
                    transparent 70%
                  )`
                }}
              />
              
              <div className="relative z-10">
                <p className="text-lg text-main font-medium mb-2">
                  The difference is clear:
                </p>
                <p className="text-muted">
                  While others focus on digital art, we're building the future of 
                  <span className="text-gold font-semibold"> real-world ownership</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-32 left-16 w-20 h-20 bg-red/5 rounded-full blur-xl"
        animate={{
          y: [-15, 15, -15],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-28 h-28 bg-green/5 rounded-full blur-xl"
        animate={{
          y: [15, -15, 15],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
}
