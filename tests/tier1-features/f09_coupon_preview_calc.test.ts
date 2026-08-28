import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { validateCouponLogic } from '../helpers/mockData';

describe('Feature 09: Coupon Preview & Calculation', () => {
  it('F09.1 - Calculates percentage discount (NOVAVIP50 = 50% off on 100,000đ)', () => {
    const result = validateCouponLogic('NOVAVIP50', 'VIP_STANDARD', 100000);
    expect(result.valid).toBe(true);
    expect(result.discountType).toBe('PERCENTAGE');
    expect(result.discountValue).toBe(50);
    expect(result.discountAmount).toBe(50000);
    expect(result.finalAmount).toBe(50000);
  });

  it('F09.2 - Calculates fixed amount discount (SAVE30K = 30,000đ off on 100,000đ)', () => {
    const result = validateCouponLogic('SAVE30K', 'VIP_STANDARD', 100000);
    expect(result.valid).toBe(true);
    expect(result.discountType).toBe('FIXED_AMOUNT');
    expect(result.discountAmount).toBe(30000);
    expect(result.finalAmount).toBe(70000);
  });

  it('F09.3 - Enforces maximum discount cap (CAP40K caps 50% discount at 40,000đ on 129,000đ)', () => {
    const result = validateCouponLogic('CAP40K', 'VIP_4K', 129000);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(40000); // instead of 64500
    expect(result.finalAmount).toBe(89000);
  });

  it('F09.4 - Validates minimum order value requirement (MIN150K rejected on 100,000đ)', () => {
    const invalidResult = validateCouponLogic('MIN150K', 'VIP_STANDARD', 100000);
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.finalAmount).toBe(100000);
    expect(invalidResult.message).toContain('tối thiểu 150.000đ');

    const validResult = validateCouponLogic('MIN150K', 'VIP_4K', 180000);
    expect(validResult.valid).toBe(true);
  });

  it('F09.5 - Rejects unknown or malformed coupon codes with descriptive message', () => {
    const result = validateCouponLogic('INVALID_CODE_999', 'VIP_STANDARD', 100000);
    expect(result.valid).toBe(false);
    expect(result.discountAmount).toBe(0);
    expect(result.finalAmount).toBe(100000);
    expect(result.message).toContain('không hợp lệ');
  });
});
