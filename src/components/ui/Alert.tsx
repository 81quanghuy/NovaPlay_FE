import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

type Tone = 'success' | 'danger' | 'info';

const styles: Record<Tone, { wrap: string; icon: ReactNode }> = {
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
};

interface Props {
  tone: Tone;
  children: ReactNode;
}

export function Alert({ tone, children }: Props) {
  const s = styles[tone];
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 border rounded-md px-3.5 py-2.5 text-sm font-medium ${s.wrap}`}
    >
      {s.icon}
      <span className="flex-1 leading-snug">{children}</span>
    </div>
  );
}
