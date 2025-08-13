import { useFetchMovies } from './hooks/useFetchMovies';
import MovieCard from './MovieCard';
import { Loading } from '@/components';

const MovieListPage = () => {
  const { movies, isLoading, error } = useFetchMovies();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Danh sách phim</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieListPage; 