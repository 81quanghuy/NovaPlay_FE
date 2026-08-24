# 11 — Kế hoạch hợp nhất & thực thi

Mỗi task được viết để **một AI agent có thể nhận và làm độc lập**.
Định dạng: mục tiêu → phụ thuộc → file đụng vào → các bước → tiêu chí nghiệm thu (DoD).

## Nguyên tắc chung khi thực thi

1. **Một task = một commit.** Message theo Conventional Commits, tiếng Việt ở phần mô tả.
2. **Không tự chạy `npm run build` / `npm test`** — báo lại cho người dùng lệnh cần chạy
   (theo quy ước dự án trong `CLAUDE.md`).
3. Task nào chạm vào file có bug đã biết → **đọc mục bug đó trong
   [09-known-issues.md](09-known-issues.md) trước**.
4. Sau khi xong, cập nhật docs liên quan **trong cùng commit**.
5. Nếu gặp quyết định treo (Q1–Q9 ở [10-target-architecture.md](10-target-architecture.md) §10.5)
   → **dừng và hỏi**, không tự đoán.

---

## Phase 0 — Chốt quyết định (không code)

| ID | Việc | Người quyết |
|---|---|---|
| T-0.1 | Trả lời Q1–Q9 ở [10 §10.5](10-target-architecture.md) | Chủ dự án |
| T-0.2 | Đối chiếu hợp đồng API với tài liệu backend (NP-013) | Chủ dự án + BE |
| T-0.3 | Chốt nhánh base = `origin/claude/merge-login-logic-1l6po` | Chủ dự án |

> ⛔ **Phase 1 trở đi không nên bắt đầu trước khi T-0.1 và T-0.3 xong**, riêng các task
> vá lỗi bảo mật (T-1.1, T-1.2) làm được ngay vì không phụ thuộc quyết định nào.

---

## Phase 1 — Vá lỗi chặn release & dựng khung config

### ☐ T-1.1 — Vá backdoor admin (NP-001) 🔴
**Phụ thuộc:** không
**File:** `src/routes/AuthBootstrap.tsx`, `src/config/feature-flags.ts` (mới),
`src/config/env.ts` (mới), `src/vite-env.d.ts`, `.env.example`

**Các bước**
1. Tạo `src/config/env.ts` theo mẫu ở [07 §7.5](07-configuration.md).
2. Tạo `src/config/feature-flags.ts` với `AUTH_BYPASS = ENV.IS_DEV && import.meta.env.VITE_AUTH_BYPASS === 'true'`.
3. Trong `AuthBootstrap.tsx`: thay `const DEV_BYPASS_AUTH = true` bằng `FLAGS.AUTH_BYPASS`.
4. Thêm `console.warn` và một dải cảnh báo đỏ cố định trên UI khi cờ bật.
5. Thêm `VITE_AUTH_BYPASS=false` vào `.env.example`; bổ sung khai báo vào `vite-env.d.ts`.

**DoD**
- [ ] `grep -rn "DEV_BYPASS_AUTH = true" src/` → rỗng
- [ ] `grep -rn "import.meta.env" src/ | grep -v config/env.ts | grep -v vite-env.d.ts` → rỗng
- [ ] Với `VITE_AUTH_BYPASS` không set → app yêu cầu đăng nhập thật
- [ ] Với cờ bật ở dev → có cảnh báo hiển thị rõ

---

### ☐ T-1.2 — Vá race condition refresh token (NP-002) 🔴
**Phụ thuộc:** không · **File:** `src/lib/api/client.ts`

