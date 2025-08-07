'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dummyDashboardData, getUserTier, getTierColor } from '@/data/dashboard';
import { 
  User, 
  Mail, 
  Wallet, 
  Shield, 
  Settings, 
  Download, 
  Trash2, 
  AlertTriangle,
  Edit3,
  Eye,
  EyeOff,
  Calendar,
  BarChart3
} from 'lucide-react';

interface PrivacySettings {
  autoDeleteProofs: number; // days
  analyticsOptIn: boolean;
}

interface ProfileData {
  displayName: string;
  email: string;
  ensName?: string;
  totalRegisteredItems: number;
  monthlyCreditsUsed: number;
  totalCredits: number;
  privacy: PrivacySettings;
}

export default function Profile() {
  const { address, isConnected } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Profile data - in real app, this would come from API
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: 'Anonymous User',
    email: '',
    ensName: undefined,
    totalRegisteredItems: dummyDashboardData.items.length,
    monthlyCreditsUsed: dummyDashboardData.user.listingCredits.used,
    totalCredits: dummyDashboardData.user.listingCredits.total,
    privacy: {
      autoDeleteProofs: 90,
      analyticsOptIn: true,
    }
  });

  const [editForm, setEditForm] = useState({
    displayName: profileData.displayName,
    email: profileData.email,
  });

  const userXP = dummyDashboardData.user.totalXP;
  const userTier = getUserTier(userXP);

  const handleSaveProfile = () => {
    setProfileData(prev => ({
      ...prev,
      displayName: editForm.displayName,
      email: editForm.email,
    }));
    setIsEditing(false);
  };

  const handlePrivacyChange = (field: keyof PrivacySettings, value: any) => {
    setProfileData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value,
      }
    }));
  };

  const handleDownloadData = () => {
    // In real app, this would trigger data export
    console.log('Downloading user data...');
  };

  const handleDeleteProofs = () => {
    // In real app, this would delete stored proofs
    console.log('Deleting stored proofs...');
  };

  const handleDeleteAccount = () => {
    // In real app, this would delete the account
    console.log('Deleting account...');
    setShowDeleteConfirm(false);
  };

  const StatCard = ({ icon: Icon, label, value, color = 'text-main' }: {
    icon: any;
    label: string;
    value: string | number;
    color?: string;
  }) => (
    <div className="relative rounded-lg border border-main/20 overflow-hidden backdrop-blur-xl p-4">
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.06) 0%, 
            rgba(255, 255, 255, 0.02) 50%, 
            transparent 100%
          )`
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <span className="text-sm text-muted">{label}</span>
        </div>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-4xl font-clash text-main mb-2">Profile</h1>
            <p className="text-muted">Manage your account settings and preferences</p>
          </motion.div>

          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="relative rounded-lg border border-main/20 overflow-hidden backdrop-blur-xl p-6 mb-8"
          >
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.06) 0%, 
                  rgba(255, 255, 255, 0.02) 50%, 
                  transparent 100%
                )`
              }}
            />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gold to-gold/80 flex items-center justify-center">
                    <User className="w-8 h-8 text-bg-main" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-main mb-1">{profileData.displayName}</h2>
                    <Badge className={`${getTierColor(userTier)} text-white border-0 mb-2`}>
                      {userTier}
                    </Badge>
                    <p className="text-sm text-muted">Total XP: {userXP}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-main border-main/20 hover:bg-main/10"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-main mb-2">Display Name</label>
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main focus:outline-none focus:border-main/40"
                      placeholder="Enter display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-main mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main focus:outline-none focus:border-main/40"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button onClick={handleSaveProfile} className="bg-gold text-bg-main hover:bg-gold/90">
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted" />
                    <div>
                      <p className="text-xs text-muted">Email</p>
                      <p className="text-main">{profileData.email || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wallet className="w-4 h-4 text-muted" />
                    <div>
                      <p className="text-xs text-muted">Wallet</p>
                      <p className="text-main font-mono text-sm">
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted" />
                    <div>
                      <p className="text-xs text-muted">ENS</p>
                      <p className="text-main">{profileData.ensName || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <StatCard
              icon={BarChart3}
              label="Total XP"
              value={userXP}
              color="text-gold"
            />
            <StatCard
              icon={Calendar}
              label="Monthly Credits"
              value={`${profileData.monthlyCreditsUsed}/${profileData.totalCredits}`}
              color="text-main"
            />
            <StatCard
              icon={Shield}
              label="Registered Items"
              value={profileData.totalRegisteredItems}
              color="text-green"
            />
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="relative rounded-lg border border-main/20 overflow-hidden backdrop-blur-xl p-6 mb-8"
          >
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.06) 0%, 
                  rgba(255, 255, 255, 0.02) 50%, 
                  transparent 100%
                )`
              }}
            />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-main mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Privacy Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-main font-medium">Auto-delete proofs</p>
                    <p className="text-sm text-muted">Automatically delete stored proofs after specified days</p>
                  </div>
                  <select
                    value={profileData.privacy.autoDeleteProofs}
                    onChange={(e) => handlePrivacyChange('autoDeleteProofs', parseInt(e.target.value))}
                    className="px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main focus:outline-none focus:border-main/40"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year</option>
                    <option value={-1}>Never</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-main font-medium">Analytics opt-in</p>
                    <p className="text-sm text-muted">Help improve the platform by sharing anonymous usage data</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange('analyticsOptIn', !profileData.privacy.analyticsOptIn)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      profileData.privacy.analyticsOptIn ? 'bg-gold' : 'bg-main/20'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        profileData.privacy.analyticsOptIn ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="relative rounded-lg border border-main/20 overflow-hidden backdrop-blur-xl p-6 mb-8"
          >
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.06) 0%, 
                  rgba(255, 255, 255, 0.02) 50%, 
                  transparent 100%
                )`
              }}
            />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-main mb-4">Data Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleDownloadData}
                  className="text-main border-main/20 hover:bg-main/10 justify-start"
                >
                  <Download className="w-4 h-4" />
                  Download My Data
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDeleteProofs}
                  className="text-main border-main/20 hover:bg-main/10 justify-start"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Stored Proofs
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            className="relative rounded-lg border border-red-500/30 overflow-hidden backdrop-blur-xl p-6"
          >
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(239, 68, 68, 0.06) 0%, 
                  rgba(239, 68, 68, 0.02) 50%, 
                  transparent 100%
                )`
              }}
            />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-main font-medium">Delete Account</p>
                  <p className="text-sm text-muted">Permanently delete your account and all associated data</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  size="sm"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-bg-main border border-main/20 rounded-lg p-6 max-w-md w-full"
              >
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-main mb-2">Delete Account</h3>
                  <p className="text-muted mb-6">
                    This action cannot be undone. Your account and all associated data will be permanently deleted.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 text-main border-main/20 hover:bg-main/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="flex-1"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
