import { useState, useEffect, useRef } from 'react';
import { movieService } from '../movieService';

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  releaseDate: string;
  rating: number;
}

// Simple in-memory cache for this session
let cachedMovieList: Movie[] | null = null;
let hasFetchedMovieList = false;

export const useFetchMovies = () => {
  const [movies, setMovies] = useState<Movie[]>(cachedMovieList ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(!hasFetchedMovieList);
  const [error, setError] = useState<string | null>(null);
  const didStartRef = useRef(false);

  useEffect(() => {
    if (didStartRef.current) return;
    didStartRef.current = true;

    const fetchMovies = async () => {
      try {
        // If already fetched once this session, show instantly and refresh in background
        if (!hasFetchedMovieList) {
          setIsLoading(true);
        }
        const data = await movieService.getMovies();
        cachedMovieList = data;
        hasFetchedMovieList = true;
        setMovies(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách phim');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { movies, isLoading, error };
};