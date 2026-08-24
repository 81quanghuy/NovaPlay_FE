# 09 — Danh sách lỗi & rủi ro đã phát hiện

Phát hiện qua đọc mã nguồn ngày **2026-08-24** trên cả 3 nhánh.
Không chạy build/test (theo quy ước dự án, agent không tự chạy lệnh build).
Mọi kết luận đều truy được về dòng mã cụ thể.

## Bảng tổng hợp

| ID | Mức | Tiêu đề | Nhánh |
|---|---|---|---|
| [NP-001](#np-001) | 🔴 | Backdoor admin bật cứng trong mã nguồn | `mll` |
| [NP-002](#np-002) | 🔴 | Race condition khi gia hạn token → đăng xuất bất ngờ | `mll` |
| [NP-003](#np-003) | 🟠 | Rò rỉ timer & `preventDefault` vô hiệu trong slider/Top10 | `main` |
| [NP-004](#np-004) | 🟡 | Danh sách tập hardcode 12, bỏ qua dữ liệu thật | `main` |
| [NP-005](#np-005) | 🟠 | Toàn bộ module movies (1098 dòng) chưa được route | `mll` |
| [NP-006](#np-006) | 🟠 | Không có router thật: mất back button, deep link, SEO | `main` |
| [NP-007](#np-007) | 🟡 | Dữ liệu mock trùng lặp, phụ thuộc TMDB, id không liên tục | `main` |
| [NP-008](#np-008) | 🟠 | Design token 4 nguồn mâu thuẫn, gần như không được dùng | cả 3 |
| [NP-009](#np-009) | 🟡 | Hardcode kích thước card + scroll listener không throttle | `main` |
| [NP-010](#np-010) | 🟡 | Tab "Hình ảnh" và "Bình luận" render rỗng | `main` |
| [NP-011](#np-011) | 🟡 | Metadata màn chi tiết hardcode theo phim Dune | `main` |
| [NP-012](#np-012) | 🟠 | Form đăng nhập hoàn toàn tĩnh, không nhập được | `main` |
| [NP-013](#np-013) | 🟡 | Lệch quy ước snake_case / camelCase với backend | `mll` |
| [NP-014](#np-014) | 🟡 | 30+ phần tử tương tác chết + thiếu accessibility | `main` |
| [NP-015](#np-015) | 🟡 | Component dùng chung nằm trong module feature | cả 2 |
| [NP-016](#np-016) | 🟡 | Không có ESLint / Prettier / test / CI | cả 3 |
| [NP-017](#np-017) | 🔵 | `.env` và `dist/` bị commit vào git | `bak` |
| [NP-018](#np-018) | 🔵 | `appConfig` dùng tiền tố `REACT_APP_` → luôn undefined | `bak` |
| [NP-019](#np-019) | 🟠 | Chưa responsive — mọi kích thước là px cứng | `main` |
| [NP-020](#np-020) | 🟠 | Refresh token lưu localStorage → rủi ro XSS | `mll` |
| [NP-021](#np-021) | 🟠 | Gia hạn token thất bại nhưng không điều hướng về `/login` | `mll` |
| [NP-022](#np-022) | 🟡 | `tokenUtils.ts` là dead code, dùng API deprecated | `mll` |
| [NP-023](#np-023) | 🟡 | Nút "Khám Phá Phim" đã bật nhưng thiếu `onClick` | `mll` |
| [NP-024](#np-024) | 🟡 | Hai định nghĩa kiểu `Movie` mâu thuẫn | cả 2 |
| [NP-025](#np-025) | 🔵 | Font Google nạp trùng 2 lần | cả 2 |
| [NP-026](#np-026) | 🔵 | `OtpInput` dùng ref callback có giá trị trả về (vỡ ở React 19) | `mll` |
| [NP-027](#np-027) | 🟡 | Không có ErrorBoundary — một lỗi render là trắng trang | cả 3 |
| [NP-028](#np-028) | 🟡 | Không code-splitting, mọi route import eager | `mll` |
| [NP-029](#np-029) | 🔵 | Favicon/logo vẫn là placeholder mặc định của CRA | cả 3 |
| [NP-030](#np-030) | 🔵 | Footer ghi cứng "© 2025" | `main` |

---

<a id="np-001"></a>
## 🔴 NP-001 — Backdoor admin bật cứng trong mã nguồn

**Nhánh:** `mll` · **File:** `src/routes/AuthBootstrap.tsx` dòng 15 · **Commit gây ra:** `58491ba`

```ts
const DEV_BYPASS_AUTH = true;              // ← hardcode, không đọc env

const FAKE_ADMIN_USER: UserResponse = {
  id: 'dev-admin-id', username: 'admin', email: 'admin@novaplay.local',
  isActive: true, isEmailVerified: true,
  roles: [{ roleName: 'ADMIN' }, { roleName: 'USER' }],
};
const FAKE_AUTH_RESPONSE: AuthResponse = {
  access_token: 'dev-bypass-access-token',
  refresh_token: 'dev-bypass-refresh-token', ...
};

useEffect(() => {
  if (DEV_BYPASS_AUTH) { setAuth(FAKE_AUTH_RESPONSE); setUser(FAKE_ADMIN_USER); return; }
  ...
});
```

### Hậu quả
1. **Mọi khách truy cập tự động trở thành ADMIN.** `ProtectedRoute` và `RoleGuard` bị vô hiệu
   hoàn toàn — kể cả `/admin`. Nếu bản build này lên bất kỳ môi trường nào có người ngoài
   truy cập được, đó là lỗ hổng bảo mật nghiêm trọng.
2. **Ô nhiễm localStorage của người dùng thật.** `setAuth()` gọi
   `refreshTokenStorage.set('dev-bypass-refresh-token')` → ghi đè token thật đang có.
3. **Mọi lời gọi API đều hỏng.** Header gửi `Bearer dev-bypass-access-token` → backend trả 401
   → interceptor thử refresh bằng token giả → thất bại → `reset()` → user bị đăng xuất
   giữa chừng, không rõ lý do.
4. Không có bất kỳ cảnh báo nào trên UI cho biết đang ở chế độ bypass.

### Cách sửa
```ts
// src/config/feature-flags.ts
import { ENV } from './env';
export const FLAGS = {
  AUTH_BYPASS: ENV.IS_DEV && import.meta.env.VITE_AUTH_BYPASS === 'true',
} as const;
```
```ts
// AuthBootstrap.tsx
import { FLAGS } from '@/config/feature-flags';
if (FLAGS.AUTH_BYPASS) {
  console.warn('[NovaPlay] AUTH BYPASS đang BẬT — phiên admin giả. Chỉ dùng cho dev.');
  setAuth(FAKE_AUTH_RESPONSE); setUser(FAKE_ADMIN_USER); return;
}
```
Thêm dải cảnh báo đỏ cố định trên màn hình khi `FLAGS.AUTH_BYPASS === true`.

### Nghiệm thu
- [ ] Không còn chuỗi `DEV_BYPASS_AUTH = true` trong mã nguồn
- [ ] `VITE_AUTH_BYPASS` có mặt trong `.env.example` với giá trị `false`
- [ ] Build production (`import.meta.env.DEV === false`) → cờ luôn `false`, khối bypass bị tree-shake
- [ ] Khi bật cờ, UI hiển thị cảnh báo rõ ràng

---

<a id="np-002"></a>
## 🔴 NP-002 — Race condition khi gia hạn token

**Nhánh:** `mll` · **File:** `src/lib/api/client.ts` dòng 62–71

```ts
let refreshing: Promise<string | null> | null = null;

if (status === 401 && original && !original._retry && !isAuthEndpoint) {
  original._retry = true;
  refreshing = refreshing ?? performRefresh();
  const newToken = await refreshing;
  refreshing = null;                    // 🔴 mọi caller đều gán null sau khi await
  ...
}
```

### Tái hiện
1. Trang gọi song song 3 request (ví dụ `/auth/me`, `/movies`, `/notifications`).
2. Access token hết hạn → cả 3 nhận 401 gần như cùng lúc.
3. Request A vào trước: `refreshing = performRefresh()` (P1), `await P1`.
4. P1 xong → A gán `refreshing = null`.
5. Request C nhảy vào **sau bước 4** → thấy `refreshing === null` → gọi
   `performRefresh()` **lần thứ hai** (P2).

### Hậu quả
- Gọi `/auth/refresh-token` nhiều lần không cần thiết (tăng tải backend).
- 🔴 Nếu backend bật **refresh token rotation** (token cũ bị vô hiệu ngay khi cấp token mới):
  P2 dùng refresh token đã bị P1 làm hết hạn → 401 → `reset()` → **người dùng bị đăng xuất
  ngẫu nhiên giữa phiên làm việc**. Đây là loại lỗi rất khó tái hiện thủ công và rất dễ
  bị báo cáo là "thỉnh thoảng bị văng ra".

### Cách sửa
```ts
function getRefreshPromise(): Promise<string | null> {
  if (!refreshing) {
    refreshing = performRefresh().finally(() => { refreshing = null; });
    //                            ^^^^^^^ reset ở ĐÚNG MỘT nơi: chính promise đó
  }
  return refreshing;
}

if (status === 401 && original && !original._retry && !isAuthEndpoint) {
  original._retry = true;
  const newToken = await getRefreshPromise();
  if (newToken) {
    original.headers.set('Authorization', `Bearer ${newToken}`);
    return apiClient.request(original);
  }
}
```

### Nghiệm thu
- [ ] `refreshing = null` chỉ xuất hiện **một lần** trong file, bên trong `.finally()`
- [ ] Bắn 5 request song song khi token hết hạn → DevTools Network chỉ thấy **1** lời gọi
      `/auth/refresh-token`
- [ ] Cả 5 request được retry và thành công

---

<a id="np-003"></a>
## 🟠 NP-003 — Rò rỉ timer & `preventDefault` vô hiệu

**Nhánh:** `main` · **File:** `src/components/MovieSlider.tsx` dòng 14–23, `src/components/MovieRows.tsx` dòng 102–108

### 3a. `setTimeout` lồng trong `setInterval` không được dọn
```tsx
tRef.current = setInterval(() => {
  setAnimating(true);
  setTimeout(() => {                    // ← id của timeout này không được lưu
    setIdx(i => (i + 1) % movies.length);
    setAnimating(false);
  }, 250);
}, 6500);
return () => { if (tRef.current) clearInterval(tRef.current); };   // chỉ clear interval
```
Nếu component unmount trong khoảng 250ms đó → `setIdx`/`setAnimating` chạy trên component
đã bị gỡ. Với `StrictMode` (đang bật ở `main.tsx`), effect chạy 2 lần khi dev → dễ gặp.

**Sửa:**
```tsx
useEffect(() => {
  let timeoutId: ReturnType<typeof setTimeout>;
  const intervalId = setInterval(() => {
    setAnimating(true);
    timeoutId = setTimeout(() => { setIdx(i => (i + 1) % movies.length); setAnimating(false); },
                           UI.HERO_TRANSITION_MS);
  }, UI.HERO_AUTOPLAY_MS);
  return () => { clearInterval(intervalId); clearTimeout(timeoutId); };
}, [movies.length]);
```

### 3b. Slider không dừng khi hover và không reset khi bấm dot
Người dùng bấm dot chọn slide 3, 200ms sau interval nhảy sang slide 4. Trải nghiệm hỏng.
**Sửa:** thêm `onMouseEnter` tạm dừng, và reset interval trong handler của dot.

### 3c. `preventDefault()` trong `onWheel` không có tác dụng
```tsx
const onWheel = (e: React.WheelEvent) => {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    scrollerRef.current.scrollLeft += e.deltaY;
    e.preventDefault();       // ← React gắn wheel listener ở chế độ passive
  }
};
```
React đăng ký `wheel` là **passive** → `preventDefault()` bị trình duyệt bỏ qua và in cảnh báo
`Unable to preventDefault inside passive event listener`. Kết quả: trang vẫn cuộn dọc **đồng
thời** với cuộn ngang.

**Sửa:** gắn listener thủ công với `{ passive: false }`:
```tsx
useEffect(() => {
  const el = scrollerRef.current; if (!el) return;
  const handler = (e: WheelEvent) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { el.scrollLeft += e.deltaY; e.preventDefault(); }
  };
  el.addEventListener('wheel', handler, { passive: false });
  return () => el.removeEventListener('wheel', handler);
}, []);
```

### Nghiệm thu
- [ ] Không còn cảnh báo `preventDefault inside passive event listener` trong console
- [ ] Chuyển màn hình khi slider đang chạy → không có cảnh báo React
- [ ] Hover vào hero → slider dừng; rời chuột → chạy lại
- [ ] Bấm dot → slide giữ nguyên ít nhất một chu kỳ đầy đủ

---

<a id="np-004"></a>
## 🟡 NP-004 — Danh sách tập hardcode 12, bỏ qua dữ liệu

**Nhánh:** `main` · **File:** `src/screens/MovieDetailScreen.tsx` dòng 16

```tsx
const eps = Array.from({ length: 12 }, (_, i) => i + 1);
```

`Movie` có sẵn `episodes?: { current: number; total: number }` — phim Loki khai `total: 60`,
nhưng UI luôn hiển thị đúng 12 tập. Phim lẻ (`type: 'movie'`, không có `episodes`) cũng
vẫn hiện tab "Tập phim" với 12 tập.

**Sửa:** `const total = movie.episodes?.total ?? 0;` — nếu `movie.type === 'movie'` thì
ẩn hẳn tab "Tập phim". Với `total` lớn (60 tập) cần chia nhóm 1–50 / 51–60 như các trang phim thật.

---

<a id="np-005"></a>
## 🟠 NP-005 — Module movies chưa được route (1098 dòng dead code)

**Nhánh:** `mll` · **File:** `src/routes/index.tsx`

Commit `627aa4f` thêm 10 file movies nhưng **không sửa `routes/index.tsx`**.
Vì có `{ path: '*', element: <Navigate to="/" replace /> }`, mọi `<Link to="/movie/5">`
trong `MovieCard` **âm thầm** nhảy về trang chủ. Không lỗi, không log — cực khó phát hiện.

**Sửa:** xem [05-feature-movies.md](05-feature-movies.md) §5.5 và task T-2.1.

Cần quyết định trước: duyệt phim / xem phim có bắt buộc đăng nhập không?

### Nghiệm thu
- [ ] Truy cập được `/movies`, `/movie/:id`, `/watch/:id`, `/search`, `/watchlist`
- [ ] Bấm thẻ phim mở đúng trang chi tiết
- [ ] Nhập id không tồn tại → hiện empty state (đã có sẵn), không nhảy về `/`

---

<a id="np-006"></a>
## 🟠 NP-006 — Không có router thật ở nhánh `main`

**Nhánh:** `main` · **File:** `src/App.tsx`

Điều hướng bằng `setRoute()` thuần state. Hậu quả:
- Nút Back của trình duyệt thoát khỏi app thay vì quay về màn trước
- Không share được link tới phim cụ thể (chỉ có `#?screen=detail` **hardcode id 19**)
- Không SEO, không Open Graph khi share lên mạng xã hội
- Không có trang 404
- F5 mất toàn bộ ngữ cảnh

**Sửa:** dùng `react-router-dom` như nhánh `mll` (đã có sẵn). Đây là một phần của
việc hợp nhất, task T-3.x.

---

<a id="np-007"></a>
## 🟡 NP-007 — Vấn đề dữ liệu mock

**Nhánh:** `main` · **File:** `src/data.ts`, `src/screens/HomeScreen.tsx`

1. **Hai hàng trùng nội dung:** `NP_NEW = NP_MOVIES.slice(2,10)` và hàng "Phim Bộ Đề Cử"
   dùng `NP_MOVIES.slice(2, 10)` — **giống hệt nhau**. Trang chủ hiện 2 hàng y chang.
2. **Các slice chồng lấn:** `NP_HERO`(0-5), `NP_TRENDING`(0-10), `NP_NEW`(2-10),
   `NP_UPCOMING`(4-12) → cùng một phim xuất hiện ở 4 vị trí.
3. **ID không liên tục:** 1,2,3,4,5,6,7,9,10,12,13,19 — thiếu 8,11,14–18.
   `App.tsx` hardcode tìm `id === 19`; nếu ai đó xoá phim đó, deep link `?screen=detail` gãy.
4. **Phụ thuộc CDN TMDB** không có ảnh dự phòng: `<img>` không có `onError`, không có
   placeholder. Mạng chặn TMDB (khá phổ biến ở VN) → toàn bộ trang là ô trống.
5. `NP_UPCOMING = slice(4, 12)` nhưng mảng chỉ có 12 phần tử → thực tế chỉ 8 phim, và
   "Sắp Chiếu" lại chứa phim năm 2021–2023 (đã chiếu xong).

**Sửa:** dùng bộ 24 phim của `mll` + gắn cờ `trending`/`topRated`/`newRelease` thay vì
`slice`. Thêm `onError` fallback cho mọi `<img>`.

---

<a id="np-008"></a>
## 🟠 NP-008 — Design token 4 nguồn mâu thuẫn

**Nhánh:** cả 3

| Nguồn | Token | Ghi chú |
|---|---|---|
| `project/colors_and_type.css` | 96 | Bản gốc, đầy đủ |
| `main:src/index.css` | 42 | Thiếu spacing/radii/shadow/text-scale. `--np-container: 1760px` |
| `mll:src/styles/colors_and_type.css` | 34 | Thiếu cả font stack và easing |
| `mll:tailwind.config.js` | — | Chép tay lại hex, không liên kết với CSS var |

Và tệ hơn: **nhánh `main` gần như không dùng biến nào** — component viết thẳng `'#ff2c55'`
(~20 lần), `'#07090f'` (~12 lần), `'Manrope,sans-serif'` (~8 lần), `maxWidth: 1760` (7 lần).

Giá trị `--np-container` có **3 phiên bản**: 1440 (gốc + tailwind) / 1760 (main css) / 1760 (hardcode).

**Sửa:** xem [07-configuration.md](07-configuration.md) §7.6. Lưu ý bắt buộc: vì code đang dùng
opacity modifier (`bg-primary/10`, `ring-primary/30`, `border-danger/40`), biến màu **phải**
khai báo dạng kênh RGB `--np-primary-rgb: 255 44 85` và Tailwind dùng
`rgb(var(--np-primary-rgb) / <alpha-value>)`.

### Nghiệm thu
- [ ] Chỉ còn **một** file token: `src/styles/tokens.css`
- [ ] `tailwind.config.js` không còn chuỗi hex nào
- [ ] `grep -rn "#ff2c55" src/` không trả về kết quả nào trong file `.tsx`
- [ ] Đổi `--np-primary` một dòng → toàn app đổi màu

---

<a id="np-009"></a>
## 🟡 NP-009 — Hardcode kích thước card & scroll listener không throttle

**Nhánh:** `main`

### 9a. Bước phân trang phụ thuộc hằng số chép tay
`MovieRows.tsx` dòng 75: `transform: translateX(-${start * (200 + 18)}px)`
trong khi `MovieCard.tsx` dòng 12: `const w = big ? 240 : 200;`

Nếu dùng `<PosterCard big />` trong một `MovieRow`, hoặc đổi gap, hàng sẽ trượt sai vị trí.
**Sửa:** đo bằng `ref` (`el.children[0].clientWidth`) hoặc đưa `CARD_WIDTH`/`CARD_GAP` vào
`config/app.config.ts` và cho cả hai file cùng đọc.

### 9b. Scroll listener chạy mỗi frame
`Navbar.tsx` dòng 45–49: `window.addEventListener('scroll', fn)` — không `{ passive: true }`,
không throttle/rAF. Handler gọi `setScrolled` mỗi sự kiện cuộn (dù giá trị không đổi,
React vẫn phải so sánh và có thể re-render toàn bộ navbar).

**Sửa:**
```ts
useEffect(() => {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { setScrolled(window.scrollY > LAYOUT.NAVBAR_SCROLL_THRESHOLD); ticking = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```

---

<a id="np-010"></a>
## 🟡 NP-010 — Tab "Hình ảnh" và "Bình luận" render rỗng

**Nhánh:** `main` · **File:** `src/screens/MovieDetailScreen.tsx` dòng 184–232

Có 4 tab nhưng chỉ 2 tab (`episodes`, `cast`) có khối `{tab === '...' && (...)}`.
Bấm "Hình ảnh" hoặc "Bình luận" → vùng nội dung **trắng hoàn toàn**, không có thông báo.
Nhãn tab còn ghi cứng "Bình luận (286)" — số giả.

**Sửa (tối thiểu):** thêm `EmptyState` "Tính năng đang được phát triển" cho 2 tab, bỏ số 286.
**Sửa (đầy đủ):** implement gallery (dùng `backdropUrl` + ảnh phụ) và khối bình luận.

---

<a id="np-011"></a>
## 🟡 NP-011 — Metadata màn chi tiết hardcode theo phim Dune

**Nhánh:** `main` · **File:** `src/screens/MovieDetailScreen.tsx`

| Vị trí | Giá trị cứng |
|---|---|
| Tab "Diễn viên" | `['Timothée Chalamet','Zendaya','Rebecca Ferguson','Oscar Isaac']` |
| Aside → Đạo diễn | `'Denis Villeneuve'` |
| Aside → Sản xuất | `'Legendary Pictures'` |
| Aside → Đề xuất | `NP_MOVIES.slice(7, 11)` — cố định, không liên quan phim đang xem, **không bấm được** |
| Chọn server | `['Vietsub #1','Vietsub #2','Lồng tiếng']`, `i === 0` luôn active, không đổi được |

Mở phim "Wonka" vẫn thấy diễn viên và đạo diễn của Dune.

**Sửa:** bổ sung `director`, `cast` vào kiểu `Movie` (bản `mll` đã có sẵn 2 trường này);
phim đề xuất tính theo genre giao nhau như `mll:MovieDetailPage`; server thành state có thể chọn.

---

<a id="np-012"></a>
## 🟠 NP-012 — Form đăng nhập hoàn toàn tĩnh

**Nhánh:** `main` · **File:** `src/screens/LoginScreen.tsx`

- `<Field>` không có `value`/`onChange`/`name`/`ref` → không lấy được dữ liệu người dùng gõ
- Không có thẻ `<form>`, không có `onSubmit`
- Nút "Đăng nhập" không có `onClick`
- 3 nút social (Google/Facebook/Apple) không có `onClick`
- Không validate, không hiện lỗi, không trạng thái loading

Người dùng gõ email + mật khẩu, bấm nút → **không có gì xảy ra**.

**Sửa:** thay bằng `LoginPage` của nhánh `mll` (react-hook-form + zod + `useLogin`), giữ
phần thẩm mỹ (nền 3 lớp, glass card) của `main`.

---

<a id="np-013"></a>
## 🟡 NP-013 — Lệch quy ước đặt tên với backend

**Nhánh:** `mll` · **File:** `src/lib/api/types.ts`

```ts
interface AuthResponse  { access_token, refresh_token, token_type, expires_in, user_profile }  // snake_case
interface LoginRequest  { emailOrUsername, password }                                          // camelCase
interface UserResponse  { isActive, isEmailVerified, lastLoginAt }                              // camelCase
```

Một API hiếm khi trộn 2 quy ước. Khả năng cao là **frontend đang đoán sai một trong hai**.
Nếu sai, mọi lời gọi auth thất bại ngay lần tích hợp thật đầu tiên.

**Việc cần làm:** đối chiếu với tài liệu backend (OpenAPI/Swagger) và sửa cho khớp.
Nếu backend thật sự trộn, cân nhắc thêm lớp mapper để trong code frontend chỉ dùng camelCase.

Ngoài ra:
- `RoleName = 'ADMIN'|'USER'|'MODERATOR'| string` — `| string` làm mất tác dụng union.
- `ApiErrorBody` khai báo nhưng không ai dùng; `extractErrorMessage` tự khai lại
  `{ message?, error? }` — và dùng `error` trong khi type gốc ghi `errors`.

---

<a id="np-014"></a>
## 🟡 NP-014 — Phần tử tương tác chết & thiếu accessibility

**Nhánh:** `main`

### Phần tử không làm gì
| Vị trí | Phần tử |
|---|---|
| `Navbar.tsx` | Ô tìm kiếm (không `value`/`onChange`/`onSubmit`) |
| `Navbar.tsx` | 12 mục dropdown thể loại/quốc gia — chỉ đóng menu |
| `Navbar.tsx` | Nút chuông — toggle state `bell` nhưng không render gì |
| `Navbar.tsx` | 4 mục nav không dropdown → `onNav(key)` mà App chỉ xử lý `'login'` |
| `MovieSlider.tsx` | Nút trái tim — không có `onClick` |
| `MovieSlider.tsx` | Nút "Chi Tiết" trùng chức năng nút "Xem Phim" |
| `MovieCard.tsx` | Nút "Chi tiết" trùng chức năng "Xem ngay" |
| `MovieRows.tsx` | Link "Xem tất cả" — `preventDefault()` |
| `Footer.tsx` | 18 link — `preventDefault()` |
| `Footer.tsx` | 4 nút mạng xã hội — không `href`, chỉ hiện chữ cái đầu |
| `MovieDetailScreen.tsx` | 3 nút chọn server — không state |
| `MovieDetailScreen.tsx` | 4 thẻ phim đề xuất — không `onClick` |

### Vấn đề accessibility
- `PosterCard` và thẻ Top10 dùng `<div onClick>` → **không** focus được bằng Tab,
  **không** kích hoạt bằng Enter/Space, không có `role`/`tabIndex`
- Dropdown navbar: chỉ đóng bằng `onMouseLeave`. Không click-outside, không Esc,
  không `aria-expanded`, không `role="menu"`, không điều hướng bằng phím
- Nút icon (chuông, prev/next của `MovieRow`) không có `aria-label`
  (riêng `TopTen` **có** — giữ mẫu đó)
- Không có `:focus-visible` style ở bất kỳ đâu trên nhánh `main`
- Ảnh có `alt` ✅ nhưng ảnh nền hero là `backgroundImage` → screen reader không thấy gì

**Sửa:** đổi card sang `<button>`/`<Link>`, viết hook `useClickOutside` dùng chung,
thêm `aria-label` cho mọi nút icon, thêm style `:focus-visible` vào token.

---

<a id="np-015"></a>
## 🟡 NP-015 — Component dùng chung nằm sai module

Xem chi tiết [06-common-and-shared.md](06-common-and-shared.md) §6.2.

- `mll`: `Button`, `Logo`, `Alert`, `FormField` nằm trong `features/auth/components/`
  nhưng được `HomePage`, `Navbar`, `WatchlistPage`, `MovieDetailPage` import
  → **module movies phụ thuộc module auth chỉ vì cái nút**
- `main`: `NovaPlayLogo` là export phụ của `components/Navbar.tsx`, được `Footer` và
  `LoginScreen` import → logo phụ thuộc navbar

**Sửa:** kéo lên `src/components/ui/` và `src/components/layout/`.

---

<a id="np-016"></a>
## 🟡 NP-016 — Không có ESLint / Prettier / test / CI

**Nhánh:** cả 3 (nhánh `bak` từng có eslint, đã mất khi rewrite)

`package.json` hiện tại chỉ có `dev`, `build`, `preview`. Không có:
- ESLint → không ai chặn được `console.log`, biến không dùng, hook sai dependency
- Prettier → format không nhất quán giữa các lần AI agent sửa file
- Test → không có lưới an toàn cho bất kỳ refactor nào
- CI → không có gì chặn commit hỏng vào nhánh chính

Với dự án có nhiều agent cùng sửa, đây là rủi ro tích luỹ.

**Sửa:** xem task T-1.5 và T-6.x trong [11-migration-plan.md](11-migration-plan.md).

---

<a id="np-017"></a>
## 🔵 NP-017 — `.env` và `dist/` bị commit vào git

**Nhánh:** `bak`

`git ls-tree origin/backup_main` cho thấy `.env` (chứa cấu hình Keycloak) và cả thư mục
`dist/` với file build. Nhánh `main` hiện tại đã có `.gitignore` đúng.

**Lưu ý:** `.gitignore` hiện dùng `.env.*` → file `.env.example` cũng bị chặn.
Cần thêm dòng phủ định:
```gitignore
.env
.env.*
!.env.example
```

---

<a id="np-018"></a>
## 🔵 NP-018 — `appConfig` dùng tiền tố `REACT_APP_`

**Nhánh:** `bak` · **File:** `src/constants/appConfig.js` dòng 2

```js
API_URL: import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api',
```

Vite **chỉ** expose biến bắt đầu bằng `VITE_`. `REACT_APP_API_URL` là quy ước của Create
React App → giá trị **luôn `undefined`** → app luôn gọi `localhost:3001` bất kể cấu hình.

Lỗi này không còn ảnh hưởng nhánh hiện hành, nhưng **phải nhớ khi port `appConfig.js`
sang `config/app.config.ts`**.

---

<a id="np-019"></a>
## 🟠 NP-019 — Chưa responsive

**Nhánh:** `main`

Mọi kích thước là px cứng, không có một media query nào trong toàn bộ `src/`:
- `padding: '0 48px'` / `'0 80px'` cố định
- `maxWidth: 1760` — trên màn 1366px sẽ tràn
- Hero `height: 680`, `fontSize: 64`
- Ô tìm kiếm `width: 340`
- Footer `gridTemplateColumns: '1.4fr repeat(4, 1fr)'` — 5 cột trên điện thoại
- MovieDetail `gridTemplateColumns: '1fr 320px'`, tập phim `repeat(8, 1fr)`
- Top10 số thứ tự `fontSize: 160`

Trên điện thoại, trang gần như không dùng được.

> Nhánh `mll` **có** responsive (`lg:`, `md:`, `sm:` của Tailwind) — thêm một lý do
> chọn `mll` làm base.

**Sửa:** port sang Tailwind với breakpoint, thay px cứng bằng `clamp()` cho typography.

---

<a id="np-020"></a>
## 🟠 NP-020 — Refresh token trong localStorage

**Nhánh:** `mll` · **File:** `src/store/refreshTokenStorage.ts`

`localStorage` đọc được bằng JavaScript → bất kỳ XSS nào (thư viện bên thứ ba bị chèn mã,
nội dung do user tạo không được sanitize) đều đánh cắp được refresh token, và refresh token
có thời hạn dài.

Điểm làm đúng: `accessToken` chỉ giữ trong memory (zustand), không xuống localStorage ✅.

**Khuyến nghị theo thứ tự ưu tiên:**
1. **Tốt nhất:** backend trả refresh token qua cookie `httpOnly; Secure; SameSite=Strict`
   → frontend không cầm token, chỉ gọi `/auth/refresh-token` với `withCredentials: true`
2. Nếu không đổi được backend: rút ngắn TTL refresh token, bật rotation, ghi nhận
   device fingerprint phía server
3. Bắt buộc: có Content-Security-Policy để giảm bề mặt XSS

Đây là quyết định cần chủ dự án + backend cùng chốt, không phải việc frontend tự làm.

---

<a id="np-021"></a>
## 🟠 NP-021 — Gia hạn thất bại nhưng không điều hướng

**Nhánh:** `mll` · **File:** `src/lib/api/client.ts` dòng 44–46

```ts
} catch {
  useAuthStore.getState().reset();     // status → 'unauthenticated'
  return null;                         // nhưng không ai đưa user về /login
}
```

`ProtectedRoute` chỉ chạy khi **route thay đổi**. Người dùng đang ở `/change-password`,
token hết hạn, refresh thất bại → store về `unauthenticated` nhưng trang vẫn đứng yên,
mọi thao tác tiếp theo đều lỗi. Không có thông báo nào.

**Sửa (chọn 1):**
- **A.** Xuất `router` ra module riêng rồi gọi `router.navigate('/login', { replace: true })`
  trong `catch` (react-router v6.4+ hỗ trợ điều hướng ngoài component)
- **B.** Bắn `window.dispatchEvent(new CustomEvent('novaplay:auth-expired'))`, cho một
  `<AuthExpiredListener>` ở gốc app nghe và điều hướng + hiện toast "Phiên đã hết hạn"

Phương án B ít ràng buộc hơn và dễ test hơn.

---

<a id="np-022"></a>
## 🟡 NP-022 — `tokenUtils.ts` dead code + API deprecated

**Nhánh:** `mll` · **File:** `src/utils/tokenUtils.ts`

`parseJwt()` và `isExpired()` không được file nào import. Ngoài ra:
```ts
JSON.parse(decodeURIComponent(escape(json)))
```
`escape()` đã **deprecated**. Cách đúng hiện nay:
```ts
const json = new TextDecoder().decode(
  Uint8Array.from(atob(payload.replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0))
);
```

**Quyết định:** hoặc (a) dùng nó để refresh **chủ động** (kiểm tra `exp` trước khi gửi
request, tránh vòng 401 → retry), hoặc (b) xoá file. Không để lơ lửng.

---

<a id="np-023"></a>
## 🟡 NP-023 — Nút "Khám Phá Phim" thiếu `onClick`

**Nhánh:** `mll` · **File:** `src/pages/HomePage.tsx` dòng 42

Commit `0a82ee5` có tiêu đề "feat(home): enable Khám Phá Phim button" nhưng chỉ **bỏ thuộc
tính `disabled`** — không thêm `onClick`:
```diff
- <Button variant="primary" leftIcon={<Play/>} disabled>Khám Phá Phim</Button>
+ <Button variant="primary" leftIcon={<Play/>}>Khám Phá Phim</Button>
```
Kết quả: nút trông bấm được nhưng vẫn không làm gì — **tệ hơn** trạng thái disabled ban đầu,
vì giờ người dùng tưởng nó hỏng.

**Sửa:** `onClick={() => navigate('/movies')}` (sau khi hoàn thành NP-005).

---

<a id="np-024"></a>
## 🟡 NP-024 — Hai định nghĩa `Movie` mâu thuẫn

| Trường | `main:src/data.ts` | `mll:features/movies/data/movies.ts` |
|---|---|---|
| id | `number` | `string` |
| mô tả | `overview` | `description` |
| poster | `posterUrl` | `poster` |
| backdrop | `backdropUrl` | `backdrop` |
| năm | `year` | `releaseYear` |
| — | `quality: '4K'\|'FHD'\|'HD'` | ❌ không có |
| — | `type: 'movie'\|'series'` | ❌ không có |
| — | `episodes?: {current,total}` | ❌ không có |
| — | `country` | ❌ không có |
| — | ❌ không có | `youtubeKey` |
| — | ❌ không có | `originalTitle`, `director`, `cast` |
| — | ❌ không có | `trending`, `topRated`, `newRelease` |

Số phim: 12 (`main`) vs 24 (`mll`). Danh sách thể loại: 7 (`main:Navbar`) vs 12 (`mll:GENRES`).

**Sửa:** hợp nhất thành một kiểu duy nhất ở `src/features/movies/types.ts`, lấy `mll`
làm nền, bổ sung `quality`/`type`/`episodes`/`country`. Task T-3.1.

---

<a id="np-025"></a>
## 🔵 NP-025 — Font nạp trùng 2 lần

**Nhánh:** cả 2 · **File:** `index.html` + `src/index.css` dòng 1

`index.html` có `<link href=".../css2?family=Be+Vietnam+Pro...&family=Manrope...">`
còn `src/index.css` mở đầu bằng `@import url('.../css2?family=Be+Vietnam+Pro...&family=Manrope...&family=JetBrains+Mono...')`.

Hai request tới Google Fonts. Tệ hơn, `@import` trong CSS **chặn render** và chỉ được
phát hiện sau khi tải xong CSS → chậm hơn `<link>` trong `<head>`.

**Sửa:** giữ **duy nhất** `<link>` trong `index.html` (bổ sung JetBrains Mono vào đó),
xoá dòng `@import` khỏi CSS.

---

<a id="np-026"></a>
## 🔵 NP-026 — `OtpInput` dùng ref callback có giá trị trả về

**Nhánh:** `mll` · **File:** `src/features/auth/components/OtpInput.tsx` dòng 57

```tsx
ref={(el) => (refs.current[i] = el)}    // arrow function rút gọn → TRẢ VỀ giá trị gán
```
React 18 bỏ qua giá trị trả về. **React 19 coi giá trị trả về là hàm cleanup** → sẽ ném lỗi.

**Sửa:** thêm ngoặc nhọn để hàm trả `void`:
```tsx
ref={(el) => { refs.current[i] = el; }}
```

---

<a id="np-027"></a>
## 🟡 NP-027 — Không có ErrorBoundary

**Nhánh:** cả 3

Một lỗi khi render (ví dụ `movie.genres.map` trên `movie` là `undefined`) sẽ làm React
gỡ toàn bộ cây component → **trang trắng hoàn toàn**, không thông báo, không nút thử lại.

Rủi ro cụ thể đang tồn tại: `main:MovieSlider` render `movies[idx]` mà không kiểm tra
mảng rỗng — nếu `movies=[]` thì `movie.genres` ném lỗi ngay.

**Sửa:** thêm `<ErrorBoundary>` ở gốc app + `errorElement` cho router (react-router v6.4+
hỗ trợ sẵn `errorElement` trên từng route).

---

<a id="np-028"></a>
## 🟡 NP-028 — Không code-splitting

**Nhánh:** `mll` · **File:** `src/routes/index.tsx`

Mọi trang được `import` tĩnh ở đầu file → toàn bộ ứng dụng (kể cả trang admin, trang đổi
mật khẩu, 472 dòng dữ liệu phim) nằm trong **một bundle duy nhất** tải ngay từ lần vào đầu.

**Sửa:** `React.lazy` + `<Suspense>` cho các route ít dùng:
```tsx
const AdminPage = lazy(() => import('@/pages/AdminPage'));
```
Ưu tiên tách: `/admin`, các trang auth, `/watch/:id`.

---

<a id="np-029"></a>
## 🔵 NP-029 — Logo/favicon vẫn là placeholder CRA

**Nhánh:** cả 3 · **File:** `public/favicon.ico`, `public/logo192.png`, `public/logo512.png`

`project/README.md` đã ghi rõ: *"Brand assets: bản gốc (placeholder PWA của CRA, rất nên thay)"*.
Cần chủ dự án cung cấp logo NovaPlay chính thức. Trong lúc chờ, `NovaPlayLogo`/`Logo`
(SVG dựng bằng code) vẫn dùng tạm được.

Ngoài ra `main` không có `public/manifest.json` (nhánh `bak` có) → không cài được như PWA.

---

<a id="np-030"></a>
## 🔵 NP-030 — Footer ghi cứng "© 2025"

**Nhánh:** `main` · **File:** `src/components/Footer.tsx`

```tsx
<span>© 2025 NovaPlay. Nội dung phim thuộc bản quyền...</span>
```
Hiện đã là 2026.

**Sửa:**
```tsx
const year = new Date().getFullYear();
const range = year > APP.COPYRIGHT_START_YEAR ? `${APP.COPYRIGHT_START_YEAR}–${year}` : `${year}`;
<span>© {range} NovaPlay. ...</span>
```

---

## Thứ tự xử lý đề xuất

**Đợt 1 — chặn release (làm ngay):** NP-001, NP-002, NP-021
**Đợt 2 — trước khi hợp nhất:** NP-005, NP-023, NP-008, NP-024
**Đợt 3 — trong lúc hợp nhất:** NP-003, NP-006, NP-012, NP-019, NP-015, NP-027, NP-028
**Đợt 4 — dọn dẹp:** NP-004, NP-007, NP-009, NP-010, NP-011, NP-013, NP-014, NP-016, NP-022
**Đợt 5 — nhỏ:** NP-017, NP-018, NP-025, NP-026, NP-029, NP-030
**Cần quyết định từ chủ dự án:** NP-013 (đối chiếu backend), NP-020 (chiến lược lưu token), NP-029 (logo)
