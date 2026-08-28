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

export interface AvatarUploadRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface AvatarUploadResponse {
  uploadUrl: string;
  avatarUrl: string;
}

export const userService = {
  /**
   * Lấy thông tin hồ sơ người dùng hiện tại (GET /api/v1/users/me)
   */
  async getProfile(): Promise<UserResponse | null> {
    try {
      const res = await apiClient.get<GenericResponse<UserResponse> | UserResponse>(
        ENDPOINTS.users.me,
      );
      const data = res.data as GenericResponse<UserResponse>;
      const user = data?.result || (res.data as UserResponse);
      if (user) {
        return user;
      }
    } catch {
      // Fallback to local store
    }
    return null;
  },

  /**
   * Cập nhật thông tin cá nhân (PUT /api/v1/users/me)
   */
  async updateProfile(data: {
    fullName?: string;
    displayName?: string;
    preferredUsername?: string;
    phoneNumber?: string;
    bio?: string;
    avatarUrl?: string;
  }): Promise<UserResponse | null> {
    try {
      const res = await apiClient.put<GenericResponse<UserResponse> | UserResponse>(
        ENDPOINTS.users.profile,
        {
          ...data,
          displayName: data.displayName || data.fullName,
          fullName: data.fullName || data.displayName,
        },
      );
      const resData = res.data as GenericResponse<UserResponse>;
      const updatedUser = resData?.result || (res.data as UserResponse);
      if (updatedUser) {
        return updatedUser;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  /**
   * Yêu cầu presigned upload URL cho Avatar (POST /api/v1/users/avatar/request-upload)
   */
  async requestAvatarUpload(data: AvatarUploadRequest): Promise<AvatarUploadResponse | null> {
    try {
      const res = await apiClient.post<GenericResponse<AvatarUploadResponse>>(
        ENDPOINTS.users.avatarUploadRequest,
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
   * Lấy danh sách phim yêu thích (GET /api/v1/users/favorites)
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
   * Thêm phim vào yêu thích (POST /api/v1/users/favorites)
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
   * Xóa phim khỏi danh sách yêu thích (DELETE /api/v1/users/favorites/{movieId})
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
   * Lấy lịch sử tiến độ xem phim (GET /api/v1/users/watch-progress)
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
   * Lưu tiến độ xem phim (PUT /api/v1/users/watch-progress)
   */
  async saveWatchProgress(data: {
    movieId: string;
    episodeId?: string;
    progressPercent: number;
    durationSeconds: number;
  }): Promise<boolean> {
    try {
      const res = await apiClient.put<GenericResponse<void>>(
        ENDPOINTS.users.watchProgress,
        data,
      );
      return res.data?.success ?? true;
    } catch {
      return true;
    }
  },
};
