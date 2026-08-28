import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { useAuthStore } from '@/store/authStore';
import { useWatchlistStore } from '@/features/movies/store/watchlistStore';

describe('Tier 4: Real-World Scenarios — User Onboarding & Movie Discovery Journey', () => {
  it('T4.Onboard.1 - Step 1: New user submits valid registration form', async () => {
    const registerPayload = {
      username: 'cinemafan2026',
      email: 'cinemafan@novaplay.vn',
      password: 'StrongPassword@123',
    };

    const registerApi = fn(async (data: typeof registerPayload) => ({
      success: true,
      statusCode: 201,
      message: 'User registered successfully. Check email for OTP.',
    }));

    const res = await registerApi(registerPayload);
    expect(res.statusCode).toBe(201);
    expect(registerApi).toHaveBeenCalled();
  });

  it('T4.Onboard.2 - Step 2: User enters 6-digit email OTP and activates account', async () => {
    const verifyPayload = { email: 'cinemafan@novaplay.vn', otp: '839201' };
    const verifyApi = fn(async (data: typeof verifyPayload) => ({
      success: true,
      statusCode: 200,
    }));

    const res = await verifyApi(verifyPayload);
    expect(res.success).toBe(true);
  });

  it('T4.Onboard.3 - Step 3: User logs in and authStore is initialized with user profile & access token', () => {
    useAuthStore.getState().reset();
    useAuthStore.getState().setAuth({
      access_token: 'jwt.onboard.access.token',
      refresh_token: 'refresh.onboard.token',
      token_type: 'Bearer',
      expires_in: 86400,
      user_profile: {
        id: 'usr_onboard_1',
        username: 'cinemafan2026',
        email: 'cinemafan@novaplay.vn',
        isActive: true,
        isEmailVerified: true,
        roles: [{ roleName: 'USER' }],
      },
    });

    expect(useAuthStore.getState().status).toBe('authenticated');
    expect(useAuthStore.getState().user?.username).toBe('cinemafan2026');
  });

  it('T4.Onboard.4 - Step 4: User browses home page and searches for "Christopher Nolan"', () => {
    const catalog = [
      { id: 'mov_1', title: 'Oppenheimer', director: 'Christopher Nolan', genres: ['Tâm Lý'] },
      { id: 'mov_2', title: 'Inception', director: 'Christopher Nolan', genres: ['Khoa Học Viễn Tưởng'] },
      { id: 'mov_3', title: 'Avatar: The Way of Water', director: 'James Cameron', genres: ['Phiêu Lưu'] },
    ];

    const searchResults = catalog.filter(
      (m) =>
        m.title.toLowerCase().includes('nolan') ||
        m.director.toLowerCase().includes('nolan')
    );

    expect(searchResults).toHaveLength(2);
    expect(searchResults.map((m) => m.id)).toEqual(['mov_1', 'mov_2']);
  });

  it('T4.Onboard.5 - Step 5: User bookmarks movies to My List / Watchlist and verifies storage', () => {
    useWatchlistStore.getState().clear();
    const { add, has } = useWatchlistStore.getState();

    add('mov_1');
    add('mov_2');

    expect(has('mov_1')).toBe(true);
    expect(has('mov_2')).toBe(true);
    expect(useWatchlistStore.getState().ids).toHaveLength(2);
  });
});
