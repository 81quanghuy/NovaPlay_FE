export type PlanId = 'FREE' | 'VIP_STANDARD' | 'VIP_4K';

export type BillingCycle = 'monthly' | 'yearly';

export interface PlanDTO {
  id: PlanId;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  popularBadge?: boolean;
  popular?: boolean;
  maxResolution: string;
  maxScreens: number;
  screens: number;
  audioQuality: string;
  adFree: boolean;
  offlineDownload: boolean;
  glowColor?: 'none' | 'cyan' | 'gold';
  description?: string;
  badge?: string;
  notIncluded?: string[];
  isPopular?: boolean;
}

export type PricingPlan = PlanDTO;

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
  discountPercent?: number;
  discountAmount: number;
  maxDiscountCap?: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  minOrderAmount?: number;
  originalAmount: number;
  finalAmount: number;
  message: string;
}

export type PaymentMethodId = 'MOMO' | 'VNPAY' | 'VIETQR';

export interface PaymentMethodOption {
  id: PaymentMethodId;
  name: string;
  description: string;
  badge?: string;
}

export interface RedemptionPayload {
  planId: PlanId | string;
  billingCycle?: BillingCycle;
  amount: number;
  couponCode?: string;
  paymentMethod?: PaymentMethodId | string;
  idempotencyKey: string;
}

export interface RedemptionResult {
  orderId: string;
  newPlan: PlanId | string;
  expiryDate: string;
  paymentMethod?: string;
  amountPaid: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  message?: string;
}

export interface RedemptionHistoryDTO {
  id: string;
  couponCode: string;
  planId: PlanId | string;
  discountAmount: number;
  redeemedAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
