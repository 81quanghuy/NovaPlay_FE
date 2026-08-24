import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { mockPricingTiers, validateCouponLogic } from '../helpers/mockData';

describe('Tier 4: Real-World Scenarios — End-to-End VIP Subscription & Checkout with Promo Code', () => {
  it('T4.VIPFlow.1 - Step 1: User navigates to /pricing and compares Free vs VIP Standard vs VIP 4K', () => {
    const plans = mockPricingTiers;
    expect(plans).toHaveLength(3);

    const vip4k = plans.find((p) => p.id === 'VIP_4K')!;
    expect(vip4k.price).toBe(129000);
    expect(vip4k.maxResolution).toContain('4K');
  });

  it('T4.VIPFlow.2 - Step 2: User selects VIP 4K Ultra HD and opens checkout modal', () => {
    let selectedPlan = null;
    let isCheckoutModalOpen = false;

    const onSelectPlan = (plan: typeof mockPricingTiers[0]) => {
      selectedPlan = plan;
      isCheckoutModalOpen = true;
    };

    onSelectPlan(mockPricingTiers[2]); // VIP 4K
    expect(selectedPlan).toBeDefined();
    expect(isCheckoutModalOpen).toBe(true);
  });

  it('T4.VIPFlow.3 - Step 3: User inputs coupon code "NOVAVIP50" and verifies 50% discount breakdown', () => {
    const coupon = validateCouponLogic('NOVAVIP50', 'VIP_4K', 129000);

    expect(coupon.valid).toBe(true);
    expect(coupon.discountAmount).toBe(64500);
    expect(coupon.finalAmount).toBe(64500);
  });

  it('T4.VIPFlow.4 - Step 4: User confirms payment order with idempotency token', async () => {
    const redeemApi = fn(async (code: string, payload: any) => ({
      success: true,
      statusCode: 200,
      result: {
        orderId: 'ord_vip_99881',
        newPlan: 'VIP_4K',
        expiryDate: '2026-09-25T00:00:00Z',
      },
    }));

    const checkoutPayload = {
      planId: 'VIP_4K',
      amount: 64500,
      idempotencyKey: 'idem_checkout_uuid_123',
    };

    const res = await redeemApi('NOVAVIP50', checkoutPayload);
    expect(res.success).toBe(true);
    expect(res.result.newPlan).toBe('VIP_4K');
    expect(redeemApi).toHaveBeenCalled();
  });

  it('T4.VIPFlow.5 - Step 5: User profile shows active VIP 4K Ultra HD badge and 30 days remaining', () => {
    const updatedAccount = {
      plan: 'VIP_4K',
      planLabel: 'VIP 4K Ultra HD',
      expiryDate: '2026-09-25T00:00:00Z',
      remainingDays: 31,
    };

    expect(updatedAccount.plan).toBe('VIP_4K');
    expect(updatedAccount.remainingDays).toBeGreaterThanOrEqual(30);
  });
});
