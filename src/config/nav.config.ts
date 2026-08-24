import { PATHS } from '@/routes/paths';

export const NAV_LINKS = [
  { label: 'Trang Chủ', to: PATHS.HOME },
  { label: 'Phim', to: PATHS.MOVIES },
  { label: 'Tìm Kiếm', to: PATHS.SEARCH },
  { label: 'Yêu Thích', to: PATHS.WATCHLIST },
] as const;

export const NAV_GENRES = [
  'Hành Động',
  'Tâm Lý',
  'Kinh Dị',
  'Hài',
  'Khoa Học Viễn Tưởng',
  'Lãng Mạn',
  'Hoạt Hình',
  'Tội Phạm',
] as const;

export const NAV_COUNTRIES = [
  'Âu Mỹ',
  'Hàn Quốc',
  'Nhật Bản',
  'Trung Quốc',
  'Việt Nam',
  'Thái Lan',
] as const;


export const FOOTER_COLS = [
  {
    title: 'NovaPlay',
    links: [
      { label: 'Giới Thiệu', to: null },
      { label: 'Điều Khoản Dịch Vụ', to: null },
      { label: 'Chính Sách Bảo Mật', to: null },
    ],
  },
  {
    title: 'Khám Phá',
    links: [
      { label: 'Phim', to: PATHS.MOVIES },
      { label: 'Tìm Kiếm', to: PATHS.SEARCH },
      { label: 'Yêu Thích', to: PATHS.WATCHLIST },
    ],
  },
  {
    title: 'Hỗ Trợ',
    links: [
      { label: 'Trợ Giúp', to: null },
      { label: 'Liên Hệ', to: null },
    ],
  },
] as const;
