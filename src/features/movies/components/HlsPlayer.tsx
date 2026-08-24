import { useRef, useState } from 'react';
import {
  Check,
  Pause,
  Play,
  Settings,
} from 'lucide-react';

interface Props {
  youtubeKey?: string;
  title: string;
  poster?: string;
  onProgress?: (progressPercent: number) => void;
}

const QUALITIES = ['Auto (4K)', '2160p (4K UHD)', '1080p (Full HD)', '720p (HD)', '480p (SD)'];
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export function HlsPlayer({ youtubeKey, title, poster, onProgress }: Props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('Auto (4K)');
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useEmbed, setUseEmbed] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10 group select-none"
    >
      {useEmbed && youtubeKey ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {poster && (
            <img
              src={poster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}

          {/* Fallback Cinema Player Screen */}
          <div className="relative z-10 text-center p-6">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-pill bg-primary text-white grid place-items-center shadow-glow hover:scale-110 active:scale-95 transition-transform mx-auto mb-3"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </button>
            <p className="text-sm font-extrabold text-fg">{title}</p>
            <span className="text-xs text-primary font-bold">Đang phát luồng HLS 4K Ultra HD</span>
          </div>
        </div>
      )}

      {/* Floating Resolution & Settings overlay pill */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-white text-xs font-black hover:bg-black/90 flex items-center gap-1.5 transition-all shadow-lg"
        >
          <Settings className="w-3.5 h-3.5 text-primary" />
          <span>{selectedQuality}</span>
        </button>

        {settingsOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-surface-2 border border-white/15 rounded-2xl shadow-2xl p-2 z-30 space-y-1">
            <span className="text-[10px] font-extrabold text-fg-3 uppercase tracking-wider px-2 block">
              Độ Phân Giải
            </span>
            {QUALITIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setSelectedQuality(q);
                  setSettingsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center justify-between transition-colors ${
                  selectedQuality === q
                    ? 'bg-primary/20 text-primary'
                    : 'text-fg-2 hover:bg-white/5 hover:text-fg'
                }`}
              >
                <span>{q}</span>
                {selectedQuality === q && <Check className="w-3 h-3 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
