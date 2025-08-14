'use client';

import { useState } from 'react';
import { Shield, Menu, X, User, Settings } from 'lucide-react';
import { CampModal, useAuthState } from '@campnetwork/origin/react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authenticated } = useAuthState();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Register Item', href: '/register' },
    { name: 'Marketplace (v2)', href: '/marketplace' }
  ];

  const userLinks = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <nav className="relative z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative rounded-full border border-white/20 overflow-hidden backdrop-blur-xl"
            style={{
              background: `linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 30%, 
                rgba(255, 255, 255, 0.02) 70%,
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
                  rgba(255, 255, 255, 0.3), 
                  transparent
                )`
              }}
            />

            <div className="relative z-10 flex items-center justify-between px-6 py-4">
              {/* Brand Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Auctor</h1>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors font-medium text-sm relative group"
                  >
                    {link.name}
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>

              {/* Desktop Right Side - Connect Button + User Icons */}
              <div className="hidden md:flex items-center gap-4">
                {/* Camp Modal with custom button styling */}
                <div className="camp-modal-container">
                  <CampModal />
                </div>

                {/* User Links - Only show when wallet is connected */}
                {authenticated && (
                  <div className="flex items-center gap-2 ml-2">
                    {userLinks.map((link, index) => {
                      const IconComponent = link.icon;
                      return (
                        <Link
                          key={`user-${index}`}
                          href={link.href}
                          className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 relative group"
                          title={link.name}
                        >
                          <IconComponent className="w-5 h-5" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div
                className="mt-2 rounded-xl border border-white/20 overflow-hidden backdrop-blur-xl"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    rgba(255, 255, 255, 0.05) 50%, 
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
                    <Link
                      key={index}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-white/80 hover:text-white transition-colors font-medium py-2"
                    >
                      {link.name}
                    </Link>
                  ))}

                  {/* User Links - Only show when wallet is connected */}
                  {authenticated && userLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={`mobile-user-${index}`}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 text-white/80 hover:text-white transition-colors font-medium py-2"
                      >
                        <IconComponent className="w-5 h-5" />
                        {link.name}
                      </Link>
                    );
                  })}

                  <div className="pt-4 border-t border-white/10">
                    <div className="camp-modal-container">
                      <CampModal />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
