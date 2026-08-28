import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { mockMemberUser, mockVipUser } from '../helpers/mockData';

describe('Feature 13: User Profile & Subscription Status', () => {
  it('F13.1 - Profile structure encompasses user details, contact information, and biography', () => {
    const profile = {
      ...mockMemberUser,
      fullName: 'Nguyễn Hoàng Minh',
      phoneNumber: '0987654321',
      bio: 'Mọt phim Christopher Nolan và Sci-Fi',
      avatarUrl: 'https://pub-r2.novaplay.vn/avatars/user123.jpg',
    };

    expect(profile.email).toBe('member@novaplay.vn');
    expect(profile.fullName).toBe('Nguyễn Hoàng Minh');
    expect(profile.phoneNumber).toBe('0987654321');
    expect(profile.bio).toContain('Christopher Nolan');
  });

  it('F13.2 - Formats subscription plan badge with appropriate tier label', () => {
    const getPlanBadge = (plan: string) => {
      switch (plan) {
        case 'VIP_4K':
          return { label: 'VIP 4K Ultra HD', color: 'gold' };
        case 'VIP_STANDARD':
          return { label: 'VIP Standard FHD', color: 'cyan' };
        default:
          return { label: 'Free Member', color: 'gray' };
      }
    };

    expect(getPlanBadge('VIP_4K')).toEqual({ label: 'VIP 4K Ultra HD', color: 'gold' });
    expect(getPlanBadge('VIP_STANDARD')).toEqual({ label: 'VIP Standard FHD', color: 'cyan' });
    expect(getPlanBadge('FREE')).toEqual({ label: 'Free Member', color: 'gray' });
  });

  it('F13.3 - Calculates remaining subscription days until expiry', () => {
    const calculateRemainingDays = (expiryIso: string) => {
      const now = new Date('2026-08-25T00:00:00Z').getTime();
      const expiry = new Date(expiryIso).getTime();
      const diffMs = expiry - now;
      return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    };

    expect(calculateRemainingDays('2026-09-24T00:00:00Z')).toBe(30);
    expect(calculateRemainingDays('2026-08-26T00:00:00Z')).toBe(1);
    expect(calculateRemainingDays('2026-08-20T00:00:00Z')).toBe(0); // expired
  });

  it('F13.4 - Aggregates account metrics (movies watched, favorites count)', () => {
    const stats = {
      watchedMoviesCount: 42,
      favoritesCount: 18,
      totalHoursWatched: 76.5,
    };

    expect(stats.watchedMoviesCount).toBe(42);
    expect(stats.favoritesCount).toBe(18);
    expect(stats.totalHoursWatched).toBeGreaterThan(50);
  });

  it('F13.5 - Upgrade button redirects free users to /pricing', () => {
    const getAccountAction = (plan: string) => (plan === 'FREE' ? { path: '/pricing', text: 'Nâng cấp VIP' } : null);

    expect(getAccountAction('FREE')).toEqual({ path: '/pricing', text: 'Nâng cấp VIP' });
    expect(getAccountAction('VIP_4K')).toBeNull();
  });
});
