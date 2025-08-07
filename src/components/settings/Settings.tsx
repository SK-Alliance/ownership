'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Zap,
} from 'lucide-react';

// Import clean components
import { SettingsSidebar } from './SettingsSidebar';
import { GeneralSettings } from './GeneralSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';
import { PlatformSettings } from './PlatformSettings';
import { SaveToast } from './SaveToast';

// Types
interface NotificationSettingsType {
  itemVerified: boolean;
  itemRejected: boolean;
  coOwnerAdded: boolean;
  monthlyReport: boolean;
  securityAlerts: boolean;
  systemUpdates: boolean;
}

interface GeneralSettingsType {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
}

interface SecuritySettingsType {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  deviceTrust: boolean;
}

interface PlatformSettingsType {
  autoVerification: boolean;
  publicProfile: boolean;
  searchableProfile: boolean;
  allowCoOwners: boolean;
  maxCoOwners: number;
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Settings state
  const [notifications, setNotifications] = useState<NotificationSettingsType>({
    itemVerified: true,
    itemRejected: true,
    coOwnerAdded: true,
    monthlyReport: false,
    securityAlerts: true,
    systemUpdates: false,
  });

  const [general, setGeneral] = useState<GeneralSettingsType>({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
  });

  const [security, setSecurity] = useState<SecuritySettingsType>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    deviceTrust: false,
  });

  const [platform, setPlatform] = useState<PlatformSettingsType>({
    autoVerification: false,
    publicProfile: true,
    searchableProfile: false,
    allowCoOwners: true,
    maxCoOwners: 5,
  });

  // Configuration
  const sections = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'platform', name: 'Platform', icon: Zap },
  ];

  // Handlers
  const handleSaveSettings = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleGeneralChange = (changes: Partial<GeneralSettingsType>) => {
    setGeneral(prev => ({ ...prev, ...changes }));
  };

  const handleNotificationChange = (changes: Partial<NotificationSettingsType>) => {
    setNotifications(prev => ({ ...prev, ...changes }));
  };

  const handleSecurityChange = (changes: Partial<SecuritySettingsType>) => {
    setSecurity(prev => ({ ...prev, ...changes }));
  };

  const handlePlatformChange = (changes: Partial<PlatformSettingsType>) => {
    setPlatform(prev => ({ ...prev, ...changes }));
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <GeneralSettings 
            settings={general} 
            onSettingsChange={handleGeneralChange} 
          />
        );
      case 'notifications':
        return (
          <NotificationSettings 
            settings={notifications} 
            onSettingsChange={handleNotificationChange} 
          />
        );
      case 'security':
        return (
          <SecuritySettings 
            settings={security} 
            onSettingsChange={handleSecurityChange} 
          />
        );
      case 'platform':
        return (
          <PlatformSettings 
            settings={platform} 
            onSettingsChange={handlePlatformChange} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-4xl font-clash text-main mb-2">Settings</h1>
            <p className="text-muted">Configure your platform preferences and security options</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-1"
            >
              <SettingsSidebar
                sections={sections}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-3"
            >
              {renderContent()}

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-green text-bg-main hover:bg-green/90 px-6 py-2"
                >
                  Save Settings
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Save Toast */}
          <SaveToast show={showSavedToast} />
        </div>
      </div>
    </div>
  );
}
