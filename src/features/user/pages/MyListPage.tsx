import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bookmark, Clock, Film } from 'lucide-react';
import { Badge, Tabs, type TabItem } from '@/components/ui';
import { FavoritesGrid } from '../components/FavoritesGrid';
import { WatchHistoryTimeline } from '../components/WatchHistoryTimeline';
import { useWatchlistStore } from '@/features/movies/store/watchlistStore';
import { useHistoryStore } from '@/features/movies/store/historyStore';

export function MyListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'history' ? 'history' : 'favorites';

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const watchlistCount = useWatchlistStore((s) => s.ids.length);
  const historyCount = useHistoryStore((s) => s.history.length);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tabId);
      return next;
    });
  };

  const tabs: TabItem[] = [
    {
      id: 'favorites',
      label: 'Danh Sách Yêu Thích',
      icon: Bookmark,
      count: watchlistCount,
    },
    {
      id: 'history',
      label: 'Lịch Sử Xem Phim',
      icon: Clock,
      count: historyCount,
    },
  ];

  return (
    <div className="max-w-container mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center text-primary shadow-glow flex-shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-fg tracking-tight">
              Kho Phim Cá Nhân
            </h1>
            <p className="text-sm text-fg-2 mt-0.5">
              Quản lý danh sách phim yêu thích đã lưu và lịch sử tiến trình xem phim của bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" className="font-bold">
            <Film className="w-3.5 h-3.5 mr-1" /> Bộ Sưu Tập Cá Nhân
          </Badge>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-between">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
          variant="pills"
          size="md"
        />
      </div>

      {/* Tab Panels */}
      <div className="animate-fade-in">
        {activeTab === 'favorites' ? (
          <FavoritesGrid />
        ) : (
          <WatchHistoryTimeline />
        )}
      </div>
    </div>
  );
}
