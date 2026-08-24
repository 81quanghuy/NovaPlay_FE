# 03 — Nhánh `main`: lớp giao diện

Toàn bộ file mô tả ở đây **có trong working tree hiện tại**.

Tóm tắt: đây là bản dựng lại pixel-perfect từ prototype `project/ui_kits/web/*.jsx`.
Đẹp, nhưng chỉ là vỏ: không router thật, không API, không form state, không auth.

---

## 3.1 Điểm vào

### `src/main.tsx` (10 dòng)
```tsx
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
```
Import `./index.css`. Không có provider nào.

### `src/App.tsx` (50 dòng) — routing tự chế

```ts
type Route =
  | { name: 'home' }
  | { name: 'detail'; movie: Movie }
  | { name: 'login' };
```

Cơ chế:
- `getInitialRoute()` đọc `location.hash`, parse bằng `URLSearchParams`, hỗ trợ
  `#?screen=detail` (hardcode mở phim `id === 19` = Dune Part Two) và `#?screen=login`.
- Điều hướng bằng `setRoute(next)` — **không đẩy URL**, không `history.pushState`.
- `useEffect` cuộn lên đầu trang mỗi khi đổi route, dependency là
  `[route.name, route.name === 'detail' ? route.movie.id : null]`.

**Hệ quả (đều là bug, xem NP-006):**
- Nút Back của trình duyệt không quay lại màn trước.
- Không share được link tới một phim cụ thể.
- Không SEO được.
- Không có trang 404.
- Toàn bộ state (đang ở tập nào, tab nào) mất khi F5.

### `index.html`
```html
<html lang="vi">
<title>NovaPlay — Xem Phim Trực Tuyến</title>
<link rel="icon" href="/favicon.ico">        ← vẫn là favicon mặc định CRA
preconnect fonts.googleapis.com + fonts.gstatic.com
link href=".../css2?family=Be+Vietnam+Pro:...&family=Manrope:..."
```
> Font được nạp **2 lần**: một lần bằng `<link>` trong `index.html`, một lần bằng
> `@import url(...)` ở dòng 1 của `src/index.css`. `index.css` còn nạp thêm JetBrains Mono.
> Xem NP-008.

---

## 3.2 Tầng dữ liệu — `src/data.ts` (35 dòng)

```ts
export interface Movie {
  id: number;                       // ⚠️ number — nhánh mll dùng string
  title: string;
  overview: string;
  posterUrl: string;                // ⚠️ tên khác nhánh mll (poster)
  backdropUrl: string;              // ⚠️ tên khác nhánh mll (backdrop)
  year: number;                     // ⚠️ mll dùng releaseYear
  rating: number;
  genres: string[];
  duration: number;                 // phút
  quality: '4K' | 'FHD' | 'HD';     // ⚠️ mll KHÔNG có trường này
  type: 'movie' | 'series';         // ⚠️ mll KHÔNG có
  episodes?: { current: number; total: number };  // ⚠️ mll KHÔNG có
  country: string;                  // ⚠️ mll KHÔNG có
}
```

- `NP_MOVIES`: **12 phim** cứng. **ID không liên tục**: 1,2,3,4,5,6,7,9,10,12,13,19
  (thiếu 8, 11, 14–18).
- Ảnh lấy trực tiếp từ `https://image.tmdb.org/t/p/...` — phụ thuộc CDN bên thứ ba,
  không có ảnh dự phòng khi lỗi tải. Xem NP-007.
- 4 slice tính sẵn:
  ```ts
  NP_HERO     = NP_MOVIES.slice(0, 5)    // 5 phim
  NP_NEW      = NP_MOVIES.slice(2, 10)   // 8 phim
  NP_UPCOMING = NP_MOVIES.slice(4, 12)   // 8 phim
  NP_TRENDING = NP_MOVIES.slice(0, 10)   // 10 phim
  ```
  Các slice **chồng lấn nhau** → cùng một phim xuất hiện ở 3–4 hàng khác nhau trên trang chủ.

