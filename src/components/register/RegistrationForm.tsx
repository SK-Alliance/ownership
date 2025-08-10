'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Upload, Image as ImageIcon, Eye, Download, X, Sparkles } from 'lucide-react';
import { NFTImageGenerator } from '@/lib/nft-image-generator';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    serialNumber: '',
    est_value: 0,
    billFile: null as File | null,
    idFile: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nftPreview, setNftPreview] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isGeneratingNFT, setIsGeneratingNFT] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [finalNFTImage, setFinalNFTImage] = useState<string | null>(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const { isAuthenticated, address, isConnected, user } = useWalletConnection();

  // Load saved image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem('registration_item_image');
    const savedNFT = NFTImageGenerator.getFromLocalStorage();
    
    if (savedImage) {
      setImagePreview(savedImage);
    }
    if (savedNFT) {
      setNftPreview(savedNFT);
    }
  }, []);

  // Fetch user profile for owner name
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated || !address) return;
      
      try {
        console.log(`Fetching profile for address: ${address}`);
        const response = await fetch(`/api/profile/${address}`);
        if (response.ok) {
          const profile = await response.json();
          console.log('✅ Profile fetched:', profile);
          setUserProfile(profile);
        } else {
          console.log('Profile not found, using fallback');
          // Create a fallback profile if API fails
          setUserProfile({
            fullName: user?.display_name || 'Camp User',
            username: 'camp_user',
            walletAddress: address
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Create a fallback profile
        setUserProfile({
          fullName: user?.display_name || 'Camp User',
          username: 'camp_user',
          walletAddress: address
        });
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, address, user]);

  // Generate NFT preview when form data changes
  useEffect(() => {
    const generateNFTPreview = async () => {
      if (!formData.title || !imagePreview) return;
      
      try {
        setIsGeneratingNFT(true);
        // Use real profile data or fallback
        const ownerName = userProfile?.fullName || userProfile?.username || user?.display_name || 'Camp User';
        
        const nftImageDataURL = await NFTImageGenerator.generateNFTImage({
          itemImage: imagePreview,
          itemName: formData.title,
          ownerName: ownerName
        });
        
        setNftPreview(nftImageDataURL);
        NFTImageGenerator.saveToLocalStorage(nftImageDataURL);
      } catch (error) {
        console.error('Error generating NFT preview:', error);
      } finally {
        setIsGeneratingNFT(false);
      }
    };
    
    // Debounce the generation to avoid too many calls
    const timeoutId = setTimeout(generateNFTPreview, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.title, imagePreview, userProfile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure required fields are filled
    if (!formData.title || !formData.category || !formData.brand || !formData.serialNumber || !imagePreview) {
      alert('Please fill all required fields');
      return;
    }

    try {
      // Generate final NFT image before showing modal
      if (imagePreview && formData.title) {
        setIsGeneratingNFT(true);
        setShowLoadingModal(true); // Show loading modal
        
        // Use real profile data or fallback
        const ownerName = userProfile?.fullName || userProfile?.username || user?.display_name || 'Camp User';
        console.log(`🎨 Generating NFT for owner: ${ownerName}`);
        
        const finalNFTImageData = await NFTImageGenerator.generateNFTImage({
          itemImage: imagePreview,
          itemName: formData.title,
          ownerName: ownerName
        });
        
        // Store the final NFT image for minting later
        NFTImageGenerator.saveToLocalStorage(finalNFTImageData, 'final_nft_image_for_minting');
        setFinalNFTImage(finalNFTImageData);
        setIsGeneratingNFT(false);
        setShowLoadingModal(false); // Hide loading modal
        
        // Show the NFT modal
        setShowNFTModal(true);
        
        console.log('Final NFT image generated and ready for preview');
      }
    } catch (error) {
      console.error('Error generating NFT:', error);
      setIsGeneratingNFT(false);
      setShowLoadingModal(false); // Hide loading modal on error
    }
  };

  const handleCloseModal = () => {
    setShowNFTModal(false);
    setFinalNFTImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Handle item image - store in localStorage as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      localStorage.setItem('registration_item_image', base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setNftPreview(null);
    localStorage.removeItem('registration_item_image');
    NFTImageGenerator.clearFromLocalStorage();
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
                    Item Photo *
                  </label>
                  <div className="space-y-4">
                    {!imagePreview ? (
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/png,image/jpeg,image/jpg"
                          className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gold file:text-main hover:file:bg-gold/90 focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                          required
                        />
                        <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="w-full h-48 bg-surface/30 border border-main/20 rounded-button overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Item preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 w-8 h-8 bg-red/20 hover:bg-red/30 text-red rounded-full flex items-center justify-center transition-colors"
                        >
                          ×
                        </button>
                        <div className="mt-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/png,image/jpeg,image/jpg';
                              input.onchange = (e) => handleFileChange(e as any);
                              input.click();
                            }}
                            className="text-gold hover:text-gold/80 text-sm underline"
                          >
                            Change Photo
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="text-muted text-sm">
                      Upload a recent, clear photo of your item (PNG, JPEG only - Max 10MB)
                    </p>
                  </div>
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFormData(prev => ({ ...prev, billFile: file || null }));
                      }}
                      accept="image/*,.pdf"
                      className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gold file:text-main hover:file:bg-gold/90 focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFormData(prev => ({ ...prev, idFile: file || null }));
                      }}
                      accept="image/*,.pdf"
                      className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gold file:text-main hover:file:bg-gold/90 focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                  </div>
                  <p className="text-muted text-sm mt-2">
                    Upload government ID for verification (JPG, PNG, PDF - Max 10MB)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!formData.title || !formData.category || !formData.brand || !formData.serialNumber || !imagePreview || isGeneratingNFT}
                  className="w-full btn-primary py-4 text-lg font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Shield className="w-5 h-5" />
                    {isGeneratingNFT ? 'Generating NFT Preview...' : 'Register Item'}
                  </div>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Generation Loading Modal */}
      {showLoadingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full mx-auto">
            <div className="card-base backdrop-blur-xl border border-main/20 relative overflow-hidden">
              {/* Glass morphism overlay */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.08) 0%, 
                    rgba(255, 255, 255, 0.03) 50%, 
                    transparent 100%
                  )`,
                  backdropFilter: 'blur(20px)'
                }}
              />

              {/* Animated top edge highlight */}
              <div
                className="absolute top-0 left-4 right-4 h-px animate-pulse"
                style={{
                  background: `linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 214, 107, 0.6), 
                    transparent
                  )`
                }}
              />

              <div className="relative z-10 p-8 text-center">
                {/* Animated Sparkles Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-gold animate-spin" />
                  </div>
                </div>

                {/* Main Heading */}
                <h2 className="text-2xl font-clash text-main mb-3">
                  Generating Your NFT
                </h2>

                {/* Description */}
                <p className="text-muted mb-6 leading-relaxed">
                  Creating your unique digital ownership...
                  <br />
                  <span className="text-sm text-gold">This may take a few seconds</span>
                </p>

                {/* Progress Steps */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green animate-pulse"></div>
                    <span className="text-muted">Processing item details</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <span className="text-muted">Compositing NFT image</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <span className="text-muted">Finalizing NFT metadata</span>
                  </div>
                </div>

                {/* Loading Bar */}
                <div className="w-full bg-surface/30 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gold via-green to-gold rounded-full animate-pulse"
                    style={{
                      width: '100%',
                      background: `linear-gradient(90deg, 
                        rgba(255, 214, 107, 0.8) 0%, 
                        rgba(107, 239, 165, 0.8) 50%, 
                        rgba(255, 214, 107, 0.8) 100%
                      )`
                    }}
                  ></div>
                </div>

                {/* Footer Note */}
                <p className="text-xs text-muted/70 mt-4">
                  Please don't close this window during generation
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NFT Preview Modal */}
      {showNFTModal && finalNFTImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full mx-auto">
            <div className="card-base backdrop-blur-xl border border-main/20 relative overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Glass morphism overlay */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.08) 0%, 
                    rgba(255, 255, 255, 0.03) 50%, 
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
                    rgba(255, 214, 107, 0.4), 
                    transparent
                  )`
                }}
              />

              <div className="relative z-10 p-8">
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-main/20 hover:bg-main/40 flex items-center justify-center transition-colors text-muted hover:text-main"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-6 h-6 text-gold" />
                    <h2 className="text-2xl font-clash text-main">Your Ownership Proof</h2>
                  </div>
                  <p className="text-muted">
                    Your claimable NFT will look like this
                  </p>
                </div>

                {/* NFT Preview */}
                <div className="text-center mb-8">
                  <div className="inline-block p-4 rounded-card border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                    <img
                      src={finalNFTImage}
                      alt="Final NFT Certificate"
                      className="w-full max-w-xs rounded-button shadow-lg"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="text-center mb-8 space-y-3">
                  <p className="text-main font-medium">
                    🎉 Your digital ownership proof is ready!
                  </p>
                  <p className="text-muted text-sm">
                    This NFT will serve as tamper-proof ownership verification for your <span className="text-gold font-medium">{formData.title}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="w-full btn-primary py-4 text-lg font-medium relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      Close Preview
                    </div>
                    
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
