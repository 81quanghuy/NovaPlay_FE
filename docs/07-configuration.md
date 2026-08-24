# 07 — Common setting nằm ở đâu

Đây là câu trả lời trực tiếp cho câu hỏi *"common setting ở đâu?"*.

## 🔴 Trả lời ngắn: **KHÔNG CÓ CHỖ TẬP TRUNG NÀO.**

Cấu hình đang rải ra 8 nơi khác nhau và có 2 chỗ **trùng lặp giá trị**.
Đây là nguyên nhân gốc khiến dự án khó bảo trì.

---

## 7.1 Bản đồ cấu hình hiện tại

| Loại cấu hình | Nhánh | Vị trí thật | Vấn đề |
|---|---|---|---|
| Base URL API | `mll` | `src/lib/api/client.ts` dòng 11 | Fallback `'http://localhost:8080/api/v1'` **hardcode lẫn trong code** |
| Danh sách endpoint | `mll` | `src/lib/api/endpoints.ts` | ✅ Đúng — giữ mẫu này |
| Biến môi trường | `mll` | `.env.example` (đúng **1** biến) | Không có `.env` thật trong repo; `main` không có file nào |
| Khai báo type cho env | `mll` | `src/vite-env.d.ts` | ✅ Đúng, nhưng chỉ khai báo 1 biến |
| Design token (CSS) | `main` | `src/index.css` `:root` | Nguồn #1 |
| Design token (CSS) | `mll` | `src/styles/colors_and_type.css` | Nguồn #2 — **cùng nội dung, 2 file** |
| Design token (Tailwind) | `mll` | `tailwind.config.js` | Nguồn #3 — **chép tay lại toàn bộ hex** |
| Design token (gốc) | — | `project/colors_and_type.css` | Nguồn #4 (chỉ tham khảo) |
| Storage key | `mll` | `src/store/refreshTokenStorage.ts` (`'novaplay.refresh_token'`) | Chuỗi rời |
| Storage key | `mll` | `src/features/movies/store/watchlistStore.ts` (`'novaplay.watchlist'`) | Chuỗi rời |
| Feature flag | `mll` | `src/routes/AuthBootstrap.tsx` `const DEV_BYPASS_AUTH = true` | 🔴 **Hardcode trong file logic** — NP-001 |
| Alias import | `mll` | `vite.config.ts` + `tsconfig.json` | ✅ Đúng (phải khai ở **cả hai**) |
| Alias import | `main` | — | ❌ Không có |
| Hằng số nghiệp vụ | `bak` | `src/constants/appConfig.js` | ❌ **Đã mất** ở gen 3 & 4 |
| Regex validation | `bak` | `src/constants/regex.js` | ❌ **Đã mất** ở gen 3 & 4 |
| Cấu hình Keycloak | `bak` | `.env` (đã commit nhầm) + `src/services/keycloak.ts` | ❌ Đã bỏ |
| Font | cả 2 | `index.html` `<link>` **và** `src/index.css` `@import` | Nạp trùng 2 lần — NP-025 |

---

## 7.2 Các hằng số đang bị "chôn" trong code

Đây là những giá trị **nên nằm trong config nhưng đang viết thẳng vào component**.
Khi cần đổi, phải đi tìm từng chỗ.

### Nhánh `main`

| Giá trị | Ý nghĩa | Xuất hiện tại |
|---|---|---|
| `1760` | max-width container | `Navbar.tsx`, `MovieSlider.tsx`, `MovieRows.tsx` ×2, `Footer.tsx`, `MovieDetailScreen.tsx` ×2 — **7 chỗ** |
| `64` | chiều cao navbar | `Navbar.tsx`, `MovieSlider.tsx` (`marginTop: -64`) |
| `80` / `48` | padding ngang | rải rác 6 chỗ |
| `6500` | chu kỳ auto-play slider (ms) | `MovieSlider.tsx` |
| `250` | thời gian hiệu ứng chuyển slide | `MovieSlider.tsx` |
| `6` | số card hiển thị mỗi hàng (`VISIBLE`) | `MovieRows.tsx` |
| `200` + `18` | rộng card + gap, dùng tính bước dịch | `MovieRows.tsx` |
| `380` | bước cuộn Top10 (`STEP`) | `MovieRows.tsx` |
| `30` | ngưỡng scrollY đổi nền navbar | `Navbar.tsx` |
| `12` | số tập cứng | `MovieDetailScreen.tsx` |
| `#ff2c55` | màu thương hiệu | **~20 chỗ** trên toàn bộ src |
| `#07090f` | màu nền | ~12 chỗ |
| `'Manrope,sans-serif'` | font display | ~8 chỗ |
| `© 2025` | năm bản quyền | `Footer.tsx` (đã lỗi thời) |
| Danh sách 7 thể loại | menu | `Navbar.tsx` |
| Danh sách 5 quốc gia | menu | `Navbar.tsx` |
| 18 link footer | menu | `Footer.tsx` |
| URL ảnh Dune | nền màn login | `LoginScreen.tsx` |

