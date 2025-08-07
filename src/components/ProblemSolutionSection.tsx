'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Users, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ProblemSolutionSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-main via-bg-surface/20 to-bg-main" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,214,107,0.02),transparent_70%)]" />
      
      <div className="container mx-auto px-6 md:px-20 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-clash text-main mb-6">
              <span className="text-red">The Problem</span> & <span className="text-gold">Our Solution</span>
            </h2>
            {/* <p className="text-xl text-muted max-w-4xl mx-auto">
              Traditional ownership lacks digital proof. We're changing that with blockchain technology.
            </p> */}
          </motion.div>

            {/* Left Side - Problem & Solution Cards Horizontally */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Card */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Liquid Glass Card */}
                <div 
                  className="relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-500 group-hover:scale-[1.02] h-full"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 107, 107, 0.05) 0%, 
                        rgba(255, 107, 107, 0.02) 50%, 
                        transparent 100%
                      ),
                      rgba(26, 27, 29, 0.8)
                    `,
                    borderColor: 'rgba(255, 107, 107, 0.2)',
                    boxShadow: `
                      inset 0 1px 0 rgba(255, 255, 255, 0.1),
                      0 4px 6px -1px rgba(0, 0, 0, 0.1),
                      0 2px 4px -1px rgba(0, 0, 0, 0.06)
                    `
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red/20 border border-red/30 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red" />
                    </div>
                    <span className="text-red text-xs font-semibold uppercase tracking-wider">
                      The Problem
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-clash text-main mb-3 leading-tight">
                    Most things we own have{' '}
                    <span className="text-red">no real proof</span>{' '}
                    tied to us
                  </h3>

                  <p className="text-sm text-muted leading-relaxed mb-4">
                    We lose receipts, bills fade, and ownership becomes a mess.
                  </p>

                  {/* Problem Points */}
                  <div className="space-y-2">
                    {[
                      "Lost physical receipts",
                      "No transferable proof", 
                      "Disputes over authenticity"
                    ].map((point, index) => (
                      <div key={index} className="flex items-center gap-2 text-muted text-sm">
                        <div className="w-1.5 h-1.5 bg-red/60 rounded-full flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Solution Card */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Liquid Glass Card */}
                <div 
                  className="relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-500 group-hover:scale-[1.02] h-full"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 214, 107, 0.08) 0%, 
                        rgba(107, 239, 165, 0.05) 50%, 
                        rgba(107, 203, 255, 0.03) 100%
                      ),
                      rgba(26, 27, 29, 0.8)
                    `,
                    borderColor: 'rgba(255, 214, 107, 0.3)',
                    boxShadow: `
                      inset 0 1px 0 rgba(255, 255, 255, 0.1),
                      0 4px 6px -1px rgba(0, 0, 0, 0.1),
                      0 2px 4px -1px rgba(0, 0, 0, 0.06),
                      0 0 0 1px rgba(255, 214, 107, 0.1)
                    `
                  }}
                >
                  {/* Solution Icon & Label */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-gold text-xs font-semibold uppercase tracking-wider">
                      Our Solution
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-clash text-main mb-3 leading-tight">
                    Register items as{' '}
                    <span className="text-green">verifiable IP</span>{' '}
                    onchain
                  </h3>

                  <p className="text-sm text-muted leading-relaxed mb-4">
                    Traceable, transferable ownership that can&apos;t be lost or disputed.
                  </p>

                  {/* Benefits Grid */}
                  <div className="space-y-2">
                    {[
                      { icon: Shield, text: "Tamperproof certificates", color: "text-gold" },
                      { icon: Zap, text: "Instant verification", color: "text-green" },
                      { icon: Users, text: "Seamless transfers", color: "text-blue" }
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                      >
                        <div className={`w-4 h-4 ${benefit.color}`}>
                          <benefit.icon className="w-full h-full" />
                        </div>
                        <span className="text-main">
                          {benefit.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
      </div>
    </section>
  );
}
