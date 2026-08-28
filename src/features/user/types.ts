import type { Movie } from '@/features/movies/types';

export type SubscriptionPlan = 'FREE' | 'VIP_STANDARD' | 'VIP_4K';

export interface UserStatsDTO {
  watchlistCount: number;
  historyCount: number;
  streakDays?: number;
  watchedMoviesCount?: number;
  favoritesCount?: number;
  totalHoursWatched?: number;
}

export interface UserProfileDTO {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
  plan: SubscriptionPlan;
  planExpiresAt?: string;
  createdAt: string;
  stats: UserStatsDTO;
}

export interface WatchProgressDTO {
  movieId: string;
  movieTitle?: string;
  moviePoster?: string;
  episode?: number;
  positionSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  lastWatchedAt: string;
}

export interface ProfileUpdateRequest {
  fullName: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AvatarUploadRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface AvatarUploadResponse {
  mediaId: string;
  uploadUrl: string;
  publicUrl: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  last?: boolean;
}

export type MovieSummaryDTO = Movie;