### Nhánh `merge-login-logic`

| Giá trị | Ý nghĩa | Xuất hiện tại |
|---|---|---|
| `'http://localhost:8080/api/v1'` | fallback API | `lib/api/client.ts` |
| `true` | DEV_BYPASS_AUTH | `routes/AuthBootstrap.tsx` 🔴 |
| `'novaplay.refresh_token'` | storage key | `store/refreshTokenStorage.ts` |
| `'novaplay.watchlist'` | storage key | `features/movies/store/watchlistStore.ts` |
| `250` | debounce tìm kiếm (ms) | `features/movies/pages/SearchPage.tsx` |
| `12` | số phim liên quan | `features/movies/pages/MovieDetailPage.tsx` |
| `5` | skew giây khi kiểm tra hạn JWT | `utils/tokenUtils.ts` |
| `8` | độ dài mật khẩu tối thiểu | `features/auth/schemas.ts` |
| `6` | độ dài OTP | `schemas.ts` + `OtpInput.tsx` (**2 chỗ, dễ lệch**) |
| `3` / `30` | độ dài username min/max | `schemas.ts` |
| URL ảnh TMDB Dune | nền AuthLayout | `features/auth/components/AuthLayout.tsx` |
| URL ảnh TMDB khác | nền HomePage | `pages/HomePage.tsx` |
| `1440px` | `maxWidth.container` | `tailwind.config.js` (**mâu thuẫn với 1760 ở `main`**) |

---

## 7.3 Vấn đề trùng lặp design token (nghiêm trọng nhất)

Cùng một giá trị màu tồn tại ở 3–4 nơi:

```
project/colors_and_type.css      --np-primary: #ff2c55      (bản gốc thiết kế)
        │
main:src/index.css               --np-primary: #ff2c55      (bản chép 1)
        │  nhưng component lại viết thẳng '#ff2c55' ~20 lần → biến gần như vô dụng
        │
mll:src/styles/colors_and_type.css  --np-primary: #ff2c55   (bản chép 2)
        │
mll:tailwind.config.js           primary: { DEFAULT: '#ff2c55', ... }   (bản chép 3 — CHÉP TAY)
```

**Muốn đổi màu thương hiệu hôm nay:** phải sửa 3 file config + ~20 chỗ hardcode.
**Sau khi sửa theo đề xuất §7.5:** sửa 1 dòng.

Tương tự với:
- Container width: `1760px` (`main:index.css`, và hardcode 7 chỗ) vs `1440px`
  (`mll:tailwind.config.js`) vs `1440px` (đặc tả `project/README.md`). **Ba giá trị khác nhau.**
- Font stack: khai báo trong `index.css`, khai báo lại trong `tailwind.config.js`,
  và hardcode `'Manrope,sans-serif'` ~8 chỗ trong component.

---

## 7.4 Mẫu tốt đã từng có (nhánh `backup_main`)

```js
// bak:src/constants/appConfig.js
export const APP_CONFIG = {
  API_URL: import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api',  // ⚠️ NP-018
  APP_NAME: 'NovaPLay',                      // ⚠️ sai chính tả: "NovaPLay"
  DEFAULT_LANGUAGE: 'vi',
  SUPPORTED_LANGUAGES: ['vi', 'en'],
  DEFAULT_CURRENCY: 'VND',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  TOKEN_KEY: 'token', USER_KEY: 'user', THEME_KEY: 'theme',
  DEFAULT_THEME: 'light',
};
```

```js
// bak:src/constants/regex.js
export const REGEX = { EMAIL, PASSWORD, PHONE, USERNAME, URL, HEX_COLOR,
                       DATE, TIME, PRICE, PERCENTAGE, ALPHANUMERIC, ALPHABETIC, NUMERIC };
```

