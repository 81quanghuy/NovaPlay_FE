// Barrel export cho feature movies
export { HeroSlider } from './components/HeroSlider';
export { TopTen } from './components/TopTen';
export { MovieRow } from './components/MovieRow';
export { MovieCard } from './components/MovieCard';
export { GenreChip } from './components/GenreChip';
export { QuickFilterBar } from './components/QuickFilterBar';
export { CollectionBanner } from './components/CollectionBanner';
export { ContinueWatchingRow } from './components/ContinueWatchingRow';
export { CinemaMoodMatcher } from './components/CinemaMoodMatcher';
export { MovieReviews } from './components/MovieReviews';
export { ShareMovieCardModal } from './components/ShareMovieCardModal';

export {
  MOVIES,
  getMovie,
  getTrending,
  getTopRated,
  getNewReleases,
  getSeries,
  getByGenre,
  searchMovies,
} from './data/movies';
export { useWatchlistStore } from './store/watchlistStore';
export { useHistoryStore } from './store/historyStore';
export type { Movie, Genre, Country } from './types';
export { GENRES, COUNTRIES } from './types';
