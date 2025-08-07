'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, Users } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection() {
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.2 
      } 
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-main via-bg-main to-bg-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,214,107,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(107,239,165,0.03),transparent_50%)]" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,214,107,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,214,107,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative container mx-auto px-6 pt-20 pb-32">
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-surface border border-main rounded-full text-sm text-muted"
            variants={childVariants}
          >
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            Built on Camp Network 🏕️
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-white text-5xl md:text-7xl font-clash mb-6 bg-gradient-to-br from-text-main via-text-main to-text-muted bg-clip-text text-transparent leading-tight"
            variants={childVariants}
          >
            Own it.{' '}
            <span className="text-gold">
            Prove it. {' '}
            </span>
            <span className="text-white" style={{ textShadow: '0 0 20px var(--accent-gold), 0 0 40px var(--accent-gold)' }}>
              Build it.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            className="text-xl md:text-2xl text-muted mb-4 max-w-3xl mx-auto leading-relaxed"
            variants={childVariants}
          >
            Build a tamperproof trail for your real world assets.
          </motion.p>

          <motion.p 
            className="text-lg md:text-xl text-muted mb-12 max-w-2xl mx-auto"
            variants={childVariants}
          >
            Co-own them, resell them and stay verified.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            variants={childVariants}
          >
            <motion.button
              className="btn-primary text-lg px-8 py-4 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              className="btn-secondary text-lg px-8 py-4 group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsVideoHovered(true)}
              onHoverEnd={() => setIsVideoHovered(false)}
            >
              <Play className={`w-5 h-5 mr-2 transition-all duration-300 ${isVideoHovered ? 'text-gold' : ''}`} />
              See How it Works
            </motion.button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={heroVariants}
          >
            <motion.div 
              className="card-base text-center p-6 group hover:border-gold transition-all duration-300"
              variants={featureVariants}
              whileHover={{ y: -8 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                <Shield className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-main">Tamperproof</h3>
              <p className="text-sm text-muted">Immutable records powered by blockchain technology</p>
            </motion.div>

            <motion.div 
              className="card-base text-center p-6 group hover:border-green transition-all duration-300"
              variants={featureVariants}
              whileHover={{ y: -8 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center group-hover:bg-green/10 transition-colors">
                <Zap className="w-6 h-6 text-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-main">Lightning Fast</h3>
              <p className="text-sm text-muted">Register and verify assets in seconds, not days</p>
            </motion.div>

            <motion.div 
              className="card-base text-center p-6 group hover:border-blue transition-all duration-300"
              variants={featureVariants}
              whileHover={{ y: -8 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center group-hover:bg-blue/10 transition-colors">
                <Users className="w-6 h-6 text-blue" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-main">Co-ownership</h3>
              <p className="text-sm text-muted">Share ownership and trade assets seamlessly</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gold/5 rounded-full blur-xl"
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-green/5 rounded-full blur-xl"
          animate={{
            y: [20, -20, 20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  );
}
