# 02 — Kiểm kê nhánh git

Snapshot lúc: **2026-08-24**. Nhánh đang checkout: `main`.

```bash
# Lệnh tái tạo lại thông tin trong file này
git branch -a -vv
git log --all --oneline --graph
git ls-tree -r --name-only <branch>
git show <branch>:<path>          # đọc file mà không cần checkout
```

---

## 2.1 Bản đồ nhánh

```
* main                                   3f84d35  [origin/main]
  origin/backup_main                      2a77c57  update code            (14/08/2025)
  origin/claude/merge-login-logic-1l6po   627aa4f  feat(movies): ...      (20/05/2026)
  origin/main                             3f84d35
```

```
627aa4f  feat(movies): add mock data, watchlist store, components and 5 pages   ← HEAD nhánh Gen4
0a82ee5  feat(home): enable Khám Phá Phim button
58491ba  feat(auth): add dev bypass with fake admin/admin account               ← nguồn bug NP-001
56cc23d  refactor(register): drop `as never` cast on accept default value
23e714d  fix(auth): use boolean+refine for accept field
ecab51f  chore: remove orphan scaffold data.ts                 ┐
234c414  chore: remove orphan scaffold MovieSlider             │
19ac7c2  chore: remove orphan scaffold MovieRows               │  7 commit xoá
4b49a56  chore: remove orphan scaffold MovieCard               │  toàn bộ UI Gen 3
42b6ac2  chore: remove orphan scaffold Footer                  │
8b66c63  chore: remove orphan scaffold MovieDetailScreen       │
ca11147  chore: remove orphan scaffold HomeScreen              │
7730a03  chore: remove orphan scaffold LoginScreen             ┘
d364fc2  refactor(auth): use postWithoutAuth helper
ffa62c6  feat(auth): wire router, protected routes, navbar, entry point
a5f9f18  feat(auth): add auth pages (login, register, verify-otp, forgot, reset, change)
1720e60  feat(auth): add design-system UI primitives (Button, FormField, OtpInput, AuthLayout)
90dc840  feat(auth): add auth service, zod schemas and form hooks
9d04dc5  feat(auth): add api client with refresh interceptor, types, store
7d4bf16  chore: setup tailwind + design tokens + path alias for auth module
    │
    ├─ 3f84d35  Merge pull request #1                                        ← HEAD main
    │  b5d91e0  fix: adjust maxWidth and responsive padding for layout
    33588fd  feat: implement NovaPlay UI redesign with Vite + React + TS     ← toàn bộ UI Gen 3
    b592cde  Claude Design handoff: NovaPlay Design System
    2a77c57  update code                                                     ← HEAD backup_main
    ed4e32f  update layout
    687060a  update 30/4
    8046a51  Initialize project using Create React App
```

---

## 2.2 Nhánh `main` — UI shell (working tree hiện tại)

### File tree (bỏ `project/`, `chats/`, `node_modules/`)

```
index.html                          16 dòng   lang="vi", preconnect Google Fonts, load Manrope + Be Vietnam Pro
vite.config.ts                       6 dòng   chỉ có plugin react, KHÔNG có alias
tsconfig.json                       20 dòng   strict:true, KHÔNG có baseUrl/paths
package.json                        22 dòng   chỉ react + react-dom
.gitignore                                    node_modules, dist, .env*
public/favicon.ico, logo192.png               placeholder CRA, cần thay
CLAUDE.md                                     hướng dẫn cho Claude Code
src/
  main.tsx                          10 dòng   StrictMode + createRoot
  App.tsx                           50 dòng   route state thủ công
  data.ts                           35 dòng   Movie interface + 12 phim + 4 slice
  index.css                         73 dòng   @import Google Fonts + ~40 CSS var --np-* + reset
  screens/
    HomeScreen.tsx                  25 dòng
    MovieDetailScreen.tsx          288 dòng
    LoginScreen.tsx                180 dòng
  components/
    Navbar.tsx                     169 dòng   + export NovaPlayLogo
    MovieSlider.tsx                151 dòng   export default HeroSlider
    MovieRows.tsx                  195 dòng   export MovieRow + TopTen
    MovieCard.tsx                  117 dòng   export default PosterCard
    Footer.tsx                      70 dòng
                            tổng: 1363 dòng src
```

### Đặc điểm cần biết
- **100% inline style.** CSS variable trong `index.css` được định nghĩa nhưng gần như
  không được dùng — mọi component hardcode hex trực tiếp (`#ff2c55` xuất hiện ~20 lần).
- Không có alias import. Mọi import là đường dẫn tương đối (`../data`, `./MovieCard`).
- `NovaPlayLogo` được export từ `Navbar.tsx` → `Footer.tsx` và `LoginScreen.tsx` phải
  import component layout từ file navbar. Coupling sai. Xem NP-015.

---

