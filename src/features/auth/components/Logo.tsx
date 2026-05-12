export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: { box: 28, text: 'text-xl' }, md: { box: 36, text: 'text-2xl' }, lg: { box: 48, text: 'text-3xl' } }[size];
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span
        className="bg-grad-brand rounded-md grid place-items-center font-display font-extrabold text-white shadow-glow"
        style={{ width: dims.box, height: dims.box, fontSize: dims.box * 0.5 }}
      >
        N
      </span>
      <span className={`font-display font-extrabold tracking-tight text-fg ${dims.text}`}>NovaPlay</span>
    </span>
  );
}
