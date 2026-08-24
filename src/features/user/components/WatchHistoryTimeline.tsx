import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Film,
  Play,
  RotateCcw,
  Trash2,
  Tv,
} from 'lucide-react';
import { Button, ConfirmDialog, EmptyState, Skeleton } from '@/components/ui';
import { userService } from '../services/userService';
import { useHistoryStore } from '@/features/movies/store/historyStore';
import { PATHS } from '@/routes/paths';
import type { WatchProgressDTO } from '../types';

interface WatchHistoryTimelineProps {
  onCountChange?: (count: number) => void;
}

interface GroupedHistory {
  today: WatchProgressDTO[];
  thisWeek: WatchProgressDTO[];
  earlier: WatchProgressDTO[];
}

export function WatchHistoryTimeline({ onCountChange }: WatchHistoryTimelineProps) {
  const [historyList, setHistoryList] = useState<WatchProgressDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const localHistory = useHistoryStore((s) => s.history);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getWatchProgressList(0, 100);
      setHistoryList(res.content);
      onCountChange?.(res.totalElements);
    } catch {
      // Handled gracefully in mock
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, localHistory]);

  const handleRemoveSingle = async (movieId: string) => {
    await userService.removeWatchProgress(movieId);
    setHistoryList((prev) => prev.filter((item) => item.movieId !== movieId));
    onCountChange?.(Math.max(0, historyList.length - 1));
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await userService.clearWatchHistory();
      setHistoryList([]);
      setClearDialogOpen(false);
      onCountChange?.(0);
    } finally {
      setClearing(false);
    }
  };

  // Group items into timeline buckets: Today, This Week, Earlier
  const grouped = useMemo<GroupedHistory>(() => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const todayLimit = now - oneDayMs;
    const weekLimit = now - 7 * oneDayMs;

    const result: GroupedHistory = {
      today: [],
      thisWeek: [],
      earlier: [],
    };

    historyList.forEach((item) => {
      const itemTime = new Date(item.lastWatchedAt).getTime();
      if (itemTime >= todayLimit) {
        result.today.push(item);
      } else if (itemTime >= weekLimit) {
        result.thisWeek.push(item);
      } else {
        result.earlier.push(item);
      }
    });

    return result;
  }, [historyList]);

  // Helper formatting for remaining time
  const formatRemainingTime = (progress: WatchProgressDTO) => {
    if (progress.progressPercent >= 95) {
      return 'Đã xem hết';
    }
    const remainingSeconds = Math.max(0, progress.durationSeconds - progress.positionSeconds);
    const remainingMinutes = Math.round(remainingSeconds / 60);
    if (remainingMinutes < 1) return 'Còn dưới 1 phút';
    if (remainingMinutes < 60) return `Còn ${remainingMinutes} phút`;
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    return `Còn ${hours}h ${mins > 0 ? `${mins}p` : ''}`;
  };

  // Helper formatting date
  const formatWatchedDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Vừa xem xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" className="w-48 h-6" />
          <Skeleton variant="button" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} variant="rect" className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (historyList.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 shadow-sm">
        <EmptyState
          icon={RotateCcw}
          title="Chưa Có Lịch Sử Xem Phim"
          description="Bạn chưa xem bộ phim nào gần đây. Hãy bắt đầu thưởng thức các bộ phim hấp dẫn trên NovaPlay để lưu lại tiến trình xem tự động!"
          action={{
            label: 'Khám Phá Phim Ngay',
            to: PATHS.MOVIES,
            leftIcon: <Film className="w-4 h-4" />,
          }}
        />
      </div>
    );
  }

  const renderTimelineSection = (title: string, items: WatchProgressDTO[], icon: React.ReactNode) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary grid place-items-center">
            {icon}
          </div>
          <h3 className="font-display font-bold text-sm sm:text-base text-fg">{title}</h3>
          <span className="text-xs text-fg-3 font-semibold">({items.length} phim)</span>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const isCompleted = item.progressPercent >= 95;

            return (
              <div
                key={item.movieId}
                className="group relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-surface-2/60 border border-border hover:border-primary/40 transition-all duration-base hover:shadow-[0_0_24px_rgb(var(--np-primary-rgb)/0.15)]"
              >
                {/* Left: Poster + Info */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                  {/* Poster with Play overlay */}
                  <Link
                    to={PATHS.WATCH(item.movieId)}
                    className="relative w-20 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden bg-surface-3 flex-shrink-0 group-hover:shadow-glow transition-all"
                  >
                    <img
                      src={item.moviePoster}
                      alt={item.movieTitle || item.movieId}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-7 h-7 rounded-pill bg-primary/90 text-white grid place-items-center shadow-glow group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </Link>

                  {/* Text Details & Progress Bar */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to={PATHS.WATCH(item.movieId)}
                        className="font-display font-bold text-sm sm:text-base text-fg hover:text-primary transition-colors truncate"
                      >
                        {item.movieTitle || item.movieId}
                      </Link>
                      {item.episode && (
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-fg-2 text-[11px] font-bold flex-shrink-0">
                          Tập {item.episode}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-3">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatWatchedDate(item.lastWatchedAt)}
                      </span>
                      <span className="text-primary font-semibold">
                        {formatRemainingTime(item)}
                      </span>
                      <span className="text-fg-3">({item.progressPercent}% đã xem)</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full max-w-md h-1.5 bg-white/10 rounded-pill overflow-hidden mt-1.5">
                      <div
                        ref={(el) => {
                          if (el) el.style.width = `${Math.min(100, Math.max(0, item.progressPercent))}%`;
                        }}
                        className={`h-full rounded-pill transition-all duration-300 ${
                          isCompleted
                            ? 'bg-success shadow-[0_0_10px_rgb(var(--np-success-rgb)/0.5)]'
                            : 'bg-primary shadow-glow'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 flex-shrink-0">
                  <Link to={PATHS.WATCH(item.movieId)}>
                    <Button
                      variant={isCompleted ? 'secondary' : 'primary'}
                      size="sm"
                      leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    >
                      {isCompleted ? 'Xem Lại' : 'Xem Tiếp'}
                    </Button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRemoveSingle(item.movieId)}
                    aria-label={`Xóa ${item.movieTitle || item.movieId} khỏi lịch sử`}
                    title="Xóa khỏi lịch sử xem"
                    className="w-8 h-8 rounded-pill bg-white/5 hover:bg-danger/20 text-fg-3 hover:text-danger grid place-items-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Clear All Action */}
      <div className="flex items-center justify-between bg-surface-2/60 border border-border rounded-2xl px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-fg">
            Tổng cộng: <strong className="text-primary">{historyList.length}</strong> phim trong lịch sử
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setClearDialogOpen(true)}
          leftIcon={<Trash2 className="w-3.5 h-3.5 text-danger" />}
          className="text-xs text-danger hover:bg-danger/10 hover:border-danger/40 h-8"
        >
          Xóa toàn bộ lịch sử
        </Button>
      </div>

      {/* Grouped Timeline Sections */}
      <div className="space-y-6">
        {renderTimelineSection('Hôm Nay', grouped.today, <Calendar className="w-3.5 h-3.5" />)}
        {renderTimelineSection('Tuần Này', grouped.thisWeek, <Clock className="w-3.5 h-3.5" />)}
        {renderTimelineSection('Cũ Hơn', grouped.earlier, <Tv className="w-3.5 h-3.5" />)}
      </div>

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={clearDialogOpen}
        title="Xóa toàn bộ lịch sử xem?"
        message="Hành động này sẽ xóa vĩnh viễn toàn bộ tiến trình xem của bạn trên mọi thiết bị và không thể hoàn tác."
        confirmLabel="Xác nhận xóa"
        cancelLabel="Hủy bỏ"
        confirmVariant="danger"
        loading={clearing}
        onConfirm={handleClearAll}
        onCancel={() => setClearDialogOpen(false)}
      />
    </div>
  );
}
