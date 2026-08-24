import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';
import { useWatchlistStore } from '@/features/movies/store/watchlistStore';
import { useHistoryStore } from '@/features/movies/store/historyStore';
import { MOVIES } from '@/features/movies/data/movies';
import type {
  UserProfileDTO,
  WatchProgressDTO,
  ProfileUpdateRequest,
  AvatarUploadResponse,
  PageResponse,
  MovieSummaryDTO,
  SubscriptionPlan,
} from '../types';

interface ApiResponseEnvelope<T> {
  success?: boolean;
  message?: string;
  statusCode?: number;
  result?: T;
  data?: T;
}

function unwrapResponse<T>(data: unknown): T {
  if (data && typeof data === 'object') {
    const envelope = data as ApiResponseEnvelope<T>;
    if (envelope.result !== undefined) {
      return envelope.result;
    }
    if (envelope.data !== undefined) {
      return envelope.data;
    }
  }
  return data as T;
}

// Local mock profile cache for realistic local mutation fallback
let localMockProfile: UserProfileDTO | null = null;

function getInitialMockProfile(): UserProfileDTO {
  const authUser = useAuthStore.getState().user;
  const watchlistCount = useWatchlistStore.getState().ids.length;
  const historyCount = useHistoryStore.getState().history.length;

  const isAdmin = authUser?.roles?.some((r) => r.roleName === 'ADMIN') ?? false;
  const plan: SubscriptionPlan = isAdmin ? 'VIP_4K' : 'VIP_STANDARD';
  const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: authUser?.id || 'usr_novaplay_member',
    username: authUser?.username || 'novaplay_member',
    email: authUser?.email || 'member@novaplay.vn',
    fullName: authUser?.username === 'vip_cinephile' ? 'Nguyễn Hoàng Minh' : authUser?.username || 'Nguyễn Hoàng Minh',
    phoneNumber: '0987654321',
    bio: 'Mọt phim Christopher Nolan và Sci-Fi. Đam mê trải nghiệm điện ảnh 4K HDR & âm thanh Dolby Atmos.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
    plan,
    planExpiresAt,
    createdAt: '2026-01-15T08:00:00.000Z',
    stats: {
      watchlistCount,
      historyCount,
      streakDays: 3,
      watchedMoviesCount: Math.max(historyCount, 12),
      favoritesCount: Math.max(watchlistCount, 8),
      totalHoursWatched: 36.5,
    },
  };
}

