# 05 — Module Movies

> **Nhánh:** `origin/claude/merge-login-logic-1l6po` (`mll:`)
> Commit duy nhất: `627aa4f` — 10 file, **1098 dòng**.

## 🔴 Trạng thái: TOÀN BỘ MODULE LÀ DEAD CODE

Không một route nào của module này được đăng ký trong `mll:src/routes/index.tsx`.
Vì router có `{ path: '*', element: <Navigate to="/" replace /> }`, mọi lần bấm vào
`<Link to="/movie/xxx">` sẽ **âm thầm nhảy về trang chủ** — không lỗi, không log.

Code chất lượng tốt, chỉ thiếu đúng phần đấu nối. Xem **NP-005** và task **T-2.1**
trong [11-migration-plan.md](11-migration-plan.md).

---

## 5.1 Mô hình dữ liệu — `mll:src/features/movies/data/movies.ts` (472 dòng)

```ts
export interface Movie {
  id: string;              // ⚠️ string — nhánh main dùng number
  title: string;
  originalTitle?: string;
  description: string;     // ⚠️ main gọi là overview
  releaseYear: number;     // ⚠️ main gọi là year
  duration: number;        // phút
  rating: number;
  genres: string[];
  poster: string;          // ⚠️ main gọi là posterUrl
  backdrop: string;        // ⚠️ main gọi là backdropUrl
  youtubeKey: string;      // ⚠️ main KHÔNG có
  director?: string;
  cast?: string[];
  trending?: boolean;
  topRated?: boolean;
  newRelease?: boolean;
}
```

So sánh đầy đủ với `main:src/data.ts` → xem bug **NP-024**. Phải chốt một kiểu duy nhất
trước khi hợp nhất UI.

### Hằng số

```ts
export const GENRES = ['Hành Động','Phiêu Lưu','Hài','Tâm Lý','Khoa Học Viễn Tưởng',
                       'Kinh Dị','Lãng Mạn','Hoạt Hình','Tội Phạm','Giật Gân',
                       'Chiến Tranh','Âm Nhạc'] as const;
export type Genre = (typeof GENRES)[number];

const TMDB = 'https://image.tmdb.org/t/p';
const poster   = (path) => `${TMDB}/w500${path}`;
const backdrop = (path) => `${TMDB}/original${path}`;
```

- **24 phim** (nhánh `main` chỉ có 12).
- Có `youtubeKey` → trang xem phim nhúng YouTube được.
- 12 thể loại, khác với danh sách 7 thể loại hardcode trong `main:src/components/Navbar.tsx`.
  Hai danh sách này phải gộp làm một. Xem **NP-007**.

### Hàm truy vấn (dòng 442–470)

```ts
getMovie(id: string): Movie | undefined
getTrending(): Movie[]        // lọc m.trending
getTopRated(): Movie[]        // lọc m.topRated
getNewReleases(): Movie[]     // lọc m.newRelease
getByGenre(genre: string): Movie[]
searchMovies(query: string): Movie[]
```

> Đây là **lớp trừu tượng đúng chỗ**. Khi thay mock bằng API thật, chỉ cần đổi 6 hàm này
> thành hàm async gọi `apiClient` — các trang không phải sửa nhiều. **Giữ nguyên interface.**

---

## 5.2 Store — `mll:src/features/movies/store/watchlistStore.ts` (31 dòng)

```ts
useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({ ids: [], toggle, add, remove, has, clear }),
    { name: 'novaplay.watchlist', storage: createJSONStorage(() => localStorage) },
  ),
);
```

| Hàm | Hành vi |
|---|---|
| `toggle(id)` | có thì bỏ, không có thì thêm |
| `add(id)` | thêm nếu chưa có (idempotent) |
| `remove(id)` | lọc bỏ |
| `has(id)` | ⚠️ đọc qua `get()` → **không reactive**, component sẽ không re-render |
| `clear()` | xoá hết |

> ⚠️ Trong component **phải** dùng `useWatchlistStore(s => s.ids.includes(id))` như
> `MovieCard`/`MovieDetailPage` đang làm, **không** dùng `has(id)`. `has` chỉ dùng ngoài React.
>
> ⚠️ Watchlist chỉ lưu localStorage → không đồng bộ giữa thiết bị, mất khi xoá cache,
> và **không gắn với user** — đăng xuất rồi đăng nhập tài khoản khác vẫn thấy watchlist cũ.
> Khi có API thật cần chuyển sang server-side hoặc ít nhất thêm userId vào key.

---

## 5.3 Component

### `MovieCard.tsx` (79 dòng)

