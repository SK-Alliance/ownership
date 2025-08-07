import React from 'react';
import { Bell } from 'lucide-react';
import { SettingCard } from './SettingCard';
import { Toggle } from './Toggle';

interface NotificationSettings {
  itemVerified: boolean;
  itemRejected: boolean;
  coOwnerAdded: boolean;
  monthlyReport: boolean;
  securityAlerts: boolean;
  systemUpdates: boolean;
}

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: Partial<NotificationSettings>) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings, 
  onSettingsChange 
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-main flex items-center gap-2">
      <Bell className="w-6 h-6" />
      Notification Settings
    </h2>

    <SettingCard
      title="Item Verified"
      description="Get notified when your registered items are verified"
    >
      <Toggle
        checked={settings.itemVerified}
        onChange={() => onSettingsChange({ itemVerified: !settings.itemVerified })}
      />
    </SettingCard>

    <SettingCard
      title="Item Rejected"
      description="Get notified when verification is rejected"
    >
      <Toggle
        checked={settings.itemRejected}
        onChange={() => onSettingsChange({ itemRejected: !settings.itemRejected })}
      />
    </SettingCard>

    <SettingCard
      title="Co-owner Added"
      description="Get notified when someone is added as a co-owner"
    >
      <Toggle
        checked={settings.coOwnerAdded}
        onChange={() => onSettingsChange({ coOwnerAdded: !settings.coOwnerAdded })}
      />
    </SettingCard>

    <SettingCard
      title="Security Alerts"
      description="Important security notifications and login alerts"
    >
      <Toggle
        checked={settings.securityAlerts}
        onChange={() => onSettingsChange({ securityAlerts: !settings.securityAlerts })}
      />
    </SettingCard>

    <SettingCard
      title="Monthly Report"
      description="Receive monthly summary of your activity"
    >
      <Toggle
        checked={settings.monthlyReport}
        onChange={() => onSettingsChange({ monthlyReport: !settings.monthlyReport })}
      />
    </SettingCard>

    <SettingCard
      title="System Updates"
      description="Get notified about platform updates and maintenance"
    >
      <Toggle
        checked={settings.systemUpdates}
        onChange={() => onSettingsChange({ systemUpdates: !settings.systemUpdates })}
      />
    </SettingCard>
  </div>
);
