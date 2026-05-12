import Navbar from '../components/Navbar';
import HeroSlider from '../components/MovieSlider';
import { MovieRow, TopTen } from '../components/MovieRows';
import Footer from '../components/Footer';
import { NP_HERO, NP_NEW, NP_UPCOMING, NP_MOVIES, NP_TRENDING } from '../data';
import type { Movie } from '../data';

interface HomeScreenProps {
  onOpen: (movie: Movie) => void;
  onNav: (route: string) => void;
}

export default function HomeScreen({ onOpen, onNav }: HomeScreenProps) {
  return (
    <div style={{ background: '#07090f', color: '#fff' }}>
      <Navbar onNav={onNav} transparent />
      <HeroSlider movies={NP_HERO} onOpen={onOpen} />
      <TopTen movies={NP_TRENDING} onOpen={onOpen} />
      <MovieRow title="Phim Mới Cập Nhật" movies={NP_NEW} onOpen={onOpen} />
      <MovieRow title="Sắp Chiếu" movies={NP_UPCOMING} onOpen={onOpen} />
      <MovieRow title="Phim Bộ Đề Cử" movies={NP_MOVIES.slice(2, 10)} onOpen={onOpen} />
      <Footer />
    </div>
  );
}