| Props | Kiểu | Mặc định |
|---|---|---|
| `movie` | `Movie` | bắt buộc |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` → `w-[140px]` / `w-[180px]` / `w-[220px]` |
| `showActions` | `boolean` | `true` |

- Bọc `<Link to={`/movie/${movie.id}`}>` (link này hiện đang chết — NP-005).
- Poster `aspect-[2/3] rounded-lg shadow-poster`, `loading="lazy"` ✅,
  hover `scale-[1.04]` với `duration-base ease-np-out`.
- Nút bookmark góc: đổi giữa `<Bookmark>` và `<BookmarkCheck>` theo
  `useWatchlistStore(s => s.ids.includes(movie.id))`.
- Badge rating sao vàng.

### `MovieRow.tsx` (60 dòng)

| Props | Kiểu |
|---|---|
| `title` | `string` |
| `subtitle` | `string?` |
| `movies` | `Movie[]` |

- **Trả `null` nếu `movies.length === 0`** ✅ — tránh render hàng rỗng.
- Cuộn ngang thật, bước cuộn = `el.clientWidth * 0.85` → **tự thích ứng theo viewport**.
  So với `MovieRow` của nhánh `main` (bước cứng `200 + 18`), bản này **tốt hơn** — giữ bản này.
- Nút prev/next ẩn dưới `md` (`hidden md:flex`), có `aria-label` tiếng Việt ✅.
- Ẩn scrollbar bằng arbitrary variant Tailwind:
  `[scrollbar-width:none] [&::-webkit-scrollbar]:hidden` — sạch hơn thẻ `<style>` inline của `main`.
- Kỹ thuật tràn lề: `-mx-6 px-6 lg:-mx-16 lg:px-16` để hàng chạy sát mép màn hình.

### `GenreChip.tsx` (21 dòng)

`{ label, active?, onClick? }` — pill `h-9 rounded-pill`, khi active thì nền `primary`
+ glow `shadow-[0_0_18px_rgba(255,44,85,0.35)]`.

---

## 5.4 Năm trang

### `MoviesPage.tsx` (69 dòng) — Khám phá
- Lọc theo 1 thể loại (`genre: string | null`) + sắp xếp `SortKey = 'rating' | 'year' | 'title'`.
- Dùng `useMemo` cho danh sách đã lọc/sắp xếp ✅.
- `sorted.sort()` chạy trên bản copy `[...filtered]` ✅ (không mutate mảng gốc).
- Sắp xếp theo tên dùng `localeCompare` ✅ (đúng cho tiếng Việt).
- ⚠️ State lọc **không đồng bộ vào URL** → không share/bookmark được kết quả lọc,
  F5 mất bộ lọc. Nên chuyển sang `useSearchParams` như `SearchPage`.
- ⚠️ Không phân trang — hiện tại 24 phim thì không sao, nhưng khi nối API thật phải có.

### `SearchPage.tsx` (74 dòng) — Tìm kiếm
- `useSearchParams` đồng bộ `?q=` ✅.
- **Debounce 250ms** bằng `setTimeout` + cleanup ✅ đúng chuẩn.
- `setParams(..., { replace: true })` ✅ — không làm ngập history.
- `useMemo(() => searchMovies(q), [q])` — ⚠️ chạy trên `q` **chưa debounce**, nên bản thân
  việc lọc chạy mỗi lần gõ; chỉ URL là được debounce. Với 24 phim thì không sao, với API thật
  phải debounce cả lời gọi.
- `autoFocus` trên ô nhập.

### `MovieDetailPage.tsx` (167 dòng) — Chi tiết
- `useParams<{ id: string }>()`, `getMovie(id)`.
- **Có empty state đàng hoàng** khi không tìm thấy phim (Navbar + thông báo + link về `/movies`) ✅
  — tốt hơn hẳn `MovieDetailScreen` của `main` (không có state này).
- Hero backdrop `h-[520px] lg:h-[640px]` + `bg-grad-hero-left` + `bg-grad-hero-bottom`.
- Nút quay lại dùng `navigate(-1)`.
- Nút watchlist `toggle(id)`, đổi icon theo trạng thái.
- **Phim liên quan tính động**: lọc phim khác `id` mà có genre giao nhau, lấy 12
  → tốt hơn `slice(7, 11)` cứng của `main`.

### `WatchPage.tsx` (68 dòng) — Xem phim
- Header riêng (không dùng `Navbar` chung), có nút "Thoát" `navigate(-1)`.
- Nhúng YouTube qua `movie.youtubeKey`.
- Có empty state khi không tìm thấy phim ✅.
- ⚠️ Trang này **không** bị bọc bởi guard nào vì chưa được route — khi đăng ký route
  cần quyết định: xem phim có bắt buộc đăng nhập không?

### `WatchlistPage.tsx` (57 dòng) — Yêu thích
- `MOVIES.filter(m => ids.includes(m.id))`.
- ⚠️ Độ phức tạp O(n×m); với danh sách lớn nên đổi `ids` sang `Set`.
- Có empty state + nút "Xoá tất cả" (`clear()`) — ⚠️ **không có xác nhận**, bấm nhầm là mất sạch.
- Thứ tự hiển thị theo thứ tự `MOVIES` chứ không theo thứ tự thêm vào.

---

## 5.5 Việc cần làm để module sống lại

Chi tiết ở [11-migration-plan.md](11-migration-plan.md) task **T-2.1**, tóm tắt:

```tsx
// mll:src/routes/index.tsx — thêm vào nhánh <ProtectedRoute> (hoặc public, tuỳ quyết định)
{ path: '/movies',      element: <MoviesPage /> },
{ path: '/movie/:id',   element: <MovieDetailPage /> },
{ path: '/watch/:id',   element: <WatchPage /> },
{ path: '/search',      element: <SearchPage /> },
{ path: '/watchlist',   element: <WatchlistPage /> },
```
```tsx
// mll:src/pages/HomePage.tsx — nút đang thiếu onClick
<Button variant="primary" onClick={() => navigate('/movies')} leftIcon={<Play .../>}>
  Khám Phá Phim
</Button>
```

**Cần quyết định trước khi làm** (hỏi chủ dự án):
1. Duyệt phim có yêu cầu đăng nhập không? (ảnh hưởng: đặt route trong `ProtectedRoute` hay ngoài)
2. Xem phim (`/watch/:id`) có yêu cầu đăng nhập không?
3. Watchlist khi chưa đăng nhập thì lưu local hay bắt đăng nhập?
