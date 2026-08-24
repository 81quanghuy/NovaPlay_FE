import type { KeyboardEvent, ReactNode } from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  id,
  name,
  className = '',
}: SwitchProps) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  const trackDimensions = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const thumbDimensions = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const translateActive = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  return (
    <div className={`inline-flex items-start gap-3 select-none ${className}`}>
      <button
        type="button"
        role="switch"
        id={id}
        name={name}
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex ${trackDimensions} flex-shrink-0 cursor-pointer rounded-pill border-2 border-transparent transition-colors duration-fast ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          checked ? 'bg-primary shadow-glow' : 'bg-surface-3 border border-border'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block ${thumbDimensions} transform rounded-pill bg-white shadow-sm ring-0 transition duration-fast ease-in-out ${
            checked ? translateActive : 'translate-x-0'
          }`}
        />
      </button>

      {(label || description) && (
        <div
          role="presentation"
          onClick={handleToggle}
          className={`flex flex-col ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label && <span className="text-sm font-semibold text-fg-1">{label}</span>}
          {description && <span className="text-xs text-fg-3">{description}</span>}
        </div>
      )}
    </div>
  );
}
