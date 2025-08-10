'use client';

import { RefreshCw, Home, AlertTriangle, Shield } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-main flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-8">
          {/* Error Icon */}
          <div className="relative flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent-red to-red-600 flex items-center justify-center shadow-elevated animate-pulse">
              <AlertTriangle className="w-12 h-12 text-white" />
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
              Something Went Wrong
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              We encountered an unexpected error while processing your request. 
              Our digital provenance network might be experiencing temporary issues.
            </p>
          </div>

          {/* Error Details Card */}
          <div className="max-w-2xl mx-auto">
            <div 
              className="relative p-6 rounded-2xl border border-card-border backdrop-blur-xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 107, 107, 0.03) 0%, 
                  rgba(255, 107, 107, 0.01) 50%, 
                  transparent 100%
                )`
              }}
            >
              {/* Glass morphism overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.02) 0%, 
                    rgba(255, 255, 255, 0.005) 50%, 
                    transparent 100%
                  )`,
                  backdropFilter: 'blur(10px)'
                }}
              />

              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-semibold text-main mb-2">Error Details</h3>
                <div className="bg-black/20 rounded-lg p-4 border border-accent-red/20">
                  <code className="text-sm text-accent-red font-mono break-all">
                    {error.message || 'An unexpected error occurred'}
                  </code>
                  {error.digest && (
                    <div className="mt-2 pt-2 border-t border-accent-red/10">
                      <span className="text-xs text-muted">Error ID: {error.digest}</span>
                    </div>
                  )}
                </div>
                <p className="text-muted text-sm">
                  This error has been logged and our development team has been notified. 
                  You can try refreshing the page or go back to the homepage.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={reset}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent-blue to-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95 shadow-elevated"
              style={{ boxShadow: '0 4px 20px rgba(107, 203, 255, 0.3)' }}
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>

            <Link
              href="/"
              className="group flex items-center gap-3 px-6 py-3 bg-surface border border-card-border text-main font-medium rounded-lg transition-all duration-200 hover:bg-white/5 hover:border-white/20 hover:scale-105 active:scale-95"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {/* Help Text */}
          <div className="pt-8">
            <p className="text-sm text-muted">
              If this error persists, please{' '}
              <Link href="/contact" className="text-accent-blue hover:text-accent-blue/80 transition-colors">
                contact our support team
              </Link>
              {' '}with the error details above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
