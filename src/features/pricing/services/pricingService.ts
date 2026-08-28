import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { GenericResponse } from '@/lib/api/types';
import type { CouponValidationResult, PlanDTO } from '../types';
import { PRICING_PLANS, DEMO_COUPONS, formatCurrency } from '../data/plans';

export { PRICING_PLANS, formatCurrency };

export const pricingService = {
  /**
   * Lấy danh sách các gói cước VIP
   */
  async getPlans(): Promise<PlanDTO[]> {
    return PRICING_PLANS;
  },

  /**
   * Kiểm tra tính hợp lệ và xem trước mức giảm giá của Coupon
   */
  async validateCoupon(code: string, originalAmount = 69000): Promise<CouponValidationResult> {
    const uppercaseCode = code.trim().toUpperCase();
    try {
      const res = await apiClient.get<GenericResponse<CouponValidationResult>>(
        ENDPOINTS.promotions.validateCoupon(uppercaseCode),
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback to local demo coupons
    }

    if (DEMO_COUPONS[uppercaseCode]) {
      const discountPercent = DEMO_COUPONS[uppercaseCode].discountPercent;
      const discountAmount = (originalAmount * discountPercent) / 100;
      const finalAmount = Math.max(0, originalAmount - discountAmount);

      return {
        code: uppercaseCode,
        valid: true,
        discountType: 'PERCENTAGE',
        discountPercent,
        discountValue: discountPercent,
        discountAmount,
        originalAmount,
        finalAmount,
        message: DEMO_COUPONS[uppercaseCode].desc,
      };
    }

    return {
      code: uppercaseCode,
      valid: false,
      discountAmount: 0,
      originalAmount,
      finalAmount: originalAmount,
      message: 'Mã ưu đãi không tồn tại hoặc đã hết hạn sử dụng.',
    };
  },

  /**
   * Đổi mã / Áp dụng nâng cấp gói cước
   */
  async redeemCoupon(code: string, planId: string): Promise<boolean> {
    try {
      const res = await apiClient.post<GenericResponse<void>>(
        ENDPOINTS.promotions.redeemCoupon,
        { code, planId },
      );
      return res.data?.success ?? true;
    } catch {
      return true;
    }
  },
};
