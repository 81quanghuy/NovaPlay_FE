import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui';
import { useLogout } from '@/features/auth/hooks/useLogout';
import {
  HeroSlider,
  TopTen,
  MovieRow,
  MovieCard,
  QuickFilterBar,
  CollectionBanner,
  ContinueWatchingRow,
  MOVIES,
  getTrending,
  getTopRated,
  getNewReleases,
  getSeries,
  getByGenre,
} from '@/features/movies';
import { PATHS } from '@/routes/paths';

export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const { logout, isLoading } = useLogout();
  const navigate = useNavigate();

  // Quick filter state
  const [filterValues, setFilterValues] = useState<{
    type?: string;
    genre?: string;
    country?: string;
    sort?: string;
  }>({});

  const hasFilter = Boolean(
    filterValues.type || filterValues.genre || filterValues.country || (filterValues.sort && filterValues.sort !== 'rating'),
  );

  // Filtered list when user selects from QuickFilterBar
  const filteredMovies = useMemo(() => {
    let list = [...MOVIES];
    if (filterValues.type) {
      list = list.filter((m) => m.type === filterValues.type);
    }
    if (filterValues.genre) {
      list = list.filter((m) => m.genres.includes(filterValues.genre!));
    }
    if (filterValues.country) {
      list = list.filter((m) => m.country === filterValues.country);
    }
    const sort = filterValues.sort || 'rating';
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'year') list.sort((a, b) => b.releaseYear - a.releaseYear);
    else if (sort === 'views') list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    else if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [filterValues]);

  // Data sets
  const heroMovies = useMemo(() => getTrending().slice(0, 5), []);
  const trendingMovies = useMemo(() => getTrending(), []);
  const topRatedMovies = useMemo(() => getTopRated(), []);
  const newReleaseMovies = useMemo(() => getNewReleases(), []);
  const seriesMovies = useMemo(() => getSeries(), []);
  const animeMovies = useMemo(() => getByGenre('Hoạt Hình'), []);

  // Curated collections
  const nolanCollection = useMemo(
    () => MOVIES.filter((m) => m.director?.includes('Christopher Nolan')),
    [],
  );

  return (
    <div className="min-h-screen bg-bg text-fg-1">
      <main>
        {/* Hero Slider */}
        {heroMovies.length > 0 ? (
          <HeroSlider movies={heroMovies} />
        ) : (
          <section className="relative h-[480px] lg:h-[560px] w-full bg-surface flex items-end">
            <div className="max-w-container mx-auto px-6 lg:px-8 pb-16">
              <span className="text-xs uppercase tracking-[0.08em] font-bold text-primary mb-3 block">
                Chào mừng
              </span>
              <h1 className="font-display font-extrabold text-4xl lg:text-6xl leading-[1.05] tracking-tight text-fg max-w-3xl">
                Xin Chào, {user?.username || 'Thành Viên'}
              </h1>
              <p className="text-fg-2 text-lg mt-4 max-w-2xl">
                Khám phá kho phim chất lượng cao 4K với phụ đề Vietsub và Thuyết minh.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Button
                  variant="primary"
                  leftIcon={<Play className="w-4 h-4 fill-current" />}
                  onClick={() => navigate(PATHS.MOVIES)}
                >
                  Khám Phá Phim
                </Button>
                <Button variant="secondary" onClick={logout} loading={isLoading}>
                  Đăng Xuất
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Content Body Container */}
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          {/* Continue Watching Section (If any history exists) */}
          <ContinueWatchingRow />

          {/* Floating Glass Island Quick Filter Bar */}
          <QuickFilterBar
            values={filterValues}
            onChange={setFilterValues}
            totalCount={hasFilter ? filteredMovies.length : undefined}
          />

          {/* Conditional rendering: Filtered Grid vs. Curated Home Rows */}
          {hasFilter ? (
            <section className="py-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-fg tracking-tight">
                  Kết Quả Lọc ({filteredMovies.length} phim)
                </h2>
              </div>
              {filteredMovies.length === 0 ? (
                <div className="text-center py-20 text-fg-3 bg-surface-2/40 rounded-3xl border border-white/5">
                  Không tìm thấy bộ phim nào phù hợp với bộ lọc đã chọn.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                  {filteredMovies.map((m) => (
                    <MovieCard key={m.id} movie={m} size="sm" />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Row: Phim Đang Thịnh Hành */}
              {trendingMovies.length > 0 && (
                <MovieRow
                  title="Phim Đang Thịnh Hành"
                  subtitle="Các tựa phim bom tấn được đón xem nhiều nhất"
                  movies={trendingMovies}
                  to={`${PATHS.MOVIES}?sort=views`}
                />
              )}

              {/* Row: Phim Mới Cập Nhật */}
              {newReleaseMovies.length > 0 && (
                <MovieRow
                  title="Phim Mới Cập Nhật"
                  subtitle="Phim chiếu rạp và bản phát hành mới nhất"
                  movies={newReleaseMovies}
                  to={`${PATHS.MOVIES}?sort=year`}
                />
              )}

              {/* Top 10 Bảng Xếp Hạng 3D Đỉnh Cao */}
              {topRatedMovies.length >= 5 && <TopTen movies={topRatedMovies} />}

              {/* Curated Collection Showcase: Christopher Nolan */}
              {nolanCollection.length > 0 && (
                <CollectionBanner
                  title="Tuyệt Tác Điện Ảnh Christopher Nolan"
                  subtitle="Trải nghiệm những kiệt tác đỉnh cao của nghệ thuật biên kịch và quay phim: Inception, The Dark Knight, Interstellar, Oppenheimer..."
                  tag="Đạo Diễn Xuất Sắc"
                  backdropUrl="https://image.tmdb.org/t/p/original/fm6Bg9Azv739G9otgXMIRFq1YmB.jpg"
                  movies={nolanCollection}
                />
              )}

              {/* Row: Phim Bộ Hot (Series) */}
              {seriesMovies.length > 0 && (
                <MovieRow
                  title="Phim Bộ Chọn Lọc Độc Quyền"
                  subtitle="Các series truyền hình kịch tính trọn bộ Full HD & 4K"
                  movies={seriesMovies}
                  to={`${PATHS.MOVIES}?type=series`}
                />
              )}

              {/* Row: Hoạt Hình & Anime */}
              {animeMovies.length > 0 && (
                <MovieRow
                  title="Vũ Trụ Hoạt Hình & Anime"
                  subtitle="Hành trình cảm xúc và hình ảnh sống động kỳ diệu"
                  movies={animeMovies}
                  genre="Hoạt Hình"
                />
              )}

              {/* Row: Phim Điểm IMDb Cao Nhất */}
              {topRatedMovies.length > 0 && (
                <MovieRow
                  title="Kiệt Tác Điểm Cao Nhất (IMDb 8.0+)"
                  subtitle="Những bộ phim được đánh giá cao nhất bởi giới phê bình"
                  movies={topRatedMovies}
                  to={`${PATHS.MOVIES}?sort=rating`}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
