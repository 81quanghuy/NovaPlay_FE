# 04 — Module Auth

> **Nhánh:** `origin/claude/merge-login-logic-1l6po` (ký hiệu `mll:`)
> Không có gì trong file này tồn tại trên `main`.
> Đọc file bằng: `git show origin/claude/merge-login-logic-1l6po:<path>`

Đây là module hoàn chỉnh nhất của dự án: 22 file, ~1000 dòng, phủ 10 use case.

---

## 4.1 Sơ đồ luồng

```
                    ┌──────────────── App khởi động ─────────────────┐
                    │  main.tsx → App.tsx → <AuthBootstrap>          │
                    │  AuthBootstrap đọc refresh_token từ localStorage│
                    │    ├─ không có  → status = 'unauthenticated'    │
                    │    └─ có        → POST /auth/refresh-token      │
                    │                   → GET /auth/me                │
                    │                   → status = 'authenticated'    │
                    │  (đang bị DEV_BYPASS chặn — xem NP-001)         │
                    └────────────────────────────────────────────────┘

ĐĂNG KÝ
  RegisterPage --useRegister--> POST /auth/register
      └─ 200 → navigate(`/verify-otp?email=...`, replace)
  VerifyOtpPage --useOtpVerify--> POST /auth/verify-otp
      ├─ 200 → navigate('/login', { state: { flash: 'Xác thực thành công...' } })
      └─ resend → POST /auth/resend-registration-otp

ĐĂNG NHẬP
  LoginPage --useLogin--> POST /auth/login
      └─ 200 → authStore.setAuth(res)   [lưu refresh_token vào localStorage]
             → navigate(location.state.from?.pathname ?? '/', replace)

QUÊN MẬT KHẨU
  ForgotPasswordPage --useForgotPassword--> POST /auth/forgot-password
      └─ 200 → navigate(`/reset-password?email=...`)
  ResetPasswordPage --useResetPassword--> POST /auth/reset-password
      └─ 200 → navigate('/login', { state: { flash: 'Mật khẩu đã được đặt lại...' } })

ĐỔI MẬT KHẨU (đã đăng nhập)
  ChangePasswordPage --useChangePassword--> POST /auth/change-password  (có Bearer)
      └─ 200 → success = true (ở lại trang, hiện Alert)

ĐĂNG XUẤT
  Navbar/HomePage --useLogout--> POST /auth/logout { refresh_token }
      └─ finally → authStore.reset() → navigate('/login', replace)

TỰ ĐỘNG GIA HẠN (interceptor)
  bất kỳ request nào → 401 → performRefresh() → POST /auth/refresh-token
      ├─ ok   → gắn token mới → retry request gốc
      └─ fail → authStore.reset()   [⚠️ không điều hướng — NP-021]
```

---

## 4.2 Hợp đồng API — `mll:src/lib/api/endpoints.ts`

```ts
export const ENDPOINTS = {
  auth: {
    register:       '/auth/register',
    verifyOtp:      '/auth/verify-otp',
    resendOtp:      '/auth/resend-registration-otp',
    login:          '/auth/login',
    refresh:        '/auth/refresh-token',
    logout:         '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword:  '/auth/reset-password',
    changePassword: '/auth/change-password',
    me:             '/auth/me',
  },
} as const;
```

| Endpoint | Method | Auth header | Request body | Response |
|---|---|---|---|---|
| `/auth/register` | POST | ❌ | `RegisterRequest` | `UserResponse` |
| `/auth/verify-otp` | POST | ❌ | `VerifyOtpRequest` | `void` |
| `/auth/resend-registration-otp` | POST | ❌ | `EmailRequest` | `void` |
| `/auth/login` | POST | ❌ | `LoginRequest` | `AuthResponse` |
| `/auth/refresh-token` | POST | ❌ | `{ refresh_token }` | `AuthResponse` |
| `/auth/logout` | POST | ✅ | `{ refresh_token }` | `void` |
| `/auth/forgot-password` | POST | ❌ | `EmailRequest` | `void` |
| `/auth/reset-password` | POST | ❌ | `ResetPasswordRequest` | `void` |
| `/auth/change-password` | POST | ✅ | `ChangePasswordRequest` | `void` |
| `/auth/me` | GET | ✅ | — | `UserResponse` |

Base URL: `import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'`

---

## 4.3 Kiểu dữ liệu — `mll:src/lib/api/types.ts`