**Các bước** — áp dụng đúng đoạn code ở [09 NP-002](09-known-issues.md#np-002):
gói `performRefresh()` trong `getRefreshPromise()` và reset `refreshing` trong `.finally()`.
Đồng thời đổi kiểm tra `isAuthEndpoint` từ `url.includes(...)` sang so khớp chính xác.

**DoD**
- [ ] Chuỗi `refreshing = null` xuất hiện đúng **1 lần**, nằm trong `.finally()`
- [ ] Ghi lại kịch bản kiểm thử thủ công vào PR: 5 request song song → 1 lần gọi refresh

---

### ☐ T-1.3 — Một nguồn design token (NP-008) 🟠
**Phụ thuộc:** T-0.1 (câu Q6 — chốt 1440 hay 1760)
**File:** `src/styles/tokens.css` (mới), `src/index.css` → `src/styles/global.css`,
`tailwind.config.js`, `src/styles/colors_and_type.css` (xoá)

**Các bước**
1. Chép `project/colors_and_type.css` (229 dòng, 96 token) → `src/styles/tokens.css`.
2. **Bổ sung biến dạng kênh RGB** cho mọi màu cần opacity modifier:
   `--np-primary-rgb: 255 44 85;` `--np-danger-rgb: 255 77 79;` `--np-success-rgb: 46 204 113;` …
3. Sửa `--np-container` theo quyết định Q6.
4. `tailwind.config.js`: thay toàn bộ hex bằng `rgb(var(--np-xxx-rgb) / <alpha-value>)`
   và `var(--np-xxx)` cho giá trị không cần alpha.
5. Xoá `src/styles/colors_and_type.css` và khối `:root` trong `index.css`.
6. Đổi `index.css` → `styles/global.css`, giữ `@tailwind` + `@layer base`, bổ sung
   style `:focus-visible` dùng `--np-border-accent`.
7. Xoá dòng `@import` font khỏi CSS, bổ sung JetBrains Mono vào `<link>` ở `index.html` (NP-025).

**DoD**
- [ ] Chỉ còn 1 file định nghĩa `--np-*` trong `src/`
- [ ] `grep -niE "#[0-9a-f]{6}" tailwind.config.js` → rỗng
- [ ] Các class `bg-primary/10`, `ring-primary/30`, `border-danger/40` vẫn hiển thị đúng
- [ ] Đổi `--np-primary` một dòng → nút, logo, badge đều đổi màu

---

### ☐ T-1.4 — Dựng `src/config/` đầy đủ
**Phụ thuộc:** T-1.1 · **File:** `src/config/*`

Tạo `app.config.ts`, `storage-keys.ts`, `regex.ts` (port từ `bak:src/constants/regex.js`),
`nav.config.ts` (chuyển `NAV_LINKS` từ `main:Navbar.tsx` và `FOOTER_COLS` từ `main:Footer.tsx`),
`index.ts` barrel. Nội dung mẫu: [07 §7.5](07-configuration.md).

Cập nhật nơi dùng:
- `refreshTokenStorage.ts` và `watchlistStore.ts` đọc key từ `STORAGE_KEYS`
- `SearchPage` đọc `UI.SEARCH_DEBOUNCE_MS`
- `schemas.ts` và `OtpInput.tsx` cùng đọc `VALIDATION.OTP_LENGTH`
- `client.ts` đọc `ENV.API_URL`

**DoD**
- [ ] `grep -rn "'novaplay\." src/ | grep -v storage-keys.ts` → rỗng
- [ ] `grep -rn "localhost:8080" src/ | grep -v config/` → rỗng
- [ ] `OTP_LENGTH` chỉ khai báo 1 chỗ

---

### ☐ T-1.5 — Thêm ESLint + Prettier (NP-016)
**Phụ thuộc:** không · **File:** `.eslintrc.cjs`, `.prettierrc`, `package.json`

Cài `eslint`, `@typescript-eslint/*`, `eslint-plugin-react-hooks`,
`eslint-plugin-jsx-a11y`, `eslint-plugin-import`, `prettier`, `eslint-config-prettier`.

Rule bắt buộc bật:
| Rule | Lý do |
|---|---|
| `react-hooks/exhaustive-deps: error` | Chặn bug dependency (đã có tiền lệ ở `App.tsx`) |
| `jsx-a11y/*` | Chặn `<div onClick>` (NP-014) |
| `no-restricted-syntax` cho hex trong JSX | Ép dùng token (NP-008) |
| `no-restricted-imports` cấm `@/features/*/...` chéo feature | Ép R4 |
| `@typescript-eslint/no-explicit-any: error` | |

Thêm script:
```json
"lint": "eslint src --ext ts,tsx --max-warnings 0",
"format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
"typecheck": "tsc --noEmit"
```

**DoD**
- [ ] Có 3 script mới trong `package.json`
- [ ] **Báo cho người dùng chạy** `npm run lint` và dán kết quả — agent không tự chạy build

---

## Phase 2 — Kích hoạt phần đã có sẵn

### ☐ T-2.1 — Đăng ký route cho module movies (NP-005, NP-023) 🟠
**Phụ thuộc:** T-0.1 (Q4, Q5) · **File:** `src/routes/index.tsx`, `src/routes/paths.ts` (mới),
`src/pages/HomePage.tsx`

**Các bước**
1. Tạo `routes/paths.ts` với hằng số đường dẫn (mẫu ở [10 §10.2 R7](10-target-architecture.md)).
2. Thêm 5 route movies vào đúng nhánh guard theo quyết định Q4/Q5.
3. Thay `{ path: '*', element: <Navigate to="/" replace /> }` bằng `<NotFoundPage />` thật
   — route catch-all đang **che giấu** mọi lỗi đường dẫn.
4. Thêm `onClick={() => navigate(PATHS.MOVIES)}` cho nút "Khám Phá Phim" ở HomePage.
5. Thêm link "Khám phá" / "Yêu thích" / ô tìm kiếm vào `Navbar`.

**DoD**
- [ ] 5 URL truy cập trực tiếp được, F5 không mất trang
- [ ] Bấm poster mở đúng `/movie/:id`
- [ ] Gõ URL sai → `NotFoundPage`, **không** im lặng nhảy về `/`
- [ ] `grep -rn "to=\"/" src/ | grep -v paths.ts` → rỗng (hoặc chỉ còn `to="/"` gốc)

---

### ☐ T-2.2 — Điều hướng khi phiên hết hạn (NP-021) 🟠
**Phụ thuộc:** T-1.2 · **File:** `src/lib/api/client.ts`, `src/App.tsx`,
`src/components/feedback/AuthExpiredListener.tsx` (mới)

Dùng phương án B ở [09 NP-021](09-known-issues.md#np-021): bắn CustomEvent
`novaplay:auth-expired`, listener ở gốc app điều hướng về `/login` + toast
"Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."

**DoD**
- [ ] Xoá refresh token trong localStorage khi đang ở trang protected → tự về `/login` kèm thông báo
- [ ] `lib/api/client.ts` **không** import gì từ `react-router-dom` (giữ lib độc lập UI)

---

### ☐ T-2.3 — ErrorBoundary + errorElement (NP-027)
**Phụ thuộc:** không · **File:** `src/components/feedback/ErrorBoundary.tsx` (mới), `src/App.tsx`, `src/routes/index.tsx`

**DoD**
- [ ] Cố tình ném lỗi trong một trang → hiện màn hình lỗi có nút "Tải lại", **không** trắng trang
- [ ] Mỗi route có `errorElement`

---

## Phase 3 — Hợp nhất giao diện

> Đây là phần lớn nhất. Làm **từng component một**, mỗi component một commit,
> để dễ review và dễ revert.

### ☐ T-3.1 — Hợp nhất kiểu `Movie` và dữ liệu (NP-024, NP-007)
**Phụ thuộc:** T-0.1 (Q8) · **File:** `src/features/movies/types.ts` (mới),
`src/features/movies/data/movies.ts`

1. Tạo `types.ts` với kiểu `Movie` hợp nhất: nền là bản `mll` (id `string`, `poster`,
   `backdrop`, `releaseYear`, `youtubeKey`, `director`, `cast`, cờ `trending/topRated/newRelease`)
   **cộng thêm** `quality`, `type`, `episodes`, `country` từ bản `main`.
2. Bổ sung 4 trường mới cho 24 phim trong `movies.ts`.
3. Xoá `main:src/data.ts`.
4. Thay các `slice()` bằng lọc theo cờ.
5. `GENRES` là danh sách thể loại duy nhất; `Navbar` đọc từ đây (không còn 7 mục riêng).

**DoD**
- [ ] Chỉ còn **1** khai báo `interface Movie` trong toàn bộ `src/`
- [ ] Không còn `NP_HERO`/`NP_NEW`/`NP_UPCOMING`/`NP_TRENDING`
- [ ] Trang chủ không còn 2 hàng trùng nội dung

---

### ☐ T-3.2 — Kéo component dùng chung ra (NP-015)
**Phụ thuộc:** không · **File:** di chuyển file + sửa import

| Từ | Đến |
|---|---|
| `features/auth/components/Button.tsx` | `components/ui/Button.tsx` |
| `features/auth/components/FormField.tsx` | `components/ui/FormField.tsx` |
| `features/auth/components/PasswordInput.tsx` | `components/ui/PasswordInput.tsx` |
| `features/auth/components/Alert.tsx` | `components/ui/Alert.tsx` |
| `features/auth/components/Logo.tsx` | `components/ui/Logo.tsx` |
| `features/auth/components/AuthLayout.tsx` | `components/layout/AuthLayout.tsx` |
| `features/auth/components/OtpInput.tsx` | **giữ nguyên** (chỉ auth dùng) |

Tạo `components/ui/index.ts` barrel. Sửa toàn bộ import.

**DoD**
- [ ] `grep -rn "features/auth/components" src/features/movies src/pages src/components` → rỗng
- [ ] Quy tắc R4 ở [10 §10.2](10-target-architecture.md) pass

---

### ☐ T-3.3 — `MainLayout` + gộp Navbar
**Phụ thuộc:** T-3.2, T-2.1 · **File:** `components/layout/MainLayout.tsx` (mới), `components/layout/Navbar.tsx`

Gộp 2 bản Navbar:
- Lấy từ `main`: khung fixed, hiệu ứng trong suốt → frosted khi cuộn, menu `NAV_LINKS`
  với dropdown, ô tìm kiếm, nút chuông, `NovaPlayLogo`
- Lấy từ `mll`: dropdown user (avatar chữ cái đầu, đổi mật khẩu, đăng xuất), **click-outside**
- Sửa luôn: throttle scroll bằng rAF + `{ passive: true }` (NP-009b), thêm `aria-expanded`/
  `role="menu"`/đóng bằng Esc (NP-014), ô tìm kiếm điều hướng tới `/search?q=` (NP-014),
  menu thể loại điều hướng tới `/movies?genre=` (NP-014)
- Nút chuông: hoặc làm thật, hoặc `disabled` + `title="Sắp ra mắt"` — **không để nút chết** (R10)

`MainLayout` render `<Navbar/><Outlet/><Footer/>` để 5 trang không phải tự gọi `<Navbar/>`.

**DoD**
- [ ] Không trang nào tự render `<Navbar/>` (trừ `WatchPage` có header riêng — đúng chủ ý)
- [ ] Dropdown đóng khi bấm ra ngoài và khi bấm Esc
- [ ] Tìm kiếm trên navbar hoạt động
- [ ] Không còn cảnh báo hiệu năng khi cuộn nhanh

---

### ☐ T-3.4 — Port `PosterCard` sang Tailwind
**Phụ thuộc:** T-1.3, T-3.1 · **File:** `features/movies/components/MovieCard.tsx`

Giữ **cấu trúc** bản `mll` (Link, lazy load, watchlist toggle), lấy **thẩm mỹ** bản `main`
(hover lift + scale, badge rating vàng, badge chất lượng, overlay gradient hiện 2 nút, genre pill).
Sửa luôn: dùng `<Link>`/`<button>` thay `<div onClick>` (NP-014), thêm `onError` fallback ảnh (NP-007),
tiêu đề clamp **2 dòng** theo đặc tả (không phải 1 như `main`).

**DoD**
- [ ] Không còn `style={{...}}` tĩnh trong file
- [ ] Focus bằng Tab thấy được viền focus, Enter mở được phim
- [ ] Ảnh lỗi → hiện placeholder, không vỡ layout

---

### ☐ T-3.5 — Port `HeroSlider` (NP-003)
**Phụ thuộc:** T-3.4 · **File:** `features/movies/components/HeroSlider.tsx` (mới, từ `main:MovieSlider.tsx`)

Port sang Tailwind **và** sửa cùng lúc: dọn `setTimeout` khi unmount, tạm dừng khi hover,
reset chu kỳ khi bấm dot, kiểm tra `movies.length === 0` trước khi render, nút trái tim
gắn vào watchlist store (hoặc bỏ hẳn), nút "Chi Tiết" đi tới `/movie/:id` còn "Xem Phim"
đi tới `/watch/:id` (hết trùng chức năng), đọc `UI.HERO_AUTOPLAY_MS` từ config.

**DoD**
- [ ] Unmount giữa lúc chuyển slide → không cảnh báo React
- [ ] Hover dừng, rời chuột chạy tiếp
- [ ] 2 nút dẫn tới 2 nơi khác nhau
- [ ] `movies=[]` không làm vỡ trang

---

### ☐ T-3.6 — Port `TopTen` (NP-003c)
**Phụ thuộc:** T-3.4 · **File:** `features/movies/components/TopTen.tsx` (mới)

Port + sửa `onWheel` thành `addEventListener('wheel', fn, { passive: false })`.
Số thứ tự dùng `clamp()` để responsive (NP-019).

**DoD**
- [ ] Không còn cảnh báo passive listener trong console
- [ ] Trên màn hình hẹp, số thứ tự không tràn

---

### ☐ T-3.7 — Hợp nhất `MovieRow` (NP-009a)
**Phụ thuộc:** T-3.4 · **File:** `features/movies/components/MovieRow.tsx`

**Giữ bản `mll`** (cuộn theo `clientWidth * 0.85` — tự thích ứng), bỏ bản `main`
(bước cứng `200 + 18`). Bổ sung từ bản `main`: thanh gradient trước tiêu đề, link "Xem tất cả"
(**trỏ tới `/movies?genre=` thật**, không `preventDefault`), thủ thuật padding/margin âm
để hover không bị cắt.

**DoD**
- [ ] Đổi kích thước card không làm lệch hàng
- [ ] "Xem tất cả" điều hướng thật

---

### ☐ T-3.8 — Hợp nhất màn chi tiết phim (NP-010, NP-011, NP-004)
**Phụ thuộc:** T-3.1, T-3.4 · **File:** `features/movies/pages/MovieDetailPage.tsx`

Nền là bản `mll` (có empty state, phim liên quan tính động, watchlist).
Bổ sung từ `main`: hero backdrop 2 lớp scrim, tab bar, aside thông tin.
Sửa cùng lúc: tab "Hình ảnh"/"Bình luận" phải có `EmptyState` (NP-010); `director`/`cast`
đọc từ `movie` (NP-011); số tập đọc `movie.episodes.total`, ẩn tab nếu `type === 'movie'` (NP-004);
nút chọn server thành state; thẻ phim đề xuất bấm được.

**DoD**
- [ ] Mở 3 phim khác nhau → metadata khác nhau (không còn Dune ở mọi phim)
- [ ] Không tab nào render rỗng
- [ ] Phim lẻ không hiện tab "Tập phim"

---

### ☐ T-3.9 — Hợp nhất màn đăng nhập (NP-012)
**Phụ thuộc:** T-3.2 · **File:** `features/auth/pages/LoginPage.tsx`

**Logic giữ nguyên bản `mll`** (react-hook-form + zod + `useLogin`).
Lấy thẩm mỹ từ `main:LoginScreen.tsx`: nền 3 lớp (radial gradient + backdrop blur + scrim),
card kính mờ, 3 nút social. Nút social chưa có backend → `disabled` + `title="Sắp ra mắt"` (R10).

**DoD**
- [ ] Gõ sai định dạng email → hiện lỗi tiếng Việt dưới ô
- [ ] Đăng nhập sai → hiện `<Alert tone="danger">` với thông điệp từ API
- [ ] Đang gửi → nút hiện spinner và bị khoá

---

### ☐ T-3.10 — Port `Footer` (NP-030, NP-014)
**Phụ thuộc:** T-1.4 · **File:** `components/layout/Footer.tsx`

Port sang Tailwind, `FOOTER_COLS` đọc từ `config/nav.config.ts`, năm bản quyền tính động,
link trỏ tới route thật (link chưa có trang → bỏ khỏi danh sách, không để link chết),
nút mạng xã hội dùng icon lucide + `href` thật hoặc bỏ.

**DoD**
- [ ] `grep -n "preventDefault" src/components/layout/Footer.tsx` → rỗng
- [ ] Năm hiển thị đúng năm hiện tại

---

### ☐ T-3.11 — Responsive toàn bộ (NP-019)
**Phụ thuộc:** T-3.3 → T-3.10 · **File:** mọi component đã port

Breakpoint Tailwind mặc định: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`.
Điểm cần xử lý: navbar → menu hamburger dưới `lg`; hero → `clamp()` cho font, giảm chiều cao;
footer 5 cột → 2 cột (`sm`) → 1 cột (mobile); chi tiết phim `1fr 320px` → 1 cột dưới `lg`;
lưới tập `repeat(8,1fr)` → `repeat(4,1fr)` mobile; Top10 giảm cỡ số.

**DoD**
- [ ] Kiểm ở 375 / 768 / 1024 / 1440 / 1920 px — không tràn ngang ở bất kỳ mức nào
- [ ] Menu dùng được bằng ngón tay trên mobile

---

## Phase 4 — Dọn dẹp & tối ưu

| ID | Việc | Bug | DoD tóm tắt |
|---|---|---|---|
| ☐ T-4.1 | Code-splitting bằng `React.lazy` cho `/admin`, trang auth, `/watch` | NP-028 | Bundle chính giảm rõ rệt; có `<Suspense fallback>` |
| ☐ T-4.2 | Quyết định số phận `tokenUtils.ts`: dùng cho refresh chủ động hoặc xoá | NP-022 | Không còn file dead code; nếu giữ thì bỏ `escape()` |
| ☐ T-4.3 | Sửa ref callback `OtpInput` | NP-026 | `ref={(el) => { ... }}` có ngoặc nhọn |
| ☐ T-4.4 | Rà soát quy ước đặt tên API sau khi có tài liệu backend | NP-013 | Type khớp response thật; bỏ `\| string` khỏi `RoleName`; dùng `ApiErrorBody` |
| ☐ T-4.5 | Bổ sung `components/ui`: Badge, Modal, Spinner, EmptyState, Skeleton | — | Gom được các đoạn lặp; barrel export đủ |
| ☐ T-4.6 | Bổ sung `hooks/`: `useDebounce`, `useClickOutside`, `useMediaQuery` | — | `SearchPage` và `Navbar` dùng hook chung |
| ☐ T-4.7 | Xác nhận trước khi "Xoá tất cả" watchlist; đổi `ids` sang `Set` | — | Có modal xác nhận |
| ☐ T-4.8 | Đồng bộ bộ lọc `MoviesPage` vào URL (`?genre=&sort=`) | — | F5 giữ bộ lọc; share link được |
| ☐ T-4.9 | Thay favicon/logo, thêm `manifest.json` | NP-029 | Không còn asset mặc định CRA |
| ☐ T-4.10 | Sửa `.gitignore` để không chặn `.env.example` | NP-017 | `git check-ignore .env.example` → không bị chặn |

---

## Phase 5 — Chuẩn bị nối API thật

| ID | Việc | Ghi chú |
|---|---|---|
| ☐ T-5.1 | Thêm `ENDPOINTS.movies.*` | Cần tài liệu backend |
| ☐ T-5.2 | Tạo `features/movies/services/movieService.ts` giữ đúng 6 hàm hợp đồng | [10 §10.4](10-target-architecture.md) |
| ☐ T-5.3 | Bọc bằng hook có `loading`/`error`/`empty` (R9) | |
| ☐ T-5.4 | Cân nhắc `@tanstack/react-query` | Phụ thuộc câu trả lời Q1 (quy mô) |
| ☐ T-5.5 | Thêm `Skeleton` cho mọi vùng đang tải | |
| ☐ T-5.6 | Phân trang / infinite scroll cho `MoviesPage`, `SearchPage` | Bắt buộc khi dữ liệu thật |
| ☐ T-5.7 | Watchlist chuyển sang server-side (hoặc gắn userId vào storage key) | [05 §5.2](05-feature-movies.md) |

---

## Phase 6 — Chất lượng dài hạn

| ID | Việc |
|---|---|
| ☐ T-6.1 | Vitest + React Testing Library; test trước cho `authStore`, `client.ts` (refresh), `watchlistStore`, guard |
| ☐ T-6.2 | GitHub Actions: `typecheck` + `lint` + `test` trên mọi PR |
| ☐ T-6.3 | Husky + lint-staged chặn commit bẩn |
| ☐ T-6.4 | Dọn nhánh: gộp về `main`, xoá `merge-login-logic`, giữ `backup_main` như tag lịch sử |
| ☐ T-6.5 | Cập nhật `CLAUDE.md` ở gốc repo cho khớp kiến trúc mới |
| ☐ T-6.6 | Cân nhắc i18n nếu Q7 = có |

---

## Bảng phụ thuộc rút gọn

```
T-0.1 ─┬─→ T-1.3 ─→ T-3.4 ─┬─→ T-3.5
       │                    ├─→ T-3.6
       ├─→ T-2.1 ──────────→├─→ T-3.7
       └─→ T-3.1 ──────────→└─→ T-3.8
T-1.1 ─→ T-1.4 ─→ T-3.10
T-1.2 ─→ T-2.2
T-3.2 ─┬─→ T-3.3 ─→ T-3.11
       └─→ T-3.9
```

**Có thể làm song song ngay từ đầu:** T-1.1, T-1.2, T-1.5, T-2.3, T-3.2
