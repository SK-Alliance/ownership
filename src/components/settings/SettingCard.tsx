import React from 'react';

interface SettingCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SettingCard: React.FC<SettingCardProps> = ({ title, description, children }) => (
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
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <h4 className="text-main font-medium mb-1">{title}</h4>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  </div>
);
