import React from 'react';
import MovieSlider from '../components/MovieSlider';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../hooks/useMovies';
import { Link } from 'react-router-dom';
const HomePage: React.FC = () => {
  const {
    sliderMovies,
    newMovies,
    upcomingMovies,
    loading,
    error
  } = useMovies();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section with Trending Movies */}
      <section>
        <h2 className="mb-4 text-2xl font-bold sr-only">Phim Đang Hot</h2>
        <MovieSlider movies={sliderMovies} />
      </section>

      {/* New Movies Section */}
      <section className='mx-auto px-4 py-6'>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Phim Mới Cập Nhật</h2>
          <Link to={"/phim-moi"}
            className="text-sm text-red-500 hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <MovieGrid movies={newMovies} />
      </section>

      {/* Upcoming Movies Section */}
      <section className='mx-auto px-4 py-6'>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Phim Sắp Chiếu</h2>
          <Link to={"/phim-sap-chieu"}
            className="text-sm text-red-500 hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <MovieGrid movies={upcomingMovies} />
      </section>
    </div>
  );
};

export default HomePage; 