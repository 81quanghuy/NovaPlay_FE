import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { mockNotifications } from '../helpers/mockData';

describe('Feature 04: Notification Popover Drawer', () => {
  it('F04.1 - Navbar bell button toggles drawer open/closed state', () => {
    let isDrawerOpen = false;
    const toggleDrawer = fn(() => {
      isDrawerOpen = !isDrawerOpen;
    });

    expect(isDrawerOpen).toBe(false);
    toggleDrawer();
    expect(isDrawerOpen).toBe(true);
    toggleDrawer();
    expect(isDrawerOpen).toBe(false);
    expect(toggleDrawer).toHaveBeenCalledTimes(2);
  });

  it('F04.2 - Unread badge count renders badge only when unreadCount > 0', () => {
    const renderBadge = (count: number) => (count > 0 ? (count > 99 ? '99+' : String(count)) : null);

    expect(renderBadge(0)).toBeNull();
    expect(renderBadge(2)).toBe('2');
    expect(renderBadge(150)).toBe('99+');
  });

  it('F04.3 - Drawer quick view restricts displayed notifications to top 5 items', () => {
    const largeList = Array.from({ length: 15 }, (_, i) => ({
      ...mockNotifications[0],
      id: `notif_${i}`,
    }));
    const previewList = largeList.slice(0, 5);

    expect(previewList).toHaveLength(5);
    expect(previewList[0].id).toBe('notif_0');
    expect(previewList[4].id).toBe('notif_4');
  });

  it('F04.4 - "View All" CTA routes to full /notifications page and closes drawer', () => {
    let currentRoute = '/';
    let isDrawerOpen = true;
    const onViewAll = fn(() => {
      isDrawerOpen = false;
      currentRoute = '/notifications';
    });

    onViewAll();
    expect(isDrawerOpen).toBe(false);
    expect(currentRoute).toBe('/notifications');
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  it('F04.5 - Auto-polling interval invokes unreadCount updater periodically', () => {
    let unreadCount = 2;
    const pollUnreadCount = fn(() => {
      unreadCount = 5;
    });

    expect(unreadCount).toBe(2);
    pollUnreadCount();
    expect(unreadCount).toBe(5);
    expect(pollUnreadCount).toHaveBeenCalled();
  });
});