---

## 3.3 Màn hình

### `HomeScreen.tsx` (25 dòng)

```tsx
<div style={{ background: '#07090f', color: '#fff' }}>
  <Navbar onNav={onNav} transparent />
  <HeroSlider movies={NP_HERO} onOpen={onOpen} />
  <TopTen movies={NP_TRENDING} onOpen={onOpen} />
  <MovieRow title="Phim Mới Cập Nhật" movies={NP_NEW} onOpen={onOpen} />
  <MovieRow title="Sắp Chiếu"        movies={NP_UPCOMING} onOpen={onOpen} />
  <MovieRow title="Phim Bộ Đề Cử"    movies={NP_MOVIES.slice(2, 10)} onOpen={onOpen} />
  <Footer />
</div>
```

| Props | Kiểu | Ghi chú |
|---|---|---|
| `onOpen` | `(movie: Movie) => void` | mở màn chi tiết |
| `onNav` | `(route: string) => void` | chỉ xử lý `'login'`, còn lại về home |

> Hàng "Phim Bộ Đề Cử" dùng `NP_MOVIES.slice(2, 10)` — **trùng y hệt** `NP_NEW`.
> Trang chủ đang render 2 hàng có nội dung giống nhau. Xem NP-007.

### `MovieDetailScreen.tsx` (288 dòng)

| Props | Kiểu |
|---|---|
| `movie` | `Movie` |
| `onBack` | `() => void` |

Cấu trúc:
1. `<Navbar onNav={() => onBack()} transparent />` — mọi mục nav đều quay về home.
2. **Hero backdrop** cao 560px, 2 lớp gradient scrim (dọc + ngang), grid `auto 1fr` gap 48.
3. **Vùng nội dung** grid `1fr 320px` gap 48, max-width 1760, padding `24px 80px`:
   - **Tab bar** 4 tab: `episodes` | `cast` | `gallery` | `comments`
     - `episodes` ✅ : 3 nút server (`Vietsub #1`, `Vietsub #2`, `Lồng tiếng` — server đầu
       luôn active cứng, không đổi được), grid 8 cột, **12 tập cứng**
       (`Array.from({length: 12})`) — **bỏ qua `movie.episodes.total`**
     - `cast` ✅ : 4 diễn viên **hardcode** `['Timothée Chalamet','Zendaya','Rebecca Ferguson','Oscar Isaac']`,
       avatar là gradient HSL sinh theo index, không có ảnh thật
     - `gallery` ❌ **KHÔNG render gì** — bấm vào tab là vùng nội dung trắng
     - `comments` ❌ **KHÔNG render gì**, nhưng nhãn tab ghi cứng "Bình luận (286)"
   - **Aside 320px**:
     - Bảng "Thông tin": Đạo diễn `Denis Villeneuve` (hardcode), Sản xuất
       `Legendary Pictures` (hardcode), Khởi chiếu/Thời lượng/Quốc gia lấy từ `movie`
     - "Đề xuất": `NP_MOVIES.slice(7, 11)` — **cố định, không liên quan tới phim đang xem**,
       và không có `onClick` nên bấm không đi đâu
4. `<Footer />`

Bug liên quan: **NP-010** (tab rỗng), **NP-011** (metadata hardcode), **NP-004** (số tập sai).

### `LoginScreen.tsx` (180 dòng)

| Props | Kiểu |
|---|---|
| `onBack` | `() => void` |

- State duy nhất: `mode: 'login' | 'signup'` — đổi tiêu đề, phụ đề, nhãn nút, hiện/ẩn
  ô "Họ và tên" và khối "Ghi nhớ tôi / Quên mật khẩu".
