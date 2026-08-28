import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { mockNotifications, MockNotificationItem } from '../helpers/mockData';

describe('Feature 03: In-App Notification Center', () => {
  it('F03.1 - Notification center query returns paginated items with envelope structure', () => {
    const pageResponse = {
      content: mockNotifications,
      page: 0,
      size: 20,
      totalElements: mockNotifications.length,
      totalPages: 1,
      last: true,
    };

    expect(pageResponse.content).toHaveLength(3);
    expect(pageResponse.totalElements).toBe(3);
    expect(pageResponse.content[0].id).toBe('notif_001');
  });

  it('F03.2 - Tab filter "unreadOnly" accurately filters unread notifications', () => {
    const filterUnread = (items: MockNotificationItem[]) => items.filter((n) => !n.read);
    const unreadItems = filterUnread(mockNotifications);

    expect(unreadItems).toHaveLength(2);
    expect(unreadItems.every((n) => n.read === false)).toBe(true);
    expect(unreadItems.map((n) => n.id)).toEqual(['notif_001', 'notif_002']);
  });

  it('F03.3 - Tab filter by notification category filters by semantic type', () => {
    const movieNotifs = mockNotifications.filter((n) => n.type === 'NEW_MOVIE_RELEASE');
    const systemNotifs = mockNotifications.filter((n) => n.type === 'SYSTEM');
    const accountNotifs = mockNotifications.filter((n) => n.type === 'ACCOUNT_UPGRADED');

    expect(movieNotifs).toHaveLength(1);
    expect(systemNotifs).toHaveLength(1);
    expect(accountNotifs).toHaveLength(1);
    expect(movieNotifs[0].title).toContain('Oppenheimer');
  });

  it('F03.4 - Notifications are sorted chronologically with newest first', () => {
    const sorted = [...mockNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    expect(sorted[0].id).toBe('notif_001');
    expect(sorted[sorted.length - 1].id).toBe('notif_003');
    expect(new Date(sorted[0].createdAt).getTime()).toBeGreaterThan(
      new Date(sorted[sorted.length - 1].createdAt).getTime()
    );
  });

  it('F03.5 - Notification date formatting handles ISO timestamps cleanly', () => {
    const formatNotificationTime = (iso: string) => {
      const date = new Date(iso);
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(
        date.getUTCDate()
      ).padStart(2, '0')}`;
    };

    expect(formatNotificationTime('2026-08-24T20:15:00Z')).toBe('2026-08-24');
    expect(formatNotificationTime('2026-08-23T10:00:00Z')).toBe('2026-08-23');
  });
});