**Ý tưởng đúng, thực thi sai** ở 3 điểm:
1. `REACT_APP_` là tiền tố của Create React App. Vite **chỉ** expose biến bắt đầu bằng
   `VITE_`. Nên `import.meta.env.REACT_APP_API_URL` **luôn `undefined`** → luôn dùng fallback
   `localhost:3001`. Xem NP-018.
2. File `.js` (không type). Nên là `.ts` để có autocomplete và chống gõ sai key.
3. Trộn hằng số hạ tầng (`API_URL`) với hằng số UI (`DEFAULT_THEME`) trong một object.

---

## 7.5 Đề xuất: `src/config/` là nguồn sự thật duy nhất

```
src/config/
  env.ts             # đọc + validate import.meta.env — DUY NHẤT một nơi được đụng vào env
  app.config.ts      # hằng số ứng dụng & UI
  storage-keys.ts    # tất cả key localStorage/sessionStorage
  feature-flags.ts   # cờ bật/tắt tính năng, đọc từ env
  regex.ts           # regex validation (port từ bak:)
  nav.config.ts      # menu điều hướng, footer link, danh sách quốc gia
  index.ts           # barrel re-export
```

### `src/config/env.ts`

```ts
/**
 * Nơi DUY NHẤT được phép đọc import.meta.env.
 * Mọi file khác import từ đây. Thiếu biến bắt buộc → ném lỗi ngay lúc khởi động,
 * thay vì lỗi mơ hồ lúc user bấm nút.
 */
function required(key: keyof ImportMetaEnv): string {
  const v = import.meta.env[key];
  if (!v) throw new Error(`[config] Thiếu biến môi trường bắt buộc: ${key}`);
  return v;
}
function optional(key: keyof ImportMetaEnv, fallback: string): string {
  return import.meta.env[key] ?? fallback;
}

export const ENV = {
  API_URL:  optional('VITE_API_URL', 'http://localhost:8080/api/v1'),
  APP_ENV:  optional('VITE_APP_ENV', import.meta.env.MODE),   // 'development' | 'staging' | 'production'
  IS_DEV:   import.meta.env.DEV,
  IS_PROD:  import.meta.env.PROD,
} as const;
```

Kèm cập nhật `src/vite-env.d.ts`:
```ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_ENV?: 'development' | 'staging' | 'production';
  readonly VITE_AUTH_BYPASS?: 'true' | 'false';
}
```

### `src/config/app.config.ts`

```ts
export const APP = {
  NAME: 'NovaPlay',
  DESCRIPTION: 'Xem phim trực tuyến',
  LOCALE: 'vi-VN',
  COPYRIGHT_START_YEAR: 2025,          // Footer tính năm hiện tại từ đây, không hardcode
} as const;

export const LAYOUT = {
  CONTAINER_MAX_WIDTH: 1440,           // ⚠️ CHỐT MỘT GIÁ TRỊ — xem NP-008
  NAVBAR_HEIGHT: 64,
  NAVBAR_SCROLL_THRESHOLD: 30,
} as const;

export const UI = {
  HERO_AUTOPLAY_MS: 6500,
  HERO_TRANSITION_MS: 250,
  SEARCH_DEBOUNCE_MS: 250,
  ROW_VISIBLE_CARDS: 6,
  RELATED_MOVIES_LIMIT: 12,
  TOP_LIST_SIZE: 10,
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  OTP_LENGTH: 6,                       // schemas.ts VÀ OtpInput.tsx cùng đọc từ đây
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 24,
  MAX_PAGE_SIZE: 100,
} as const;
```

### `src/config/storage-keys.ts`

```ts
const PREFIX = 'novaplay';
export const STORAGE_KEYS = {
  REFRESH_TOKEN: `${PREFIX}.refresh_token`,
  WATCHLIST:     `${PREFIX}.watchlist`,
  THEME:         `${PREFIX}.theme`,
  RECENT_SEARCH: `${PREFIX}.recent_search`,
} as const;
```
> Gom về một chỗ để: (1) không gõ sai chuỗi, (2) có thể xoá sạch dữ liệu app khi đăng xuất
> bằng cách duyệt `Object.values(STORAGE_KEYS)`.

### `src/config/feature-flags.ts`