- Nền: 3 lớp — radial gradient đỏ/cam, ảnh backdrop Dune blur(2px) opacity .15, gradient tối.
- Component nội bộ `Field({ label, placeholder, icon, type })`:
  - Có state `focused` để đổi màu viền + glow.
  - `ICONS` là 3 chuỗi `path d=` viết tay cho user/mail/lock.
  - ❌ **Không có `value`, `onChange`, `name`, `ref`** → input không kiểm soát, không lấy được dữ liệu.
- 3 nút social (Google / Facebook / Apple) — **không có `onClick`**, chỉ hiển thị chữ cái đầu.
- Nút submit — **không có `onClick`**, không có `<form>`, không có `onSubmit`.

**Kết luận: màn này 100% tĩnh.** Xem NP-012.

---

## 3.4 Component

### `Navbar.tsx` (169 dòng)

| Props | Kiểu | Mặc định |
|---|---|---|
| `onNav` | `(route: string) => void` | bắt buộc |
| `transparent` | `boolean?` | undefined |

- Export phụ: **`NovaPlayLogo({ size = 28 })`** — ô vuông gradient `#ff2c55 → #ff6a3d`,
  icon tam giác play SVG, chữ "NovaPlay" Manrope 800. Được `Footer.tsx` và
  `LoginScreen.tsx` import lại từ đây. Xem NP-015.
- State: `scrolled` (window.scrollY > 30), `openDD` (dropdown đang mở), `bell` (toggle chuông).
- Listener `scroll` gắn/gỡ đúng trong `useEffect`. ⚠️ Không `passive: true`, không throttle —
  handler chạy mỗi frame khi cuộn. Xem NP-009.
- Nền: `transparent` khi `transparent && !scrolled`, ngược lại `rgba(11,15,23,0.85)` + `blur(14px)`.
- `NAV_LINKS` (hardcode trong file):
  | Nhãn | key | dropdown |
  |---|---|---|
  | Chủ đề | `topics` | — |
  | Thể loại | `genres` | 7 mục: Hành Động, Hài, Tâm Lý, Khoa Học Viễn Tưởng, Kinh Dị, Tình Cảm, Hoạt Hình |
  | Phim Lẻ | `movies` | — |
  | Phim Bộ | `series` | — |
  | Quốc gia | `countries` | 5 mục: Việt Nam, Mỹ, Hàn Quốc, Nhật Bản, Trung Quốc |
  | Diễn Viên | `actors` | — |
  - Mục dropdown khi bấm chỉ `setOpenDD(null)` — **không lọc gì**.
  - Mục không dropdown gọi `onNav(key)`, mà `App.tsx` chỉ xử lý `'login'` → mọi mục khác về home.
- Ô tìm kiếm rộng 340px: **không `value`, không `onChange`, không `onSubmit`**. Xem NP-014.
- Nút chuông: có chấm đỏ báo, `onClick` chỉ toggle state `bell` — **không render dropdown nào**.
  State `bell` được set nhưng không dùng ở đâu. Xem NP-014.
- Nút "Đăng nhập" → `onNav('login')` ✅ hoạt động.
- Dropdown đóng bằng `onMouseLeave` — **không có click-outside**, không đóng bằng phím Esc,
  không `role="menu"`, không điều hướng bằng bàn phím. Xem NP-014.

### `MovieSlider.tsx` (151 dòng) — export default `HeroSlider`

| Props | Kiểu |
|---|---|
| `movies` | `Movie[]` |
| `onOpen` | `(movie: Movie) => void` |

- Cao 680px, `marginTop: -64` để chui lên dưới navbar trong suốt.
- Auto-play: `setInterval` **6500ms**; mỗi lần: `setAnimating(true)` → `setTimeout(250ms)` →
  đổi index + `setAnimating(false)`.
- ⚠️ `setTimeout` bên trong interval **không được clear** khi unmount → cảnh báo
  "state update on unmounted component". Xem NP-003.
