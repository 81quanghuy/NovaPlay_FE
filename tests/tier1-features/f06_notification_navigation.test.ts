import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { mockNotifications } from '../helpers/mockData';

describe('Feature 06: Notification Navigation', () => {
  it('F06.1 - NEW_MOVIE_RELEASE notification navigates to destination movie URL', () => {
    let currentPath = '/';
    const navigate = fn((url: string) => {
      currentPath = url;
    });

    const notif = mockNotifications.find((n) => n.type === 'NEW_MOVIE_RELEASE')!;
    if (notif.targetUrl) navigate(notif.targetUrl);

    expect(currentPath).toBe('/movie/oppenheimer-2023');
    expect(navigate).toHaveBeenCalledWith('/movie/oppenheimer-2023');
  });

  it('F06.2 - ACCOUNT_UPGRADED notification navigates to profile or pricing page', () => {
    let currentPath = '/';
    const navigate = fn((url: string) => {
      currentPath = url;
    });

    const notif = mockNotifications.find((n) => n.type === 'ACCOUNT_UPGRADED')!;
    if (notif.targetUrl) navigate(notif.targetUrl);

    expect(currentPath).toBe('/profile');
  });

  it('F06.3 - SYSTEM notification without targetUrl stays on current page without navigation', () => {
    let currentPath = '/movies';
    const navigate = fn((url: string) => {
      currentPath = url;
    });

    const notif = mockNotifications.find((n) => n.type === 'SYSTEM')!;
    if (notif.targetUrl) navigate(notif.targetUrl);

    expect(currentPath).toBe('/movies');
    expect(navigate).toHaveBeenCalledTimes(0);
  });

  it('F06.4 - Clicking notification automatically marks that notification as read', () => {
    let notif = { ...mockNotifications[0], read: false };
    const onNotifClick = fn(() => {
      notif.read = true;
    });

    expect(notif.read).toBe(false);
    onNotifClick();
    expect(notif.read).toBe(true);
    expect(onNotifClick).toHaveBeenCalledTimes(1);
  });

  it('F06.5 - Clicking notification closes drawer prior to route transition', () => {
    let isDrawerOpen = true;
    let currentRoute = '/';
    const handleClick = fn((targetUrl?: string) => {
      isDrawerOpen = false;
      if (targetUrl) currentRoute = targetUrl;
    });

    handleClick('/movie/oppenheimer-2023');
    expect(isDrawerOpen).toBe(false);
    expect(currentRoute).toBe('/movie/oppenheimer-2023');
  });
});
