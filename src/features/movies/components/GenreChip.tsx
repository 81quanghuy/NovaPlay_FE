interface Props {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function GenreChip({ label, active = false, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 h-9 rounded-pill text-sm font-semibold transition-colors duration-fast border ${
        active
          ? 'bg-primary text-white border-primary shadow-[0_0_18px_rgba(255,44,85,0.35)]'
          : 'bg-white/5 border-border text-fg-1 hover:bg-white/10 hover:border-border-strong'
      }`}
    >
      {label}
    </button>
  );
}
