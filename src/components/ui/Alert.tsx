import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

export type AlertTone = 'success' | 'danger' | 'info' | 'warning';

const styles: Record<AlertTone, { wrap: string; icon: ReactNode }> = {
  success: {
    wrap: 'bg-success/10 border-success/30 text-success',
    icon: <CheckCircle2 className="w-4 h-4 flex-shrink-0" />,
  },
  danger: {
    wrap: 'bg-danger/10 border-danger/40 text-danger',
    icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
  },
  info: {
    wrap: 'bg-info/10 border-info/30 text-info',
    icon: <Info className="w-4 h-4 flex-shrink-0" />,
  },
  warning: {
    wrap: 'bg-warning/10 border-warning/30 text-warning',
    icon: <AlertTriangle className="w-4 h-4 flex-shrink-0" />,
  },
};

export interface AlertProps {
  tone: AlertTone;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Alert({ tone, title, children, className = '' }: AlertProps) {
  const s = styles[tone];
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 border rounded-md px-3.5 py-2.5 text-sm font-medium ${s.wrap} ${className}`}
    >
      {s.icon}
      <div className="flex-1 leading-snug">
        {title && <p className="font-bold mb-0.5">{title}</p>}
        <span>{children}</span>
      </div>
    </div>
  );
}
