import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import { VALIDATION } from '@/config';

interface Props {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({ value, onChange, length = VALIDATION.OTP_LENGTH, error, disabled, autoFocus }: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function setDigit(i: number, d: string) {
    const cleaned = d.replace(/\D/g, '').slice(-1);
    const next = digits.slice();
    next[i] = cleaned;
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (cleaned && i < length - 1) refs.current[i + 1]?.focus();
  }

  function onKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (text) {
      e.preventDefault();
      onChange(text);
      const focusIdx = Math.min(text.length, length - 1);
      refs.current[focusIdx]?.focus();
    }
  }

  const borderCls = error
    ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/30'
    : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/30';

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 justify-between" role="group" aria-label="Mã OTP">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={d}
            disabled={disabled}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            onPaste={onPaste}
            className={`w-12 h-14 text-2xl font-display font-bold text-center bg-surface-2 border rounded-md text-fg outline-none transition-colors duration-fast ${borderCls} disabled:opacity-60`}
          />
        ))}
      </div>
      {error && <p className="text-xs text-danger mt-2 font-medium">{error}</p>}
    </div>
  );
}
