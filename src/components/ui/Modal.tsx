import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-5xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  className = '',
  bodyClassName = '',
  showCloseButton = true,
  hideCloseButton = false,
  closeOnBackdropClick = true,
  closeOnEsc = true,
}: ModalProps) {
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
      aria-label={typeof title === 'string' ? title : 'Hộp thoại'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
    >
      {/* Accessible Backdrop */}
      <button
        type="button"
        aria-label="Đóng hộp thoại"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl cursor-default transition-opacity"
      />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full ${sizeClasses[size]} bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${className}`}
      >
        {/* Header */}
        {(title || shouldShowClose) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-2/60 flex-shrink-0">
            <div>
              {typeof title === 'string' ? (
                <h3 className="font-display font-bold text-base sm:text-lg text-fg">{title}</h3>
              ) : (
                title
              )}
              {description && (
                <div className="text-xs text-fg-3 mt-0.5">{description}</div>
              )}
            </div>
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
        )}

        {/* Body */}
        <div className={`flex-1 overflow-y-auto p-5 text-fg-1 ${bodyClassName}`}>{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-border bg-surface-2/60 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
