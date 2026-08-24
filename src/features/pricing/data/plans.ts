import type { PlanDTO } from '../types';
import { PRICING_PLANS } from '../services/pricingService';

export { PRICING_PLANS };

export type PricingPlan = PlanDTO;

export const DEMO_COUPONS: Record<string, { discountPercent: number; desc: string }> = {
  NOVAVIP50: { discountPercent: 50, desc: 'Giảm 50% cho gói VIP bất kỳ' },
  SAVE30K: { discountPercent: 30, desc: 'Giảm 30.000đ cho đơn hàng' },
  CAP40K: { discountPercent: 50, desc: 'Giảm 50% (tối đa 40.000đ)' },
  MIN150K: { discountPercent: 30, desc: 'Giảm 50.000đ cho đơn từ 150k' },
};
