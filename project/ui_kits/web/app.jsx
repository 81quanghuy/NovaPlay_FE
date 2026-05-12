/* global React, ReactDOM */
const { useState, useEffect } = React;

function HomeScreen({ onOpen }) {
  return (
    <div style={{background:'#07090f', color:'#fff'}}>
      <Navbar onNav={()=>{}} route="home" transparent/>
      <HeroSlider movies={window.NP_HERO} onOpen={onOpen}/>
      <TopTen movies={window.NP_TRENDING} onOpen={onOpen}/>
      <MovieRow title="Phim Mới Cập Nhật" movies={window.NP_NEW} onOpen={onOpen}/>
      <MovieRow title="Sắp Chiếu" movies={window.NP_UPCOMING} onOpen={onOpen}/>
      <MovieRow title="Phim Bộ Đề Cử" movies={window.NP_MOVIES.slice(2,10)} onOpen={onOpen}/>
      <Footer/>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState({ name:'home' });
  if (route.name==='home')
    return <HomeScreen onOpen={(m)=>setRoute({name:'detail', movie:m})}/>;
  if (route.name==='detail')
    return <MovieDetailScreen movie={route.movie} onBack={()=>setRoute({name:'home'})}/>;
  if (route.name==='login')
    return <LoginScreen onBack={()=>setRoute({name:'home'})}/>;
  return null;
}

// Pass `screen=home|detail|login` via URL hash to render a specific screen
const hash = new URLSearchParams(location.hash.replace('#','')).get('screen');
function Boot() {
  const [route, setRoute] = useState(()=>{
    if (hash==='detail') return {name:'detail', movie:window.NP_MOVIES.find(m=>m.id===19)};
    if (hash==='login') return {name:'login'};
    return {name:'home'};
  });

  // Scroll to top whenever the screen changes (fix: "Xem ngay" was landing
  // user at the bottom of the new screen because previous scroll position
  // was retained).
  useEffect(()=>{
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [route.name, route.movie && route.movie.id]);

  const go = (next) => setRoute(next);
  if (route.name==='home')
    return <HomeScreen onOpen={(m)=>go({name:'detail', movie:m})}/>;
  if (route.name==='detail')
    return <MovieDetailScreen movie={route.movie} onBack={()=>go({name:'home'})}/>;
  return <LoginScreen onBack={()=>go({name:'home'})}/>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Boot/>);
