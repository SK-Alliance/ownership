'use client';

import { Home, ArrowLeft, Shield, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-main flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-8">
          {/* 404 Number */}
          <div className="relative">
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-accent-red via-accent-blue to-accent-green bg-clip-text animate-pulse">
              404
            </div>
          </div>

          {/* Logo and Branding */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-elevated">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-main">Auctor</h1>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-main">
              Page Not Found
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              The page you're looking for has vanished into the digital void. 
              It might have been moved, deleted, or never existed in the first place.
            </p>
          </div>

          {/* Error Card */}
          <div className="max-w-md mx-auto">
            <div 
              className="relative p-6 rounded-2xl border border-card-border backdrop-blur-xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.05) 0%, 
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
                    rgba(255, 255, 255, 0.03) 0%, 
                    rgba(255, 255, 255, 0.01) 50%, 
                    transparent 100%
                  )`,
                  backdropFilter: 'blur(10px)'
                }}
              />

              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent-red/10 border border-accent-red/20 flex items-center justify-center">
                  <Search className="w-8 h-8 text-accent-red" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-main mb-2">Lost in the Network</h3>
                  <p className="text-muted text-sm">
                    This digital asset couldn't be verified or located in our provenance network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95 shadow-elevated hover:shadow-glow-green"
            >
              <Home className="w-5 h-5" />
              Back to Home
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rotate-180" />
            </Link>

            <button
              onClick={() => router.back()}
              className="group flex items-center gap-3 px-6 py-3 bg-surface border border-card-border text-main font-medium rounded-lg transition-all duration-200 hover:bg-white/5 hover:border-white/20 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="pt-8">
            <p className="text-sm text-muted">
              If you believe this is an error, please{' '}
              <Link href="/contact" className="text-accent-blue hover:text-accent-blue/80 transition-colors">
                contact support
              </Link>
              {' '}or try searching for what you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