```ts
type RoleName = 'ADMIN' | 'USER' | 'MODERATOR' | string;   // ⚠️ | string làm union vô hiệu

interface RoleResponse  { id?, roleName: RoleName, description?, permissions?: {id?, name}[] }

interface UserResponse  { id: string; username: string; email: string;
                          isActive: boolean; isEmailVerified: boolean;
                          lastLoginAt?: string | null; roles: RoleResponse[] }

interface AuthResponse  { access_token: string; refresh_token: string;
                          token_type: string; expires_in: number;
                          user_profile: UserResponse }          // ⚠️ snake_case

interface LoginRequest          { emailOrUsername, password }   // ⚠️ camelCase
interface RegisterRequest       { username, email, password, locale? }
interface VerifyOtpRequest      { email, otp }
interface EmailRequest          { email }
interface ResetPasswordRequest  { email, otp, newPassword, confirmNewPassword }
interface ChangePasswordRequest { currentPassword, newPassword, confirmNewPassword }
interface RefreshTokenRequest   { refresh_token }
interface ApiErrorBody          { code?, message?, errors?: Record<string, string[]> }
```

> ⚠️ **NP-013**: `AuthResponse` dùng snake_case còn request dùng camelCase. Hoặc backend
> thật sự không nhất quán, hoặc frontend đang map sai. **Cần đối chiếu tài liệu backend.**
>
> ⚠️ `RoleName` khai báo `| string` khiến TypeScript không còn kiểm tra được giá trị hợp lệ.
> Nên bỏ `| string` hoặc dùng `type RoleName = 'ADMIN'|'USER'|'MODERATOR'` + `(string & {})`.
>
> ⚠️ `ApiErrorBody` được khai báo nhưng **không được import ở đâu** — `extractErrorMessage`
> tự khai báo lại kiểu inline `{ message?, error? }`. Trùng lặp và lệch (`error` vs `errors`).

---

## 4.4 HTTP client — `mll:src/lib/api/client.ts` (88 dòng)

```ts
export const apiClient = axios.create({ baseURL: BASE_URL,
                                        headers: { 'Content-Type': 'application/json' } });

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean; _skipAuth?: boolean };
```

**Request interceptor** — bỏ qua nếu `_skipAuth`, ngược lại gắn
`Authorization: Bearer <accessToken từ zustand>`.

**Response interceptor** — khi `401` và chưa `_retry` và không phải endpoint auth
(login/refresh/register):
```ts
original._retry = true;
refreshing = refreshing ?? performRefresh();
const newToken = await refreshing;
refreshing = null;                      // 🔴 BUG NP-002 — xem 09-known-issues
if (newToken) { gắn header mới; return apiClient.request(original); }
```

**Helper export:**
- `extractErrorMessage(err, fallback = 'Có lỗi xảy ra, vui lòng thử lại')` — đọc
  `response.data.message` → `.error` → `err.message` → fallback.
- `postWithoutAuth<T>(url, body, config)` — POST có `_skipAuth: true`.

**Điểm cần chú ý khi sửa file này:**
- `performRefresh()` gọi `axios.post` **trần** (không qua `apiClient`) để tránh vòng lặp
  interceptor — đúng, giữ nguyên cách này.
- Khi refresh fail → `useAuthStore.getState().reset()` rồi trả `null`. Không điều hướng.
- Kiểm tra `isAuthEndpoint` bằng `url.includes(...)` — mong manh, nếu sau này có
  `/auth/login-history` sẽ khớp nhầm. Nên so sánh chính xác hoặc dùng cờ trên config.

---

## 4.5 State — `mll:src/store/authStore.ts` (51 dòng)

```ts
type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  accessToken: string | null;      // chỉ trong memory — mất khi F5 (đúng, an toàn hơn)
  user: UserResponse | null;
  status: AuthStatus;
  setStatus, setAuth, setAccessToken, setUser, reset
}
```

- `setAuth(res)` → ghi `refresh_token` xuống localStorage **và** set state, status = `authenticated`.
- `reset()` → xoá localStorage + về `unauthenticated`.
- Helper ngoài store: `hasRole(user, role)`, `hasAnyRole(user, roles)`, `getAccessToken()`.
  - ⚠️ `hasAnyRole(user, [])` trả `!!user` — mảng rỗng nghĩa là "chỉ cần đăng nhập".
    Hành vi này **phải giữ**, `RoleGuard` phụ thuộc vào nó.

### `mll:src/store/refreshTokenStorage.ts` (25 dòng)
Wrapper `localStorage` với key `'novaplay.refresh_token'`, mọi thao tác bọc `try/catch`
(an toàn khi trình duyệt chặn storage). Xem rủi ro XSS ở **NP-020**.

