'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Users } from 'lucide-react';

export default function ProblemSolutionSection() {
  return (
    <section className="py-24 bg-surface/30">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Problem Statement */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="text-red text-sm font-medium uppercase tracking-wider mb-2 block">
                    The Problem
                  </span>
                  <h2 className="text-3xl md:text-4xl font-clash text-main leading-tight mb-6">
                    Most things we own have{' '}
                    <span className="text-red">no real proof</span>{' '}
                    tied to us.
                  </h2>
                </motion.div>

                <motion.p
                  className="text-lg text-muted leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  We lose receipts, bills fade and ownership becomes a mess - 
                  especially when reselling or sharing.
                </motion.p>
              </div>

              {/* Solution Statement */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                    <Shield className="w-4 h-4 text-bg-main" />
                  </div>
                  <span className="text-gold text-sm font-medium uppercase tracking-wider">
                    Auctor fixes that for you!
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-clash text-main leading-tight">
                  Register any high-value item with proof, mint it as{' '}
                  <span className="text-green">verifiable IP onchain</span>{' '}
                  and always have a traceable, transferable recording of ownership.
                </h3>
              </motion.div>

              {/* Benefits List */}
              <motion.div
                className="space-y-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {[
                  { icon: Shield, text: "Tamperproof digital certificates", color: "text-gold" },
                  { icon: Zap, text: "Instant verification & transfers", color: "text-green" },
                  { icon: Users, text: "Seamless co-ownership & resale", color: "text-blue" }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                  >
                    <div className={`w-6 h-6 ${benefit.color} group-hover:scale-110 transition-transform`}>
                      <benefit.icon className="w-full h-full" />
                    </div>
                    <span className="text-muted group-hover:text-main transition-colors">
                      {benefit.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              {/* Main Mockup Container */}
              <div className="relative bg-surface border border-main rounded-card p-8 shadow-elevated">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-bg-main" />
                    </div>
                    <span className="font-semibold text-main">Asset Certificate</span>
                  </div>
                  <div className="badge-verified">
                    <div className="w-2 h-2 bg-green rounded-full" />
                    Verified
                  </div>
                </div>

                {/* Asset Image Placeholder */}
                <div className="w-full h-48 bg-parchment rounded-button mb-6 flex items-center justify-center border border-gold/20">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-gold" />
                    </div>
                    <p className="text-sm text-muted">High-Value Asset</p>
                    <p className="text-xs text-muted/70">Digital Certificate</p>
                  </div>
                </div>

                {/* Asset Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted text-sm">Asset ID</span>
                    <span className="text-main text-sm font-mono">AUC-2025-001234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted text-sm">Owner</span>
                    <span className="text-main text-sm">0x1234...5678</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted text-sm">Created</span>
                    <span className="text-main text-sm">Aug 7, 2025</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-main">
                    <span className="text-muted text-sm">Status</span>
                    <div className="badge-verified text-xs">
                      Blockchain Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-gold/10 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-green/5 rounded-full blur-xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Chain Connection Lines */}
              <div className="absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-gold to-transparent opacity-50" />
              <div className="absolute top-1/2 -right-12 w-3 h-3 border-2 border-gold rounded-full bg-bg-main opacity-75" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
