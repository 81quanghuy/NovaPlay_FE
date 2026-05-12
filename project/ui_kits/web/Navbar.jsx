/* global React */
const { useState, useEffect, useRef } = React;

/* ---------- LOGO ---------- */
function NovaPlayLogo({ size = 28 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <div style={{
        width:size, height:size, borderRadius:8,
        background:'linear-gradient(135deg,#ff2c55 0%,#ff6a3d 100%)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 4px 14px rgba(255,44,85,.45)'
      }}>
        <svg viewBox="0 0 24 24" width={size*0.55} height={size*0.55} fill="#fff">
          <polygon points="7,4 20,12 7,20" />
        </svg>
      </div>
      <span style={{
        fontFamily:'Manrope, sans-serif', fontWeight:800, fontSize:18,
        letterSpacing:'-0.02em', color:'#fff'
      }}>NovaPlay</span>
    </div>
  );
}

/* ---------- NAVBAR ---------- */
function Navbar({ onNav, route, transparent }) {
  const [scrolled, setScrolled] = useState(false);
  const [openDD, setOpenDD] = useState(null);
  const [bell, setBell] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navBg = (transparent && !scrolled)
    ? 'transparent'
    : 'rgba(11,15,23,0.85)';

  const links = [
    { l:'Chủ đề', k:'topics' },
    { l:'Thể loại', k:'genres', dropdown:['Hành Động','Hài','Tâm Lý','Khoa Học Viễn Tưởng','Kinh Dị','Tình Cảm','Hoạt Hình'] },
    { l:'Phim Lẻ', k:'movies' },
    { l:'Phim Bộ', k:'series' },
    { l:'Quốc gia', k:'countries', dropdown:['Việt Nam','Mỹ','Hàn Quốc','Nhật Bản','Trung Quốc'] },
    { l:'Diễn Viên', k:'actors' },
  ];

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, height:64, zIndex:100,
      background:navBg, backdropFilter:scrolled?'blur(14px)':'none',
      WebkitBackdropFilter:scrolled?'blur(14px)':'none',
      borderBottom:scrolled?'1px solid rgba(255,255,255,.06)':'1px solid transparent',
      transition:'all .35s var(--np-ease-out)'
    }}>
      <div style={{
        maxWidth:1440, height:'100%', margin:'0 auto', padding:'0 32px',
        display:'flex', alignItems:'center', gap:32
      }}>
        <a href="#" onClick={e=>{e.preventDefault();onNav('home')}} style={{textDecoration:'none'}}>
          <NovaPlayLogo />
        </a>

        {/* Search */}
        <div style={{position:'relative', width:340}}>
          <svg viewBox="0 0 24 24" width="16" height="16" style={{
            position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
            stroke:'#6b7385', fill:'none', strokeWidth:2, strokeLinecap:'round'
          }}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input placeholder="Tìm kiếm phim, diễn viên..." style={{
            width:'100%', padding:'9px 14px 9px 38px',
            background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)',
            borderRadius:999, color:'#fff', fontSize:13, outline:'none',
            fontFamily:'inherit'
          }} />
        </div>

        {/* Links */}
        <div style={{display:'flex', alignItems:'center', gap:24, flex:1, fontSize:13.5}}>
          {links.map(L => (
            <div key={L.k} style={{position:'relative'}}>
              <button onClick={()=>L.dropdown?setOpenDD(openDD===L.k?null:L.k):onNav(L.k)} style={{
                background:'transparent', border:0, color:'#a8b0c0',
                cursor:'pointer', display:'inline-flex', alignItems:'center', gap:3,
                fontFamily:'inherit', fontSize:'inherit', fontWeight:500,
                padding:'8px 0', transition:'color .2s'
              }}
              onMouseEnter={e=>e.currentTarget.style.color='#fff'}
              onMouseLeave={e=>e.currentTarget.style.color='#a8b0c0'}
              >
                {L.l}
                {L.dropdown && <svg viewBox="0 0 24 24" width="14" height="14" style={{stroke:'currentColor',fill:'none',strokeWidth:2}}><path d="m6 9 6 6 6-6"/></svg>}
              </button>
              {L.dropdown && openDD===L.k && (
                <div style={{
                  position:'absolute', top:'calc(100% + 6px)', left:0, minWidth:200,
                  background:'#181d2a', border:'1px solid rgba(255,255,255,.08)',
                  borderRadius:12, padding:6, boxShadow:'0 24px 48px rgba(0,0,0,.55)'
                }} onMouseLeave={()=>setOpenDD(null)}>
                  {L.dropdown.map(item => (
                    <a key={item} href="#" onClick={e=>{e.preventDefault();setOpenDD(null)}} style={{
                      display:'block', padding:'9px 12px', color:'#e8ecf3',
                      textDecoration:'none', borderRadius:7, fontSize:13
                    }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.06)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>{item}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right */}
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <button onClick={()=>setBell(!bell)} style={{
            width:36, height:36, borderRadius:'50%', border:0,
            background:'rgba(255,255,255,.05)', color:'#a8b0c0', cursor:'pointer',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            position:'relative'
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" style={{stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span style={{position:'absolute',top:8,right:8,width:7,height:7,borderRadius:'50%',background:'#ff2c55'}}></span>
          </button>
          <button onClick={()=>onNav('login')} style={{
            background:'#ff2c55', color:'#fff', border:0, padding:'9px 20px',
            borderRadius:999, fontWeight:600, cursor:'pointer', fontSize:13,
            fontFamily:'inherit', transition:'all .2s',
            display:'inline-flex', alignItems:'center', gap:6
          }}
          onMouseEnter={e=>{e.currentTarget.style.background='#ff4d6f';e.currentTarget.style.boxShadow='0 0 24px rgba(255,44,85,.35)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='#ff2c55';e.currentTarget.style.boxShadow='none'}}>
            <svg viewBox="0 0 24 24" width="14" height="14" style={{stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Đăng nhập
          </button>
        </div>
      </div>
    </nav>
  );
}

window.NovaPlayLogo = NovaPlayLogo;
window.Navbar = Navbar;
