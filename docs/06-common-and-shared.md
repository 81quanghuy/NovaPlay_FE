# 06 — Thành phần dùng chung (common)

Trả lời câu hỏi: *"tính năng nào là common, và nó đang nằm ở đâu?"*

---

## 6.1 Định nghĩa dùng trong dự án này

| Loại | Tiêu chí | Nơi phải đặt |
|---|---|---|
| **UI primitive** | Không biết gì về nghiệp vụ. Button, Input, Modal, Alert, Badge | `src/components/ui/` |
| **Layout** | Khung trang: Navbar, Footer, Sidebar, AuthLayout | `src/components/layout/` |
| **Lib / hạ tầng** | HTTP client, storage, format, jwt | `src/lib/` |
| **Config** | Hằng số, env, feature flag, storage key | `src/config/` |
| **State toàn cục** | Store nhiều feature cùng đọc (auth) | `src/store/` |
| **Feature-local** | Chỉ một feature dùng | `src/features/<tên>/` |

**Quy tắc vàng:** nếu một thứ được import bởi **≥ 2 feature khác nhau**, nó không được
nằm trong bất kỳ thư mục `features/*` nào.

---

## 6.2 Hiện trạng: cái gì đang được dùng chung

### Nhánh `merge-login-logic`

| Thành phần | Đang nằm ở | Ai đang import | Đúng chỗ? |
|---|---|---|---|
| `Button` | `features/auth/components/` | HomePage, WatchlistPage, MovieDetailPage, 6 trang auth | ❌ **SAI** |
| `Logo` | `features/auth/components/` | Navbar, AuthLayout, AuthBootstrap | ❌ **SAI** |
| `Alert` | `features/auth/components/` | các trang auth (hiện tại) | ⚠️ sẽ sai ngay khi movies cần |
| `FormField` | `features/auth/components/` | các trang auth | ⚠️ sẽ sai khi có form khác |
| `AuthLayout` | `features/auth/components/` | 5 trang auth | ⚠️ là layout, nên ở `components/layout/` |
| `PasswordInput` | `features/auth/components/` | chỉ auth | ✅ đúng |
| `OtpInput` | `features/auth/components/` | chỉ auth | ✅ đúng |
| `Navbar` | `components/` | HomePage, MoviesPage, SearchPage, MovieDetailPage, WatchlistPage | ✅ đúng |
| `apiClient`, `extractErrorMessage`, `postWithoutAuth` | `lib/api/` | authService, AuthBootstrap, mọi hook | ✅ đúng |
| `ENDPOINTS` | `lib/api/` | authService, client | ✅ đúng |
| DTO types | `lib/api/types.ts` | store, service, guard | ✅ đúng |
| `useAuthStore` + `hasRole`/`hasAnyRole` | `store/` | 3 guard, Navbar, HomePage, mọi hook | ✅ đúng |
| `refreshTokenStorage` | `store/` | authStore, client, AuthBootstrap, useLogout | ⚠️ nên ở `lib/storage/` |
| `tokenUtils` | `utils/` | **không ai** | ❌ dead code (NP-022) |
| `useWatchlistStore` | `features/movies/store/` | chỉ movies | ✅ đúng |

**Hệ quả cụ thể của việc đặt sai:**
```ts
// mll:src/features/movies/pages/WatchlistPage.tsx dòng 4
import { Button } from '@/features/auth/components/Button';
//                       ^^^^^^^^^^^^^^ module movies phụ thuộc module auth
```
Nếu sau này tách `features/auth` ra package riêng, hoặc lazy-load auth, module movies gãy.

### Nhánh `main`

| Thành phần | Đang nằm ở | Ai import | Đúng chỗ? |
|---|---|---|---|
| `NovaPlayLogo` | export phụ trong `components/Navbar.tsx` | Footer, LoginScreen | ❌ **SAI** — logo không thuộc navbar |
| `Navbar` | `components/` | HomeScreen, MovieDetailScreen | ✅ |
| `Footer` | `components/` | HomeScreen, MovieDetailScreen | ✅ |
| `PosterCard` | `components/MovieCard.tsx` | MovieRow | ✅ |
| `MovieRow` + `TopTen` | cùng file `components/MovieRows.tsx` | HomeScreen | ⚠️ 2 component khác nhau trong 1 file |
| `Field` | định nghĩa **bên trong** `screens/LoginScreen.tsx` | chỉ LoginScreen | ⚠️ input dùng chung bị chôn trong screen |
| `Movie` type + data | `src/data.ts` | mọi component | ⚠️ type domain trộn với dữ liệu mock |

---

## 6.3 Thành phần common **chưa tồn tại** nhưng dự án đang cần

Đây là danh sách những thứ mà bạn sẽ phải viết đi viết lại nếu không tạo sớm:

| Thành phần | Vì sao cần | Bằng chứng trong code |
|---|---|---|
| `ErrorBoundary` | Một lỗi render là trắng trang toàn app | Không có ở cả 3 nhánh (NP-027) |
| `Toast` / notification | 7 hook đều tự quản lý `error` string rồi tự render `<Alert>` | Từng có ở `bak:src/components/Toast.tsx`, đã mất |
| `Modal` | Xác nhận "Xoá tất cả watchlist", "Đăng xuất" | Từng có ở `bak:src/components/Modal.tsx`, đã mất |
| `Spinner` / `Loading` | Mỗi nơi tự viết `<Loader2 className="animate-spin">` | AuthBootstrap, Button lặp lại |
| `EmptyState` | 3 trang movies tự viết lại khối "không tìm thấy" | MovieDetailPage, WatchPage, WatchlistPage |
| `Skeleton` | Khi nối API thật sẽ cần trạng thái đang tải | Chưa có ở đâu |
| `MainLayout` | Mỗi trang tự render `<Navbar/>` — 5 lần lặp | Từng có ở `bak:src/layouts/MainLayout.tsx`, đã mất |
| `Badge` | Badge rating/chất lượng/genre viết lại ở 4 chỗ | MovieCard(main), MovieSlider, MovieCard(mll), MovieDetailPage |
| `usePagination` | MovieRow(main) và MoviesPage tự xử lý | — |
| `useDebounce` | SearchPage tự viết `setTimeout` | Sẽ lặp ở mọi ô tìm kiếm |
| `useClickOutside` | Navbar(mll) tự viết listener `mousedown`; Navbar(main) **không có** → dropdown không đóng | NP-014 |
| `formatDuration` / `formatRating` | `${duration} phút` và `rating.toFixed(1)` lặp ở 5 chỗ | — |

---

## 6.4 Trùng lặp cần gộp

| Thứ bị trùng | Bản 1 | Bản 2 | Nên giữ |
|---|---|---|---|
| Kiểu `Movie` | `main:src/data.ts` (id number) | `mll:features/movies/data/movies.ts` (id string) | Bản `mll`, bổ sung `quality`/`type`/`episodes`/`country` từ `main` (NP-024) |
| Dữ liệu phim mock | 12 phim (`main`) | 24 phim (`mll`) | Bản `mll` |
| Component thẻ phim | `main:components/MovieCard.tsx` (117 dòng, inline style) | `mll:features/movies/components/MovieCard.tsx` (79 dòng, tailwind) | Cấu trúc bản `mll` + hiệu ứng/badge của bản `main` |
| Component hàng phim | `main:components/MovieRows.tsx` `MovieRow` (bước cứng) | `mll:features/movies/components/MovieRow.tsx` (bước theo viewport) | Bản `mll` |
| Navbar | `main` (169 dòng, menu đầy đủ, tìm kiếm, chuông) | `mll` (77 dòng, chỉ dropdown user) | **Gộp**: khung + menu của `main`, phần user + click-outside của `mll` |
| Logo | `main:NovaPlayLogo` (SVG play) | `mll:Logo` (chữ N) | Chốt 1 bản, đặt ở `components/ui/Logo.tsx` |
| Nút | inline style khắp `main` | `mll:Button` | `mll:Button` |
| Input | `Field` trong `LoginScreen` | `mll:FormField` | `mll:FormField` |
| Design token | `main:src/index.css` | `mll:src/styles/colors_and_type.css` + `mll:tailwind.config.js` | Một file CSS + tailwind trỏ vào biến (NP-008) |
| Danh sách thể loại | 7 mục trong `main:Navbar.tsx` | 12 mục trong `mll:movies.ts GENRES` | `GENRES` ở `mll`, Navbar đọc từ đó |
| Danh sách quốc gia | 5 mục trong `main:Navbar.tsx` | không có | Chuyển vào `config/` hoặc data |

---

## 6.5 Đích đến

```
src/components/
  ui/                       ← dùng chung, không biết nghiệp vụ
    Button.tsx              (từ mll:features/auth/components/Button.tsx)
    FormField.tsx           (từ mll:features/auth/components/FormField.tsx)
    PasswordInput.tsx
    Alert.tsx
    Logo.tsx
    Badge.tsx               ← viết mới, gom 4 chỗ trùng
    Modal.tsx               ← viết mới (tham khảo bak:)
    Spinner.tsx             ← viết mới
    EmptyState.tsx          ← viết mới
    Skeleton.tsx            ← viết mới
  layout/
    Navbar.tsx              (gộp 2 bản)
    Footer.tsx              (từ main:)
    MainLayout.tsx          ← viết mới (tham khảo bak:)
    AuthLayout.tsx          (từ mll:features/auth/components/)
  feedback/
    ErrorBoundary.tsx       ← viết mới
    ToastProvider.tsx       ← viết mới

src/hooks/                  ← hook dùng chung
  useDebounce.ts
  useClickOutside.ts
  useMediaQuery.ts

src/lib/
  api/    client.ts  endpoints.ts  types.ts
  storage/ localStorage.ts        ← gom refreshTokenStorage + watchlist storage
  format/  duration.ts  rating.ts  date.ts
  jwt.ts                          ← từ utils/tokenUtils.ts (nếu quyết định giữ)
```

Xem [10-target-architecture.md](10-target-architecture.md) để có cây thư mục đầy đủ.
