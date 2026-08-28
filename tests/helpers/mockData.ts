/**
 * Authoritative Mock Data Fixtures for NovaPlay Platform
 * Derived from API_DOCUMENTATION.md and PROJECT.md schemas.
 */

import type { UserResponse, AuthResponse } from '@/lib/api/types';

export const mockMemberUser: UserResponse = {
  id: 'usr_member_101',
  username: 'test_member',
  email: 'member@novaplay.vn',
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: '2026-08-24T18:00:00Z',
  roles: [{ roleName: 'USER', description: 'Standard Free Member' }],
};

export const mockVipUser: UserResponse = {
  id: 'usr_vip_202',
  username: 'vip_cinephile',
  email: 'vip@novaplay.vn',
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: '2026-08-24T19:30:00Z',
  roles: [{ roleName: 'USER', description: 'VIP 4K Ultra Member' }],
};

export const mockAdminUser: UserResponse = {
  id: 'usr_admin_999',
  username: 'super_admin',
  email: 'admin@novaplay.vn',
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: '2026-08-24T20:00:00Z',
  roles: [
    { roleName: 'ADMIN', description: 'System Administrator' },
    { roleName: 'USER', description: 'User role' },
  ],
};

export const mockAuthSuccess: AuthResponse = {
  access_token: 'mock.jwt.access_token_abc123',
  refresh_token: 'mock_refresh_token_xyz789',
  token_type: 'Bearer',
  expires_in: 86400,
  user_profile: mockMemberUser,
};

export interface MockNotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'NEW_MOVIE_RELEASE' | 'ACCOUNT_UPGRADED' | 'SYSTEM' | 'PROMO';
  targetUrl?: string;
  read: boolean;
  createdAt: string;
}

export const mockNotifications: MockNotificationItem[] = [
  {
    id: 'notif_001',
    title: 'Phim Mới Cập Nhật: Oppenheimer (4K)',
    content: 'Tác phẩm bom tấn của Christopher Nolan đã chính thức có mặt trên NovaPlay.',
    type: 'NEW_MOVIE_RELEASE',
    targetUrl: '/movie/oppenheimer-2023',
    read: false,
    createdAt: '2026-08-24T20:15:00Z',
  },
  {
    id: 'notif_002',
    title: 'Chào mừng bạn đến với NovaPlay VIP',
    content: 'Bạn vừa mở khóa tính năng xem phim 4K không giới hạn và âm thanh vòm Dolby Atmos.',
    type: 'ACCOUNT_UPGRADED',
    targetUrl: '/profile',
    read: false,
    createdAt: '2026-08-24T14:30:00Z',
  },
  {
    id: 'notif_003',
    title: 'Bảo trì hệ thống định kỳ',
    content: 'Hệ thống sẽ nâng cấp cơ sở dữ liệu từ 02:00 đến 03:00 sáng mai.',
    type: 'SYSTEM',
    targetUrl: undefined,
    read: true,
    createdAt: '2026-08-23T10:00:00Z',
  },
];

export interface MockPricingTier {
  id: 'FREE' | 'VIP_STANDARD' | 'VIP_4K';
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  maxResolution: string;
  screens: number;
  audioQuality: string;
  adFree: boolean;
  offlineDownload: boolean;
  glowColor: 'none' | 'cyan' | 'gold';
  popular?: boolean;
}

export const mockPricingTiers: MockPricingTier[] = [
  {
    id: 'FREE',
    name: 'Free Member',
    price: 0,
    currency: 'VND',
    billingPeriod: 'Tháng',
    maxResolution: '480p SD',
    screens: 1,
    audioQuality: 'Stereo 2.0',
    adFree: false,
    offlineDownload: false,
    glowColor: 'none',
  },
  {
    id: 'VIP_STANDARD',
    name: 'VIP Standard FHD',
    price: 79000,
    currency: 'VND',
    billingPeriod: 'Tháng',
    maxResolution: '1080p FHD',
    screens: 2,
    audioQuality: 'Dolby Digital 5.1',
    adFree: true,
    offlineDownload: true,
    glowColor: 'cyan',
    popular: true,
  },
  {
    id: 'VIP_4K',
    name: 'VIP 4K Ultra HD',
    price: 129000,
    currency: 'VND',
    billingPeriod: 'Tháng',
    maxResolution: '4K Ultra HD + HDR',
    screens: 4,
    audioQuality: 'Dolby Atmos',
    adFree: true,
    offlineDownload: true,
    glowColor: 'gold',
  },
];

