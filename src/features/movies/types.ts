/**
 * Kiểu Movie hợp nhất — nguồn sự thật duy nhất cho toàn bộ ứng dụng.
 * Chuẩn hóa theo phong cách RoPhim / PhimHay với đầy đủ annotations.
 */
export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  releaseYear: number;
  /** Thời lượng tính bằng phút */
  duration: number;
  rating: number;
  genres: string[];
  poster: string;
  backdrop: string;
  youtubeKey: string;
  director?: string;
  cast?: string[];
  country?: string;
  /** 'movie' | 'series' */
  type?: 'movie' | 'series';
  /** Chất lượng phát: HD, FHD, 4K */
  quality?: 'HD' | 'FHD' | '4K';
  /** Phụ đề: Vietsub, Thuyết Minh, Lồng Tiếng */
  subtitleType?: 'Vietsub' | 'Thuyết Minh' | 'Lồng Tiếng';
  /** Chỉ có khi type === 'series' */
  episodes?: {
    total: number;
    seasons: number;
    current?: number;
  };
  /** Lượt xem ước tính */
  viewCount?: number;
  /** Cờ phân loại cho danh sách */
  trending?: boolean;
  topRated?: boolean;
  newRelease?: boolean;
}

export const GENRES = [
  'Hành Động',
  'Phiêu Lưu',
  'Hài',
  'Tâm Lý',
  'Khoa Học Viễn Tưởng',
  'Kinh Dị',
  'Lãng Mạn',
  'Hoạt Hình',
  'Tội Phạm',
  'Giật Gân',
  'Chiến Tranh',
  'Âm Nhạc',
] as const;

export type Genre = (typeof GENRES)[number];

export const COUNTRIES = [
  'Âu Mỹ',
  'Hàn Quốc',
  'Nhật Bản',
  'Trung Quốc',
  'Việt Nam',
  'Thái Lan',
  'Anh',
] as const;

export type Country = (typeof COUNTRIES)[number];
