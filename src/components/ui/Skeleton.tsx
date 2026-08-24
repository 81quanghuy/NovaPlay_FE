import type { HTMLAttributes } from 'react';

export type SkeletonVariant = 'text' | 'rect' | 'circle' | 'card' | 'poster' | 'avatar' | 'button';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

export function Skeleton({ variant = 'rect', count = 1, className = '', ...rest }: SkeletonProps) {
  const renderSingle = (key?: number) => {
    if (variant === 'card') {
      return (
        <div
          key={key}
          className={`w-full rounded-2xl bg-surface-2/60 border border-white/5 p-3 space-y-3 animate-pulse ${className}`}
          {...rest}
        >
          <div className="w-full aspect-[2/3] rounded-xl bg-white/[0.07]" />
          <div className="h-4 w-3/4 rounded bg-white/[0.07]" />
          <div className="h-3 w-1/2 rounded bg-white/[0.05]" />
        </div>
      );
    }

    if (variant === 'poster') {
      return (
        <div
          key={key}
          aria-hidden="true"
          className={`w-full aspect-[2/3] rounded-2xl bg-white/[0.07] animate-pulse ${className}`}
          {...rest}
        />
      );
    }

    const variantClasses = {
      text: 'h-4 w-3/4 rounded bg-white/[0.07]',
      rect: 'h-24 w-full rounded-xl bg-white/[0.07]',
      circle: 'w-10 h-10 rounded-pill bg-white/[0.07]',
      avatar: 'w-12 h-12 rounded-pill bg-white/[0.07]',
      button: 'h-10 w-28 rounded-pill bg-white/[0.07]',
    }[variant];

    return (
      <div
        key={key}
        aria-hidden="true"
        className={`animate-pulse ${variantClasses} ${className}`}
        {...rest}
      />
    );
  };

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => renderSingle(index))}
      </>
    );
  }

  return renderSingle();
}
