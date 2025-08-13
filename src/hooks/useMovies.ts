import { useState, useEffect, useRef } from 'react';
import { Movie } from '@/types/movie';
import {getSliderMovies, getTrendingMovies, getNewMovies, getUpcomingMovies } from '@/data/mockMovies';

// In-memory cache for the homepage movie sets within a session
let cachedTrending: Movie[] | null = null;
let cachedSlider: Movie[] | null = null;
let cachedNew: Movie[] | null = null;
let cachedUpcoming: Movie[] | null = null;
let hasFetchedHomeSets = false;

export const useMovies = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>(cachedTrending ?? []);
  const [sliderMovies, setSliderMovies] = useState<Movie[]>(cachedSlider ?? []);
  const [newMovies, setNewMovies] = useState<Movie[]>(cachedNew ?? []);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>(cachedUpcoming ?? []);
  const [loading, setLoading] = useState<boolean>(!hasFetchedHomeSets);
  const [error, setError] = useState<string | null>(null);
  const didStartRef = useRef(false);

  useEffect(() => {
    if (didStartRef.current) return;
    didStartRef.current = true;

    const fetchMovies = async () => {
      try {
        if (!hasFetchedHomeSets) {
          setLoading(true);
        }
        // Optionally keep a short delay only for the very first load to show smooth spinner
        if (!hasFetchedHomeSets) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        const slider = getSliderMovies();
        const trending = getTrendingMovies();
        const news = getNewMovies();
        const upcoming = getUpcomingMovies();

        cachedSlider = slider;
        cachedTrending = trending;
        cachedNew = news;
        cachedUpcoming = upcoming;
        hasFetchedHomeSets = true;

        setSliderMovies(slider);
        setTrendingMovies(trending);
        setNewMovies(news);
        setUpcomingMovies(upcoming);
        setError(null);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu phim');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return {
    trendingMovies,
    sliderMovies,
    newMovies,
    upcomingMovies,
    loading,
    error,
  };
};