export const userService = {
  /**
   * Lấy thông tin hồ sơ người dùng hiện tại
   */
  async getProfile(): Promise<UserProfileDTO> {
    try {
      const res = await apiClient.get<ApiResponseEnvelope<UserProfileDTO>>('/users/me');
      const profile = unwrapResponse<UserProfileDTO>(res.data);
      if (profile && profile.id) {
        localMockProfile = profile;
        return profile;
      }
    } catch {
      // Backend offline or mock mode — proceed to mock fallback
    }

    if (!localMockProfile) {
      localMockProfile = getInitialMockProfile();
    } else {
      // Refresh real-time counts from Zustand stores
      localMockProfile.stats.watchlistCount = useWatchlistStore.getState().ids.length;
      localMockProfile.stats.historyCount = useHistoryStore.getState().history.length;
    }

    const authUser = useAuthStore.getState().user;
    if (authUser) {
      localMockProfile.id = authUser.id;
      localMockProfile.username = authUser.username;
      localMockProfile.email = authUser.email;
    }

    return { ...localMockProfile };
  },

  /**
   * Cập nhật thông tin hồ sơ người dùng
   */
  async updateProfile(data: ProfileUpdateRequest): Promise<UserProfileDTO> {
    try {
      const res = await apiClient.put<ApiResponseEnvelope<UserProfileDTO>>('/users/me', data);
      const profile = unwrapResponse<UserProfileDTO>(res.data);
      if (profile && profile.id) {
        localMockProfile = profile;
        return profile;
      }
    } catch {
      // Fallback
    }

    if (!localMockProfile) {
      localMockProfile = getInitialMockProfile();
    }

    localMockProfile = {
      ...localMockProfile,
      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber ? data.phoneNumber.trim() : localMockProfile.phoneNumber,
      bio: data.bio !== undefined ? data.bio : localMockProfile.bio,
      avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : localMockProfile.avatarUrl,
    };

    return { ...localMockProfile };
  },

  /**
   * Yêu cầu presigned upload URL cho Avatar lên Cloudflare R2
   */
  async requestAvatarUpload(
    fileName: string,
    contentType: string,
    fileSize: number,
  ): Promise<AvatarUploadResponse> {
    try {
      const res = await apiClient.post<ApiResponseEnvelope<AvatarUploadResponse>>(
        '/users/avatar/request-upload',
        { fileName, contentType, fileSize },
      );
      const data = unwrapResponse<AvatarUploadResponse>(res.data);
      if (data && data.uploadUrl) {
        return data;
      }
    } catch {
      // Fallback
    }

    const mediaId = `med_avatar_${Date.now()}`;
    const publicUrl = `https://cdn.novaplay.vn/avatars/${mediaId}.png`;
    const uploadUrl = `https://pub-r2.novaplay.vn/avatars/temp-upload?mediaId=${mediaId}&signature=${Date.now()}`;

    return {
      mediaId,
      uploadUrl,
      publicUrl,
    };
  },

  /**
   * Tải nhị phân trực tiếp tệp ảnh lên Cloudflare R2 presigned URL mà không đính kèm Bearer token
   */
  async uploadAvatarBinary(uploadUrl: string, file: File | Blob | ArrayBuffer): Promise<void> {
    const contentType =
      file instanceof File || file instanceof Blob ? file.type : 'application/octet-stream';

    // Direct binary PUT to presigned destination without Authorization header
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
      },
    });
  },

  /**
   * Lấy danh sách phim yêu thích
   */
  async getFavorites(page = 0, size = 20): Promise<PageResponse<MovieSummaryDTO>> {
    try {
      const res = await apiClient.get<ApiResponseEnvelope<PageResponse<MovieSummaryDTO>>>(
        '/users/favorites',
        { params: { page, size } },
      );
      const data = unwrapResponse<PageResponse<MovieSummaryDTO>>(res.data);
      if (data && Array.isArray(data.content)) {
        return data;
      }
    } catch {
      // Fallback
    }

    const savedIds = useWatchlistStore.getState().ids;
    // Map existing watchlist IDs to MOVIES data
    const matchedMovies: MovieSummaryDTO[] = savedIds
      .map((id) => MOVIES.find((m) => m.id === id))
      .filter((m): m is MovieSummaryDTO => m !== undefined);

    // If watchlist is empty but we want some demo items for first-time view
    const totalElements = matchedMovies.length;
    const startIndex = page * size;
    const paginated = matchedMovies.slice(startIndex, startIndex + size);

    return {
      content: paginated,
      totalElements,
      totalPages: Math.ceil(totalElements / size) || 1,
      page,
      size,
      last: startIndex + size >= totalElements,
    };
  },

  /**
   * Thêm phim vào danh sách yêu thích
   */
  async addFavorite(movieId: string): Promise<void> {
    useWatchlistStore.getState().add(movieId);
    try {
      await apiClient.post('/users/favorites', { movieId });
    } catch {
      // Ignore network error for local store sync
    }
  },

  /**
   * Xóa phim khỏi danh sách yêu thích
   */
  async removeFavorite(movieId: string): Promise<void> {
    useWatchlistStore.getState().remove(movieId);
    try {
      await apiClient.delete(`/users/favorites/${movieId}`);
    } catch {
      // Ignore network error for local store sync
    }
  },

  /**
   * Lấy danh sách tiến trình xem phim
   */
  async getWatchProgressList(page = 0, size = 20): Promise<PageResponse<WatchProgressDTO>> {
    try {
      const res = await apiClient.get<ApiResponseEnvelope<PageResponse<WatchProgressDTO>>>(
        '/users/watch-progress',
        { params: { page, size } },
      );
      const data = unwrapResponse<PageResponse<WatchProgressDTO>>(res.data);
      if (data && Array.isArray(data.content)) {
        return data;
      }
    } catch {
      // Fallback
    }

    const historyItems = useHistoryStore.getState().history;
    const content: WatchProgressDTO[] = historyItems.map((item) => {
      const movie = MOVIES.find((m) => m.id === item.movieId);
      const durationSeconds = (movie?.duration || 120) * 60;
      const positionSeconds = Math.round((item.progressPercent / 100) * durationSeconds);

      return {
        movieId: item.movieId,
        movieTitle: movie?.title || item.movieId,
        moviePoster: movie?.poster || 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        episode: item.episode,
        positionSeconds,
        durationSeconds,
        progressPercent: item.progressPercent,
        lastWatchedAt: new Date(item.updatedAt).toISOString(),
      };
    });

    const totalElements = content.length;
    const startIndex = page * size;
    const paginated = content.slice(startIndex, startIndex + size);

    return {
      content: paginated,
      totalElements,
      totalPages: Math.ceil(totalElements / size) || 1,
      page,
      size,
      last: startIndex + size >= totalElements,
    };
  },

  /**
   * Cập nhật tiến độ xem phim
   */
  async updateWatchProgress(payload: {
    movieId: string;
    episode?: number;
    positionSeconds: number;
    durationSeconds: number;
  }): Promise<void> {
    const progressPercent = Math.min(
      100,
      Math.max(0, Math.round((payload.positionSeconds / Math.max(1, payload.durationSeconds)) * 100)),
    );
    useHistoryStore.getState().saveProgress(payload.movieId, payload.episode || 1, progressPercent);

    try {
      await apiClient.put('/users/watch-progress', {
        ...payload,
        progressPercent,
      });
    } catch {
      // Ignore network error for local store sync
    }
  },

  /**
   * Xóa 1 phim khỏi lịch sử xem
   */
  async removeWatchProgress(movieId: string): Promise<void> {
    useHistoryStore.getState().removeFromHistory(movieId);
    try {
      await apiClient.delete(`/users/watch-progress/${movieId}`);
    } catch {
      // Ignore network error
    }
  },

  /**
   * Xóa toàn bộ lịch sử xem
   */
  async clearWatchHistory(): Promise<void> {
    useHistoryStore.getState().clearHistory();
    try {
      await apiClient.delete('/users/watch-progress');
    } catch {
      // Ignore network error
    }
  },
};