export interface MockCouponValidation {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  valid: boolean;
  message: string;
  maxDiscountCap?: number;
  minOrderValue?: number;
}

export function validateCouponLogic(
  code: string,
  planId: string,
  amount: number
): MockCouponValidation {
  const cleanCode = code.trim().toUpperCase();

  if (cleanCode === 'NOVAVIP50') {
    const discountAmount = Math.round(amount * 0.5);
    return {
      code: cleanCode,
      discountType: 'PERCENTAGE',
      discountValue: 50,
      originalAmount: amount,
      discountAmount,
      finalAmount: amount - discountAmount,
      valid: true,
      message: 'Áp dụng thành công giảm giá 50%',
    };
  }

  if (cleanCode === 'SAVE30K') {
    const discountAmount = Math.min(30000, amount);
    return {
      code: cleanCode,
      discountType: 'FIXED_AMOUNT',
      discountValue: 30000,
      originalAmount: amount,
      discountAmount,
      finalAmount: amount - discountAmount,
      valid: true,
      message: 'Áp dụng giảm 30.000đ',
    };
  }

  if (cleanCode === 'CAP40K') {
    // 50% discount with 40k cap
    const rawDiscount = Math.round(amount * 0.5);
    const cappedDiscount = Math.min(rawDiscount, 40000);
    return {
      code: cleanCode,
      discountType: 'PERCENTAGE',
      discountValue: 50,
      maxDiscountCap: 40000,
      originalAmount: amount,
      discountAmount: cappedDiscount,
      finalAmount: amount - cappedDiscount,
      valid: true,
      message: 'Áp dụng giảm 50% (tối đa 40.000đ)',
    };
  }

  if (cleanCode === 'MIN150K') {
    if (amount < 150000) {
      return {
        code: cleanCode,
        discountType: 'FIXED_AMOUNT',
        discountValue: 50000,
        minOrderValue: 150000,
        originalAmount: amount,
        discountAmount: 0,
        finalAmount: amount,
        valid: false,
        message: 'Mã ưu đãi yêu cầu đơn hàng tối thiểu 150.000đ',
      };
    } else {
      const discountAmount = Math.min(50000, amount);
      return {
        code: cleanCode,
        discountType: 'FIXED_AMOUNT',
        discountValue: 50000,
        minOrderValue: 150000,
        originalAmount: amount,
        discountAmount,
        finalAmount: amount - discountAmount,
        valid: true,
        message: 'Áp dụng giảm 50.000đ',
      };
    }
  }

  return {
    code: cleanCode,
    discountType: 'FIXED_AMOUNT',
    discountValue: 0,
    originalAmount: amount,
    discountAmount: 0,
    finalAmount: amount,
    valid: false,
    message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn',
  };
}

export const mockStreamingManifest = {
  manifestUrl: '/api/v1/streaming/hls/vman_9831412/master.m3u8?pt=eyJhbGciOiJIUzI1Ni...',
  playbackToken: 'mock_pt_hmac_4h_token',
  expiresAt: '2026-08-25T04:00:00Z',
  movie: {
    id: 'mov_inception',
    slug: 'inception-2010',
    title: 'Inception (Kẻ Đánh Cắp Giấc Mơ)',
    quality: '4K',
    audioChannels: '5.1',
    duration: 8880,
  },
  levels: [
    { height: 2160, bitrate: 15000000, label: '4K Ultra HD' },
    { height: 1080, bitrate: 6000000, label: '1080p FHD' },
    { height: 720, bitrate: 3000000, label: '720p HD' },
    { height: 480, bitrate: 1200000, label: '480p SD' },
  ],
};