```ts
import { ENV } from './env';

export const FLAGS = {
  /**
   * 🔴 Bỏ qua đăng nhập, tạo phiên admin giả. CHỈ dùng khi phát triển local.
   * Có 2 lớp khoá: phải là bản dev VÀ phải bật biến môi trường.
   * Bản production build sẽ luôn cho ra false → tree-shake luôn code bypass.
   */
  AUTH_BYPASS: ENV.IS_DEV && import.meta.env.VITE_AUTH_BYPASS === 'true',
} as const;
```

### `src/config/nav.config.ts`

Chuyển `NAV_LINKS` (từ `main:Navbar.tsx`) và `FOOTER_COLS` (từ `main:Footer.tsx`) vào đây;
danh sách thể loại đọc từ `GENRES` của module movies để không có 2 danh sách lệch nhau.

---

## 7.6 Đề xuất: một nguồn design token duy nhất

**Bước 1** — giữ đúng **một** file CSS token: `src/styles/tokens.css` (dùng bản
`mll:src/styles/colors_and_type.css`, đầy đủ hơn). Xoá `main:src/index.css :root`.

**Bước 2** — `tailwind.config.js` **trỏ vào biến CSS**, không chép hex:

```js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      { DEFAULT: 'var(--np-bg)',      2: 'var(--np-bg-2)' },
        surface: { DEFAULT: 'var(--np-surface)', 2: 'var(--np-surface-2)', 3: 'var(--np-surface-3)' },
        primary: { DEFAULT: 'var(--np-primary)', hover: 'var(--np-primary-hover)',
                   press: 'var(--np-primary-press)', soft: 'var(--np-primary-soft)' },
        gold:    { DEFAULT: 'var(--np-gold)', soft: 'var(--np-gold-soft)' },
        // ...
      },
      maxWidth: { container: 'var(--np-container)' },
    },
  },
};
```

> ⚠️ Lưu ý kỹ thuật: dùng `var()` trong Tailwind thì **opacity modifier** (`bg-primary/20`)
> sẽ không hoạt động với giá trị hex thường. Nếu cần `/20`, khai báo biến dạng kênh:
> `--np-primary-rgb: 255 44 85;` rồi `primary: 'rgb(var(--np-primary-rgb) / <alpha-value>)'`.
> Code hiện tại **đang dùng** `bg-primary/10`, `border-danger/40`, `ring-primary/30` ở
> `Alert.tsx`, `FormField.tsx`, `OtpInput.tsx` → **bắt buộc** dùng dạng kênh RGB.

**Bước 3** — cấm hardcode hex trong `.tsx`. Thêm rule ESLint chặn
(xem [12-agent-playbook.md](12-agent-playbook.md) §12.6).

---

## 7.7 File `.env` cần có

```bash
# .env.example  (commit vào git)
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_ENV=development
VITE_AUTH_BYPASS=false

# .env.local    (KHÔNG commit — đã có trong .gitignore: .env, .env.*)
```

⚠️ Nhánh `backup_main` đã commit nhầm file `.env` vào git (NP-017). `.gitignore` hiện tại
của `main` đã chặn đúng (`.env`, `.env.*`) — **giữ nguyên**, và nhớ rằng
`.env.example` bị chặn theo. Cần thêm ngoại lệ:
```gitignore
.env
.env.*
!.env.example
```

---

## 7.8 Bảng tra nhanh cho AI agent: "hằng số này đặt ở đâu?"

| Bạn đang cần thêm... | Đặt vào |
|---|---|
| URL backend, key bên thứ ba | `config/env.ts` (đọc từ `.env`) |
| Bật/tắt tính năng | `config/feature-flags.ts` |
| Key localStorage | `config/storage-keys.ts` |
| Đường dẫn API mới | `lib/api/endpoints.ts` |
| Số ms debounce, số item mỗi trang, độ dài tối thiểu | `config/app.config.ts` |
| Regex validation | `config/regex.ts` |
| Menu, link footer, danh sách quốc gia | `config/nav.config.ts` |
| Màu, font, spacing, radius, shadow, easing | `styles/tokens.css` (+ tailwind trỏ vào) |
| Text hiển thị cho user | Ngay tại component (chưa có i18n). Nếu lặp ≥3 lần → `config/messages.ts` |
| Kiểu dữ liệu API | `lib/api/types.ts` |
| Kiểu dữ liệu domain | `features/<tên>/types.ts` |

**Không bao giờ** đặt hằng số cấu hình trực tiếp trong file component, hook, hay service.
