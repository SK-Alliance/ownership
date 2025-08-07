'use client';

import { useState, useEffect } from 'react';
import { Shield, Menu, X, User, Settings } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { createPortal } from 'react-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right
    });
    setIsAvatarOpen(!isAvatarOpen);
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Register Item', href: '/register' },
    { name: 'About', href: '/about' }
  ];

  return (
    <nav className="relative z-50">

      {/* main container begins here */}
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
            {/* Glass morphism shown here */}
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

            {/* highlighting the edges for beautyy */}
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
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-muted hover:text-main hover:text-gold transition-colors duration-300 font-medium text-sm relative group"
                  >
                    {link.name}
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>

              {/* Desktop - Connect Wallet Button or Avatar Dropdown */}
              <div className="hidden md:flex items-center gap-3">
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                onClick={openConnectModal}
                                className="relative px-6 py-2.5 rounded-full border border-gold/30 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-glow-gold"
                                style={{
                                  background: `linear-gradient(135deg, 
                                    rgba(255, 214, 107, 0.1) 0%, 
                                    rgba(255, 214, 107, 0.05) 50%, 
                                    transparent 100%
                                  )`
                                }}
                              >
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
                                  <span className="text-gold font-medium text-sm">Connect Wallet</span>
                                </div>
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
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <button
                                onClick={openChainModal}
                                className="relative px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                              >
                                Wrong network
                              </button>
                            );
                          }

                          return (
                            <button
                              onClick={openAccountModal}
                              className="relative px-4 py-2 rounded-full border border-gold/30 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-glow-gold"
                              style={{
                                background: `linear-gradient(135deg, 
                                  rgba(255, 214, 107, 0.1) 0%, 
                                  rgba(255, 214, 107, 0.05) 50%, 
                                  transparent 100%
                                )`
                              }}
                            >
                              <div className="relative z-10 flex items-center gap-2">
                                <span className="text-gold font-medium text-sm">
                                  {account.displayName}
                                </span>
                                <span className="text-gold/70 text-xs">
                                  {account.displayBalance}
                                </span>
                              </div>
                            </button>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>

                {/* Avatar Dropdown - Only shown when wallet is connected */}
                {isConnected && (
                  <div className="relative">
                    <button
                      onClick={handleAvatarClick}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-gold/80 flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-glow-gold"
                    >
                      <User className="w-5 h-5 text-bg-main" />
                    </button>

                    {/* Avatar Dropdown Menu - Rendered via Portal */}
                    {mounted && isAvatarOpen && createPortal(
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0"
                          style={{
                            zIndex: 999998,
                            backgroundColor: 'transparent'
                          }}
                          onClick={() => setIsAvatarOpen(false)}
                        />
                        
                        {/* Dropdown */}
                        <div
                          className="fixed w-48 rounded-lg border border-main/20 overflow-hidden backdrop-blur-xl shadow-lg"
                          style={{
                            top: `${dropdownPosition.top}px`,
                            right: `${dropdownPosition.right}px`,
                            zIndex: 999999,
                            background: `linear-gradient(135deg, 
                              rgba(255, 255, 255, 0.08) 0%, 
                              rgba(255, 255, 255, 0.03) 50%, 
                              transparent 100%
                            )`
                          }}
                        >
                          <div className="py-2">
                            <Link
                              href="/profile"
                              onClick={() => setIsAvatarOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-main hover:bg-main/10 transition-colors"
                            >
                              <User className="w-4 h-4" />
                              <span>My Profile</span>
                            </Link>
                            <Link
                              href="/settings"
                              onClick={() => setIsAvatarOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-main hover:bg-main/10 transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              <span>Settings</span>
                            </Link>
                          </div>
                        </div>
                      </>,
                      document.body
                    )}
                  </div>
                )}
              </div>

              {/* Mobile - Menu Button only */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 rounded-full border border-main/20 flex items-center justify-center text-muted hover:text-main transition-colors duration-300"
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

                  {/* Mobile Connect Button */}
                  <div className="pt-4 border-t border-main/10">
                    <ConnectButton.Custom>
                      {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                      }) => {
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                          ready &&
                          account &&
                          chain &&
                          (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                        return (
                          <div
                            {...(!ready && {
                              'aria-hidden': true,
                              'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                              },
                            })}
                          >
                            {(() => {
                              if (!connected) {
                                return (
                                  <button
                                    onClick={() => {
                                      openConnectModal();
                                      setIsMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-3 rounded-full border border-gold/30 bg-gold/10 text-gold font-medium text-sm hover:bg-gold/20 transition-colors"
                                  >
                                    Connect Wallet
                                  </button>
                                );
                              }

                              if (chain.unsupported) {
                                return (
                                  <button
                                    onClick={() => {
                                      openChainModal();
                                      setIsMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-3 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                                  >
                                    Wrong network
                                  </button>
                                );
                              }

                              return (
                                <button
                                  onClick={() => {
                                    openAccountModal();
                                    setIsMenuOpen(false);
                                  }}
                                  className="w-full px-4 py-3 rounded-full border border-gold/30 bg-gold/10 text-gold font-medium text-sm hover:bg-gold/20 transition-colors"
                                >
                                  {account.displayName}
                                  {account.displayBalance && (
                                    <span className="block text-xs text-gold/70 mt-1">
                                      {account.displayBalance}
                                    </span>
                                  )}
                                </button>
                              );
                            })()}
                          </div>
                        );
                      }}
                    </ConnectButton.Custom>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-bg-main/20 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}