- ⚠️ Interval **không tạm dừng khi hover** và không reset khi user bấm dot → slide có thể
  nhảy ngay sau khi user vừa chọn.
- Hiệu ứng chuyển: ảnh nền `opacity 0.5`, khối chữ `translateX(-30px)` + `opacity 0`.
- Nội dung: genre pill, `<h1>` 64px, hàng meta (sao vàng + năm + `{duration} phút` + badge
  chất lượng + badge "Vietsub" cứng), mô tả clamp 3 dòng.
- 3 nút: "Xem Phim" → `onOpen(movie)`; "Chi Tiết" → `onOpen(movie)` (**trùng chức năng**);
  nút tròn hình trái tim — **không có `onClick`**.
- Dot indicator: dot active dài 32px, các dot khác 8px.

### `MovieRows.tsx` (195 dòng) — export `MovieRow` và `TopTen`

#### `MovieRow({ title, movies, onOpen })`
- Section `padding: '40px 80px 0'`, `maxWidth: 1760`.
- Tiêu đề có thanh dọc gradient đỏ `#ff2c55 → #ff6a3d` rộng 5px.
- Link "Xem tất cả" — `onClick={e => e.preventDefault()}`, **không dẫn đi đâu**.
- Phân trang: `start` + hằng `VISIBLE = 6`; `translateX(-${start * (200 + 18)}px)`.
  - ⚠️ `200` là chiều rộng card thường và `18` là gap — **cả hai hardcode**, trùng lặp với
    `const w = big ? 240 : 200` trong `MovieCard.tsx`. Nếu đổi kích thước card, hàng sẽ lệch.
    Xem NP-009.
  - Nút prev/next `disabled` khi hết biên, có đổi `opacity` + `cursor`.
- Có comment giải thích thủ thuật `padding: '20px 0', margin: '-20px 0'` để hover scale
  không bị `overflow: hidden` cắt. **Giữ lại thủ thuật này khi port sang Tailwind.**

#### `TopTen({ movies, onOpen })`
- Scroll ngang thật (`overflowX: auto`) + `scrollSnapType: 'x mandatory'`, ẩn thanh cuộn
  bằng thẻ `<style>` inline `.np-top10-scroll::-webkit-scrollbar { display: none }`.
- `onWheel`: nếu `|deltaY| > |deltaX|` thì chuyển cuộn dọc thành cuộn ngang + `preventDefault()`.
  - ⚠️ React gắn `onWheel` là listener **passive** → `preventDefault()` bị bỏ qua và trình
    duyệt in cảnh báo ra console. Muốn chặn thật phải `addEventListener('wheel', fn, {passive:false})`.
    Xem NP-003.
- Số thứ tự: font 160px (riêng số 10 là 120px), gradient clip vào chữ, `marginRight` âm để
  poster đè lên. Poster rộng 150px, ratio 2/3.
- Chỉ lấy `movies.slice(0, 10)`.

### `MovieCard.tsx` (117 dòng) — export default `PosterCard`

| Props | Kiểu | Mặc định |
|---|---|---|
| `movie` | `Movie` | bắt buộc |
| `onOpen` | `(movie: Movie) => void` | optional |
| `big` | `boolean?` | false → rộng 200px; true → 240px |

- Hover: `translateY(-4px) scale(1.03)`, đổi shadow, `zIndex` 1 → 5.
- Badge trái trên: rating sao vàng nền đen mờ. Badge phải trên: chất lượng
  (`4K` cam `#ff8a00` / `FHD` cyan `#2ad4ff` chữ `#03222b` / `HD` xám `#6b7385`).
- Overlay hover: gradient đen từ dưới, hiện tối đa 2 genre pill đỏ + 2 nút:
  - "Xem ngay" (nền vàng `#ffc83a`) → `onOpen(movie)`
  - "Chi tiết" (nền kính) → `onOpen(movie)` — **trùng chức năng**
