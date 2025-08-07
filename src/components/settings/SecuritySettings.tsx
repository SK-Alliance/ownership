import React from 'react';
import { Shield } from 'lucide-react';
import { SettingCard } from './SettingCard';
import { Toggle } from './Toggle';

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  deviceTrust: boolean;
}

interface SecuritySettingsProps {
  settings: SecuritySettings;
  onSettingsChange: (settings: Partial<SecuritySettings>) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ 
  settings, 
  onSettingsChange 
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-main flex items-center gap-2">
      <Shield className="w-6 h-6" />
      Security Settings
    </h2>

    <SettingCard
      title="Two-Factor Authentication"
      description="Add an extra layer of security to your account"
    >
      <Toggle
        checked={settings.twoFactorAuth}
        onChange={() => onSettingsChange({ twoFactorAuth: !settings.twoFactorAuth })}
      />
    </SettingCard>

    <SettingCard
      title="Session Timeout"
      description="Automatically log out after period of inactivity"
    >
      <select
        value={settings.sessionTimeout}
        onChange={(e) => onSettingsChange({ sessionTimeout: parseInt(e.target.value) })}
        className="px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main focus:outline-none focus:border-main/40"
      >
        <option value={15}>15 minutes</option>
        <option value={30}>30 minutes</option>
        <option value={60}>1 hour</option>
        <option value={240}>4 hours</option>
      </select>
    </SettingCard>

    <SettingCard
      title="Login Notifications"
      description="Get notified of new login attempts"
    >
      <Toggle
        checked={settings.loginNotifications}
        onChange={() => onSettingsChange({ loginNotifications: !settings.loginNotifications })}
      />
    </SettingCard>

    <SettingCard
      title="Device Trust"
      description="Remember this device to reduce authentication prompts"
    >
      <Toggle
        checked={settings.deviceTrust}
        onChange={() => onSettingsChange({ deviceTrust: !settings.deviceTrust })}
      />
    </SettingCard>
  </div>
);
