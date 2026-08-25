export type NotificationType =
  | 'SYSTEM'
  | 'NEW_MOVIE_RELEASE'
  | 'ACCOUNT_UPGRADED'
  | 'PROMOTION'
  | 'SECURITY_ALERT'
  | 'PROMO';

export type InAppNotification = NotificationDTO;

export interface NotificationDTO {
  id: string;
  userId?: string;
  title: string;
  message: string;
  content?: string;
  type: NotificationType;
  targetUrl?: string;
  isRead: boolean;
  read?: boolean;
  readAt?: string | null;
  createdAt: string;
}

export type NotificationFilter = 'all' | 'unread' | 'movies' | 'system';

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/**
 * Normalizes raw notification payload into consistent NotificationDTO
 */
export function normalizeNotification(
  raw: Partial<NotificationDTO> | Record<string, unknown>,
): NotificationDTO {
  const rawObj = raw as Record<string, unknown>;
  const isRead = typeof rawObj.isRead === 'boolean' ? rawObj.isRead : Boolean(rawObj.read);
  const message = (rawObj.message || rawObj.content || '') as string;
  const content = (rawObj.content || rawObj.message || '') as string;

  return {
    id: String(rawObj.id || `notif_${Date.now()}`),
    userId: rawObj.userId ? String(rawObj.userId) : undefined,
    title: String(rawObj.title || 'Thông báo mới'),
    message,
    content,
    type: (rawObj.type as NotificationType) || 'SYSTEM',
    targetUrl: rawObj.targetUrl ? String(rawObj.targetUrl) : undefined,
    isRead,
    read: isRead,
    readAt: rawObj.readAt ? String(rawObj.readAt) : null,
    createdAt: String(rawObj.createdAt || new Date().toISOString()),
  };
}

/**
 * Formats ISO timestamp to Vietnamese relative time
 */
export function formatNotificationRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0 || diffInSeconds < 60) {
      return 'Vừa xong';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  } catch {
    return isoString;
  }
}
