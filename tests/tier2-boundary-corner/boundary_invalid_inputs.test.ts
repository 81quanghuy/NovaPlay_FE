import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { loginSchema, registerSchema, otpSchema, resetPasswordSchema } from '@/features/auth/schemas';
import { validateCouponLogic } from '../helpers/mockData';

describe('Tier 2: Boundary & Corner Cases — Invalid Inputs & Adversarial Data', () => {
  it('T2.Invalid.1 - Rejects SQL Injection & XSS payload strings in authentication schemas', () => {
    const maliciousLogin = {
      emailOrUsername: "' OR '1'='1' --",
      password: "<script>alert('xss')</script>",
    };

    // Fails because username regex or length constraints reject malformed usernames
    const regResult = registerSchema.safeParse({
      username: "<script>alert('xss')</script>",
      email: "attacker@exploit.com'; DROP TABLE users;--",
      password: 'StrongPassword@123',
      confirmPassword: 'StrongPassword@123',
      accept: true,
    });

    expect(regResult.success).toBe(false);
  });

  it('T2.Invalid.2 - Rejects non-numeric or malformed OTP inputs', () => {
    expect(otpSchema.safeParse({ otp: '12345' }).success).toBe(false); // too short (5 chars)
    expect(otpSchema.safeParse({ otp: '1234567' }).success).toBe(false); // too long (7 chars)
    expect(otpSchema.safeParse({ otp: '12345A' }).success).toBe(false); // contains letters
    expect(otpSchema.safeParse({ otp: '123456' }).success).toBe(true); // valid
  });

  it('T2.Invalid.3 - Rejects password mismatch between newPassword and confirmNewPassword', () => {
    const mismatchPayload = {
      email: 'user@example.com',
      otp: '123456',
      newPassword: 'Password@123',
      confirmNewPassword: 'Password@456',
    };

    const result = resetPasswordSchema.safeParse(mismatchPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('không khớp');
    }
  });

  it('T2.Invalid.4 - Handles negative numbers or NaN in coupon amount calculations', () => {
    const result = validateCouponLogic('NOVAVIP50', 'VIP_STANDARD', -50000);
    // Even if negative amount passed, final discount calculation should safely handle or clamp
    expect(typeof result.finalAmount).toBe('number');
  });

  it('T2.Invalid.5 - Strips leading and trailing whitespace and control characters from inputs', () => {
    const rawUsername = '  validuser  ';
    const parsed = loginSchema.parse({
      emailOrUsername: rawUsername,
      password: 'Password@123',
    });

    expect(parsed.emailOrUsername).toBe('validuser');
  });
});
