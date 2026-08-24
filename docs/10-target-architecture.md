# 10 — Kiến trúc đích

Mục tiêu: **một nhánh, một nguồn sự thật cho mỗi thứ, dễ bảo trì nhất**.

Nền tảng chọn: nhánh `origin/claude/merge-login-logic-1l6po` (đã có router, tailwind,
axios, zustand, zod, alias `@/`), bổ sung 4 điều chỉnh:
1. Kéo component dùng chung ra khỏi `features/auth`
2. Gom toàn bộ cấu hình về `src/config/`
3. Một nguồn design token duy nhất
4. Port giao diện đẹp của `main` sang Tailwind

---

## 10.1 Cây thư mục đích

```
NovaPlay_FE/
├── docs/                          ← bộ tài liệu này
├── project/                       ← tham chiếu thiết kế, KHÔNG import vào src
├── public/
│   ├── favicon.ico                ← cần thay (NP-029)
│   ├── logo192.png  logo512.png
│   └── manifest.json              ← thêm mới
├── .env.example                   ← commit
├── .env.local                     ← KHÔNG commit
├── .eslintrc.cjs                  ← thêm mới (NP-016)
├── .prettierrc                    ← thêm mới
├── index.html
├── tailwind.config.js             ← chỉ trỏ vào CSS var, KHÔNG chứa hex
├── postcss.config.js
├── tsconfig.json                  ← có paths @/*
├── vite.config.ts                 ← có alias @ (phải khớp tsconfig)
└── src/
    │
    ├── main.tsx                   # createRoot + StrictMode + <App/>
    ├── App.tsx                    # <ErrorBoundary><AuthBootstrap><RouterProvider/>
    ├── vite-env.d.ts              # khai báo ImportMetaEnv
    │
    ├── config/                    ← ⭐ MỌI CẤU HÌNH NẰM Ở ĐÂY
    │   ├── env.ts                 #   nơi DUY NHẤT đọc import.meta.env
    │   ├── app.config.ts          #   APP / LAYOUT / UI / VALIDATION / PAGINATION
    │   ├── feature-flags.ts       #   AUTH_BYPASS, ...
    │   ├── storage-keys.ts        #   mọi key localStorage
    │   ├── regex.ts               #   regex validation (port từ bak:)
    │   ├── nav.config.ts          #   menu nav, cột footer, danh sách quốc gia
    │   └── index.ts               #   barrel
    │
    ├── styles/
    │   ├── tokens.css             ← ⭐ NGUỒN SỰ THẬT DUY NHẤT cho design token
    │   └── global.css             #   @tailwind + @layer base (reset, scrollbar, autofill, focus-visible)
    │
    ├── lib/                       ← hạ tầng, không phụ thuộc UI
    │   ├── api/
    │   │   ├── client.ts          #   axios instance + interceptor
    │   │   ├── endpoints.ts       #   mọi đường dẫn API
    │   │   └── types.ts           #   DTO request/response
    │   ├── storage/
    │   │   └── local-storage.ts   #   wrapper an toàn + dùng STORAGE_KEYS
    │   ├── format/
    │   │   ├── duration.ts        #   141 → "141 phút"
    │   │   ├── rating.ts          #   8.35 → "8.4"
    │   │   └── date.ts
    │   └── jwt.ts                 #   parseJwt / isExpired (nếu quyết định giữ — NP-022)
    │
    ├── components/                ← dùng chung, KHÔNG biết nghiệp vụ
    │   ├── ui/
    │   │   ├── Button.tsx         Badge.tsx      Spinner.tsx
    │   │   ├── FormField.tsx      PasswordInput.tsx
    │   │   ├── Alert.tsx          Modal.tsx      EmptyState.tsx
    │   │   ├── Skeleton.tsx       Logo.tsx
    │   │   └── index.ts           #   barrel
    │   ├── layout/
    │   │   ├── Navbar.tsx         #   gộp bản main (menu) + bản mll (user dropdown)
    │   │   ├── Footer.tsx
    │   │   ├── MainLayout.tsx     #   <Navbar/><Outlet/><Footer/>
    │   │   └── AuthLayout.tsx
    │   └── feedback/
    │       ├── ErrorBoundary.tsx
    │       └── ToastProvider.tsx
    │
    ├── hooks/                     ← hook dùng chung
    │   ├── useDebounce.ts
    │   ├── useClickOutside.ts
    │   └── useMediaQuery.ts
    │
    ├── store/                     ← state toàn cục (nhiều feature dùng)
    │   └── authStore.ts
    │
    ├── routes/
    │   ├── index.tsx              #   createBrowserRouter, dùng lazy cho route ít dùng
    │   ├── paths.ts               #   ⭐ hằng số đường dẫn, không viết chuỗi '/movies' rải rác
    │   ├── AuthBootstrap.tsx
    │   ├── ProtectedRoute.tsx
    │   ├── PublicOnly.tsx
    │   └── RoleGuard.tsx
    │
    ├── pages/                     ← trang không thuộc feature nào
    │   ├── HomePage.tsx
    │   ├── AdminPage.tsx
    │   ├── ForbiddenPage.tsx
    │   └── NotFoundPage.tsx       ← thêm mới
    │
    └── features/                  ← mỗi feature là một "khối" tự chứa
        ├── auth/
        │   ├── components/        #   chỉ auth: OtpInput
        │   ├── hooks/             #   useLogin, useRegister, ...
        │   ├── services/          #   authService.ts
        │   ├── pages/             #   LoginPage, RegisterPage, ...
        │   ├── schemas.ts
        │   └── index.ts           #   ⭐ public API của feature
        └── movies/
            ├── components/        #   MovieCard, MovieRow, GenreChip, HeroSlider, TopTen, PosterCard
            ├── hooks/             #   useMovies, useMovieDetail
            ├── services/          #   movieService.ts (thay data/movies.ts khi có API)
            ├── data/              #   movies.ts (mock, tạm thời)
            ├── store/             #   watchlistStore.ts
            ├── pages/             #   MoviesPage, SearchPage, MovieDetailPage, WatchPage, WatchlistPage
            ├── types.ts           #   ⭐ kiểu Movie DUY NHẤT
            └── index.ts
```

