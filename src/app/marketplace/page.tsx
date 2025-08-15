import React from 'react';

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-main relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,214,107,0.03),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(107,239,165,0.02),transparent_60%)]" />
            
            <div className="relative flex items-center justify-center min-h-screen">
                <div className="text-center p-8 card-base backdrop-blur-xl border border-main/20 rounded-xl max-w-md relative overflow-hidden">
                    {/* Glass morphism overlay */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            background: `linear-gradient(135deg, 
                                rgba(255, 255, 255, 0.05) 0%, 
                                rgba(255, 255, 255, 0.02) 50%, 
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
                                rgba(255, 214, 107, 0.3), 
                                transparent
                            )`
                        }}
                    />
                    
                    <div className="relative z-10">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gold/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold/30">
                                <span className="text-2xl">🏕️</span>
                            </div>
                            <h1 className="text-3xl font-clash text-main mb-2">Marketplace</h1>
                            <p className="text-muted">Camp Network</p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="animate-spin w-8 h-8 border-4 border-green/60 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <h2 className="text-xl font-semibold text-main mb-2">Under Development</h2>
                            <p className="text-muted text-sm">
                                We&apos;re working hard to bring you an amazing marketplace experience. 
                                Check back soon!
                            </p>
                        </div>
                        
                        <div className="text-xs text-muted/60">
                            Coming Soon...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}