import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { NP_MOVIES } from '../data';
import type { Movie } from '../data';

interface MovieDetailScreenProps {
  movie: Movie;
  onBack: () => void;
}

type Tab = 'episodes' | 'cast' | 'gallery' | 'comments';

export default function MovieDetailScreen({ movie, onBack }: MovieDetailScreenProps) {
  const [tab, setTab] = useState<Tab>('episodes');
  const eps = Array.from({ length: 12 }, (_, i) => i + 1);
  const [activeEp, setActiveEp] = useState(1);

  return (
    <div style={{ background: '#07090f', minHeight: '100vh', color: '#fff' }}>
      <Navbar onNav={() => onBack()} transparent />

      <div style={{ position: 'relative', height: 560, marginTop: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${movie.backdropUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(7,9,15,.4) 0%, rgba(7,9,15,.7) 50%, #07090f 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(7,9,15,.95) 0%, rgba(7,9,15,.55) 40%, transparent 100%)',
        }} />

        <div style={{
          position: 'absolute', inset: 0, padding: '96px 64px 32px', maxWidth: 1440, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 48, alignItems: 'end',
        }}>
          <div style={{
            width: 280, aspectRatio: '2/3', borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 32px 64px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.08)',
          }}>
            <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ paddingBottom: 8 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {movie.genres.map(g => (
                <span key={g} style={{
                  fontSize: 11, fontWeight: 600, padding: '5px 12px',
                  background: 'rgba(255,44,85,.16)', border: '1px solid rgba(255,44,85,.4)',
                  color: '#ff4d6f', borderRadius: 999,
                }}>{g}</span>
              ))}
            </div>
            <h1 style={{
              fontFamily: 'Manrope,sans-serif', fontWeight: 800,
              fontSize: 54, lineHeight: 1.05, letterSpacing: '-0.025em',
              margin: '0 0 12px', maxWidth: 780,
            }}>{movie.title}</h1>
            <div style={{ color: '#a8b0c0', fontSize: 14, margin: '0 0 22px' }}>
              {movie.year}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 14, marginBottom: 24, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,200,58,.12)', color: '#ffc83a',
                padding: '5px 12px', borderRadius: 7, fontWeight: 700,
                border: '1px solid rgba(255,200,58,.3)',
              }}>
                <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
                  <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.3a1 1 0 0 0 .95.68h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 0 0-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12L10 14.25l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 0 0-.36-1.12L3.57 8.72c-.78-.57-.38-1.81.59-1.81H7.6a1 1 0 0 0 .95-.68z" />
                </svg>
                {movie.rating.toFixed(1)} / 10
              </span>
              <span style={{ color: '#a8b0c0' }}>{movie.duration} phút</span>
              <span style={{ color: 'rgba(255,255,255,.2)' }}>•</span>
              <span style={{ color: '#a8b0c0' }}>{movie.country}</span>
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
              <span style={{
                padding: '3px 9px', background: 'rgba(255,138,0,.16)',
                color: '#ff8a00', fontSize: 11, fontWeight: 600, borderRadius: 5,
                border: '1px solid rgba(255,138,0,.3)',
              }}>Lồng tiếng</span>
              <span style={{
                padding: '3px 9px', background: 'rgba(255,255,255,.06)',
                color: '#a8b0c0', fontSize: 11, fontWeight: 600, borderRadius: 5,
              }}>T16</span>
            </div>

            <p style={{
              color: '#a8b0c0', fontSize: 15.5, lineHeight: 1.6,
              margin: '0 0 28px', maxWidth: 720,
            }}>{movie.overview}</p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button style={{
                background: '#ff2c55', color: '#fff', border: 0,
                padding: '14px 36px', borderRadius: 999, fontWeight: 700, fontSize: 15,
                fontFamily: 'inherit', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 0 24px rgba(255,44,85,.4)',
              }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 4 20 12 6 20" /></svg>
                Xem ngay
              </button>
              <button style={{
                background: 'rgba(255,255,255,.08)', color: '#fff',
                border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(8px)',
                padding: '13px 24px', borderRadius: 999, fontWeight: 600, fontSize: 14,
                fontFamily: 'inherit', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                Yêu thích
              </button>
              <button style={{
                background: 'rgba(255,255,255,.08)', color: '#fff',
                border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(8px)',
                padding: '13px 24px', borderRadius: 999, fontWeight: 600, fontSize: 14,
                fontFamily: 'inherit', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Lưu lại
              </button>
              <button style={{
                width: 46, height: 46, borderRadius: '50%',
                background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)',
                color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 64px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48 }}>
        <div>
          <div style={{
            display: 'flex', gap: 32, borderBottom: '1px solid rgba(255,255,255,.08)',
            marginBottom: 24,
          }}>
            {([
              { k: 'episodes', l: 'Tập phim' },
              { k: 'cast', l: 'Diễn viên' },
              { k: 'gallery', l: 'Hình ảnh' },
              { k: 'comments', l: 'Bình luận (286)' },
            ] as { k: Tab; l: string }[]).map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                background: 'transparent', border: 0, padding: '12px 0',
                color: tab === t.k ? '#fff' : '#a8b0c0',
                borderBottom: tab === t.k ? '2px solid #ff2c55' : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 600, fontSize: 14,
              }}>{t.l}</button>
            ))}
          </div>

          {tab === 'episodes' && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#a8b0c0' }}>Server:</span>
                {['Vietsub #1', 'Vietsub #2', 'Lồng tiếng'].map((s, i) => (
                  <button key={s} style={{
                    padding: '7px 14px', borderRadius: 7, fontSize: 12.5, fontWeight: 600,
                    background: i === 0 ? 'rgba(255,44,85,.16)' : 'rgba(255,255,255,.05)',
                    border: i === 0 ? '1px solid rgba(255,44,85,.4)' : '1px solid rgba(255,255,255,.08)',
                    color: i === 0 ? '#ff4d6f' : '#a8b0c0', cursor: 'pointer', fontFamily: 'inherit',
                  }}>{s}</button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
                {eps.map(e => (
                  <button key={e} onClick={() => setActiveEp(e)} style={{
                    padding: '13px 0', borderRadius: 8, fontSize: 13.5, fontWeight: 700,
                    background: e === activeEp ? '#ff2c55' : 'rgba(255,255,255,.05)',
                    border: e === activeEp ? '1px solid #ff2c55' : '1px solid rgba(255,255,255,.08)',
                    color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: e === activeEp ? '0 0 18px rgba(255,44,85,.4)' : 'none',
                    transition: 'all .2s',
                  }}>Tập {e}</button>
                ))}
              </div>
            </div>
          )}

          {tab === 'cast' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
              {['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Oscar Isaac'].map((n, i) => (
                <div key={n} style={{
                  background: '#13182433', padding: 14, borderRadius: 14,
                  border: '1px solid rgba(255,255,255,.06)',
                }}>
                  <div style={{
                    width: '100%', aspectRatio: '1/1', borderRadius: 10,
                    background: `linear-gradient(135deg, hsl(${i * 60 + 10},60%,40%), hsl(${i * 60 + 30},50%,25%))`,
                    marginBottom: 10,
                  }} />
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#fff' }}>{n}</div>
                  <div style={{ fontSize: 11.5, color: '#6b7385', marginTop: 2 }}>Diễn viên</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside>
          <div style={{
            background: '#13182466', padding: 20, borderRadius: 14,
            border: '1px solid rgba(255,255,255,.06)', marginBottom: 18,
          }}>
            <h4 style={{
              margin: '0 0 14px', fontSize: 14, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '.06em', color: '#fff',
            }}>Thông tin</h4>
            {([
              ['Đạo diễn', 'Denis Villeneuve'],
              ['Sản xuất', 'Legendary Pictures'],
              ['Khởi chiếu', String(movie.year)],
              ['Thời lượng', `${movie.duration} phút`],
              ['Quốc gia', movie.country],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.04)',
                fontSize: 13,
              }}>
                <span style={{ color: '#6b7385' }}>{k}</span>
                <span style={{ color: '#e8ecf3', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <h4 style={{
            margin: '0 0 14px', fontSize: 14, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.06em', color: '#fff',
          }}>Đề xuất</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {NP_MOVIES.slice(7, 11).map(m => (
              <div key={m.id} style={{ display: 'flex', gap: 12, cursor: 'pointer' }}>
                <div style={{ width: 90, aspectRatio: '2/3', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={m.posterUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{
                    fontSize: 13.5, fontWeight: 700, lineHeight: 1.3, marginBottom: 6,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  } as React.CSSProperties}>{m.title}</div>
                  <div style={{ fontSize: 11.5, color: '#a8b0c0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#ffc83a' }}>★ {m.rating.toFixed(1)}</span>
                    <span>·</span><span>{m.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
