import type { ComponentType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button, type ButtonVariant } from './Button';

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  to?: string;
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  icon?: ReactNode;
}

export interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }> | ReactNode;
  title: string;
  description?: string | ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  children,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'function') {
      const IconComponent = icon as ComponentType<{ className?: string }>;
      return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-4 text-primary shadow-glow">
          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 opacity-90" />
        </div>
      );
    }
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-4 text-primary shadow-glow">
        {icon}
      </div>
    );
  };

  const renderActionButton = (btnAction: EmptyStateAction, isSecondary = false) => {
    const defaultVariant: ButtonVariant = isSecondary ? 'secondary' : 'primary';
    const actionIcon = btnAction.leftIcon ?? btnAction.icon;

    if (btnAction.to) {
      return (
        <Link to={btnAction.to}>
          <Button
            variant={btnAction.variant || defaultVariant}
            size="sm"
            onClick={btnAction.onClick}
            leftIcon={actionIcon}
          >
            {btnAction.label}
          </Button>
        </Link>
      );
    }

    return (
      <Button
        variant={btnAction.variant || defaultVariant}
        size="sm"
        onClick={btnAction.onClick}
        leftIcon={actionIcon}
      >
        {btnAction.label}
      </Button>
    );
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 select-none ${className}`}
    >
      {renderIcon()}
      <h3 className="font-display font-bold text-base sm:text-lg text-fg mb-1.5">{title}</h3>
      {description && (
        <div className="text-sm text-fg-2 max-w-sm sm:max-w-md mb-6 leading-relaxed">
          {description}
        </div>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action && renderActionButton(action, false)}
          {secondaryAction && renderActionButton(secondaryAction, true)}
        </div>
      )}

      {children}
    </div>
  );
}