---

## 10.2 Mười quy tắc bất biến

> Mỗi quy tắc kèm cách kiểm tra. AI agent phải tự kiểm trước khi báo hoàn thành.

### R1 — Cấu hình chỉ ở `src/config/`
Không hằng số cấu hình nào được viết trực tiếp trong component/hook/service.
```bash
# kiểm tra: không có magic number cho các giá trị đã có trong config
grep -rn "1440\|1760\|6500\|localhost:8080" src/ --include="*.tsx" --include="*.ts" | grep -v "src/config/"
```

### R2 — `import.meta.env` chỉ đọc ở `src/config/env.ts`
```bash
grep -rn "import.meta.env" src/ | grep -v "src/config/env.ts" | grep -v "vite-env.d.ts"
# → phải rỗng
```

### R3 — Design token chỉ định nghĩa ở `src/styles/tokens.css`
Không hex trong `.tsx`, không hex trong `tailwind.config.js`.
```bash
grep -rniE "#[0-9a-f]{3,8}\b" src/ --include="*.tsx" tailwind.config.js
# → phải rỗng (trừ chú thích)
```

### R4 — `features/*` không được import chéo nhau
```bash
grep -rn "from '@/features/" src/features/ | awk -F: '{print $1, $3}' \
  | grep -vE "src/features/([a-z]+)/.*@/features/\1"
# → phải rỗng
```
Cần dùng chung → kéo lên `components/ui`, `lib`, hoặc `hooks`.

### R5 — Mỗi feature export qua `index.ts`
Bên ngoài import `from '@/features/movies'`, không đào vào đường dẫn nội bộ.

### R6 — Đường dẫn API chỉ ở `lib/api/endpoints.ts`
```bash
grep -rn "'/auth/\|'/movies/\|\"/api/" src/ | grep -v "endpoints.ts"
# → phải rỗng
```

### R7 — Đường dẫn route chỉ ở `routes/paths.ts`
```ts
export const PATHS = {
  HOME: '/', LOGIN: '/login', REGISTER: '/register',
  MOVIES: '/movies', MOVIE_DETAIL: (id: string) => `/movie/${id}`,
  WATCH: (id: string) => `/watch/${id}`, SEARCH: '/search',
  WATCHLIST: '/watchlist', ADMIN: '/admin', FORBIDDEN: '/403',
} as const;
```

