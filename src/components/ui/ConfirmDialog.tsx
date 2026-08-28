import type { ComponentType, ReactNode } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button, type ButtonVariant } from './Button';

export type ConfirmVariant = 'danger' | 'primary' | 'warning';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  cancelLabel?: string;
  confirmVariant?: ConfirmVariant;
  loading?: boolean;
  icon?: ComponentType<{ className?: string }> | ReactNode;
  className?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  confirmVariant = 'primary',
  loading = false,
  icon,
  className = '',
}: ConfirmDialogProps) {
  const resolvedConfirmLabel = confirmLabel || confirmText || 'Xác nhận';
  const resolvedCancelLabel = cancelLabel || cancelText || 'Hủy bỏ';

  const iconColors = {
    danger: 'text-danger bg-danger/15 border-danger/30',
    warning: 'text-warning bg-warning/15 border-warning/30',
    primary: 'text-primary bg-primary/15 border-primary/30',
  }[confirmVariant];

  const renderIcon = () => {
    if (icon) {
      if (typeof icon === 'function') {
        const CustomIconComponent = icon as ComponentType<{ className?: string }>;
        return <CustomIconComponent className="w-5 h-5" />;
      }
      return icon;
    }

    if (confirmVariant === 'danger' || confirmVariant === 'warning') {
      return <AlertTriangle className="w-5 h-5" />;
    }

    return <HelpCircle className="w-5 h-5" />;
  };

  const buttonVariant: ButtonVariant = confirmVariant === 'danger' ? 'danger' : 'primary';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      className={className}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
            {resolvedCancelLabel}
          </Button>
          <Button
            variant={buttonVariant}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {resolvedConfirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconColors}`}
        >
          {renderIcon()}
        </div>
        <div className="space-y-1">
          <h4 className="font-display font-bold text-base text-fg">{title}</h4>
          <div className="text-sm text-fg-2 leading-relaxed">{message}</div>
        </div>
      </div>
    </Modal>
  );
}
