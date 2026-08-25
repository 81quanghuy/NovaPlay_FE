import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { GenericResponse, UserResponse } from '@/lib/api/types';

export interface WatchProgressDTO {
  movieId: string;
  episodeId?: string;
  progressPercent: number;
  durationSeconds: number;
  updatedAt: string;
}

export const userService = {
  /**
   * Lấy thông tin hồ sơ người dùng hiện tại
   */
  async getProfile(): Promise<UserResponse | null> {
    try {
      const res = await apiClient.get<GenericResponse<UserResponse>>(
        ENDPOINTS.users.me,
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback to local store
    }
    return null;
  },

  /**
   * Cập nhật thông tin cá nhân
   */
  async updateProfile(data: {
    fullName?: string;
    phoneNumber?: string;
    bio?: string;
  }): Promise<UserResponse | null> {
    try {
      const res = await apiClient.put<GenericResponse<UserResponse>>(
        ENDPOINTS.users.profile,
        data,
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  /**
   * Lấy danh sách phim yêu thích
   */
  async getFavorites(): Promise<string[]> {
    try {
      const res = await apiClient.get<GenericResponse<string[]>>(
        ENDPOINTS.users.favorites,
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback
    }
    return [];
  },

  /**
   * Thêm phim vào yêu thích
   */
  async addFavorite(movieId: string): Promise<boolean> {
    try {
      const res = await apiClient.post<GenericResponse<void>>(
        ENDPOINTS.users.favorites,
        { movieId },
      );
      return res.data?.success ?? true;
    } catch {
      return true;
    }
  },

  /**
   * Xóa phim khỏi danh sách yêu thích
   */
  async removeFavorite(movieId: string): Promise<boolean> {
    try {
      const res = await apiClient.delete<GenericResponse<void>>(
        ENDPOINTS.users.favoriteById(movieId),
      );
      return res.data?.success ?? true;
    } catch {
      return true;
    }
  },

  /**
   * Lấy lịch sử tiến độ xem phim
   */
  async getWatchProgress(): Promise<WatchProgressDTO[]> {
    try {
      const res = await apiClient.get<GenericResponse<WatchProgressDTO[]>>(
        ENDPOINTS.users.watchProgress,
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback
    }
    return [];
  },

  /**
   * Lưu tiến độ xem phim
   */
  async saveWatchProgress(data: {
    movieId: string;
    episodeId?: string;
    progressPercent: number;
    durationSeconds: number;
  }): Promise<boolean> {
    try {
      const res = await apiClient.post<GenericResponse<void>>(
        ENDPOINTS.users.watchProgress,
        data,
      );
      return res.data?.success ?? true;
    } catch {
      return true;
    }
  },
};