## 2.3 Nhánh `origin/claude/merge-login-logic-1l6po` — logic

Ký hiệu trong docs: `mll:`

### File tree đầy đủ + số dòng

```
Cấu hình
  package.json                     32   +axios, zustand, zod, rhf, lucide, react-router, tailwind
  tsconfig.json                    24   + baseUrl "." + paths {"@/*": ["src/*"]}
  vite.config.ts                   12   + alias '@' → ./src
  tailwind.config.js               80   toàn bộ design token viết lại bằng hex (trùng lặp!)
  postcss.config.js                 6   tailwindcss + autoprefixer
  .env.example                      1   VITE_API_URL=http://localhost:8080/api/v1
  index.html                            như main

Entry
  src/main.tsx                     10
  src/App.tsx                      11   <AuthBootstrap><RouterProvider router={router}/></AuthBootstrap>
  src/vite-env.d.ts                 9   khai báo ImportMetaEnv.VITE_API_URL

Styling
  src/index.css                    40   @import tokens + @tailwind + @layer base (scrollbar, autofill)
  src/styles/colors_and_type.css   67   toàn bộ CSS var --np-*

Tầng API
  src/lib/api/client.ts            88   axios instance + request/response interceptor + refresh
  src/lib/api/endpoints.ts         14   ENDPOINTS.auth.* (10 endpoint)
  src/lib/api/types.ts             70   DTO request/response

State toàn cục
  src/store/authStore.ts           51   zustand + hasRole/hasAnyRole/getAccessToken
  src/store/refreshTokenStorage.ts 25   wrapper localStorage có try/catch

Tiện ích
  src/utils/tokenUtils.ts          25   parseJwt + isExpired  ← KHÔNG ĐƯỢC DÙNG Ở ĐÂU (dead code)

Routing
  src/routes/index.tsx             39   createBrowserRouter, 9 route
  src/routes/AuthBootstrap.tsx     90   khôi phục phiên khi load + DEV BYPASS (bug NP-001)
  src/routes/ProtectedRoute.tsx    12
  src/routes/PublicOnly.tsx         8
  src/routes/RoleGuard.tsx         13

Trang chung
  src/pages/HomePage.tsx           82   hero + bảng thông tin tài khoản
  src/pages/AdminPage.tsx          24
  src/pages/ForbiddenPage.tsx      24

Layout chung
  src/components/Navbar.tsx        77   sticky, dropdown user, đổi mật khẩu, đăng xuất

Feature: auth
  features/auth/schemas.ts         76   6 zod schema
  features/auth/services/authService.ts  53   10 hàm gọi API
  features/auth/hooks/useLogin.ts        35
  features/auth/hooks/useRegister.ts     26
  features/auth/hooks/useOtpVerify.ts    45   submit + resend
  features/auth/hooks/useForgotPassword.ts 25
  features/auth/hooks/useResetPassword.ts  29
  features/auth/hooks/useChangePassword.ts 26
  features/auth/hooks/useLogout.ts       27
  features/auth/components/AuthLayout.tsx  80   ← layout, không thuộc riêng auth
  features/auth/components/Button.tsx      56   ← COMMON, đặt sai chỗ
  features/auth/components/FormField.tsx   55   ← COMMON, đặt sai chỗ
  features/auth/components/PasswordInput.tsx 40
  features/auth/components/OtpInput.tsx    72
  features/auth/components/Alert.tsx       37   ← COMMON, đặt sai chỗ
  features/auth/components/Logo.tsx        14   ← COMMON, đặt sai chỗ
  features/auth/pages/LoginPage.tsx        93
  features/auth/pages/RegisterPage.tsx    121
  features/auth/pages/VerifyOtpPage.tsx    94
  features/auth/pages/ForgotPasswordPage.tsx 59
  features/auth/pages/ResetPasswordPage.tsx  86
  features/auth/pages/ChangePasswordPage.tsx 79

Feature: movies  ← TOÀN BỘ CHƯA ĐƯỢC ROUTE (bug NP-005)
  features/movies/data/movies.ts          472   24 phim + 12 genre + 6 hàm truy vấn
  features/movies/store/watchlistStore.ts  31   zustand + persist localStorage
  features/movies/components/MovieCard.tsx 79
  features/movies/components/MovieRow.tsx  60
  features/movies/components/GenreChip.tsx 21
  features/movies/pages/MoviesPage.tsx     69
  features/movies/pages/SearchPage.tsx     74
  features/movies/pages/MovieDetailPage.tsx 167
  features/movies/pages/WatchPage.tsx      68
  features/movies/pages/WatchlistPage.tsx  57
```

### Route đã đăng ký (chỉ 9)

