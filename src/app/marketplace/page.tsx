import React from 'react';

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏕️</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Marketplace</h1>
                    <p className="text-gray-600">Camp Network</p>
                </div>
                
                <div className="mb-6">
                    <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Under Development</h2>
                    <p className="text-gray-500 text-sm">
                        We&apos;re working hard to bring you an amazing marketplace experience. 
                        Check back soon!
                    </p>
                </div>
                
                <div className="text-xs text-gray-400">
                    Coming Soon...
                </div>
            </div>
        </div>
    );
}