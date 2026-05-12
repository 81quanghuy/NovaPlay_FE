import { useState, useRef } from 'react';
import PosterCard from './MovieCard';
import type { Movie } from '../data';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onOpen: (movie: Movie) => void;
}

export function MovieRow({ title, movies, onOpen }: MovieRowProps) {
  const [start, setStart] = useState(0);
  const VISIBLE = 6;
  const canNext = start + VISIBLE < movies.length;
  const canPrev = start > 0;

  return (
    <section style={{ padding: '40px 80px 0', maxWidth: 1760, margin: '0 auto' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <h2 style={{
          fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 26,
          color: '#fff', margin: 0, letterSpacing: '-0.02em',
          display: 'inline-flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            display: 'inline-block', width: 5, height: 24,
            background: 'linear-gradient(180deg,#ff2c55,#ff6a3d)', borderRadius: 3,
          }} />
          {title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="#" onClick={e => e.preventDefault()} style={{
            fontSize: 13, color: '#ff4d6f', textDecoration: 'none', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            Xem tất cả
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
          </a>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              disabled={!canPrev}
              onClick={() => setStart(Math.max(0, start - 1))}
              style={{
                width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,.12)',
                background: 'rgba(255,255,255,.04)', color: '#fff',
                cursor: canPrev ? 'pointer' : 'not-allowed', opacity: canPrev ? 1 : 0.35,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button
              disabled={!canNext}
              onClick={() => setStart(start + 1)}
              style={{
                width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,.12)',
                background: 'rgba(255,255,255,.04)', color: '#fff',
                cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.35,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Vertical padding + negative margin lets hover lift/scale without clipping */}
      <div style={{ overflow: 'hidden', padding: '20px 0', margin: '-20px 0' }}>
        <div style={{
          display: 'flex', gap: 18,
          transform: `translateX(-${start * (200 + 18)}px)`,
          transition: 'transform .35s cubic-bezier(.22,.61,.36,1)',
        }}>
          {movies.map(m => (
            <div key={m.id} style={{ flexShrink: 0 }}>
              <PosterCard movie={m} onOpen={onOpen} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TopTenProps {
  movies: Movie[];
  onOpen: (movie: Movie) => void;
}

export function TopTen({ movies, onOpen }: TopTenProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const STEP = 380;

  const scrollBy = (dx: number) => {
    scrollerRef.current?.scrollBy({ left: dx, behavior: 'smooth' });
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!scrollerRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollerRef.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  return (
    <section style={{ padding: '40px 0 0', maxWidth: 1760, margin: '0 auto' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '0 80px', marginBottom: 20,
      }}>
        <h2 style={{
          fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 26,
          color: '#fff', margin: 0, letterSpacing: '-0.02em',
          display: 'inline-flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            display: 'inline-block', width: 5, height: 24,
            background: 'linear-gradient(180deg,#ffc83a,#ff8a00)', borderRadius: 3,
          }} />
          Top 10 Đang Hot
        </h2>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => scrollBy(-STEP)}
            aria-label="Trước"
            style={{
              width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,.12)',
              background: 'rgba(255,255,255,.04)', color: '#fff', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => scrollBy(STEP)}
            aria-label="Sau"
            style={{
              width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,.12)',
              background: 'rgba(255,255,255,.04)', color: '#fff', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <style>{`.np-top10-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div
        ref={scrollerRef}
        className="np-top10-scroll"
        onWheel={onWheel}
        style={{
          display: 'flex', gap: 24, overflowX: 'auto', overflowY: 'hidden',
          padding: '20px 80px', scrollbarWidth: 'none', msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
        } as React.CSSProperties}
      >
        {movies.slice(0, 10).map((m, i) => (
          <div
            key={m.id}
            onClick={() => onOpen(m)}
            style={{
              display: 'flex', alignItems: 'flex-end', gap: 0, cursor: 'pointer',
              position: 'relative', flexShrink: 0, scrollSnapAlign: 'start',
            }}
          >
            <div style={{
              fontFamily: 'Manrope,sans-serif', fontWeight: 800,
              fontSize: i === 9 ? 120 : 160,
              lineHeight: 0.85, letterSpacing: '-0.06em',
              background: 'linear-gradient(180deg, rgba(255,44,85,.95), rgba(255,44,85,.2))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255,44,85,.25)',
              marginRight: i === 9 ? -30 : -28,
              position: 'relative', zIndex: 1, userSelect: 'none',
            } as React.CSSProperties}>{i + 1}</div>
            <div style={{
              width: 150, aspectRatio: '2/3', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,.55)', position: 'relative', zIndex: 2,
              flexShrink: 0,
            }}>
              <img src={m.posterUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
