/* global React */
const { useState } = React;

function PosterCard({ movie, onOpen, big }) {
  const [hover, setHover] = useState(false);
  const w = big ? 240 : 200;
  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      onClick={()=>onOpen && onOpen(movie)}
      style={{
        width:w, cursor:'pointer', position:'relative',
        transform:hover?'translateY(-4px) scale(1.03)':'none',
        transition:'transform .28s cubic-bezier(.22,.61,.36,1)',
        zIndex:hover?5:1
      }}>
      <div style={{
        position:'relative', aspectRatio:'2/3', borderRadius:20,
        overflow:'hidden',
        boxShadow:hover
          ? '0 24px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(255,44,85,.4)'
          : '0 12px 32px rgba(0,0,0,.55), 0 2px 6px rgba(0,0,0,.4)',
        transition:'box-shadow .28s'
      }}>
        <img src={movie.posterUrl} alt={movie.title} style={{
          width:'100%', height:'100%', objectFit:'cover', display:'block'
        }}/>
        {/* rating */}
        <div style={{
          position:'absolute', top:10, left:10, background:'rgba(0,0,0,.78)',
          color:'#ffc83a', fontSize:11.5, fontWeight:700, padding:'4px 9px',
          borderRadius:999, display:'flex', alignItems:'center', gap:4,
          backdropFilter:'blur(6px)'
        }}>
          <svg viewBox="0 0 20 20" width="11" height="11" fill="currentColor"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.3a1 1 0 0 0 .95.68h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 0 0-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12L10 14.25l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 0 0-.36-1.12L3.57 8.72c-.78-.57-.38-1.81.59-1.81H7.6a1 1 0 0 0 .95-.68z"/></svg>
          {movie.rating.toFixed(1)}
        </div>
        {/* quality */}
        <div style={{
          position:'absolute', top:10, right:10,
          background: movie.quality==='4K' ? '#ff8a00'
                   : movie.quality==='FHD' ? '#2ad4ff'
                   : '#6b7385',
          color: movie.quality==='FHD' ? '#03222b' : '#fff',
          fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:5,
          letterSpacing:'.04em'
        }}>{movie.quality}</div>
        {/* hover overlay */}
        <div style={{
          position:'absolute', inset:0, padding:14,
          background:'linear-gradient(180deg, transparent 25%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.96) 100%)',
          display:'flex', flexDirection:'column', justifyContent:'flex-end',
          opacity:hover?1:0, transition:'opacity .28s'
        }}>
          <div style={{display:'flex', gap:4, flexWrap:'wrap', marginBottom:8}}>
            {movie.genres.slice(0,2).map(g => (
              <span key={g} style={{
                fontSize:10, fontWeight:600, padding:'3px 7px',
                background:'rgba(255,44,85,.85)', color:'#fff', borderRadius:5
              }}>{g}</span>
            ))}
          </div>
          <div style={{display:'flex', gap:6}}>
            <button style={{
              flex:1, background:'#ffc83a', color:'#1a1100', border:0,
              padding:'7px 8px', borderRadius:6, fontWeight:700, fontSize:12,
              fontFamily:'inherit', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:4
            }}>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>
              Xem ngay
            </button>
            <button style={{
              background:'rgba(255,255,255,.15)', backdropFilter:'blur(4px)',
              color:'#fff', border:'1px solid rgba(255,255,255,.18)',
              padding:'7px 10px', borderRadius:6, fontSize:12, fontWeight:600,
              fontFamily:'inherit', cursor:'pointer'
            }}>Chi tiết</button>
          </div>
        </div>
      </div>
      {/* title outside poster */}
      <div style={{marginTop:10}}>
        <div style={{
          fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:14,
          color:'#fff', lineHeight:1.3,
          display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical',
          overflow:'hidden'
        }}>{movie.title}</div>
        <div style={{fontSize:11.5, color:'#a8b0c0', marginTop:2, display:'flex', gap:6, alignItems:'center'}}>
          <span>{movie.year}</span>
          <span style={{opacity:.5}}>·</span>
          <span>{movie.genres[0]}</span>
          {movie.episodes && <>
            <span style={{opacity:.5}}>·</span>
            <span style={{color:'#ff4d6f'}}>Tập {movie.episodes.current}</span>
          </>}
        </div>
      </div>
    </div>
  );
}

window.PosterCard = PosterCard;
