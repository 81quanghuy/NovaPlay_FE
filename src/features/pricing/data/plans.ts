import type { PlanDTO } from '../types';

export const PRICING_PLANS: PlanDTO[] = [
  {
    id: 'FREE',
    name: 'Gói Miễn Phí (MEMBER)',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Chất lượng hình ảnh 720p / 1080p cơ bản',
      'Xem đồng thời trên 1 thiết bị',
      'Đầy đủ phụ đề tiếng Việt',
      'Có quảng cáo ngắn đầu phim',
    ],
    notIncluded: [
      'Phát trực tuyến 4K Ultra HD & HDR',
      'Âm thanh vòm Dolby Atmos / 5.1',
      'Xem đồng thời trên 4 thiết bị',
      'Ưu tiên tốc độ máy chủ VIP',
    ],
    maxResolution: 'Full HD 1080p',
    maxScreens: 1,
    screens: 1,
    audioQuality: 'Stereo 2.0',
    adFree: false,
    offlineDownload: false,
    glowColor: 'none',
    description: 'Thưởng thức các tựa phim kinh điển cơ bản với chất lượng Full HD tiêu chuẩn.',
  },
  {
    id: 'VIP_STANDARD',
    name: 'VIP STANDARD',
    badge: 'Phổ Biến Nhất',
    popularBadge: true,
    popular: true,
    isPopular: true,
    priceMonthly: 69000,
    priceYearly: 690000,
    features: [
      'Không quảng cáo 100%',
      'Chất lượng Full HD 1080p 60fps sắc nét',
      'Xem đồng thời trên 2 thiết bị',
      'Tốc độ máy chủ Server VIP #1',
      'Hỗ trợ phụ đề Vietsub & Thuyết minh',
    ],
    notIncluded: [
      'Chất lượng IMAX 4K UHD 2160p',
      'Âm thanh Dolby Atmos chuyên sâu',
    ],
    maxResolution: '1080p 60fps',
    maxScreens: 2,
    screens: 2,
    audioQuality: 'Dolby Digital 5.1',
    adFree: true,
    offlineDownload: true,
    glowColor: 'cyan',
    description: 'Trải nghiệm mượt mà không quảng cáo, âm thanh sống động và toàn bộ kho phim.',
  },
  {
    id: 'VIP_4K',
    name: 'VIP 4K ULTRA HD',
    badge: 'Trải Nghiệm Đỉnh Cao',
    priceMonthly: 119000,
    priceYearly: 1190000,
    features: [
      'Chất lượng siêu nét 4K Ultra HD & HDR',
      'Âm thanh vòm rạp chiếu 5.1 Dolby Atmos',
      'Toàn bộ kho phim bom tấn & Độc quyền',
      'Tốc độ cao nhất, không giật lag',
      'Xem đồng thời trên 4 thiết bị',
      'Huy hiệu Thành Viên VIP Vàng trên hồ sơ',
      'Hỗ trợ khách hàng ưu tiên 24/7',
    ],
    maxResolution: '4K Ultra HD + HDR',
    maxScreens: 4,
    screens: 4,
    audioQuality: 'Dolby Atmos 7.1',
    adFree: true,
    offlineDownload: true,
    glowColor: 'gold',
    description: 'Chuẩn rạp chiếu phim tại gia với hình ảnh 4K HDR và âm thanh vòm Dolby Atmos đa chiều.',
  },
];

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

export const DEMO_COUPONS: Record<string, { discountPercent: number; desc: string }> = {
  NOVAVIP50: { discountPercent: 50, desc: 'Giảm 50% cho gói VIP bất kỳ' },
  SUPERVIP: { discountPercent: 30, desc: 'Giảm 30% tri ân thành viên mới' },
  FREEMONTH: { discountPercent: 100, desc: 'Miễn phí 1 tháng trải nghiệm VIP 4K' },
};
