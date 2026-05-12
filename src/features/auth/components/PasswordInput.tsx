import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormField } from './FormField';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  showHintRules?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, Props>(function PasswordInput(
  { showHintRules, hint, ...rest },
  ref,
) {
  const [show, setShow] = useState(false);
  const defaultHint = showHintRules
    ? '≥ 8 ký tự, có chữ hoa, thường, số và ký tự đặc biệt'
    : undefined;
  return (
    <FormField
      {...rest}
      ref={ref}
      type={show ? 'text' : 'password'}
      leftIcon={<Lock className="w-4 h-4" />}
      hint={hint ?? defaultHint}
      rightAdornment={
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((v) => !v)}
          className="w-9 h-9 grid place-items-center rounded-sm text-fg-2 hover:text-fg hover:bg-white/[0.06] transition-colors"
          aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  );
});
