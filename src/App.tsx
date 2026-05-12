import { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import MovieDetailScreen from './screens/MovieDetailScreen';
import LoginScreen from './screens/LoginScreen';
import { NP_MOVIES } from './data';
import type { Movie } from './data';

type Route =
  | { name: 'home' }
  | { name: 'detail'; movie: Movie }
  | { name: 'login' };

function getInitialRoute(): Route {
  const hash = new URLSearchParams(location.hash.replace('#', '')).get('screen');
  if (hash === 'detail') {
    const movie = NP_MOVIES.find(m => m.id === 19);
    if (movie) return { name: 'detail', movie };
  }
  if (hash === 'login') return { name: 'login' };
  return { name: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<Route>(getInitialRoute);

  // Scroll to top whenever screen changes (fixes "Xem ngay" landing at bottom)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [route.name, route.name === 'detail' ? (route as { name: 'detail'; movie: Movie }).movie.id : null]);

  const go = (next: Route) => setRoute(next);

  if (route.name === 'home') {
    return (
      <HomeScreen
        onOpen={m => go({ name: 'detail', movie: m })}
        onNav={r => r === 'login' ? go({ name: 'login' }) : go({ name: 'home' })}
      />
    );
  }
  if (route.name === 'detail') {
    return (
      <MovieDetailScreen
        movie={route.movie}
        onBack={() => go({ name: 'home' })}
      />
    );
  }
  return <LoginScreen onBack={() => go({ name: 'home' })} />;
}
