import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightAdornment?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, Props>(function FormField(
  { label, error, hint, leftIcon, rightAdornment, className = '', id, ...rest },
  ref,
) {
  const inputId = id || rest.name;
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mb-2 text-sm font-semibold text-fg-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          {...rest}
          aria-invalid={!!error}
          className={`w-full h-11 bg-surface-2 border rounded-md px-4 text-base text-fg placeholder:text-fg-3 outline-none transition-colors duration-fast
            ${leftIcon ? 'pl-11' : ''}
            ${rightAdornment ? 'pr-11' : ''}
            ${
              error
                ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/30'
                : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/30'
            }
            disabled:opacity-60 disabled:cursor-not-allowed`}
        />
        {rightAdornment && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">{rightAdornment}</span>
        )}
      </div>
      {error ? (
        <p className="text-xs text-danger mt-1.5 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-xs text-fg-3 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
});
