import { NovaPlayLogo } from './Navbar';

const FOOTER_COLS = [
  { h: 'Khám phá', l: ['Phim mới','Phim lẻ','Phim bộ','Top thịnh hành','Sắp chiếu'] },
  { h: 'Thể loại', l: ['Hành động','Tâm lý','Hài','Khoa học viễn tưởng','Hoạt hình'] },
  { h: 'Hỗ trợ', l: ['Trung tâm trợ giúp','Liên hệ','Báo lỗi phim','Yêu cầu phim'] },
  { h: 'Về NovaPlay', l: ['Giới thiệu','Điều khoản','Bảo mật','Tuyển dụng'] },
];

export default function Footer() {
  return (
    <footer style={{
      marginTop: 80, padding: '56px 64px 32px',
      background: 'linear-gradient(180deg, transparent, rgba(0,0,0,.5))',
      borderTop: '1px solid rgba(255,255,255,.06)',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 48, marginBottom: 48 }}>
          <div>
            <NovaPlayLogo size={32} />
            <p style={{ color: '#a8b0c0', fontSize: 13, lineHeight: 1.6, marginTop: 16, maxWidth: 280 }}>
              Nền tảng xem phim trực tuyến hàng đầu với kho phim đa dạng, chất lượng 4K, vietsub & lồng tiếng.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              {['Facebook', 'X', 'Telegram', 'YouTube'].map(s => (
                <button key={s} style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
                  color: '#a8b0c0', cursor: 'pointer', fontSize: 10, fontWeight: 700,
                }}>{s[0]}</button>
              ))}
            </div>
          </div>
          {FOOTER_COLS.map(c => (
            <div key={c.h}>
              <h4 style={{
                fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 13,
                color: '#fff', margin: '0 0 16px', letterSpacing: '.04em', textTransform: 'uppercase',
              }}>{c.h}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.l.map(item => (
                  <li key={item}>
                    <a
                      href="#" onClick={e => e.preventDefault()}
                      style={{ color: '#a8b0c0', textDecoration: 'none', fontSize: 13.5, transition: 'color .2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#a8b0c0')}
                    >{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: '#6b7385', fontSize: 12,
        }}>
          <span>© 2025 NovaPlay. Nội dung phim thuộc bản quyền của các đơn vị sản xuất.</span>
          <span style={{ display: 'flex', gap: 18 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Điều khoản</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Bảo mật</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>DMCA</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
