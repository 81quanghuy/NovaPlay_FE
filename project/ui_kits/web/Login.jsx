/* global React */
const { useState } = React;

function LoginScreen({ onBack }) {
  const [mode, setMode] = useState('login');
  return (
    <div style={{
      minHeight:'100vh', background:'#07090f', color:'#fff',
      position:'relative', overflow:'hidden'
    }}>
      {/* atmosphere */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(60% 50% at 20% 30%, rgba(255,44,85,.16), transparent), radial-gradient(50% 50% at 85% 70%, rgba(255,138,0,.12), transparent)',
        pointerEvents:'none'
      }}/>
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'url(https://image.tmdb.org/t/p/original/2vFuG6bWGyQUzYS9d69E5l85nIz.jpg)',
        backgroundSize:'cover', backgroundPosition:'center', opacity:.15, filter:'blur(2px)'
      }}/>
      <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(7,9,15,.7), rgba(7,9,15,.95))'}}/>

      <div style={{
        position:'relative', maxWidth:1440, margin:'0 auto', padding:'24px 64px',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <a href="#" onClick={e=>{e.preventDefault();onBack&&onBack()}} style={{textDecoration:'none'}}>
          <NovaPlayLogo size={30}/>
        </a>
        <div style={{fontSize:13, color:'#a8b0c0'}}>
          {mode==='login'?'Chưa có tài khoản?':'Đã có tài khoản?'}{' '}
          <a href="#" onClick={e=>{e.preventDefault();setMode(mode==='login'?'signup':'login')}}
            style={{color:'#ff4d6f', fontWeight:700, textDecoration:'none'}}>
            {mode==='login'?'Đăng ký':'Đăng nhập'}
          </a>
        </div>
      </div>

      <div style={{
        position:'relative', display:'flex', justifyContent:'center', alignItems:'center',
        padding:'60px 24px 80px'
      }}>
        <div style={{
          width:'100%', maxWidth:440,
          background:'rgba(19, 24, 36, 0.7)', backdropFilter:'blur(20px)',
          WebkitBackdropFilter:'blur(20px)',
          border:'1px solid rgba(255,255,255,.08)', borderRadius:20,
          padding:'40px 36px',
          boxShadow:'0 32px 64px rgba(0,0,0,.5)'
        }}>
          <h1 style={{
            fontFamily:'Manrope,sans-serif', fontWeight:800, fontSize:32,
            letterSpacing:'-0.02em', margin:'0 0 8px'
          }}>{mode==='login'?'Chào mừng trở lại 👋':'Tạo tài khoản'}</h1>
          <p style={{color:'#a8b0c0', fontSize:14, margin:'0 0 32px'}}>
            {mode==='login'?'Đăng nhập để tiếp tục xem phim yêu thích':'Đăng ký để bắt đầu hành trình điện ảnh của bạn'}
          </p>

          {/* Social */}
          <div style={{display:'flex', gap:10, marginBottom:24}}>
            {[
              {n:'Google', c:'#fff', bg:'#fff', tc:'#1a1d24'},
              {n:'Facebook', c:'#fff', bg:'#1877f2', tc:'#fff'},
              {n:'Apple', c:'#fff', bg:'#000', tc:'#fff'}
            ].map(p=>(
              <button key={p.n} style={{
                flex:1, padding:'11px 0', borderRadius:10, fontSize:13, fontWeight:600,
                background:p.bg, color:p.tc, border:0, cursor:'pointer', fontFamily:'inherit',
                display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8
              }}>
                <span style={{fontSize:14, fontWeight:800}}>{p.n[0]}</span>
                {p.n}
              </button>
            ))}
          </div>

          <div style={{
            display:'flex', alignItems:'center', gap:12, margin:'8px 0 24px',
            color:'#6b7385', fontSize:12
          }}>
            <div style={{flex:1, height:1, background:'rgba(255,255,255,.08)'}}/>
            <span>hoặc đăng nhập với email</span>
            <div style={{flex:1, height:1, background:'rgba(255,255,255,.08)'}}/>
          </div>

          {/* Inputs */}
          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            {mode==='signup' && (
              <Field label="Họ và tên" placeholder="Nguyễn Văn A" icon="user"/>
            )}
            <Field label="Email" placeholder="ban@example.com" icon="mail"/>
            <Field label="Mật khẩu" placeholder="••••••••" icon="lock" type="password"/>

            {mode==='login' && (
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13}}>
                <label style={{display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer', color:'#a8b0c0'}}>
                  <input type="checkbox" defaultChecked style={{accentColor:'#ff2c55'}}/>
                  Ghi nhớ tôi
                </label>
                <a href="#" onClick={e=>e.preventDefault()} style={{color:'#ff4d6f', textDecoration:'none', fontWeight:600}}>
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <button style={{
              marginTop:8, padding:'14px 0', borderRadius:10, border:0,
              background:'#ff2c55', color:'#fff', fontWeight:700, fontSize:15,
              fontFamily:'inherit', cursor:'pointer',
              boxShadow:'0 0 30px rgba(255,44,85,.45)', transition:'all .2s'
            }}
            onMouseEnter={e=>e.currentTarget.style.background='#ff4d6f'}
            onMouseLeave={e=>e.currentTarget.style.background='#ff2c55'}>
              {mode==='login'?'Đăng nhập':'Tạo tài khoản'}
            </button>
          </div>

          <p style={{fontSize:11.5, color:'#6b7385', marginTop:24, lineHeight:1.5, textAlign:'center'}}>
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <a href="#" style={{color:'#ff4d6f', textDecoration:'none'}}>Điều khoản</a> &{' '}
            <a href="#" style={{color:'#ff4d6f', textDecoration:'none'}}>Chính sách bảo mật</a> của NovaPlay.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, icon, type='text' }) {
  const [focused, setFocused] = useState(false);
  const ICONS = {
    user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    mail:'M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2 M22 6l-10 7L2 6',
    lock:'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4'
  };
  return (
    <div>
      <label style={{
        display:'block', fontSize:12, fontWeight:600, color:'#a8b0c0',
        marginBottom:7, letterSpacing:'.02em'
      }}>{label}</label>
      <div style={{position:'relative'}}>
        <svg viewBox="0 0 24 24" width="16" height="16" style={{
          position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
          stroke:focused?'#ff4d6f':'#6b7385', fill:'none', strokeWidth:2,
          strokeLinecap:'round', transition:'stroke .2s'
        }}><path d={ICONS[icon]}/></svg>
        <input
          type={type}
          placeholder={placeholder}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          style={{
            width:'100%', padding:'13px 16px 13px 42px',
            background:focused?'rgba(255,255,255,.06)':'rgba(255,255,255,.04)',
            border:focused?'1.5px solid #ff2c55':'1.5px solid rgba(255,255,255,.08)',
            borderRadius:10, color:'#fff', fontSize:14, outline:'none',
            fontFamily:'inherit', transition:'all .2s',
            boxShadow:focused?'0 0 0 4px rgba(255,44,85,.12)':'none'
          }}
        />
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