### `mll:src/utils/tokenUtils.ts` (25 dòng) — ⚠️ DEAD CODE
`parseJwt(token)` và `isExpired(token, skewSec = 5)`. **Không file nào import.**
Chiến lược hiện tại là refresh phản ứng (đợi 401) chứ không chủ động (kiểm tra `exp`).
Hoặc dùng nó để refresh sớm, hoặc xoá. Xem **NP-022**.
Lưu ý: hàm dùng `decodeURIComponent(escape(json))` — `escape()` đã deprecated.

---

## 4.6 Validation — `mll:src/features/auth/schemas.ts` (76 dòng)

Quy tắc mật khẩu mạnh dùng chung (`strongPassword`):
`≥ 8 ký tự` + `≥1 chữ hoa` + `≥1 chữ thường` + `≥1 chữ số` + `≥1 ký tự đặc biệt`.

| Schema | Trường | Ràng buộc riêng |
|---|---|---|
| `loginSchema` | emailOrUsername, password, rememberMe? | emailOrUsername ≥ 3 ký tự (trim) |
| `registerSchema` | username, email, password, confirmPassword, accept | username 3–30, regex `^[A-Za-z0-9_.-]+$`; accept phải `true`; confirm phải khớp |
| `otpSchema` | otp | `^\d{6}$` |
| `emailSchema` | email | email hợp lệ (trim) |
| `resetPasswordSchema` | email, otp, newPassword, confirmNewPassword | confirm khớp |
| `changePasswordSchema` | currentPassword, newPassword, confirmNewPassword | confirm khớp **và** mật khẩu mới ≠ mật khẩu cũ |

Mọi thông điệp lỗi bằng tiếng Việt. Mỗi schema export kèm type `z.infer`.

> ⚠️ `rememberMe` có trong schema và `defaultValues: { rememberMe: true }` của LoginPage,
> nhưng **không được gửi lên API và không ảnh hưởng gì**. Checkbox trang trí.

---

## 4.7 Hook — một hook cho một use case

Cả 7 hook theo đúng một khuôn mẫu, **hãy giữ khuôn mẫu này khi thêm hook mới**:

```ts
export function useXxx() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(values) {
    setIsLoading(true); setError(null);
    try   { await authService.xxx(values); /* điều hướng hoặc set success */ }
    catch (err) { setError(extractErrorMessage(err, '<thông điệp tiếng Việt>')); }
    finally { setIsLoading(false); }
  }
  return { submit, isLoading, error };
}
```

| Hook | Trả về thêm | Sau khi thành công |
|---|---|---|
| `useLogin` | — | `setAuth(res)` → về `location.state.from` hoặc `/` |
| `useRegister` | — | → `/verify-otp?email=...` (replace) |
| `useOtpVerify(email)` | `resend`, `isResending`, `info` | → `/login` + flash |
| `useForgotPassword` | — | → `/reset-password?email=...` |
| `useResetPassword` | — | → `/login` + flash |
| `useChangePassword` | `success`, `reset()` | ở lại trang, `success = true` |
| `useLogout` | `logout`, `isLoading` | `reset()` → `/login` (trong `finally`, luôn chạy) |

`useLogout` gọi `authService.logout(refreshToken).catch(() => undefined)` — API lỗi vẫn
đăng xuất được ở client. **Thiết kế đúng, giữ nguyên.**

---

## 4.8 Bảo vệ route

| File | Logic |
|---|---|
| `ProtectedRoute.tsx` | `status !== 'authenticated'` → `<Navigate to="/login" state={{ from: location }} replace />` |
| `PublicOnly.tsx` | `status === 'authenticated'` → `<Navigate to="/" replace />` |
| `RoleGuard.tsx` | `!hasAnyRole(user, allow)` → `<Navigate to="/403" replace />` |

Dùng lồng nhau qua `<Outlet />`:
```
ProtectedRoute
  └─ RoleGuard allow={['ADMIN']}
       └─ /admin
```

### `AuthBootstrap.tsx` (90 dòng) — 🔴 chứa bug nghiêm trọng nhất dự án

Nhiệm vụ đúng: chặn render cho tới khi biết user đã đăng nhập hay chưa. Dùng
`useRef(started)` để không chạy 2 lần dưới `StrictMode` — **kỹ thuật đúng, giữ lại**.

Khi `status` là `'loading'` hoặc `'idle'` thì render màn chờ (Logo + spinner + "Đang khởi động...").

