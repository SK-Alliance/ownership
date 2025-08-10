'use client';

import React, { useState } from 'react';
import { useItemRegistration } from '@/hooks/useItemRegistration';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { RegisterItemRequest } from '@/types/api';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, Upload, CheckCircle, AlertCircle, Star } from 'lucide-react';

export default function RegistrationForm() {
  const [formData, setFormData] = useState<RegisterItemRequest>({
    title: '',
    category: '',
    brand: '',
    serialNumber: '',
    est_value: 0,
    billFile: undefined,
    idFile: undefined,
  });

  const { isLoading, error, success, registerItem, reset } = useItemRegistration();
  const { isAuthenticated } = useWalletConnection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      return;
    }

    const result = await registerItem(formData);
    if (result?.success) {
      // Reset form on success
      setFormData({
        title: '',
        category: '',
        brand: '',
        serialNumber: '',
        est_value: 0,
        billFile: undefined,
        idFile: undefined,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'billFile' | 'idFile') => {
    const file = e.target.files?.[0];
    setFormData(prev => ({ ...prev, [type]: file }));
  };

  return (
    <div className="min-h-screen bg-main relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,214,107,0.03),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(107,239,165,0.02),transparent_60%)]" />
      
      <div className="relative container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-clash text-main mb-4">Register New Item</h1>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Create tamperproof ownership records for your valuable items
            </p>
          </div>

          {/* Main Form Card */}
          <div className="card-base backdrop-blur-xl border border-main/20 relative overflow-hidden">
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
              {!isAuthenticated && (
                <div className="mb-8 p-6 bg-gradient-to-r from-gold/10 to-orange-500/10 border border-gold/20 text-gold rounded-card">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">Wallet Connection Required</p>
                  </div>
                  <p className="text-gold/80 mb-4">Connect your wallet to register items and create ownership records</p>
                  <ConnectButton />
                </div>
              )}
              
              {success && (
                <div className="mb-8 p-6 bg-gradient-to-r from-green/10 to-emerald-500/10 border border-green/20 text-green rounded-card">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-medium">Registration Successful!</p>
                  </div>
                  <p className="text-green/80 mb-4">Your item has been submitted for verification. You will earn 100 XP once approved!</p>
                  <button
                    onClick={reset}
                    className="text-green hover:text-green/80 underline font-medium"
                  >
                    Register another item
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-8 p-6 bg-gradient-to-r from-red/10 to-red-500/10 border border-red/20 text-red rounded-card">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">Registration Failed</p>
                  </div>
                  <p className="text-red/80 mb-4">{error}</p>
                  <button
                    onClick={reset}
                    className="text-red hover:text-red/80 underline font-medium"
                  >
                    Try again
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-main font-medium mb-3">
                    Item Title/Model *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                    placeholder="e.g., iPhone 14 Pro, MacBook Air M2"
                    required
                    disabled={!isAuthenticated}
                  />
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                    required
                    disabled={!isAuthenticated}
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="art">Art & Collectibles</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    Brand/Manufacturer *
                  </label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                    placeholder="e.g., Apple, Samsung, Toyota, Rolex"
                    required
                    disabled={!isAuthenticated}
                  />
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                    placeholder="e.g., ABC123456789, IMEI, VIN, Serial Code"
                    required
                    disabled={!isAuthenticated}
                  />
                  <p className="text-muted text-sm mt-2">
                    Serial numbers are required for unique item identification and verification
                  </p>
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    Estimated Value (USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.est_value || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      est_value: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                    placeholder="1000.00 (optional)"
                    disabled={!isAuthenticated}
                  />
                  <p className="text-muted text-sm mt-2">
                    Optional field to help with insurance and verification purposes
                  </p>
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    Bill/Receipt (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'billFile')}
                      accept="image/*,.pdf"
                      className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gold file:text-main hover:file:bg-gold/90 focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                      disabled={!isAuthenticated}
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                  </div>
                  <p className="text-muted text-sm mt-2">
                    Upload proof of purchase (JPG, PNG, PDF - Max 10MB)
                  </p>
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    ID Document (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'idFile')}
                      accept="image/*,.pdf"
                      className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gold file:text-main hover:file:bg-gold/90 focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                      disabled={!isAuthenticated}
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                  </div>
                  <p className="text-muted text-sm mt-2">
                    Upload government ID for verification (JPG, PNG, PDF - Max 10MB)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isAuthenticated || !formData.title || !formData.category || !formData.brand || !formData.serialNumber}
                  className="w-full btn-primary py-4 text-lg font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Shield className="w-5 h-5" />
                    {isLoading ? 'Registering Item...' : 'Register Item'}
                  </div>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </form>

              {/* How it Works Section */}
              <div className="mt-12 p-6 rounded-card border border-blue/20 bg-gradient-to-br from-blue/5 to-transparent relative overflow-hidden">
                {/* Background gradient */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(107, 203, 255, 0.1) 0%, 
                      transparent 70%
                    )`
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-5 h-5 text-blue" />
                    <h3 className="font-medium text-blue text-lg">How Registration Works</h3>
                  </div>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3 text-muted">
                      <span className="w-6 h-6 rounded-full bg-blue/20 text-blue text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <span>Fill out item details with accurate information</span>
                    </li>
                    <li className="flex items-start gap-3 text-muted">
                      <span className="w-6 h-6 rounded-full bg-blue/20 text-blue text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <span>Upload supporting documents (optional but increases trust score)</span>
                    </li>
                    <li className="flex items-start gap-3 text-muted">
                      <span className="w-6 h-6 rounded-full bg-blue/20 text-blue text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <span>Submit for community verification and review</span>
                    </li>
                    <li className="flex items-start gap-3 text-muted">
                      <span className="w-6 h-6 rounded-full bg-green/20 text-green text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                      <span className="text-green">Earn 100 XP once verified and approved</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
