import { useState, useEffect, useRef } from 'react';
import type { Movie } from '../data';

interface HeroSliderProps {
  movies: Movie[];
  onOpen: (movie: Movie) => void;
}

export default function HeroSlider({ movies, onOpen }: HeroSliderProps) {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const tRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % movies.length);
        setAnimating(false);
      }, 250);
    }, 6500);
    return () => { if (tRef.current) clearInterval(tRef.current); };
  }, [movies.length]);

  const movie = movies[idx];

  return (
    <div style={{ position: 'relative', height: 680, overflow: 'hidden', marginTop: -64 }}>
      <div key={movie.id} style={{
        position: 'absolute', inset: 0, transform: 'scale(1.02)',
        backgroundImage: `url(${movie.backdropUrl})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transition: 'opacity .5s', opacity: animating ? 0.5 : 1,
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,9,15,.5) 0%, transparent 25%, rgba(7,9,15,.6) 80%, #07090f 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #07090f 0%, rgba(7,9,15,.85) 25%, rgba(7,9,15,.3) 60%, transparent 100%)' }} />

      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        padding: '0 80px', maxWidth: 1760, margin: '0 auto',
      }}>
        <div style={{
          maxWidth: 620,
          transform: animating ? 'translateX(-30px)' : 'none',
          opacity: animating ? 0 : 1,
          transition: 'all .35s cubic-bezier(.22,.61,.36,1)',
        }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {movie.genres.map(g => (
              <span key={g} style={{
                fontSize: 11, fontWeight: 600, padding: '5px 12px',
                background: 'rgba(255,44,85,.16)', border: '1px solid rgba(255,44,85,.4)',
                color: '#ff4d6f', borderRadius: 999, backdropFilter: 'blur(6px)',
              }}>{g}</span>
            ))}
          </div>

          <h1 style={{
            fontFamily: 'Manrope,sans-serif', fontWeight: 800,
            fontSize: 64, lineHeight: 1.02, letterSpacing: '-0.025em',
            color: '#fff', margin: '0 0 18px',
            textShadow: '0 2px 24px rgba(0,0,0,.6)',
          }}>{movie.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#e8ecf3', fontSize: 14, marginBottom: 18 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#ffc83a', fontWeight: 700 }}>
              <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor">
                <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.3a1 1 0 0 0 .95.68h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 0 0-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12L10 14.25l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 0 0-.36-1.12L3.57 8.72c-.78-.57-.38-1.81.59-1.81H7.6a1 1 0 0 0 .95-.68z" />
              </svg>
              {movie.rating.toFixed(1)}
            </span>
            <span style={{ color: 'rgba(255,255,255,.2)' }}>•</span>
            <span>{movie.year}</span>
            <span style={{ color: 'rgba(255,255,255,.2)' }}>•</span>
            <span>{movie.duration} phút</span>
            <span style={{ color: 'rgba(255,255,255,.2)' }}>•</span>
            <span style={{
              padding: '3px 9px',
              background: movie.quality === '4K' ? '#ff8a00' : '#2ad4ff',
              color: movie.quality === '4K' ? '#fff' : '#03222b',
              fontSize: 11, fontWeight: 700, borderRadius: 5, letterSpacing: '.04em',
            }}>{movie.quality}</span>
            <span style={{
              padding: '3px 9px', background: 'rgba(46,204,113,.16)',
              color: '#2ecc71', fontSize: 11, fontWeight: 600, borderRadius: 5,
              border: '1px solid rgba(46,204,113,.35)',
            }}>Vietsub</span>
          </div>

          <p style={{
            fontSize: 16, color: '#a8b0c0', lineHeight: 1.55,
            margin: '0 0 26px', maxWidth: 540,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          } as React.CSSProperties}>{movie.overview}</p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => onOpen(movie)}
              style={{
                background: '#ff2c55', color: '#fff', border: 0,
                padding: '14px 30px', borderRadius: 999, fontWeight: 700, fontSize: 15,
                fontFamily: 'inherit', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ff4d6f'; e.currentTarget.style.boxShadow = '0 0 36px rgba(255,44,85,.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ff2c55'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 4 20 12 6 20" /></svg>
              Xem Phim
            </button>
            <button
              onClick={() => onOpen(movie)}
              style={{
                background: 'rgba(255,255,255,.10)', color: '#fff',
                border: '1.5px solid rgba(255,255,255,.4)', backdropFilter: 'blur(8px)',
                padding: '13px 28px', borderRadius: 999, fontWeight: 600, fontSize: 15,
                fontFamily: 'inherit', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
              Chi Tiết
            </button>
            <button style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)',
              color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 32, right: 64, display: 'flex', gap: 8 }}>
        {movies.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 32 : 8, height: 8, borderRadius: 999,
            background: i === idx ? '#ff2c55' : 'rgba(255,255,255,.3)', border: 0,
            cursor: 'pointer', transition: 'all .3s',
          }} />
        ))}
      </div>
    </div>
  );
}
