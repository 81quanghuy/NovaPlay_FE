import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant =
  | 'primary'
  | 'gold'
  | 'cyan'
  | 'success'
  | 'warning'
  | 'danger'
  | 'surface'
  | 'ghost';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  icon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { wrap: string; dot: string }> = {
  primary: {
    wrap: 'bg-primary/15 text-primary border-primary/30',
    dot: 'bg-primary',
  },
  gold: {
    wrap: 'bg-gold/15 text-gold border-gold/30',
    dot: 'bg-gold',
  },
  cyan: {
    wrap: 'bg-cyan/15 text-cyan border-cyan/30',
    dot: 'bg-cyan',
  },
  success: {
    wrap: 'bg-success/15 text-success border-success/30',
    dot: 'bg-success',
  },
  warning: {
    wrap: 'bg-warning/15 text-warning border-warning/30',
    dot: 'bg-warning',
  },
  danger: {
    wrap: 'bg-danger/15 text-danger border-danger/30',
    dot: 'bg-danger',
  },
  surface: {
    wrap: 'bg-surface-3/80 text-fg-2 border-border',
    dot: 'bg-fg-3',
  },
  ghost: {
    wrap: 'bg-white/5 text-fg-2 border-white/10',
    dot: 'bg-fg-2',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
  md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-bold',
  lg: 'text-sm px-3 py-1.5 rounded-xl gap-2 font-extrabold',
};

export function Badge({
  variant = 'primary',
  size = 'sm',
  dot = false,
  pulse = false,
  icon,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...rest
}: BadgeProps) {
  const style = variantStyles[variant];
  const renderedLeftIcon = leftIcon ?? icon;

  return (
    <span
      {...rest}
      className={`inline-flex items-center font-display border select-none ${style.wrap} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2 mr-0.5">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-pill opacity-75 ${style.dot}`}
            />
          )}
          <span className={`relative inline-flex rounded-pill h-2 w-2 ${style.dot}`} />
        </span>
      )}
      {renderedLeftIcon}
      <span>{children}</span>
      {rightIcon}
    </span>
  );
}
