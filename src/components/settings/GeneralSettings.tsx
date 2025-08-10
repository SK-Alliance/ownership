import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingCard } from './SettingCard';

interface GeneralSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
}

interface GeneralSettingsProps {
  settings: GeneralSettings;
  onSettingsChange: (settings: Partial<GeneralSettings>) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ 
  settings, 
  onSettingsChange 
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-main flex items-center gap-2">
      <SettingsIcon className="w-6 h-6" />
      General Settings
    </h2>

    <SettingCard
      title="Theme"
      description="Choose your preferred theme appearance"
    >
      <select
        value={settings.theme}
        onChange={(e) => onSettingsChange({ theme: e.target.value as 'light' | 'dark' | 'system' })}
        className="px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main focus:outline-none focus:border-main/40"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </SettingCard>

    <SettingCard
      title="Language"
      description="Select your preferred language"
    >
      <select
        value={settings.language}
        onChange={(e) => onSettingsChange({ language: e.target.value })}
        className="px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main focus:outline-none focus:border-main/40"
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
    </SettingCard>

    <SettingCard
      title="Timezone"
      description="Set your local timezone for accurate timestamps"
    >
      <select
        value={settings.timezone}
        onChange={(e) => onSettingsChange({ timezone: e.target.value })}
        className="px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main focus:outline-none focus:border-main/40"
      >
        <option value="UTC">UTC</option>
        <option value="EST">Eastern Time</option>
        <option value="PST">Pacific Time</option>
        <option value="CET">Central European Time</option>
      </select>
    </SettingCard>
  </div>
);