🔴 Nhưng đầu file (dòng 15) có:
```ts
const DEV_BYPASS_AUTH = true;   // hardcode
```
và khi bật, nó `setAuth(FAKE_AUTH_RESPONSE)` với `access_token: 'dev-bypass-access-token'`,
role `ADMIN` + `USER`. Chi tiết hậu quả: **NP-001**.

---

## 4.9 UI primitive (đang nằm trong `features/auth/components/`)

| Component | Dòng | Mô tả | Vị trí đúng |
|---|---|---|---|
| `Button` | 56 | 3 variant (primary/secondary/ghost) × 3 size (sm/md/lg), `loading` hiện `<Loader2 animate-spin>`, `fullWidth`, `leftIcon`/`rightIcon`, có `focus-visible` outline | `components/ui/` |
| `FormField` | 55 | `forwardRef`, label + leftIcon + rightAdornment + error/hint, `aria-invalid`, tự lấy `id` từ `name` | `components/ui/` |
| `PasswordInput` | 40 | Bọc `FormField`, toggle hiện/ẩn (Eye/EyeOff), `showHintRules` hiện gợi ý quy tắc mật khẩu, nút toggle có `tabIndex={-1}` + `aria-label` | `components/ui/` |
| `OtpInput` | 72 | 6 ô, tự nhảy ô, Backspace lùi, ←/→, **dán được cả mã**, `inputMode="numeric"`, `role="group"` | `components/ui/` |
| `Alert` | 37 | 3 tone success/danger/info + icon lucide, `role="alert"` | `components/ui/` |
| `Logo` | 14 | Ô gradient + chữ "NovaPlay", 3 size | `components/ui/` |
| `AuthLayout` | 80 | Grid 2 cột: aside ảnh Dune + 2 gradient scrim (ẩn dưới `lg`) / form. `variant: 'split' | 'center'` | `components/layout/` |

> ⚠️ **NP-015**: `Button` và `Logo` đang được `HomePage`, `Navbar`, `WatchlistPage`,
> `MovieDetailPage` import xuyên qua `@/features/auth/components/...`. Module movies phụ
> thuộc module auth chỉ vì cái nút. Phải kéo lên `components/ui/`.
>
> ⚠️ `OtpInput` dùng `ref={(el) => (refs.current[i] = el)}` — callback này **trả về giá trị**
> (kết quả phép gán). React 18 chấp nhận, **React 19 sẽ báo lỗi**. Sửa thành
> `ref={(el) => { refs.current[i] = el; }}`. Xem NP-026.

---

## 4.10 Trang

| Trang | Dòng | Điểm đáng chú ý |
|---|---|---|
| `LoginPage` | 93 | react-hook-form + zodResolver; đọc `location.state.flash` để hiện `<Alert tone="success">`; xoá flash bằng `window.history.replaceState({}, '')`; `noValidate` trên form |
| `RegisterPage` | 121 | Form dài nhất: username, email, password (`showHintRules`), confirm, checkbox điều khoản |
| `VerifyOtpPage` | 94 | Lấy email từ query param; dùng `OtpInput`; có nút gửi lại mã (`isResending`, `info`) |
| `ForgotPasswordPage` | 59 | Một ô email |
| `ResetPasswordPage` | 86 | email (từ query) + otp + mật khẩu mới + xác nhận |
| `ChangePasswordPage` | 79 | Trang trong (protected), hiện Alert success tại chỗ |
| `HomePage` | 82 | Hero + bảng thông tin tài khoản từ `/auth/me`. Nút "Khám Phá Phim" **thiếu onClick** (NP-023) |
| `AdminPage` | 24 | Trang giữ chỗ, chỉ ADMIN |
| `ForbiddenPage` | 24 | Trang 403 |

---

## 4.11 Checklist khi sửa module auth

- [ ] Không thêm `useState` cho form — dùng react-hook-form + zod schema có sẵn.
- [ ] Thông điệp lỗi tiếng Việt, đi qua `extractErrorMessage`.
- [ ] Endpoint mới phải thêm vào `ENDPOINTS`, không viết chuỗi trực tiếp.
- [ ] Request không cần token → dùng `postWithoutAuth`.
- [ ] Thêm hook mới → theo đúng khuôn `{ submit, isLoading, error }` ở §4.7.
- [ ] Đụng vào `client.ts` → đọc **NP-002** trước.
- [ ] Đụng vào `AuthBootstrap.tsx` → đọc **NP-001** trước, và **không được** để
      `DEV_BYPASS_AUTH = true` lọt vào commit.
