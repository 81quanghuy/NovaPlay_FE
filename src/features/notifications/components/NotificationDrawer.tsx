import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  BellOff,
  CheckCheck,
  Film,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  Badge,
  Button,
  Drawer,
  EmptyState,
  Skeleton,
  Tabs,
  type TabItem,
} from '@/components/ui';
import { PATHS } from '@/routes/paths';
import { NotificationDTO, NotificationFilter } from '../types';
import { useNotificationStore } from '../store/notificationStore';
import { NotificationItem } from './NotificationItem';

export interface NotificationDrawerProps {
  className?: string;
}

export function NotificationDrawer({ className = '' }: NotificationDrawerProps) {
  const navigate = useNavigate();

  const isDrawerOpen = useNotificationStore((s) => s.isDrawerOpen);
  const closeDrawer = useNotificationStore((s) => s.closeDrawer);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const isLoading = useNotificationStore((s) => s.isLoading);
  const filter = useNotificationStore((s) => s.filter);
  const setFilter = useNotificationStore((s) => s.setFilter);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  // Fetch notifications on drawer open if empty
  useEffect(() => {
    if (isDrawerOpen) {
      fetchNotifications(0, 20);
    }
  }, [isDrawerOpen, fetchNotifications]);

  // Tab definitions
  const tabs: TabItem[] = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: notifications.length },
      { id: 'unread', label: 'Chưa đọc', count: unreadCount },
      {
        id: 'movies',
        label: 'Phim mới',
        count: notifications.filter((n) => n.type === 'NEW_MOVIE_RELEASE').length,
      },
      {
        id: 'system',
        label: 'Hệ thống',
        count: notifications.filter((n) => n.type === 'SYSTEM').length,
      },
    ],
    [notifications, unreadCount],
  );

  // Filtered notifications
  const displayedNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (filter === 'unread') return !item.isRead && !item.read;
      if (filter === 'movies') return item.type === 'NEW_MOVIE_RELEASE';
      if (filter === 'system') return item.type === 'SYSTEM';
      return true;
    });
  }, [notifications, filter]);

  const handleNotificationSelect = (item: NotificationDTO) => {
    closeDrawer();
    if (item.targetUrl) {
      navigate(item.targetUrl);
    }
  };

  const handleViewAll = () => {
    closeDrawer();
    navigate(PATHS.NOTIFICATIONS);
  };

  // Drawer Title with unread count badge
  const headerTitle = (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center text-primary">
        <Bell className="w-4 h-4" />
      </div>
      <span className="font-display font-bold text-base text-fg">Thông Báo</span>
      {unreadCount > 0 && (
        <Badge variant="primary" size="sm" pulse>
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </div>
  );

  // Mark all as read button in header
  const headerAction = (
    <Button
      variant="ghost"
      size="sm"
      onClick={markAllAsRead}
      disabled={unreadCount === 0}
      leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
      className="text-xs text-primary hover:text-primary-hover disabled:opacity-40"
    >
      <span className="hidden sm:inline">Đánh dấu tất cả đã đọc</span>
      <span className="sm:hidden">Đã đọc tất cả</span>
    </Button>
  );

  // Drawer Footer
  const drawerFooter = (
    <div className="space-y-2">
      <Button
        variant="secondary"
        size="md"
        fullWidth
        onClick={handleViewAll}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="text-sm font-bold border-white/10 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all"
      >
        Xem tất cả thông báo
      </Button>
    </div>
  );

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title={headerTitle}
      headerAction={headerAction}
      position="right"
      size="md"
      footer={drawerFooter}
      className={`border-border bg-surface-1/95 backdrop-blur-xl ${className}`}
      bodyClassName="p-4 space-y-3.5"
    >
      {/* Category Filter Tabs */}
      <div className="pb-1 border-b border-border/60">
        <Tabs
          tabs={tabs}
          activeTab={filter}
          onChange={(id) => setFilter(id as NotificationFilter)}
          variant="pills"
          size="sm"
          fullWidth
        />
      </div>

      {/* Loading Skeleton State */}
      {isLoading && notifications.length === 0 ? (
        <div className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-surface-2/60 border border-white/5 space-y-2.5 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="w-9 h-9" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton variant="text" className="h-3 w-1/3" />
                  <Skeleton variant="text" className="h-4 w-3/4" />
                </div>
              </div>
              <Skeleton variant="text" className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : displayedNotifications.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon={filter === 'unread' ? BellOff : filter === 'movies' ? Film : Layers}
          title={
            filter === 'unread'
              ? 'Không có thông báo chưa đọc'
              : filter === 'movies'
              ? 'Chưa có cập nhật phim mới'
              : filter === 'system'
              ? 'Không có thông báo hệ thống'
              : 'Chưa có thông báo nào'
          }
          description={
            filter === 'unread'
              ? 'Tuyệt vời! Bạn đã cập nhật và đọc tất cả các thông báo.'
              : 'Các thông báo mới về phim bom tấn, ưu đãi VIP và tài khoản sẽ hiển thị tại đây.'
          }
          action={
            filter !== 'all'
              ? {
                  label: 'Xem tất cả thông báo',
                  onClick: () => setFilter('all'),
                  variant: 'secondary',
                  icon: <Sparkles className="w-4 h-4" />,
                }
              : undefined
          }
          className="py-12"
        />
      ) : (
        /* Notifications List */
        <div className="space-y-2.5">
          {displayedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onSelect={handleNotificationSelect}
              compact
            />
          ))}
        </div>
      )}
    </Drawer>
  );
}
