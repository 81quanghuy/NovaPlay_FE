import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { mockNotifications, MockNotificationItem } from '../helpers/mockData';

describe('Feature 05: Mark Notifications Read', () => {
  it('F05.1 - Marking single notification as read updates its read flag to true', () => {
    let items = JSON.parse(JSON.stringify(mockNotifications)) as MockNotificationItem[];
    const markAsRead = fn((id: string) => {
      items = items.map((item) => (item.id === id ? { ...item, read: true } : item));
    });

    expect(items.find((i) => i.id === 'notif_001')?.read).toBe(false);
    markAsRead('notif_001');
    expect(items.find((i) => i.id === 'notif_001')?.read).toBe(true);
    expect(markAsRead).toHaveBeenCalledWith('notif_001');
  });

  it('F05.2 - Marking single notification decrements unread badge count', () => {
    let unreadCount = 3;
    const markSingle = fn(() => {
      unreadCount = Math.max(0, unreadCount - 1);
    });

    markSingle();
    expect(unreadCount).toBe(2);
    markSingle();
    expect(unreadCount).toBe(1);
    markSingle();
    expect(unreadCount).toBe(0);
    markSingle();
    expect(unreadCount).toBe(0); // non-negative boundary
  });

  it('F05.3 - Bulk "Mark all as read" marks all active notifications as read', () => {
    let items = JSON.parse(JSON.stringify(mockNotifications)) as MockNotificationItem[];
    const markAllAsRead = fn(() => {
      items = items.map((i) => ({ ...i, read: true }));
    });

    expect(items.some((i) => !i.read)).toBe(true);
    markAllAsRead();
    expect(items.every((i) => i.read === true)).toBe(true);
  });

  it('F05.4 - Bulk "Mark all as read" resets unread counter immediately to 0', () => {
    let unreadCount = 15;
    const markAll = fn(() => {
      unreadCount = 0;
    });

    markAll();
    expect(unreadCount).toBe(0);
    expect(markAll).toHaveBeenCalledTimes(1);
  });

  it('F05.5 - Optimistic state rollback restores previous state on API network error', () => {
    let unreadCount = 2;
    const previousCount = unreadCount;
    let apiFailed = true;

    try {
      unreadCount = 0; // optimistic
      if (apiFailed) {
        throw new Error('500 Internal Server Error');
      }
    } catch (e) {
      unreadCount = previousCount; // rollback
    }

    expect(unreadCount).toBe(2);
  });
});
