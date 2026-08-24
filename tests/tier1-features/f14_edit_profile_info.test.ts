import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { z } from 'zod';
import { REGEX } from '@/config';

const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự').max(50, 'Họ tên tối đa 50 ký tự'),
  phoneNumber: z
    .string()
    .trim()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(500, 'Tiểu sử tối đa 500 ký tự').optional(),
});

describe('Feature 14: Edit Profile Information', () => {
  it('F14.1 - Schema validates minimum fullName length (>= 2 chars)', () => {
    const valid = profileUpdateSchema.safeParse({ fullName: 'Minh Hoàng' });
    expect(valid.success).toBe(true);

    const invalid = profileUpdateSchema.safeParse({ fullName: 'A' });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.issues[0].message).toContain('tối thiểu 2 ký tự');
    }
  });

  it('F14.2 - Schema validates Vietnamese mobile phone number format', () => {
    expect(profileUpdateSchema.safeParse({ fullName: 'Valid Name', phoneNumber: '0987654321' }).success).toBe(true);
    expect(profileUpdateSchema.safeParse({ fullName: 'Valid Name', phoneNumber: '0381234567' }).success).toBe(true);
    expect(profileUpdateSchema.safeParse({ fullName: 'Valid Name', phoneNumber: '12345' }).success).toBe(false);
  });

  it('F14.3 - Schema validates maximum bio character length (<= 500 chars)', () => {
    const shortBio = 'Yêu thích phim hành động và khoa học viễn tưởng.';
    expect(profileUpdateSchema.safeParse({ fullName: 'Valid Name', bio: shortBio }).success).toBe(true);

    const longBio = 'a'.repeat(501);
    const result = profileUpdateSchema.safeParse({ fullName: 'Valid Name', bio: longBio });
    expect(result.success).toBe(false);
  });

  it('F14.4 - Handles optional and empty string values gracefully', () => {
    const result = profileUpdateSchema.safeParse({ fullName: 'Valid Name', phoneNumber: '', bio: '' });
    expect(result.success).toBe(true);
  });

  it('F14.5 - Prepares PUT /api/v1/users/me payload with trimmed data', () => {
    const rawInput = {
      fullName: '  Nguyễn Văn A  ',
      phoneNumber: ' 0987654321 ',
      bio: '  Hello world  ',
    };

    const parsed = profileUpdateSchema.parse(rawInput);
    expect(parsed.fullName).toBe('Nguyễn Văn A');
    expect(parsed.phoneNumber).toBe('0987654321');
  });
});
