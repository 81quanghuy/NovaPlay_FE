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
      className={`px-4 h-9 rounded-pill text-sm font-semibold transition-all duration-fast border ${
        active
          ? 'bg-primary text-white border-primary shadow-glow font-bold'
          : 'bg-white/5 border-border text-fg-2 hover:text-fg hover:bg-white/10 hover:border-border-strong'
      }`}
    >
      {label}
    </button>
  );
}
