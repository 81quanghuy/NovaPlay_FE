import { useState } from 'react';
import { Check, Copy, Film, Share2, Sparkles, Star, X } from 'lucide-react';
import type { Movie } from '../types';

interface Props {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareMovieCardModal({ movie, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href;

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chia sẻ thẻ phim"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
    >
      {/* Accessible Backdrop */}
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl cursor-default"
      />

      <div className="relative z-10 w-full max-w-md bg-surface border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            <h3 className="font-display font-extrabold text-base text-fg">
              Chia Sẻ Thẻ Phim Story
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 rounded-pill bg-white/10 hover:bg-white/20 text-fg grid place-items-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 9:16 Vertical Story Card Preview */}
        <div className="relative aspect-[9/14] w-full rounded-2xl overflow-hidden bg-surface-2 border border-white/15 shadow-2xl p-5 flex flex-col justify-between mb-5 group">
          {/* Background Poster with heavy blur & overlay */}
          <img
            src={movie.backdrop || movie.poster}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/30" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-black/70 backdrop-blur-md border border-white/15">
              <Film className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-black text-fg font-display">NOVAPLAY</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-primary text-white text-[11px] font-black shadow-glow">
              {movie.quality || '4K'}
            </span>
          </div>

          {/* Center Mini Poster & Info */}
          <div className="relative z-10 flex flex-col items-center text-center my-auto py-3">
            <div className="w-[130px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mb-3 ring-1 ring-primary/40">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h4 className="font-display font-black text-lg text-fg line-clamp-1 drop-shadow-md">
              {movie.title}
            </h4>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-xs text-fg-3 italic">{movie.originalTitle}</p>
            )}

            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gold/20 text-gold text-xs font-extrabold border border-gold/40">
                <Star className="w-3 h-3 fill-gold" /> {movie.rating.toFixed(1)} IMDb
              </span>
              <span className="text-xs text-fg-2 font-bold">{movie.releaseYear}</span>
            </div>
          </div>

          {/* Bottom QR/Quote */}
          <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-fg-2">
            <span className="truncate max-w-[180px]">Đang xem trên NovaPlay</span>
            <span className="text-primary font-bold inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Xem ngay
            </span>
          </div>
        </div>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="w-full h-11 rounded-xl bg-grad-brand text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow hover:brightness-110 active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Đã Sao Chép Link Phim!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Sao Chép Đường Dẫn Để Chia Sẻ
            </>
          )}
        </button>
      </div>
    </div>
  );
}