- Dưới poster: tiêu đề clamp 1 dòng, hàng meta `{year} · {genres[0]}` + `Tập {episodes.current}` nếu có.
- ⚠️ `<div onClick>` chứ không phải `<button>` → không focus được bằng Tab, không kích hoạt
  bằng Enter/Space, không có `role`. Xem NP-014.

### `Footer.tsx` (70 dòng)

- Grid `1.4fr repeat(4, 1fr)` gap 48.
- Cột 1: `NovaPlayLogo size={32}` + mô tả + 4 nút mạng xã hội — nút chỉ hiện **chữ cái đầu**
  (`s[0]` → F, X, T, Y), không có icon thật, không có `href`.
- 4 cột link (`FOOTER_COLS` hardcode): Khám phá / Thể loại / Hỗ trợ / Về NovaPlay,
  tổng 18 link — **tất cả `preventDefault()`**, không dẫn đi đâu.
- Dòng cuối: `© 2025 NovaPlay` (⚠️ năm cứng, hiện tại đã 2026) + 3 link Điều khoản/Bảo mật/DMCA.

---

## 3.5 Style — `src/index.css` (73 dòng)

- Dòng 1: `@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro...&family=Manrope...&family=JetBrains+Mono...')`
- `:root` khai báo **~40 biến `--np-*`**: surfaces, borders, foreground, primary, gold, cyan,
  semantic (success/warning/danger/info), quality (q-4k/q-fhd/q-hd), 3 font stack, 3 easing,
  3 duration, `--np-container: 1760px`, `--np-nav-h: 64px`.
- Reset `box-sizing`, `html, body` nền `var(--np-bg)`, font 15px/1.5, antialiased.
- Custom scrollbar webkit.

> 🔴 **Nghịch lý lớn nhất của nhánh `main`:** các biến này gần như không được component nào
> dùng. Ví dụ `--np-primary: #ff2c55` được khai báo, nhưng `Navbar`, `MovieSlider`, `MovieCard`,
> `MovieRows`, `LoginScreen`, `MovieDetailScreen` đều viết thẳng `'#ff2c55'`. Đổi màu thương
> hiệu hiện tại = sửa tay ~20 chỗ. Xem NP-008.

Ngoài ra `--np-container` khai báo 1760px trong khi `project/README.md` đặc tả **1440px**,
và các component thì hardcode `maxWidth: 1760`. Ba nguồn số liệu mâu thuẫn. Xem NP-008.

---

## 3.6 Bảng tổng kết "cái gì chưa làm" ở nhánh `main`

| Hạng mục | Trạng thái | Bug ID |
|---|---|---|
| Ô tìm kiếm navbar | Không xử lý | NP-014 |
| Dropdown thể loại/quốc gia | Bấm không lọc | NP-014 |
| Nút chuông thông báo | Toggle state rỗng | NP-014 |
| Nút trái tim ở hero | Không có onClick | NP-014 |
| Link "Xem tất cả" | preventDefault | NP-014 |
| 18 link footer | preventDefault | NP-014 |
| Nút mạng xã hội | Không href, không icon | NP-014 |
| Form đăng nhập | Không state, không submit | NP-012 |
| 3 nút social login | Không onClick | NP-012 |
| Tab "Hình ảnh" | Render rỗng | NP-010 |
| Tab "Bình luận" | Render rỗng | NP-010 |
| Chọn server phim | Nút đầu active cứng | NP-011 |
| Danh sách tập | 12 tập cứng, bỏ qua data | NP-004 |
| Diễn viên | Hardcode 4 tên Dune | NP-011 |
| Đạo diễn / nhà sản xuất | Hardcode Dune | NP-011 |
| Phim đề xuất | Slice cố định, không bấm được | NP-011 |
| URL / deep link / back | Không có | NP-006 |
| Trang 404 | Không có | NP-006 |
| Responsive mobile | Chưa làm — mọi kích thước là px cứng | NP-019 |
