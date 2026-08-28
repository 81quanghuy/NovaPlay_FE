import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { GenericResponse, PageResponse } from '@/lib/api/types';
import type { InAppNotification } from '../types';

const INITIAL_MOCK_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    title: '🎬 Bom tấn mới: Oppenheimer (4K Ultra HD)',
    message:
      'Kiệt tác đoạt giải Oscar của Christopher Nolan đã chính thức có mặt trên NovaPlay với phụ đề Vietsub và âm thanh Dolby Atmos.',
    content:
      'Kiệt tác đoạt giải Oscar của Christopher Nolan đã chính thức có mặt trên NovaPlay với phụ đề Vietsub và âm thanh Dolby Atmos.',
    type: 'NEW_MOVIE_RELEASE',
    targetUrl: '/movie/oppenheimer',
    isRead: false,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'notif-2',
    title: '🎁 Ưu đãi độc quyền: Giảm 50% Gói VIP 4K',
    message:
      'Nhập mã NOVAVIP50 để nhận ngay ưu đãi giảm 50% khi nâng cấp gói VIP 4K trải nghiệm không quảng cáo.',
    content:
      'Nhập mã NOVAVIP50 để nhận ngay ưu đãi giảm 50% khi nâng cấp gói VIP 4K trải nghiệm không quảng cáo.',
    type: 'PROMOTION',
    targetUrl: '/pricing',
    isRead: false,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'notif-3',
    title: '🔥 Chuỗi xem phim: Bạn đã đạt chuỗi 3 ngày!',
    message:
      'Chúc mừng bạn đã duy trì chuỗi xem phim 3 ngày liên tiếp. Tiếp tục khám phá để mở khóa huy hiệu Mọt Phim Chuyên Nghiệp.',
    content:
      'Chúc mừng bạn đã duy trì chuỗi xem phim 3 ngày liên tiếp. Tiếp tục khám phá để mở khóa huy hiệu Mọt Phim Chuyên Nghiệp.',
    type: 'SYSTEM',
    targetUrl: '/profile',
    isRead: true,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const notificationService = {
  /**
   * Lấy danh sách thông báo in-app (có phân trang)
   */
  async getNotifications(
    page = 0,
    size = 20,
    unreadOnly = false,
  ): Promise<PageResponse<InAppNotification>> {
    try {
      const res = await apiClient.get<GenericResponse<PageResponse<InAppNotification>>>(
        ENDPOINTS.notifications.list,
        { params: { page, size, unreadOnly } },
      );
      if (res.data?.success && res.data.result) {
        return res.data.result;
      }
    } catch {
      // Fallback
    }

    const filtered = unreadOnly
      ? INITIAL_MOCK_NOTIFICATIONS.filter((n) => !n.isRead && !n.read)
      : INITIAL_MOCK_NOTIFICATIONS;

    return {
      content: filtered,
      page,
      size,
      totalElements: filtered.length,
      totalPages: 1,
      last: true,
    };
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  async getUnreadCount(): Promise<number> {
    try {
      const res = await apiClient.get<GenericResponse<number>>(
        ENDPOINTS.notifications.unreadCount,
      );
      if (res.data?.success && typeof res.data.result === 'number') {
        return res.data.result;
      }
    } catch {
      // Fallback
    }
    return INITIAL_MOCK_NOTIFICATIONS.filter((n) => !n.isRead && !n.read).length;
  },

  /**
   * Đánh dấu 1 thông báo là đã đọc
   */
  async markAsRead(id: string): Promise<boolean> {
    try {
      const res = await apiClient.put<GenericResponse<void>>(
        ENDPOINTS.notifications.markRead(id),
      );
      return res.data?.success ?? true;
    } catch {
      return true;
    }
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      const res = await apiClient.put<GenericResponse<void>>(
        ENDPOINTS.notifications.markAllRead,
      );
      return res.data?.success ?? true;
    } catch {
      return true;
    }
  },

  /**
   * Xóa thông báo
   */
  async deleteNotification(id: string): Promise<boolean> {
    try {
      const res = await apiClient.delete<GenericResponse<void>>(
        ENDPOINTS.notifications.delete(id),
      );
      return res.data?.success ?? true;
    } catch {
      return true;
    }
  },
};
