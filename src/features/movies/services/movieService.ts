import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { GenericResponse, PageResponse } from '@/lib/api/types';
import type { Movie, Genre } from '../types';
import { MOVIES, GENRES, getMovie } from '../data/movies';

export const movieService = {
  /**
   * Lấy danh sách phim có phân trang & lọc
   */
  async getMovies(params?: {
    page?: number;
    size?: number;
    genre?: string;
    country?: string;
    type?: string;
    sort?: string;
  }): Promise<{ content: Movie[]; totalElements: number; totalPages: number }> {
    try {
      const res = await apiClient.get<GenericResponse<PageResponse<Movie>>>(
        ENDPOINTS.movies.list,
        { params },
      );
      if (res.data?.success && res.data.result?.content) {
        return {
          content: res.data.result.content,
          totalElements: res.data.result.totalElements,
          totalPages: res.data.result.totalPages,
        };
      }
    } catch {
      // Hybrid fallback to mock data
    }

    // Mock fallback logic
    let filtered = [...MOVIES];
    if (params?.genre) {
      filtered = filtered.filter((m) => m.genres.includes(params.genre as Genre));
    }
    if (params?.country) {
      filtered = filtered.filter((m) => m.country === params.country);
    }
    if (params?.type) {
      filtered = filtered.filter((m) => m.type === params.type);
    }

    return {
      content: filtered,
      totalElements: filtered.length,
      totalPages: 1,
    };
  },

  /**
   * Lấy chi tiết một bộ phim
   */
  async getMovieById(id: string): Promise<Movie | null> {
    try {
      const res = await apiClient.get<GenericResponse<Movie>>(
        ENDPOINTS.movies.detail(id),
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Hybrid fallback to mock data
    }
    return getMovie(id) || null;
  },

  /**
   * Lấy danh sách phim thịnh hành (Trending)
   */
  async getTrendingMovies(): Promise<Movie[]> {
    try {
      const res = await apiClient.get<GenericResponse<Movie[]>>(
        ENDPOINTS.movies.trending,
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback
    }
    return MOVIES.slice(0, 10);
  },

  /**
   * Lấy danh sách thể loại phim
   */
  async getGenres(): Promise<Genre[]> {
    try {
      const res = await apiClient.get<GenericResponse<Genre[]>>(
        ENDPOINTS.genres.list,
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback
    }
    return [...GENRES];
  },

  /**
   * Admin: Tạo mới phim
   */
  async createMovie(data: Partial<Movie>): Promise<Movie> {
    try {
      const res = await apiClient.post<GenericResponse<Movie>>(
        ENDPOINTS.movies.adminManage,
        data,
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback
    }
    return data as Movie;
  },

  /**
   * Admin: Cập nhật phim
   */
  async updateMovie(id: string, data: Partial<Movie>): Promise<Movie> {
    try {
      const res = await apiClient.put<GenericResponse<Movie>>(
        ENDPOINTS.movies.adminMovieDetail(id),
        data,
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback
    }
    return data as Movie;
  },

  /**
   * Admin: Xóa phim
   */
  async deleteMovie(id: string): Promise<boolean> {
    try {
      const res = await apiClient.delete<GenericResponse<void>>(
        ENDPOINTS.movies.adminMovieDetail(id),
      );
      return res.data?.success ?? true;
    } catch {
      return true;
    }
  },
};