| Path | Guard | Component |
|---|---|---|
| `/login` | PublicOnly | LoginPage |
| `/register` | PublicOnly | RegisterPage |
| `/verify-otp` | PublicOnly | VerifyOtpPage |
| `/forgot-password` | PublicOnly | ForgotPasswordPage |
| `/reset-password` | PublicOnly | ResetPasswordPage |
| `/` | Protected | HomePage |
| `/change-password` | Protected | ChangePasswordPage |
| `/admin` | Protected + RoleGuard[ADMIN] | AdminPage |
| `/403` | — | ForbiddenPage |
| `*` | — | `<Navigate to="/" replace />` |

**Thiếu:** `/movies`, `/movie/:id`, `/watch/:id`, `/search`, `/watchlist`.
Vì có route catch-all `*`, mọi link tới các path này bị **âm thầm** đá về `/` — không báo lỗi.

---

## 2.4 Nhánh `origin/backup_main` — Gen 2 (tham khảo)

Ký hiệu: `bak:`. Tên package: `cinema-zone`. Auth bằng **Keycloak**.

```
src/
  api.ts
  constants/appConfig.js        ← MẪU TỐT cho common setting, đã bị mất ở gen sau
  constants/regex.js            ← MẪU TỐT, đã bị mất
  components/  AuthPopup, Button, Footer, Loading, Modal, MovieGrid,
               MovieSlider, Navbar, PasswordChangeModal, Toast, index.ts
  features/auth/     AuthPage, LoginForm, authService, hooks/useLogin
  features/booking/  BookingPage, SeatSelector, bookingService, hooks/useBooking
  features/movies/   MovieCard, MovieListPage, hooks/useFetchMovies, movieService
  hooks/       useAuth, useMovies
  layouts/     MainLayout          ← MẪU TỐT: có layout riêng, gen sau không có
  pages/       HomePage, MovieDetailPage, MovieGridPage, MovieWatchPage, NotFound, ProfilePage
  routes/index.tsx
  services/    apiClient, endpoints, keycloak
  styles/      animations.css, tailwind.css
  types/movie.ts
  utils/       formatDate.js, formatName.ts, validateEmail.js
  data/mockMovies.ts
USE_AUTH_GUIDE.md               ← tài liệu hướng dẫn auth cũ
dist/                           ← ĐÃ COMMIT NHẦM build artifact vào git
.env                            ← ĐÃ COMMIT NHẦM file .env vào git (bug NP-017)
```

### Cái đáng học lại từ nhánh này
1. `src/constants/appConfig.js` — gom hằng số ứng dụng về một chỗ.
2. `src/constants/regex.js` — gom regex validation.
3. `src/layouts/MainLayout.tsx` — có layout wrapper thật, thay vì mỗi trang tự render `<Navbar/>`.
4. `src/components/index.ts` — barrel export.
5. `package.json` có script `lint` với eslint + @typescript-eslint.
6. `src/types/movie.ts` — kiểu domain tách khỏi file data.

### Cái KHÔNG nên học lại
- Commit `dist/` và `.env` vào git.
- Trộn `.js` và `.ts` trong cùng thư mục (`formatDate.js` cạnh `formatName.ts`).
- `appConfig.js` đọc `import.meta.env.REACT_APP_API_URL` — sai tiền tố, Vite chỉ expose `VITE_*`
  nên biến này **luôn undefined**, luôn rơi về fallback. Xem NP-018.

---

## 2.5 Bảng tra nhanh: "tính năng X nằm ở nhánh nào"

| Cần tìm | Nhánh | Đường dẫn |
|---|---|---|
| Hero slider đẹp | `main` | `src/components/MovieSlider.tsx` |
| Top 10 với số lớn gradient | `main` | `src/components/MovieRows.tsx` (export `TopTen`) |
| Poster card hover overlay | `main` | `src/components/MovieCard.tsx` |
| Navbar dropdown thể loại/quốc gia | `main` | `src/components/Navbar.tsx` |
| Footer 5 cột | `main` | `src/components/Footer.tsx` |
| Màn chi tiết phim có tab | `main` | `src/screens/MovieDetailScreen.tsx` |
| Axios client + refresh interceptor | `mll` | `src/lib/api/client.ts` |
| Zustand auth store | `mll` | `src/store/authStore.ts` |
| Route guard theo role | `mll` | `src/routes/RoleGuard.tsx` |
| Zod schema mật khẩu mạnh | `mll` | `src/features/auth/schemas.ts` |
| OTP input 6 ô | `mll` | `src/features/auth/components/OtpInput.tsx` |
| Watchlist persist localStorage | `mll` | `src/features/movies/store/watchlistStore.ts` |
| Tailwind config token | `mll` | `tailwind.config.js` |
| Hằng số ứng dụng (mẫu) | `bak` | `src/constants/appConfig.js` |
| Regex validation (mẫu) | `bak` | `src/constants/regex.js` |
| Layout wrapper (mẫu) | `bak` | `src/layouts/MainLayout.tsx` |
| Keycloak setup | `bak` | `src/services/keycloak.ts` |
