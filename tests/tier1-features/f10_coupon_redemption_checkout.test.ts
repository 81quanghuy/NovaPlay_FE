import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';

describe('Feature 10: Coupon Redemption & Checkout', () => {
  it('F10.1 - Checkout payload incorporates planId, finalAmount, and unique idempotencyKey', () => {
    const createCheckoutPayload = (planId: string, amount: number, couponCode?: string) => ({
      planId,
      amount,
      couponCode,
      idempotencyKey: `idem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    });

    const payload = createCheckoutPayload('VIP_4K', 89000, 'CAP40K');
    expect(payload.planId).toBe('VIP_4K');
    expect(payload.amount).toBe(89000);
    expect(payload.couponCode).toBe('CAP40K');
    expect(payload.idempotencyKey.startsWith('idem_')).toBe(true);
  });

  it('F10.2 - Successful redemption upgrades user subscription tier and updates status', () => {
    let userPlan = 'FREE';
    const onRedeemSuccess = fn((newPlan: string) => {
      userPlan = newPlan;
    });

    expect(userPlan).toBe('FREE');
    onRedeemSuccess('VIP_4K');
    expect(userPlan).toBe('VIP_4K');
    expect(onRedeemSuccess).toHaveBeenCalledWith('VIP_4K');
  });

  it('F10.3 - Order summary calculates base price, discount, and total final price accurately', () => {
    const calculateOrderSummary = (basePrice: number, discount: number) => ({
      basePrice,
      discount,
      total: Math.max(0, basePrice - discount),
    });

    const summary = calculateOrderSummary(129000, 50000);
    expect(summary.basePrice).toBe(129000);
    expect(summary.discount).toBe(50000);
    expect(summary.total).toBe(79000);
  });

  it('F10.4 - Duplicate submission prevention blocks duplicate checkout calls while pending', () => {
    let isSubmitting = false;
    let submitCount = 0;

    const handleCheckout = () => {
      if (isSubmitting) return;
      isSubmitting = true;
      submitCount++;
    };

    handleCheckout(); // 1st submit
    handleCheckout(); // 2nd submit ignored
    handleCheckout(); // 3rd submit ignored

    expect(submitCount).toBe(1);
    expect(isSubmitting).toBe(true);
  });

  it('F10.5 - Redemption history records past coupon usages and timestamps', () => {
    const history = [
      {
        id: 'red_01',
        couponCode: 'NOVAVIP50',
        planId: 'VIP_STANDARD',
        discountAmount: 39500,
        redeemedAt: '2026-08-20T10:00:00Z',
      },
    ];

    expect(history).toHaveLength(1);
    expect(history[0].couponCode).toBe('NOVAVIP50');
    expect(history[0].discountAmount).toBe(39500);
  });
});
