import { create } from 'zustand';
import { APP_EVENTS } from '@/config';
import { NotificationDTO, NotificationFilter } from '../types';
import { notificationService } from '../services/notificationService';

export interface NotificationState {
  notifications: NotificationDTO[];
  unreadCount: number;
  isLoading: boolean;
  filter: NotificationFilter;
  isDrawerOpen: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  hasMore: boolean;

  // Actions
  fetchNotifications: (page?: number, size?: number, unreadOnly?: boolean) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  setFilter: (filter: NotificationFilter) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  reset: () => void;
}

const initialState = {
  notifications: [] as NotificationDTO[],
  unreadCount: 0,
  isLoading: false,
  filter: 'all' as NotificationFilter,
  isDrawerOpen: false,
  page: 0,
  totalPages: 1,
  totalElements: 0,
  hasMore: false,
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  ...initialState,

  fetchNotifications: async (page = 0, size = 20, unreadOnly = false) => {
    set({ isLoading: true });
    try {
      const response = await notificationService.getNotifications(page, size, unreadOnly);
      const unreadCount = await notificationService.getUnreadCount();

      set({
        notifications: page === 0 ? response.content : [...get().notifications, ...response.content],
        unreadCount,
        page: response.page,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        hasMore: !response.last && response.page < response.totalPages - 1,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const unreadCount = await notificationService.getUnreadCount();
      set({ unreadCount });
    } catch {
      // Keep existing unread count
    }
  },

  markAsRead: async (id: string) => {
    const prevNotifications = get().notifications;
    const prevUnreadCount = get().unreadCount;

    const target = prevNotifications.find((n) => n.id === id);
    const wasUnread = target ? !target.isRead && !target.read : true;

    // Optimistic update
    set({
      notifications: prevNotifications.map((n) =>
        n.id === id
          ? { ...n, isRead: true, read: true, readAt: new Date().toISOString() }
          : n,
      ),
      unreadCount: wasUnread ? Math.max(0, prevUnreadCount - 1) : prevUnreadCount,
    });

    try {
      await notificationService.markAsRead(id);
    } catch {
      // Rollback on failure
      set({
        notifications: prevNotifications,
        unreadCount: prevUnreadCount,
      });
    }
  },

  markAllAsRead: async () => {
    const prevNotifications = get().notifications;
    const prevUnreadCount = get().unreadCount;

    const now = new Date().toISOString();

    // Optimistic update
    set({
      notifications: prevNotifications.map((n) => ({
        ...n,
        isRead: true,
        read: true,
        readAt: now,
      })),
      unreadCount: 0,
    });

    try {
      await notificationService.markAllAsRead();
    } catch {
      // Rollback on failure
      set({
        notifications: prevNotifications,
        unreadCount: prevUnreadCount,
      });
    }
  },

  deleteNotification: async (id: string) => {
    const prevNotifications = get().notifications;
    const prevUnreadCount = get().unreadCount;
    const target = prevNotifications.find((n) => n.id === id);
    const wasUnread = target ? !target.isRead && !target.read : false;

    set({
      notifications: prevNotifications.filter((n) => n.id !== id),
      unreadCount: wasUnread ? Math.max(0, prevUnreadCount - 1) : prevUnreadCount,
      totalElements: Math.max(0, get().totalElements - 1),
    });

    try {
      await notificationService.deleteNotification(id);
    } catch {
      set({
        notifications: prevNotifications,
        unreadCount: prevUnreadCount,
      });
    }
  },

  setFilter: (filter: NotificationFilter) => {
    set({ filter });
  },

  openDrawer: () => {
    set({ isDrawerOpen: true });
  },

  closeDrawer: () => {
    set({ isDrawerOpen: false });
  },

  toggleDrawer: () => {
    set((s) => ({ isDrawerOpen: !s.isDrawerOpen }));
  },

  reset: () => {
    set({ ...initialState });
  },
}));

// Setup global event listeners
if (typeof window !== 'undefined') {
  window.addEventListener(APP_EVENTS.TOGGLE_NOTIFICATIONS, () => {
    useNotificationStore.getState().toggleDrawer();
  });

  window.addEventListener(APP_EVENTS.OPEN_NOTIFICATIONS, () => {
    useNotificationStore.getState().openDrawer();
  });

  window.addEventListener(APP_EVENTS.AUTH_EXPIRED, () => {
    useNotificationStore.getState().reset();
  });
}
