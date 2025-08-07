'use client';

import { motion } from 'framer-motion';
import { Upload, CheckCircle, Zap, ArrowRightLeft } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload your bill + ID",
      description: "Provide proof of purchase and identity verification",
      color: "text-blue",
      bgColor: "bg-blue/10",
      borderColor: "border-blue/20",
      gradientBg: "bg-gradient-to-br from-blue/20 via-blue/10 to-transparent",
      glassOverlay: "bg-gradient-to-br from-white/5 via-white/10 to-transparent",
      step: "01"
    },
    {
      icon: CheckCircle,
      title: "We verify it",
      description: "Our system validates authenticity and ownership",
      color: "text-green",
      bgColor: "bg-green/10",
      borderColor: "border-green/20",
      gradientBg: "bg-gradient-to-br from-green/20 via-green/10 to-transparent",
      glassOverlay: "bg-gradient-to-br from-white/5 via-white/10 to-transparent",
      step: "02"
    },
    {
      icon: Zap,
      title: "We mint your item as an origin IP artifact",
      description: "Create immutable digital certificate on blockchain",
      color: "text-gold",
      bgColor: "bg-gold/10",
      borderColor: "border-gold/20",
      gradientBg: "bg-gradient-to-br from-gold/20 via-gold/10 to-transparent",
      glassOverlay: "bg-gradient-to-br from-white/5 via-white/10 to-transparent",
      step: "03"
    },
    {
      icon: ArrowRightLeft,
      title: "You can view, co-own or transfer it anytime",
      description: "Full control over your verified digital asset",
      color: "text-main",
      bgColor: "bg-surface",
      borderColor: "border-main",
      gradientBg: "bg-gradient-to-br from-surface via-bg-surface to-transparent",
      glassOverlay: "bg-gradient-to-br from-white/3 via-white/8 to-transparent",
      step: "04"
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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.2
      }
    },
  };

  return (
    <section className="py-24 bg-main relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(107,239,165,0.03),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,214,107,0.02),transparent_70%)]" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
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
              <span className="text-gold text-sm font-medium uppercase tracking-wider mb-3 block">
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-clash text-main mb-4">
                Simple Flow, <span className="text-gold">Solid Record</span>
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                From upload to ownership - secure your assets in four simple steps
              </p>
            </motion.div>
          </motion.div>

          {/* Steps Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded-card border ${step.borderColor} group hover:border-gold transition-all duration-300 overflow-hidden backdrop-blur-sm`}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.05) 0%, 
                    rgba(255, 255, 255, 0.02) 50%, 
                    transparent 100%
                  )`
                }}
              >
                {/* Gradient Background Layer */}
                <div 
                  className={`absolute inset-0 ${step.gradientBg} opacity-60`}
                  style={{
                    background: `linear-gradient(135deg, 
                      ${step.color === 'text-blue' ? 'rgba(107, 203, 255, 0.15)' : ''}
                      ${step.color === 'text-green' ? 'rgba(107, 239, 165, 0.15)' : ''}
                      ${step.color === 'text-gold' ? 'rgba(255, 214, 107, 0.15)' : ''}
                      ${step.color === 'text-main' ? 'rgba(26, 27, 29, 0.8)' : ''}
                      0%, 
                      transparent 70%
                    )`
                  }}
                />
                
                {/* Glass Morphism Overlay */}
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.1) 0%, 
                      rgba(255, 255, 255, 0.05) 30%, 
                      transparent 100%
                    )`,
                    backdropFilter: 'blur(10px)'
                  }}
                />

                {/* Liquid Glass Effect - Top Edge */}
                <div 
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, 
                      transparent, 
                      rgba(255, 255, 255, 0.2), 
                      transparent
                    )`
                  }}
                />

                {/* Content Container - Above overlays */}
                <div className="relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-12 -right-12 w-8 h-8 bg-gradient-to-r from-gold to-gold/80 rounded-full flex items-center justify-center shadow-glow-gold">
                    <span className="text-bg-main text-sm font-bold">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-full border ${step.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                    variants={iconVariants}
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.1) 0%, 
                        rgba(255, 255, 255, 0.05) 50%, 
                        transparent 100%
                      )`,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {/* Icon gradient background */}
                    <div 
                      className={`absolute inset-0 opacity-20`}
                      style={{
                        background: `radial-gradient(circle, 
                          ${step.color === 'text-blue' ? 'rgba(107, 203, 255, 0.3)' : ''}
                          ${step.color === 'text-green' ? 'rgba(107, 239, 165, 0.3)' : ''}
                          ${step.color === 'text-gold' ? 'rgba(255, 214, 107, 0.3)' : ''}
                          ${step.color === 'text-main' ? 'rgba(242, 242, 242, 0.1)' : ''}
                          30%, 
                          transparent 70%
                        )`
                      }}
                    />
                    <step.icon className={`w-8 h-8 ${step.color} relative z-10`} />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                  >
                    <h3 className="text-xl font-semibold text-main mb-3 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Connection Line (except last card) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gold to-transparent opacity-30" />
                )}

                {/* Enhanced Hover Glow Effect */}
                <div className="absolute inset-0 rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div 
                    className="absolute inset-0 rounded-card blur-xl opacity-30"
                    style={{
                      background: `linear-gradient(135deg, 
                        ${step.color === 'text-blue' ? 'rgba(107, 203, 255, 0.2)' : ''}
                        ${step.color === 'text-green' ? 'rgba(107, 239, 165, 0.2)' : ''}
                        ${step.color === 'text-gold' ? 'rgba(255, 214, 107, 0.2)' : ''}
                        ${step.color === 'text-main' ? 'rgba(242, 242, 242, 0.1)' : ''}
                        0%, 
                        transparent 70%
                      )`
                    }}
                  />
                </div>

                {/* Subtle animated shimmer effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `linear-gradient(45deg, 
                      transparent 30%, 
                      rgba(255, 255, 255, 0.1) 50%, 
                      transparent 70%
                    )`,
                    animation: 'shimmer 2s infinite'
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gold/5 rounded-full blur-xl"
        animate={{
          y: [-10, 10, -10],
          x: [-5, 5, -5],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 bg-green/5 rounded-full blur-xl"
        animate={{
          y: [10, -10, 10],
          x: [5, -5, 5],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
}
