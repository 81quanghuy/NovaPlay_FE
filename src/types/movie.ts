export interface Movie {
  id: number;
  title: string;
  originalTitle?: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
  genres: string[];
  duration: number; // in minutes
  quality: string; // HD, FHD, etc.
  type: 'movie' | 'series';
  episodes?: {
    current: number;
    total: number;
  };
  tags?: string[];
  year?: number;
  season?: number;
} 