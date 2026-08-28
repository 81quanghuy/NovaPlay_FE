import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type DrawerPosition = 'right' | 'left';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  position?: DrawerPosition;
  size?: DrawerSize;
  children: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
  className?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

const sizeClasses: Record<DrawerSize, string> = {
  sm: 'max-w-xs',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-2xl',
};

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  position = 'right',
  size = 'md',
  children,
  footer,
  headerAction,
  className = '',
  bodyClassName = '',
  showCloseButton = true,
  hideCloseButton = false,
  closeOnBackdropClick = true,
  closeOnEsc = true,
}: DrawerProps) {
  const shouldShowClose = showCloseButton && !hideCloseButton;

  // ESC key listener
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Ngăn kéo thông tin'}
      className="fixed inset-0 z-50 overflow-hidden select-none animate-fade-in"
    >
      {/* Accessible Backdrop */}
      <button
        type="button"
        aria-label="Đóng ngăn kéo"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-default transition-opacity"
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed inset-y-0 ${
          position === 'right' ? 'right-0' : 'left-0'
        } z-10 flex flex-col w-full ${sizeClasses[size]} bg-surface-2 border-border shadow-2xl ${
          position === 'right' ? 'border-l' : 'border-r'
        } ${className}`}
      >
        {/* Header */}
        {(title || shouldShowClose || headerAction) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-3/30 flex-shrink-0">
            <div className="min-w-0 pr-2">
              {typeof title === 'string' ? (
                <h3 className="font-display font-bold text-base text-fg truncate">{title}</h3>
              ) : (
                title
              )}
              {description && (
                <div className="text-xs text-fg-3 mt-0.5 truncate">{description}</div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {headerAction}
              {shouldShowClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng"
                  className="w-8 h-8 rounded-pill bg-white/5 hover:bg-white/10 text-fg-2 hover:text-fg grid place-items-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className={`flex-1 overflow-y-auto p-5 text-fg-1 ${bodyClassName}`}>{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-border bg-surface-3/30 flex-shrink-0">
            {footer}
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}
