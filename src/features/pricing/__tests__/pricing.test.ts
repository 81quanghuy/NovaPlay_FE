import { describe, it, expect, fn } from '../../../../tests/helpers/framework';
import {
  PRICING_PLANS,
  PAYMENT_METHODS,
  formatCurrency,
  calculateCouponDiscount,
  pricingService,
} from '../services/pricingService';
import type { RedemptionPayload } from '../types';

describe('Pricing Module Unit & Integration Tests', () => {
  describe('Plan Data & Tier Structures', () => {
    it('defines 3 tiers with appropriate IDs and properties', () => {
      expect(PRICING_PLANS).toHaveLength(3);
      expect(PRICING_PLANS.map((p) => p.id)).toEqual(['FREE', 'VIP_STANDARD', 'VIP_4K']);
    });

    it('has accurate monthly and yearly pricing for all tiers', () => {
      const free = PRICING_PLANS.find((p) => p.id === 'FREE')!;
      const standard = PRICING_PLANS.find((p) => p.id === 'VIP_STANDARD')!;
      const vip4k = PRICING_PLANS.find((p) => p.id === 'VIP_4K')!;

      expect(free.priceMonthly).toBe(0);
      expect(free.priceYearly).toBe(0);

      expect(standard.priceMonthly).toBe(79000);
      expect(standard.priceYearly).toBe(758000);

      expect(vip4k.priceMonthly).toBe(129000);
      expect(vip4k.priceYearly).toBe(1238000);
    });

    it('has correct resolution, screens, audio, and privileges mapped', () => {
      const free = PRICING_PLANS.find((p) => p.id === 'FREE')!;
      const standard = PRICING_PLANS.find((p) => p.id === 'VIP_STANDARD')!;
      const vip4k = PRICING_PLANS.find((p) => p.id === 'VIP_4K')!;

      expect(free.maxResolution).toBe('480p SD');
      expect(free.screens).toBe(1);
      expect(free.maxScreens).toBe(1);
      expect(free.audioQuality).toBe('Stereo 2.0');
      expect(free.adFree).toBe(false);
      expect(free.offlineDownload).toBe(false);

      expect(standard.maxResolution).toBe('1080p FHD');
      expect(standard.screens).toBe(2);
      expect(standard.audioQuality).toBe('Dolby Digital 5.1');
      expect(standard.adFree).toBe(true);
      expect(standard.offlineDownload).toBe(true);
      expect(standard.glowColor).toBe('cyan');

      expect(vip4k.maxResolution).toBe('4K Ultra HD + HDR');
      expect(vip4k.screens).toBe(4);
      expect(vip4k.audioQuality).toBe('Dolby Atmos');
      expect(vip4k.adFree).toBe(true);
      expect(vip4k.offlineDownload).toBe(true);
      expect(vip4k.glowColor).toBe('gold');
    });

    it('has payment methods defined', () => {
      expect(PAYMENT_METHODS).toHaveLength(3);
      expect(PAYMENT_METHODS.map((m) => m.id)).toEqual(['MOMO', 'VNPAY', 'VIETQR']);
    });
  });

  describe('Currency Formatting', () => {
    it('formats 0 as "Miễn phí"', () => {
      expect(formatCurrency(0)).toBe('Miễn phí');
    });

    it('formats numbers with Vietnamese Dong currency format', () => {
      expect(formatCurrency(79000)).toBe('79.000đ');
      expect(formatCurrency(129000)).toBe('129.000đ');
      expect(formatCurrency(1238000)).toBe('1.238.000đ');
    });
  });

  describe('Coupon Calculation Engine', () => {
    it('handles NOVAVIP50 (50% discount)', () => {
      const result = calculateCouponDiscount('novavip50', 'VIP_STANDARD', 100000);
      expect(result.valid).toBe(true);
      expect(result.code).toBe('NOVAVIP50');
      expect(result.discountType).toBe('PERCENTAGE');
      expect(result.discountAmount).toBe(50000);
      expect(result.finalAmount).toBe(50000);
    });

    it('handles SAVE30K (fixed 30,000 VND discount)', () => {
      const result = calculateCouponDiscount('  save30k  ', 'VIP_STANDARD', 79000);
      expect(result.valid).toBe(true);
      expect(result.code).toBe('SAVE30K');
      expect(result.discountType).toBe('FIXED_AMOUNT');
      expect(result.discountAmount).toBe(30000);
      expect(result.finalAmount).toBe(49000);
    });

    it('handles CAP40K (50% discount capped at 40,000 VND)', () => {
      const result = calculateCouponDiscount('CAP40K', 'VIP_4K', 129000);
      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(40000);
      expect(result.finalAmount).toBe(89000);
      expect(result.maxDiscountAmount).toBe(40000);
    });

    it('handles MIN150K minimum order constraints', () => {
      const rejected = calculateCouponDiscount('MIN150K', 'VIP_STANDARD', 100000);
      expect(rejected.valid).toBe(false);
      expect(rejected.discountAmount).toBe(0);
      expect(rejected.finalAmount).toBe(100000);
      expect(rejected.message).toContain('tối thiểu 150.000đ');

      const accepted = calculateCouponDiscount('MIN150K', 'VIP_4K', 180000);
      expect(accepted.valid).toBe(true);
      expect(accepted.discountAmount).toBe(50000);
      expect(accepted.finalAmount).toBe(130000);
    });

    it('safely handles invalid, expired or empty coupons', () => {
      const invalid = calculateCouponDiscount('EXPIRED999', 'VIP_4K', 129000);
      expect(invalid.valid).toBe(false);
      expect(invalid.discountAmount).toBe(0);
      expect(invalid.finalAmount).toBe(129000);
      expect(invalid.message).toContain('không hợp lệ');
    });

    it('handles negative or malformed amount inputs gracefully', () => {
      const negative = calculateCouponDiscount('NOVAVIP50', 'VIP_4K', -50000);
      expect(negative.valid).toBe(true);
      expect(negative.discountAmount).toBe(0);
      expect(negative.finalAmount).toBe(0);
    });
  });

  describe('Pricing Service Operations', () => {
    it('getPlans returns tier list', async () => {
      const plans = await pricingService.getPlans();
      expect(plans).toHaveLength(3);
      expect(plans[1].name).toBe('VIP Standard FHD');
    });

    it('validateCoupon resolves valid coupon result', async () => {
      const result = await pricingService.validateCoupon('NOVAVIP50', 'VIP_4K', 129000);
      expect(result.valid).toBe(true);
      expect(result.finalAmount).toBe(64500);
    });

    it('redeemCoupon creates successful redemption result with expiration and order ID', async () => {
      const payload: RedemptionPayload = {
        planId: 'VIP_4K',
        billingCycle: 'yearly',
        amount: 1238000,
        couponCode: 'NOVAVIP50',
        paymentMethod: 'VIETQR',
        idempotencyKey: 'idem_test_uuid_999',
      };

      const res = await pricingService.redeemCoupon('NOVAVIP50', payload);
      expect(res.status).toBe('SUCCESS');
      expect(res.newPlan).toBe('VIP_4K');
      expect(res.amountPaid).toBe(1238000);
      expect(res.orderId.startsWith('ord_vip_')).toBe(true);
      expect(typeof res.expiryDate).toBe('string');
    });

    it('getMyRedemptions returns history list', async () => {
      const history = await pricingService.getMyRedemptions();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThanOrEqual(1);
      expect(history[0].couponCode).toBe('NOVAVIP50');
    });
  });
});
