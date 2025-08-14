'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuthState, useAuth, useProvider } from '@campnetwork/origin/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Wallet, Edit3, Save, X, AlertCircle } from 'lucide-react';

interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  walletAddress: string;
  xpPoints: number;
}

export default function Profile() {
  const { authenticated } = useAuthState();
  const auth = useAuth();
  const { provider } = useProvider();
  
  // Debug: Log all available data to see what we can access
  console.log('Auth object:', auth);
  console.log('Provider object:', provider);
  
  // Enhanced address detection
  const [address, setAddress] = useState<string | null>(null);
  
  useEffect(() => {
    const getWalletAddress = async () => {
      if (!authenticated) {
        setAddress(null);
        return;
      }
      
      try {
        // Try multiple approaches to get the wallet address
        let walletAddress = null;
        
        // Method 3: Try window.ethereum as fallback
        if (!walletAddress && typeof window !== 'undefined' && window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              walletAddress = accounts[0];
            }
          } catch (error) {
            console.log('Window ethereum address retrieval failed:', error);
          }
        }
        
        console.log('Detected wallet address:', walletAddress);
        setAddress(walletAddress || '0x1234567890123456789012345678901234567890'); // Fallback to test address
        
      } catch (error) {
        console.error('Error getting wallet address:', error);
        setAddress('0x1234567890123456789012345678901234567890'); // Fallback to test address
      }
    };
    
    getWalletAddress();
  }, [authenticated, auth, provider]);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const [profileData, setProfileData] = useState<UserProfile>({
    username: '',
    fullName: '',
    email: '',
    walletAddress: address || '',
    xpPoints: 0,
  });

  const [editForm, setEditForm] = useState<UserProfile>({ ...profileData });

  // Update wallet address when it changes
  useEffect(() => {
    if (address) {
      setProfileData(prev => ({ ...prev, walletAddress: address }));
      setEditForm(prev => ({ ...prev, walletAddress: address }));
    }
  }, [address]);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!address) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/profile/${address}`);
        
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          setEditForm(data);
          
          // Check if profile has meaningful data (not just wallet address)
          const hasProfileData = data.username || data.fullName || data.email;
          
          if (!hasProfileData) {
            // Profile exists but incomplete - treat as new user
            setIsNewUser(true);
            setIsEditing(true);
          }
          // For existing users with complete profiles, just show the profile normally
        } else if (response.status === 404) {
          // Profile doesn't exist - new user
          setIsNewUser(true);
          setIsEditing(true);
        } else {
          throw new Error('Failed to load profile');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile data');
        setIsNewUser(true);
        setIsEditing(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [address, router]);

  const handleSaveProfile = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editForm,
          walletAddress: address,
        }),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save profile');
        } catch {
          // If we can't parse the error response, show a generic network error
          throw new Error('Network error - please check your connection and try again');
        }
      }

      const updatedProfile = await response.json();
      setProfileData(updatedProfile);
      setEditForm(updatedProfile);
      setIsEditing(false);
      setIsNewUser(false);
      setSuccess('Profile saved successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard after successful profile creation/update
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isNewUser) {
      // For new users, don't allow canceling - they must complete profile
      return;
    }
    setEditForm({ ...profileData });
    setIsEditing(false);
    setError(null);
  };

  if (isLoading && !address) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,214,107,0.03),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(107,239,165,0.02),transparent_60%)]" />
      
      <div className="relative container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-clash text-main mb-4">
              {isNewUser ? 'Complete Your Profile' : 'Profile'}
            </h1>
            <p className="text-muted text-lg">
              {isNewUser 
                ? 'Welcome to the platform! To get started, please complete your profile information below.'
                : 'Manage your personal information and account details'
              }
            </p>
          </div>

          {/* New User Alert */}
          {isNewUser && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 p-6 bg-gradient-to-r from-gold/10 to-amber-500/10 border border-gold/30 rounded-card"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-main mb-2">Profile Setup Required</h3>
                  <p className="text-muted">
                    In order to use this platform effectively, you must complete your profile. 
                    This helps us personalize your experience and enables all platform features.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
      

          {/* Profile Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="card-base backdrop-blur-xl border border-main/20 relative overflow-hidden"
          >
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
              {/* Header with Edit Button */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-clash text-main">Personal Information</h2>
                {!isNewUser && (
                  <button
                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-button border border-main/20 text-main hover:bg-main/10 transition-colors"
                    disabled={isLoading}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green/10 to-emerald-500/10 border border-green/20 text-green rounded-card">
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red/10 to-red-500/10 border border-red/20 text-red rounded-card">
                  {error}
                </div>
              )}

              {/* Profile Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-main font-medium mb-3">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                      placeholder="Enter your username"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface/30 border border-main/10 rounded-button">
                      <User className="w-5 h-5 text-muted" />
                      <span className="text-main">{profileData.username || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface/30 border border-main/10 rounded-button">
                      <User className="w-5 h-5 text-muted" />
                      <span className="text-main">{profileData.fullName || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface/50 border border-main/20 rounded-button text-main placeholder-muted focus:ring-2 focus:ring-gold focus:border-gold transition-all backdrop-blur-sm"
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface/30 border border-main/10 rounded-button">
                      <Mail className="w-5 h-5 text-muted" />
                      <span className="text-main">{profileData.email || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    Wallet Address
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-surface/30 border border-main/10 rounded-button">
                    <Wallet className="w-5 h-5 text-muted" />
                    <span className="text-main font-mono text-sm">
                      {profileData.walletAddress || 'Not connected'}
                    </span>
                  </div>
                  <p className="text-muted text-sm mt-2">
                    This is automatically set from your connected wallet
                  </p>
                </div>

                <div>
                  <label className="block text-main font-medium mb-3">
                    Experience Points (XP)
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gold/5 to-amber-500/5 border border-gold/20 rounded-button">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-gold to-amber-500 flex items-center justify-center">
                      <span className="text-black text-xs font-bold">XP</span>
                    </div>
                    <span className="text-main font-semibold">
                      {profileData.xpPoints.toLocaleString()} XP
                    </span>
                  </div>
                  <p className="text-muted text-sm mt-2">
                    Earn XP by registering items and participating in the network
                  </p>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="mt-8 pt-6 border-t border-main/10">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="w-full btn-primary py-4 text-lg font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Save className="w-5 h-5" />
                      {isLoading ? 'Saving...' : isNewUser ? 'Complete Profile & Continue' : 'Save Profile'}
                    </div>
                    
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  
                  {isNewUser && (
                    <p className="text-muted text-sm mt-3 text-center">
                      After completing your profile, you will be redirected to your dashboard
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
