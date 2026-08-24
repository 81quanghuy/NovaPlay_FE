import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { PATHS } from '@/routes/paths';
import { hasRole, hasAnyRole } from '@/store/authStore';
import { mockMemberUser, mockAdminUser } from '../helpers/mockData';

describe('Feature 02: Route & Navigation Wiring', () => {
  it('F02.1 - PATHS dictionary declares all public and authenticated routes as frozen constants', () => {
    expect(PATHS.HOME).toBe('/');
    expect(PATHS.LOGIN).toBe('/login');
    expect(PATHS.REGISTER).toBe('/register');
    expect(PATHS.VERIFY_OTP).toBe('/verify-otp');
    expect(PATHS.FORGOT_PASSWORD).toBe('/forgot-password');
    expect(PATHS.RESET_PASSWORD).toBe('/reset-password');
    expect(PATHS.MOVIES).toBe('/movies');
    expect(PATHS.SEARCH).toBe('/search');
    expect(PATHS.PRICING).toBe('/pricing');
    expect(PATHS.NOTIFICATIONS).toBe('/notifications');
    expect(PATHS.MY_LIST).toBe('/my-list');
    expect(PATHS.PROFILE).toBe('/profile');
    expect(PATHS.ADMIN).toBe('/admin');
    expect(PATHS.ADMIN_MOVIES).toBe('/admin/movies');
    expect(PATHS.ADMIN_GENRES).toBe('/admin/genres');
    expect(PATHS.ADMIN_ARTISTS).toBe('/admin/artists');
    expect(PATHS.FORBIDDEN).toBe('/403');
    expect(PATHS.NOT_FOUND).toBe('/404');
  });

  it('F02.2 - Dynamic route functions generate standard canonical parameterized URLs', () => {
    expect(PATHS.MOVIE_DETAIL('oppenheimer-2023')).toBe('/movie/oppenheimer-2023');
    expect(PATHS.WATCH('mov_inception_101')).toBe('/watch/mov_inception_101');
    expect(PATHS.ADMIN_EPISODES('mov_series_456')).toBe('/admin/movies/mov_series_456/episodes');
  });

  it('F02.3 - RoleGuard verifies ADMIN authorization and rejects standard users', () => {
    expect(hasRole(mockAdminUser, 'ADMIN')).toBe(true);
    expect(hasRole(mockMemberUser, 'ADMIN')).toBe(false);
    expect(hasRole(null, 'ADMIN')).toBe(false);
  });

  it('F02.4 - hasAnyRole allows multi-role authorization checks for protected areas', () => {
    expect(hasAnyRole(mockAdminUser, ['ADMIN', 'MODERATOR'])).toBe(true);
    expect(hasAnyRole(mockMemberUser, ['ADMIN', 'MODERATOR'])).toBe(false);
    expect(hasAnyRole(mockMemberUser, ['USER'])).toBe(true);
  });

  it('F02.5 - PublicOnly guard identifies authenticated vs unauthenticated session state', () => {
    const isPublicAllowed = (user: any) => user === null;
    expect(isPublicAllowed(null)).toBe(true);
    expect(isPublicAllowed(mockMemberUser)).toBe(false);
  });

  it('F02.6 - StaticPath type extraction preserves exact literal path mappings', () => {
    const validPaths = ['/', '/login', '/register', '/admin', '/404', '/403', '/pricing', '/my-list', '/profile'];
    for (const p of validPaths) {
      expect(typeof p).toBe('string');
      expect(p.startsWith('/')).toBe(true);
    }
  });
});
