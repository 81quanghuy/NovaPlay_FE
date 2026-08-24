import { type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  Crown,
  ExternalLink,
  Film,
  ShieldAlert,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import {
  NotificationDTO,
  NotificationType,
  formatNotificationRelativeTime,
} from '../types';
import { useNotificationStore } from '../store/notificationStore';

export interface NotificationItemProps {
  notification: NotificationDTO;
  onSelect?: (notification: NotificationDTO) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
  className?: string;
}

const TYPE_CONFIG: Record<
  NotificationType,
  {
    icon: typeof Bell;
    label: string;
    badgeVariant: 'primary' | 'gold' | 'cyan' | 'danger' | 'surface';
    iconBoxClass: string;
  }
> = {
  NEW_MOVIE_RELEASE: {
    icon: Film,
    label: 'Phim Mới',
    badgeVariant: 'cyan',
    iconBoxClass: 'bg-cyan/15 text-cyan border-cyan/30 shadow-glow',
  },
  ACCOUNT_UPGRADED: {
    icon: Crown,
    label: 'VIP & Tài Khoản',
    badgeVariant: 'gold',
    iconBoxClass: 'bg-gold/15 text-gold border-gold/30 shadow-glow',
  },
  PROMOTION: {
    icon: Sparkles,
    label: 'Ưu Đãi',
    badgeVariant: 'primary',
    iconBoxClass: 'bg-primary/15 text-primary border-primary/30 shadow-glow',
  },
  PROMO: {
    icon: Tag,
    label: 'Ưu Đãi',
    badgeVariant: 'primary',
    iconBoxClass: 'bg-primary/15 text-primary border-primary/30 shadow-glow',
  },
  SECURITY_ALERT: {
    icon: ShieldAlert,
    label: 'Bảo Mật',
    badgeVariant: 'danger',
    iconBoxClass: 'bg-danger/15 text-danger border-danger/30 shadow-glow',
  },
  SYSTEM: {
    icon: Bell,
    label: 'Hệ Thống',
    badgeVariant: 'surface',
    iconBoxClass: 'bg-surface-3 text-fg-2 border-border',
  },
};

export function NotificationItem({
  notification,
  onSelect,
  onDismiss,
  compact = false,
  className = '',
}: NotificationItemProps) {
  const navigate = useNavigate();
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const isUnread = !notification.isRead && !notification.read;

  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.SYSTEM;
  const Icon = config.icon;
  const timeFormatted = formatNotificationRelativeTime(notification.createdAt);

  const handleClick = () => {
    if (isUnread) {
      markAsRead(notification.id);
    }
    if (onSelect) {
      onSelect(notification);
    } else if (notification.targetUrl) {
      navigate(notification.targetUrl);
    }
  };

  const handleMarkAsReadClick = (e: MouseEvent) => {
    e.stopPropagation();
    markAsRead(notification.id);
  };

  const handleDismissClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (onDismiss) {
      onDismiss(notification.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`group relative text-left w-full rounded-2xl border transition-all duration-base cursor-pointer select-none overflow-hidden ${
        compact ? 'p-3.5' : 'p-4 sm:p-5'
      } ${
        isUnread
          ? 'bg-surface-2/95 border-primary/35 hover:border-primary/70 hover:bg-surface-3/80 shadow-md'
          : 'bg-surface-2/40 border-border/60 hover:bg-surface-2 hover:border-border'
      } ${className}`}
    >
      {/* Animated Cyber Glow Indicator on unread */}
      {isUnread && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-cyan to-primary shadow-glow animate-pulse"
        />
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Type Icon */}
        <div
          className={`flex-shrink-0 grid place-items-center rounded-xl border ${
            compact ? 'w-9 h-9' : 'w-11 h-11'
          } ${config.iconBoxClass}`}
        >
          <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={config.badgeVariant} size="sm">
                {config.label}
              </Badge>
              {isUnread && (
                <span className="inline-flex items-center text-[11px] font-extrabold text-primary">
                  <span className="w-1.5 h-1.5 rounded-pill bg-primary mr-1 animate-ping" />
                  Mới
                </span>
              )}
            </div>
            <span className="text-[11px] text-fg-3 whitespace-nowrap font-medium">
              {timeFormatted}
            </span>
          </div>

          <h4
            className={`font-display text-sm leading-snug line-clamp-1 mb-1 ${
              isUnread ? 'font-bold text-fg' : 'font-medium text-fg-1'
            }`}
          >
            {notification.title}
          </h4>

          <p
            className={`text-xs text-fg-2 leading-relaxed ${
              compact ? 'line-clamp-2' : 'line-clamp-3 sm:line-clamp-2'
            }`}
          >
            {notification.message || notification.content}
          </p>

          {/* Target link preview */}
          {notification.targetUrl && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover group-hover:underline">
              <span>Xem chi tiết</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Action buttons (hover visible) */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          {isUnread && (
            <button
              type="button"
              onClick={handleMarkAsReadClick}
              title="Đánh dấu đã đọc"
              aria-label="Đánh dấu đã đọc"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-primary/20 text-fg-3 hover:text-primary grid place-items-center transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}

          {onDismiss && (
            <button
              type="button"
              onClick={handleDismissClick}
              title="Xóa thông báo"
              aria-label="Xóa thông báo"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-danger/20 text-fg-3 hover:text-danger grid place-items-center transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
