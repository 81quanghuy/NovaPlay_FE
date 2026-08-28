import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import {
  Badge,
  Button,
  EmptyState,
  Skeleton,
  Tabs,
  type TabItem,
} from '@/components/ui';
import { NotificationDTO, NotificationFilter } from '../types';
import { useNotificationStore } from '../store/notificationStore';
import { NotificationItem } from '../components/NotificationItem';

export function NotificationsPage() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const isLoading = useNotificationStore((s) => s.isLoading);
  const filter = useNotificationStore((s) => s.filter);
  const page = useNotificationStore((s) => s.page);
  const hasMore = useNotificationStore((s) => s.hasMore);
  const setFilter = useNotificationStore((s) => s.setFilter);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'unread_only'>('all');

  useEffect(() => {
    fetchNotifications(0, 50);
  }, [fetchNotifications]);

  const handleRefresh = () => {
    fetchNotifications(0, 50);
  };

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

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item: NotificationDTO) => {
      // Filter tab
      if (filter === 'unread' && (item.isRead || item.read)) return false;
      if (filter === 'movies' && item.type !== 'NEW_MOVIE_RELEASE') return false;
      if (filter === 'system' && item.type !== 'SYSTEM') return false;

      // Quick view mode toggle
      if (viewMode === 'unread_only' && (item.isRead || item.read)) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(query);
        const msgMatch = (item.message || item.content || '').toLowerCase().includes(query);
        if (!titleMatch && !msgMatch) return false;
      }

      return true;
    });
  }, [notifications, filter, viewMode, searchQuery]);

  return (
    <div className="max-w-container mx-auto px-4 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center text-primary shadow-glow flex-shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-fg">
                Trung Tâm Thông Báo
              </h1>
              {unreadCount > 0 && (
                <Badge variant="primary" size="md" pulse>
                  {unreadCount > 99 ? '99+' : unreadCount} chưa đọc
                </Badge>
              )}
            </div>
            <p className="text-sm text-fg-2 mt-1">
              Cập nhật phim mới phát hành, trạng thái VIP và cảnh báo hệ thống
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            className="text-fg-2 hover:text-fg"
          >
            Làm mới
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            leftIcon={<CheckCheck className="w-4 h-4 text-primary" />}
            className="border-white/10 hover:border-primary/40 font-bold"
          >
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="overflow-x-auto pb-1 lg:pb-0">
          <Tabs
            tabs={tabs}
            activeTab={filter}
            onChange={(id) => setFilter(id as NotificationFilter)}
            variant="pills"
            size="md"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm thông báo..."
              className="w-full h-10 pl-10 pr-4 rounded-pill bg-surface-2/80 border border-border text-sm text-fg placeholder:text-fg-3 focus:outline-none focus:border-primary/60 focus:bg-surface-2 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Xóa tìm kiếm"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-fg-3 hover:text-fg"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick unread filter toggle */}
          <Button
            variant={viewMode === 'unread_only' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode(viewMode === 'unread_only' ? 'all' : 'unread_only')}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Chưa đọc</span>
          </Button>
        </div>
      </div>

      {/* Notifications List Content */}
      {isLoading && notifications.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-surface-2/60 border border-white/5 space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <Skeleton variant="circle" className="w-11 h-11" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="h-4 w-1/4" />
                  <Skeleton variant="text" className="h-5 w-2/3" />
                </div>
              </div>
              <Skeleton variant="text" className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-surface-2/40 border border-border rounded-3xl p-8 sm:p-12 text-center">
          <EmptyState
            icon={Filter}
            title={
              searchQuery
                ? `Không tìm thấy thông báo cho "${searchQuery}"`
                : filter === 'unread' || viewMode === 'unread_only'
                ? 'Không có thông báo chưa đọc'
                : 'Không có thông báo phù hợp'
            }
            description={
              searchQuery
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc danh mục khác.'
                : 'Bạn đã đọc tất cả thông báo hoặc chưa có thông báo mới trong danh mục này.'
            }
            action={
              searchQuery || filter !== 'all' || viewMode !== 'all'
                ? {
                    label: 'Xem tất cả thông báo',
                    onClick: () => {
                      setSearchQuery('');
                      setFilter('all');
                      setViewMode('all');
                    },
                    variant: 'primary',
                    icon: <Sparkles className="w-4 h-4" />,
                  }
                : undefined
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onDismiss={deleteNotification}
            />
          ))}

          {/* Load more button if has more pages */}
          {hasMore && (
            <div className="pt-6 text-center">
              <Button
                variant="secondary"
                size="md"
                onClick={() => fetchNotifications(page + 1, 20)}
                disabled={isLoading}
                leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
              >
                Tải thêm thông báo cũ hơn
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
