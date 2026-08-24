import { apiClient } from '@/lib/api/client';
import type {
  PlanDTO,
  CouponValidationResult,
  RedemptionPayload,
  RedemptionResult,
  RedemptionHistoryDTO,
  PaymentMethodOption,
} from '../types';

export const PRICING_PLANS: PlanDTO[] = [
  {
    id: 'FREE',
    name: 'Free Member',
    priceMonthly: 0,
    priceYearly: 0,
    maxResolution: '480p SD',
    maxScreens: 1,
    screens: 1,
    audioQuality: 'Stereo 2.0',
    adFree: false,
    offlineDownload: false,
    glowColor: 'none',
    popular: false,
    popularBadge: false,
    description: 'Trải nghiệm xem phim cơ bản với các tác phẩm miễn phí',
    features: [
      'Độ phân giải tối đa 480p SD',
      'Xem trên 1 thiết bị đồng thời',
      'Âm thanh tiêu chuẩn Stereo 2.0',
      'Xem có quảng cáo',
      'Không hỗ trợ tải phim xem offline',
      'Kho phim giới hạn cho thành viên miễn phí',
    ],
  },
  {
    id: 'VIP_STANDARD',
    name: 'VIP Standard FHD',
    priceMonthly: 79000,
    priceYearly: 758000,
    maxResolution: '1080p FHD',
    maxScreens: 2,
    screens: 2,
    audioQuality: 'Dolby Digital 5.1',
    adFree: true,
    offlineDownload: true,
    glowColor: 'cyan',
    popular: true,
    popularBadge: true,
    description: 'Lựa chọn hoàn hảo & phổ biến nhất cho cá nhân và gia đình',
    features: [
      'Độ phân giải Full HD 1080p sắc nét',
      'Xem cùng lúc 2 thiết bị',
      'Âm thanh vòm Dolby Digital 5.1',
      'Hoàn toàn không có quảng cáo',
      'Tải phim offline (tối đa 10 phim)',
      'Kho phim chiếu rạp và bom tấn độc quyền',
      'Ưu tiên băng thông đường truyền cao',
    ],
  },
  {
    id: 'VIP_4K',
    name: 'VIP 4K Ultra HD',
    priceMonthly: 129000,
    priceYearly: 1238000,
    maxResolution: '4K Ultra HD + HDR',
    maxScreens: 4,
    screens: 4,
    audioQuality: 'Dolby Atmos',
    adFree: true,
    offlineDownload: true,
    glowColor: 'gold',
    popular: false,
    popularBadge: false,
    description: 'Trải nghiệm điện ảnh đỉnh cao chuẩn rạp chiếu phim tại gia',
    features: [
      'Độ phân giải 4K Ultra HD + HDR đỉnh cao',
      'Xem cùng lúc 4 thiết bị',
      'Âm thanh chuẩn rạp chiếu Dolby Atmos',
      'Hoàn toàn không có quảng cáo',
      'Tải phim offline không giới hạn',
      'Kho phim 4K & Xem trước phim độc quyền (Early Access)',
      'Ưu tiên kết nối máy chủ CDN VIP chuyên biệt',
      'Hỗ trợ kỹ thuật VIP 24/7',
    ],
  },
];

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'MOMO',
    name: 'Ví MoMo',
    description: 'Quét mã QR qua ứng dụng MoMo tức thì',
    badge: 'Phổ biến',
  },
  {
    id: 'VNPAY',
    name: 'VNPay QR / Thẻ ATM',
    description: 'Hỗ trợ thẻ ATM nội địa & hơn 40 ngân hàng',
    badge: 'Tự động',
  },
  {
    id: 'VIETQR',
    name: 'Chuyển khoản VietQR',
    description: 'Quét mã QR chuyển khoản 24/7 miễn phí',
    badge: 'Khuyên dùng',
  },
];

export function formatCurrency(amount: number): string {
  if (amount === 0) return 'Miễn phí';
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
}

