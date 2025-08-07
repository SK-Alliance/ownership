'use client';

import { useState } from 'react';
import { Shield, Menu, X, Wallet } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' }
  ];

  return (
    <nav className="relative z-50">
      {/* Main Navbar Container */}
      <div className="container mx-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative rounded-full border border-main/20 overflow-hidden backdrop-blur-xl"
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

            {/* Top edge highlight */}
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

            <div className="relative z-10 flex items-center justify-between px-6 py-4">
              {/* Brand Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-gold/80 flex items-center justify-center shadow-glow-gold">
                  <Shield className="w-5 h-5 text-bg-main" />
                </div>
                <div>
                  <h1 className="text-xl font-clash text-main">Auctor</h1>
                  <p className="text-xs text-muted -mt-1">Built on Camp</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-muted hover:text-main hover:text-gold transition-colors duration-300 font-medium text-sm relative group"
                  >
                    {link.name}
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                  </a>
                ))}
              </div>

              {/* Connect Wallet Button & Mobile Menu */}
              <div className="flex items-center gap-4">
                {/* Connect Wallet Button */}
                <button
                  className="relative px-6 py-2.5 rounded-full border border-gold/30 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-glow-gold"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(255, 214, 107, 0.1) 0%, 
                      rgba(255, 214, 107, 0.05) 50%, 
                      transparent 100%
                    )`
                  }}
                >
                  {/* Button glass overlay */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(255, 214, 107, 0.15) 0%, 
                        rgba(255, 214, 107, 0.08) 50%, 
                        transparent 100%
                      )`
                    }}
                  />
                  
                  <div className="relative z-10 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gold" />
                    <span className="text-gold font-medium text-sm">Connect Wallet</span>
                  </div>

                  {/* Button highlight edge */}
                  <div 
                    className="absolute top-0 left-2 right-2 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, 
                        transparent, 
                        rgba(255, 214, 107, 0.4), 
                        transparent
                      )`
                    }}
                  />
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden w-10 h-10 rounded-full border border-main/20 flex items-center justify-center text-muted hover:text-main transition-colors duration-300"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.05) 0%, 
                      rgba(255, 255, 255, 0.02) 50%, 
                      transparent 100%
                    )`
                  }}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div 
                className="mt-2 rounded-card border border-main/20 overflow-hidden backdrop-blur-xl"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.06) 0%, 
                    rgba(255, 255, 255, 0.02) 50%, 
                    transparent 100%
                  )`
                }}
              >
                {/* Glass morphism overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.08) 0%, 
                      rgba(255, 255, 255, 0.03) 50%, 
                      transparent 100%
                    )`,
                    backdropFilter: 'blur(15px)'
                  }}
                />

                <div className="relative z-10 p-6 space-y-4">
                  {navLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-muted hover:text-main transition-colors duration-300 font-medium py-2"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-bg-main/20 backdrop-blur-sm -z-10 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}
