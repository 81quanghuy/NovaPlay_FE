import type { ComponentType, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: ComponentType<{ className?: string }> | ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export type TabsVariant = 'pills' | 'underline' | 'buttons' | 'default';
export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  size = 'md',
  fullWidth = false,
  className = '',
}: TabsProps) {
  const normalizedVariant = variant === 'default' ? 'pills' : variant;

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size];

  const getTabClass = (isActive: boolean, disabled?: boolean) => {
    if (disabled) return 'opacity-40 cursor-not-allowed text-fg-disabled';

    if (normalizedVariant === 'pills') {
      return isActive
        ? 'bg-primary text-white shadow-glow font-bold'
        : 'text-fg-2 hover:text-fg hover:bg-white/5 font-semibold';
    }

    if (normalizedVariant === 'underline') {
      return isActive
        ? 'text-primary border-b-2 border-primary font-bold'
        : 'text-fg-2 hover:text-fg border-b-2 border-transparent hover:border-white/20 font-semibold';
    }

    // buttons variant
    return isActive
      ? 'bg-surface-3 text-fg font-bold shadow-sm border border-border'
      : 'text-fg-2 hover:text-fg hover:bg-white/5 font-semibold';
  };

  const containerVariantClass = {
    pills: 'bg-surface-2/80 p-1 rounded-pill border border-border',
    underline: 'border-b border-border gap-2',
    buttons: 'bg-surface-2/60 p-1 rounded-xl border border-border gap-1',
  }[normalizedVariant];

  const renderIcon = (icon: TabItem['icon']) => {
    if (!icon) return null;
    if (typeof icon === 'function') {
      const IconComponent = icon as ComponentType<{ className?: string }>;
      return <IconComponent className="w-4 h-4 flex-shrink-0" />;
    }
    return <span className="flex-shrink-0">{icon}</span>;
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`inline-flex items-center ${containerVariantClass} ${
        fullWidth ? 'w-full justify-between' : ''
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={`inline-flex items-center justify-center rounded-pill transition-all duration-fast select-none ${sizeClasses} ${getTabClass(
              isActive,
              tab.disabled,
            )} ${fullWidth ? 'flex-1' : ''}`}
          >
            {renderIcon(tab.icon)}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-pill text-[11px] font-extrabold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-fg-3 group-hover:text-fg-2'
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.badge}
          </button>
        );
      })}
    </div>
  );
}
