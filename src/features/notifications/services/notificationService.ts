import { apiClient } from '@/lib/api/client';
import {
  NotificationDTO,
  PageResponse,
  normalizeNotification,
} from '../types';

// In-memory mock storage for fallback / offline / dev mode
let mockNotificationsState: NotificationDTO[] = [
  {
    id: 'notif_001',
    title: 'Phim Mới Cập Nhật: Oppenheimer (4K)',
    message: 'Tác phẩm bom tấn của Christopher Nolan đã chính thức có mặt trên NovaPlay.',
    content: 'Tác phẩm bom tấn của Christopher Nolan đã chính thức có mặt trên NovaPlay.',
    type: 'NEW_MOVIE_RELEASE',
    targetUrl: '/movie/oppenheimer-2023',
    isRead: false,
    read: false,
    createdAt: '2026-08-24T20:15:00Z',
  },
  {
    id: 'notif_002',
    title: 'Chào mừng bạn đến với NovaPlay VIP',
    message: 'Bạn vừa mở khóa tính năng xem phim 4K không giới hạn và âm thanh vòm Dolby Atmos.',
    content: 'Bạn vừa mở khóa tính năng xem phim 4K không giới hạn và âm thanh vòm Dolby Atmos.',
    type: 'ACCOUNT_UPGRADED',
    targetUrl: '/profile',
    isRead: false,
    read: false,
    createdAt: '2026-08-24T14:30:00Z',
  },
  {
    id: 'notif_003',
    title: 'Bảo trì hệ thống định kỳ',
    message: 'Hệ thống sẽ nâng cấp cơ sở dữ liệu từ 02:00 đến 03:00 sáng mai.',
    content: 'Hệ thống sẽ nâng cấp cơ sở dữ liệu từ 02:00 đến 03:00 sáng mai.',
    type: 'SYSTEM',
    targetUrl: undefined,
    isRead: true,
    read: true,
    createdAt: '2026-08-23T10:00:00Z',
  },
  {
    id: 'notif_004',
    title: 'Ưu đãi Đặc Biệt: Giảm 50% Gói VIP 4K',
    message: 'Sử dụng mã NOVAVIP50 để nhận ngay ưu đãi 50% khi nâng cấp gói xem phim 4K trong hôm nay.',
    content: 'Sử dụng mã NOVAVIP50 để nhận ngay ưu đãi 50% khi nâng cấp gói xem phim 4K trong hôm nay.',
    type: 'PROMOTION',
    targetUrl: '/pricing',
    isRead: false,
    read: false,
    createdAt: '2026-08-22T08:00:00Z',
  },
  {
    id: 'notif_005',
    title: 'Cảnh Báo Bảo Mật Tài Khoản',
    message: 'Phát hiện đăng nhập mới từ trình duyệt Chrome trên thiết bị Linux.',
    content: 'Phát hiện đăng nhập mới từ trình duyệt Chrome trên thiết bị Linux.',
    type: 'SECURITY_ALERT',
    targetUrl: '/profile',
    isRead: true,
    read: true,
    createdAt: '2026-08-21T11:20:00Z',
  },
];

export const notificationService = {
  /**
   * Fetch paginated notifications with optional unreadOnly filter
   */
  async getNotifications(
    page = 0,
    size = 20,
    unreadOnly = false,
  ): Promise<PageResponse<NotificationDTO>> {
    try {
      const response = await apiClient.get<PageResponse<Record<string, unknown>>>(
        '/notifications',
        {
          params: { page, size, unreadOnly },
        },
      );

      const rawData = response.data;
      const content = Array.isArray(rawData?.content)
        ? rawData.content.map(normalizeNotification)
        : [];

      return {
        content,
        page: rawData?.page ?? page,
        size: rawData?.size ?? size,
        totalElements: rawData?.totalElements ?? content.length,
        totalPages: rawData?.totalPages ?? (Math.ceil(content.length / size) || 1),
        last: rawData?.last ?? true,
      };
    } catch {
      // Fallback to in-memory mock data
      let filtered = [...mockNotificationsState];
      if (unreadOnly) {
        filtered = filtered.filter((n) => !n.isRead && !n.read);
      }

      // Sort newest first
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / size) || 1;
      const start = page * size;
      const pageItems = filtered.slice(start, start + size);

      return {
        content: pageItems,
        page,
        size,
        totalElements,
        totalPages,
        last: page >= totalPages - 1,
      };
    }
  },

  /**
   * Fetch unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number } | number>(
        '/notifications/unread-count',
      );
      if (typeof response.data === 'number') {
        return response.data;
      }
      return response.data?.count ?? 0;
    } catch {
      return mockNotificationsState.filter((n) => !n.isRead && !n.read).length;
    }
  },

  /**
   * Mark single notification as read
   */
  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch {
      // Mock fallback update
      mockNotificationsState = mockNotificationsState.map((n) =>
        n.id === id ? { ...n, isRead: true, read: true, readAt: new Date().toISOString() } : n,
      );
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.patch('/notifications/read-all');
    } catch {
      // Mock fallback update
      const now = new Date().toISOString();
      mockNotificationsState = mockNotificationsState.map((n) => ({
        ...n,
        isRead: true,
        read: true,
        readAt: now,
      }));
    }
  },

  /**
   * Delete or dismiss a notification
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch {
      mockNotificationsState = mockNotificationsState.filter((n) => n.id !== id);
    }
  },

  /**
   * Reset mock data (useful for test isolation)
   */
  __resetMockData(items?: NotificationDTO[]) {
    if (items) {
      mockNotificationsState = items.map(normalizeNotification);
    } else {
      mockNotificationsState = [
        {
          id: 'notif_001',
          title: 'Phim Mới Cập Nhật: Oppenheimer (4K)',
          message: 'Tác phẩm bom tấn của Christopher Nolan đã chính thức có mặt trên NovaPlay.',
          content: 'Tác phẩm bom tấn của Christopher Nolan đã chính thức có mặt trên NovaPlay.',
          type: 'NEW_MOVIE_RELEASE',
          targetUrl: '/movie/oppenheimer-2023',
          isRead: false,
          read: false,
          createdAt: '2026-08-24T20:15:00Z',
        },
        {
          id: 'notif_002',
          title: 'Chào mừng bạn đến với NovaPlay VIP',
          message: 'Bạn vừa mở khóa tính năng xem phim 4K không giới hạn và âm thanh vòm Dolby Atmos.',
          content: 'Bạn vừa mở khóa tính năng xem phim 4K không giới hạn và âm thanh vòm Dolby Atmos.',
          type: 'ACCOUNT_UPGRADED',
          targetUrl: '/profile',
          isRead: false,
          read: false,
          createdAt: '2026-08-24T14:30:00Z',
        },
        {
          id: 'notif_003',
          title: 'Bảo trì hệ thống định kỳ',
          message: 'Hệ thống sẽ nâng cấp cơ sở dữ liệu từ 02:00 đến 03:00 sáng mai.',
          content: 'Hệ thống sẽ nâng cấp cơ sở dữ liệu từ 02:00 đến 03:00 sáng mai.',
          type: 'SYSTEM',
          targetUrl: undefined,
          isRead: true,
          read: true,
          createdAt: '2026-08-23T10:00:00Z',
        },
      ];
    }
  },
};