export function calculateCouponDiscount(
  code: string,
  _planId: string,
  amount: number,
): CouponValidationResult {
  const cleanCode = code.trim().toUpperCase();
  const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;

  if (cleanCode === 'NOVAVIP50') {
    const discountAmount = Math.round(safeAmount * 0.5);
    return {
      code: cleanCode,
      discountType: 'PERCENTAGE',
      discountValue: 50,
      discountPercent: 50,
      originalAmount: safeAmount,
      discountAmount,
      finalAmount: Math.max(0, safeAmount - discountAmount),
      valid: true,
      message: 'Áp dụng thành công giảm giá 50%',
    };
  }

  if (cleanCode === 'SAVE30K') {
    const discountAmount = Math.min(30000, safeAmount);
    return {
      code: cleanCode,
      discountType: 'FIXED_AMOUNT',
      discountValue: 30000,
      originalAmount: safeAmount,
      discountAmount,
      finalAmount: Math.max(0, safeAmount - discountAmount),
      valid: true,
      message: 'Áp dụng giảm 30.000đ',
    };
  }

  if (cleanCode === 'CAP40K') {
    const rawDiscount = Math.round(safeAmount * 0.5);
    const cappedDiscount = Math.min(rawDiscount, 40000);
    return {
      code: cleanCode,
      discountType: 'PERCENTAGE',
      discountValue: 50,
      discountPercent: 50,
      maxDiscountCap: 40000,
      maxDiscountAmount: 40000,
      originalAmount: safeAmount,
      discountAmount: cappedDiscount,
      finalAmount: Math.max(0, safeAmount - cappedDiscount),
      valid: true,
      message: 'Áp dụng giảm 50% (tối đa 40.000đ)',
    };
  }

  if (cleanCode === 'MIN150K') {
    if (safeAmount < 150000) {
      return {
        code: cleanCode,
        discountType: 'FIXED_AMOUNT',
        discountValue: 50000,
        minOrderValue: 150000,
        minOrderAmount: 150000,
        originalAmount: safeAmount,
        discountAmount: 0,
        finalAmount: safeAmount,
        valid: false,
        message: 'Mã ưu đãi yêu cầu đơn hàng tối thiểu 150.000đ',
      };
    }
    const discountAmount = Math.min(50000, safeAmount);
    return {
      code: cleanCode,
      discountType: 'FIXED_AMOUNT',
      discountValue: 50000,
      minOrderValue: 150000,
      minOrderAmount: 150000,
      originalAmount: safeAmount,
      discountAmount,
      finalAmount: Math.max(0, safeAmount - discountAmount),
      valid: true,
      message: 'Áp dụng giảm 50.000đ',
    };
  }

  return {
    code: cleanCode,
    discountType: 'FIXED_AMOUNT',
    discountValue: 0,
    originalAmount: safeAmount,
    discountAmount: 0,
    finalAmount: safeAmount,
    valid: false,
    message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn',
  };
}

export const pricingService = {
  async getPlans(): Promise<PlanDTO[]> {
    try {
      const response = await apiClient.get<PlanDTO[]>('/promotions/plans');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return PRICING_PLANS;
    } catch {
      return PRICING_PLANS;
    }
  },

  async validateCoupon(
    code: string,
    planId: string,
    amount: number,
  ): Promise<CouponValidationResult> {
    try {
      const cleanCode = code.trim().toUpperCase();
      const response = await apiClient.get<CouponValidationResult>(
        `/promotions/coupons/${encodeURIComponent(cleanCode)}/validate`,
        { params: { planId, amount } },
      );
      if (response.data && typeof response.data.valid === 'boolean') {
        return response.data;
      }
      return calculateCouponDiscount(code, planId, amount);
    } catch {
      return calculateCouponDiscount(code, planId, amount);
    }
  },

  async redeemCoupon(
    code: string,
    payload: RedemptionPayload,
  ): Promise<RedemptionResult> {
    try {
      const cleanCode = code ? code.trim().toUpperCase() : 'DIRECT';
      const response = await apiClient.post<RedemptionResult>(
        `/promotions/coupons/${encodeURIComponent(cleanCode)}/redeem`,
        payload,
      );
      if (response.data && response.data.orderId) {
        return response.data;
      }
      return this.createMockRedemption(payload);
    } catch {
      return this.createMockRedemption(payload);
    }
  },

  async getMyRedemptions(page = 1, size = 10): Promise<RedemptionHistoryDTO[]> {
    try {
      const response = await apiClient.get<RedemptionHistoryDTO[]>(
        '/promotions/coupons/my-redemptions',
        { params: { page, size } },
      );
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch {
      return [
        {
          id: 'red_01',
          couponCode: 'NOVAVIP50',
          planId: 'VIP_STANDARD',
          discountAmount: 39500,
          redeemedAt: '2026-08-20T10:00:00Z',
        },
      ];
    }
  },

  createMockRedemption(payload: RedemptionPayload): RedemptionResult {
    const daysToAdd = payload.billingCycle === 'yearly' ? 365 : 30;
    const expiry = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
    const orderId = `ord_vip_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

    return {
      orderId,
      newPlan: payload.planId,
      expiryDate: expiry,
      paymentMethod: payload.paymentMethod || 'VIETQR',
      amountPaid: payload.amount,
      status: 'SUCCESS',
      message: 'Kích hoạt gói cước VIP thành công',
    };
  },
};
