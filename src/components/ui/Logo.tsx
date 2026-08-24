export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const boxClass = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-2xl',
  }[size];

  const textClass = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span
        className={`bg-grad-brand rounded-md grid place-items-center font-display font-extrabold text-white shadow-glow ${boxClass}`}
      >
        N
      </span>
      <span className={`font-display font-extrabold tracking-tight text-fg ${textClass}`}>
        NovaPlay
      </span>
    </span>
  );
}
