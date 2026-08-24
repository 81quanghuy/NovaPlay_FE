import { useState } from 'react';
import {
  CheckCircle2,
  Heart,
  MessageSquare,
  Send,
  Star,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface Review {
  id: string;
  author: string;
  avatarLetter: string;
  rating: number;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  isVerified?: boolean;
}

interface Props {
  movieId: string;
  movieTitle: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Minh Hoàng (Film Critic)',
    avatarLetter: 'H',
    rating: 10,
    content:
      'Tuyệt tác điện ảnh không thể bỏ lỡ! Âm thanh và kỹ xảo quá mãn nhãn, xem chất lượng 4K trên NovaPlay cảm giác mượt mà và đã như ngồi rạp IMAX.',
    createdAt: '2 giờ trước',
    likes: 48,
    isVerified: true,
  },
  {
    id: '2',
    author: 'Trang Nguyễn',
    avatarLetter: 'T',
    rating: 9,
    content:
      'Diễn xuất đỉnh chóp, cốt truyện cuốn từ đầu đến cuối không rời mắt được. Phụ đề dịch rất mượt và chuẩn nghĩa.',
    createdAt: 'Hôm qua',
    likes: 23,
    isVerified: true,
  },
  {
    id: '3',
    author: 'Văn Đức',
    avatarLetter: 'Đ',
    rating: 9,
    content:
      'Xem lại lần thứ 3 rồi vẫn thấy hay. Đoạn cao trào âm nhạc đẩy cảm xúc lên đỉnh điểm!',
    createdAt: '3 ngày trước',
    likes: 15,
  },
];

export function MovieReviews({ movieTitle }: Props) {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(10);
  const [hoverRating, setHoverRating] = useState(0);

  function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev: Review = {
      id: Date.now().toString(),
      author: user?.username || 'Bạn',
      avatarLetter: (user?.username?.[0] || 'B').toUpperCase(),
      rating: userRating,
      content: newComment.trim(),
      createdAt: 'Vừa xong',
      likes: 1,
      isLiked: true,
      isVerified: true,
    };

    setReviews([newRev, ...reviews]);
    setNewComment('');
  }

  function handleToggleLike(reviewId: string) {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likes: r.likes + (isLiked ? 1 : -1),
          };
        }
        return r;
      }),
    );
  }

  return (
    <section className="bg-surface/85 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 text-primary grid place-items-center shadow-glow">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-display font-black text-lg sm:text-2xl text-fg tracking-tight">
              Đánh Giá & Thảo Luận ({reviews.length})
            </h3>
            <p className="text-xs sm:text-sm text-fg-3">
              Cảm nghĩ của cộng đồng người xem về &quot;{movieTitle}&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleAddReview} className="mb-8 p-4 sm:p-5 rounded-2xl bg-surface-2 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <span className="text-xs sm:text-sm font-bold text-fg">
            Chấm điểm của bạn:
          </span>

          {/* 10-Star Rating Selector */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }, (_, i) => {
              const score = i + 1;
              const isFilled = (hoverRating || userRating) >= score;
              return (
                <button
                  key={score}
                  type="button"
                  onMouseEnter={() => setHoverRating(score)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setUserRating(score)}
                  aria-label={`Chấm ${score} sao`}
                  className="p-0.5 text-fg-3 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isFilled ? 'fill-gold text-gold drop-shadow-sm' : 'text-fg-3'
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-sm font-black text-gold ml-2 min-w-[36px]">
              {hoverRating || userRating}/10
            </span>
          </div>
        </div>

        {/* Text Input */}
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Chia sẻ cảm nghĩ hoặc đánh giá của bạn về bộ phim..."
            className="w-full bg-surface border border-white/10 rounded-xl p-3.5 text-sm text-fg placeholder:text-fg-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 resize-none font-medium"
          />
        </div>

        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-grad-brand text-white font-extrabold text-xs sm:text-sm hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow-glow"
          >
            <Send className="w-4 h-4" /> Gửi Bình Luận
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 sm:p-5 rounded-2xl bg-surface-2/70 border border-white/5 hover:border-white/15 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-pill bg-primary/20 border border-primary/30 text-primary font-black grid place-items-center text-sm shadow-sm flex-shrink-0">
                  {rev.avatarLetter}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-fg">{rev.author}</span>
                    {rev.isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary">
                        <CheckCircle2 className="w-3 h-3" /> Đã xem
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-fg-3">{rev.createdAt}</span>
                </div>
              </div>

              {/* Rating Pill */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold/15 border border-gold/30 text-gold text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-gold" />
                {rev.rating}/10
              </div>
            </div>

            <p className="text-xs sm:text-sm text-fg-1 leading-relaxed pl-12">
              {rev.content}
            </p>

            {/* Like button */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => handleToggleLike(rev.id)}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                  rev.isLiked
                    ? 'text-danger bg-danger/10'
                    : 'text-fg-3 hover:text-fg hover:bg-white/5'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${rev.isLiked ? 'fill-current' : ''}`} />
                <span>{rev.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
