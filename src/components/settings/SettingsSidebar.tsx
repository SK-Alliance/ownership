import React from 'react';

interface SettingsSidebarProps {
  sections: Array<{
    id: string;
    name: string;
    icon: React.ElementType;
  }>;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ 
  sections, 
  activeSection, 
  onSectionChange 
}) => (
  <div className="relative rounded-lg border border-main/20 overflow-hidden backdrop-blur-xl p-1">
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
    <div className="relative z-10 space-y-1">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
            activeSection === section.id
              ? 'bg-gold/20 text-gold border border-gold/30'
              : 'text-muted hover:text-main hover:bg-main/10'
          }`}
        >
          <section.icon className="w-5 h-5" />
          <span className="font-medium">{section.name}</span>
        </button>
      ))}
    </div>
  </div>
);
