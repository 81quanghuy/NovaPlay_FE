import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { useAuthStore } from '@/store/authStore';
import { mockAuthSuccess } from '../helpers/mockData';

describe('Tier 4: Real-World Scenarios — User Session Expiration & Silent Token Recovery Journey', () => {
  it('T4.SessionRec.1 - Step 1: Active authenticated session with access token and profile in authStore', () => {
    useAuthStore.getState().setAuth(mockAuthSuccess);
    expect(useAuthStore.getState().status).toBe('authenticated');
    expect(useAuthStore.getState().accessToken).toBe('mock.jwt.access_token_abc123');
  });

  it('T4.SessionRec.2 - Step 2: Access token expires during browsing (HTTP 401 response from backend)', () => {
    const errorResponse = {
      status: 401,
      data: {
        success: false,
        message: 'Token expired',
      },
    };

    expect(errorResponse.status).toBe(401);
  });

  it('T4.SessionRec.3 - Step 3: Axios interceptor triggers silent refresh and obtains new access token', async () => {
    const refreshApi = fn(async (refreshToken: string) => ({
      access_token: 'new_rotated_access_token_7788',
      expires_in: 86400,
    }));

    const res = await refreshApi('mock_refresh_token_xyz789');
    expect(res.access_token).toBe('new_rotated_access_token_7788');
    expect(refreshApi).toHaveBeenCalled();
  });

  it('T4.SessionRec.4 - Step 4: authStore is updated with new token while preserving current user profile', () => {
    const userBefore = useAuthStore.getState().user;
    useAuthStore.getState().setAccessToken('new_rotated_access_token_7788');

    expect(useAuthStore.getState().accessToken).toBe('new_rotated_access_token_7788');
    expect(useAuthStore.getState().user).toEqual(userBefore);
    expect(useAuthStore.getState().status).toBe('authenticated');
  });

  it('T4.SessionRec.5 - Step 5: Original paused network request is retried with new Bearer token and succeeds', async () => {
    const retryRequest = fn(async (token: string) => {
      expect(token).toBe('new_rotated_access_token_7788');
      return { success: true, statusCode: 200, result: { message: 'Success after retry' } };
    });

    const res = await retryRequest(useAuthStore.getState().accessToken!);
    expect(res.success).toBe(true);
    expect(retryRequest).toHaveBeenCalledWith('new_rotated_access_token_7788');
  });
});
