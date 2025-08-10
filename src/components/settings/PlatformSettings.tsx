import React from 'react';
import { Zap } from 'lucide-react';
import { SettingCard } from './SettingCard';
import { Toggle } from './Toggle';

interface PlatformSettings {
  autoVerification: boolean;
  publicProfile: boolean;
  searchableProfile: boolean;
  allowCoOwners: boolean;
  maxCoOwners: number;
}

interface PlatformSettingsProps {
  settings: PlatformSettings;
  onSettingsChange: (settings: Partial<PlatformSettings>) => void;
}

export const PlatformSettings: React.FC<PlatformSettingsProps> = ({ 
  settings, 
  onSettingsChange 
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-main flex items-center gap-2">
      <Zap className="w-6 h-6" />
      Platform Settings
    </h2>

    <SettingCard
      title="Public Profile"
      description="Make your profile visible to other users"
    >
      <Toggle
        checked={settings.publicProfile}
        onChange={() => onSettingsChange({ publicProfile: !settings.publicProfile })}
      />
    </SettingCard>

    <SettingCard
      title="Searchable Profile"
      description="Allow others to find your profile in search results"
    >
      <Toggle
        checked={settings.searchableProfile}
        onChange={() => onSettingsChange({ searchableProfile: !settings.searchableProfile })}
        disabled={!settings.publicProfile}
      />
    </SettingCard>

    <SettingCard
      title="Allow Co-owners"
      description="Enable others to be added as co-owners of your items"
    >
      <Toggle
        checked={settings.allowCoOwners}
        onChange={() => onSettingsChange({ allowCoOwners: !settings.allowCoOwners })}
      />
    </SettingCard>

    <SettingCard
      title="Maximum Co-owners"
      description="Set the maximum number of co-owners per item"
    >
      <select
        value={settings.maxCoOwners}
        onChange={(e) => onSettingsChange({ maxCoOwners: parseInt(e.target.value) })}
        className="px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main focus:outline-none focus:border-main/40"
        disabled={!settings.allowCoOwners}
      >
        <option value={1}>1</option>
        <option value={3}>3</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
      </select>
    </SettingCard>

    <SettingCard
      title="Auto-verification"
      description="Automatically submit items for verification after registration"
    >
      <Toggle
        checked={settings.autoVerification}
        onChange={() => onSettingsChange({ autoVerification: !settings.autoVerification })}
      />
    </SettingCard>
  </div>
);