### R8 — Không inline style trừ giá trị động thật sự
Được phép: `style={{ backgroundImage: url(${movie.backdrop}) }}`.
Không được phép: `style={{ padding: 24, color: '#fff' }}` → dùng class Tailwind.

### R9 — Mọi thao tác bất đồng bộ phải có 3 trạng thái
`loading` / `error` / `empty`. Không được để màn hình trắng hoặc "đứng hình".

### R10 — Mọi phần tử tương tác phải tương tác được
Không `<div onClick>`. Không `onClick` rỗng. Không `href="#"` + `preventDefault()`.
Nếu tính năng chưa làm → dùng `disabled` + `title="Sắp ra mắt"`, **không** để nút chết.

---

## 10.3 Luồng phụ thuộc (không được có mũi tên ngược)

```
      config/  ←──────────────────────────────────┐
         ↑                                        │
      styles/                                     │
         ↑                                        │
       lib/    ────────────────→ store/           │
         ↑                          ↑             │
   components/ui ──→ components/layout            │
         ↑                          ↑             │
      hooks/                        │             │
         ↑                          │             │
    features/*  ────────────────────┘             │
         ↑                                        │
      routes/  ──→ pages/  ─────────────────→ ────┘
         ↑
       App.tsx
```

Quy tắc kiểm tra nhanh:
- `lib/` **không** được import từ `components/`, `features/`, `pages/`
- `components/ui/` **không** được import từ `features/`, `store/`
- `features/*` được import `config`, `lib`, `components`, `hooks`, `store`
- Chỉ `routes/` và `App.tsx` biết về cấu trúc trang

---

## 10.4 Chiến lược dữ liệu (khi nối API thật)

Hiện tại `features/movies/data/movies.ts` là mock, được truy cập qua 6 hàm
(`getMovie`, `getTrending`, `getTopRated`, `getNewReleases`, `getByGenre`, `searchMovies`).

**Giữ nguyên bộ 6 hàm này làm hợp đồng.** Khi có API thật:

```ts
// features/movies/services/movieService.ts
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Movie } from '../types';

export const movieService = {
  getMovie:      (id: string)      => apiClient.get<Movie>(ENDPOINTS.movies.detail(id)).then(r => r.data),
  getTrending:   ()                => apiClient.get<Movie[]>(ENDPOINTS.movies.trending).then(r => r.data),
  searchMovies:  (q: string)       => apiClient.get<Movie[]>(ENDPOINTS.movies.search, { params: { q } }).then(r => r.data),
  // ...
};
```

Sau đó bọc bằng hook có `loading`/`error` (R9). **Cân nhắc thêm `@tanstack/react-query`**
nếu số màn hình gọi API vượt quá ~10 — nó xử lý sẵn cache, dedupe request, retry,
stale-while-revalidate. Quyết định này phụ thuộc quy mô traffic dự kiến (xem
[12-agent-playbook.md](12-agent-playbook.md) §12.1).

---

## 10.5 Quyết định còn treo (cần chủ dự án chốt)

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| Q1 | Quy mô dự kiến: bao nhiêu user đồng thời? | Có cần react-query, code-splitting sâu, CDN ảnh không |
| Q2 | Backend là JWT tự quản lý hay Keycloak? | `bak` dùng Keycloak, `mll` dùng JWT — hai hướng khác hẳn nhau |
| Q3 | Refresh token: localStorage hay cookie httpOnly? | NP-020 |
| Q4 | Duyệt phim có bắt buộc đăng nhập không? | Vị trí route trong `ProtectedRoute` |
| Q5 | Xem phim có bắt buộc đăng nhập không? | Như trên |
| Q6 | Container 1440px hay 1760px? | NP-008, ảnh hưởng toàn bộ layout |
| Q7 | Có cần đa ngôn ngữ (vi/en) không? | `bak:appConfig` từng có `SUPPORTED_LANGUAGES` — cần i18n từ sớm nếu có |
| Q8 | Nguồn ảnh: tiếp tục dùng TMDB hay tự host? | NP-007 |
| Q9 | Logo chính thức? | NP-029 |
