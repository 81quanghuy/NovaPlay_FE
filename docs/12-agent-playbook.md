# 12 — Playbook cho AI agent

Quy tắc bắt buộc khi làm việc trên repo NovaPlay_FE.
Đọc file này **trước khi viết dòng code đầu tiên**.

---

## 12.1 Trước khi bắt đầu — 5 câu hỏi tự kiểm

1. **Task này thuộc nhánh nào?** Working tree là `main` (chỉ có UI). Nếu task nói về auth,
   API, router, tailwind → code nằm ở `origin/claude/merge-login-logic-1l6po`.
   Xem [02-branch-inventory.md](02-branch-inventory.md) §2.5.
2. **File tôi sắp sửa có bug đã biết không?** Tra [09-known-issues.md](09-known-issues.md).
3. **Có quyết định treo nào chặn task này không?** Xem
   [10-target-architecture.md](10-target-architecture.md) §10.5 (Q1–Q9). Nếu có → **hỏi, đừng đoán**.
4. **Hằng số tôi sắp thêm phải đặt ở đâu?** Tra bảng ở
   [07-configuration.md](07-configuration.md) §7.8.
5. **Đây có phải tính năng mới không?** Nếu có → **hỏi quy mô traffic dự kiến trước khi
   thiết kế** (quy ước dự án trong `CLAUDE.md` gốc). Câu trả lời quyết định: có cần cache,
   phân trang, code-splitting, react-query hay không.

---

## 12.2 ⛔ Không được làm

| Cấm | Lý do |
|---|---|
| Tự chạy `npm run build`, `npm test`, hay bất kỳ lệnh build nào | Quy ước dự án — báo lệnh cho người dùng tự chạy |
| Tự commit / push khi chưa được xác nhận | Quy ước dự án |
| Import bất cứ thứ gì từ `project/` vào `src/` | `project/` là tài liệu thiết kế, không phải code |
| Đọc `import.meta.env` ngoài `src/config/env.ts` | Quy tắc R2 |
| Viết hex màu trong `.tsx` hoặc `tailwind.config.js` | Quy tắc R3 — dùng token |
| Import chéo giữa 2 `features/*` | Quy tắc R4 |
| Viết chuỗi đường dẫn API ngoài `lib/api/endpoints.ts` | Quy tắc R6 |
| Viết chuỗi route ngoài `routes/paths.ts` | Quy tắc R7 |
| Tạo `<div onClick>` cho phần tử tương tác | Quy tắc R10 + NP-014 |
| Để lại nút/link không làm gì | Quy tắc R10 — dùng `disabled` + `title="Sắp ra mắt"` |
| Tạo file ngoài phạm vi task được giao | Quy ước dự án |
| Để `DEV_BYPASS_AUTH = true` lọt vào commit | NP-001 |

---

## 12.3 Quy ước code

### Đặt tên file
| Loại | Quy ước | Ví dụ |
|---|---|---|
| Component | `PascalCase.tsx` | `MovieCard.tsx` |
| Hook | `camelCase.ts` bắt đầu bằng `use` | `useDebounce.ts` |
| Service | `camelCase.ts` kết thúc `Service` | `authService.ts` |
| Store | `camelCase.ts` kết thúc `Store` | `watchlistStore.ts` |
| Config / util | `kebab-case.ts` | `storage-keys.ts`, `feature-flags.ts` |
| Type-only | `types.ts` trong thư mục feature | `features/movies/types.ts` |

### Component
```tsx
// 1. import ngoài
import { useState } from 'react';
import { Star } from 'lucide-react';
// 2. import trong (theo thứ tự: config → lib → components → hooks → features tương đối)
import { UI } from '@/config';
import { Button } from '@/components/ui';
import type { Movie } from '../types';

// 3. interface Props đặt tên `Props` (nội bộ) hoặc `<Tên>Props` (export)
interface Props { movie: Movie; onOpen?: (m: Movie) => void; }

// 4. named export cho component thường; chỉ dùng default export cho trang route
export function MovieCard({ movie, onOpen }: Props) { ... }
```

- **Named export** là mặc định (nhánh `mll` đang làm đúng: `export function LoginPage`).
  Nhánh `main` dùng default export lẫn lộn — khi port thì đổi sang named.
- Props tuỳ chọn dùng `?`, không dùng `| undefined`.
- Import kiểu dùng `import type { ... }` (đã bật `isolatedModules`).

### Hook bất đồng bộ — dùng đúng khuôn có sẵn
```ts
export function useXxx() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(values: Xxx) {
    setIsLoading(true); setError(null);
    try { ... }
    catch (err) { setError(extractErrorMessage(err, 'Thông điệp tiếng Việt')); }
    finally { setIsLoading(false); }
  }
  return { submit, isLoading, error };
}
```

### Form
Luôn dùng `react-hook-form` + `zodResolver` + schema trong `schemas.ts`.
**Không** tự viết `useState` cho từng ô input.

### Zustand
```ts
const user = useAuthStore((s) => s.user);          // ✅ selector — chỉ re-render khi user đổi
const store = useAuthStore();                       // ❌ lấy cả store — re-render mọi lúc
useWatchlistStore((s) => s.ids.includes(id));      // ✅ reactive
useWatchlistStore.getState().has(id);              // ❌ không reactive trong render
```

### Tailwind
- Thứ tự class: layout → spacing → kích thước → typography → màu → hiệu ứng → trạng thái
- Dùng token: `bg-bg`, `text-fg-2`, `border-border`, `rounded-pill`, `shadow-poster`,
  `duration-base`, `ease-np-out`, `max-w-container`
- Class dài lặp ≥ 3 lần → tách thành component hoặc hằng số `const base = '...'`
  (xem `Button.tsx` làm mẫu tốt)

---

## 12.4 Ngôn ngữ hiển thị

Mọi text người dùng thấy là **tiếng Việt**. Xem quy tắc đầy đủ ở
[08-design-system.md](08-design-system.md) §8.12.

Nhắc nhanh:
- Tiêu đề section & nút: **Title Case Tiếng Việt** — "Phim Mới Cập Nhật", "Xem Phim"
- Body & thông báo: sentence case — "Bạn có 2 bình luận mới"
- Gọi người dùng là **"bạn"**, không xưng "chúng tôi"
- Không emoji trong UI
- Thời lượng: `141 phút` (không "min"), rating: `8.4` (1 chữ số thập phân)

Thông điệp lỗi phải cụ thể và hành động được:
- ❌ "Đã xảy ra lỗi"
- ✅ "Mã OTP không đúng hoặc đã hết hạn. Bấm Gửi lại mã để nhận mã mới."

---

## 12.5 Hiệu năng & an toàn runtime — checklist bắt buộc

Trước khi báo hoàn thành, rà lại:

| Hạng mục | Kiểm tra |
|---|---|
| **Timer** | Mọi `setInterval`/`setTimeout` đều được clear trong cleanup của `useEffect`? (NP-003) |
| **Listener** | Mọi `addEventListener` đều có `removeEventListener`? Scroll/resize có `{ passive: true }` + throttle rAF? |
| **Race condition** | Có 2 lời gọi async cùng ghi vào một state không? (NP-002) |
| **Null safety** | Truy cập `movie.genres.map` — `movie` chắc chắn tồn tại? Mảng có thể rỗng? |
| **Dependency** | `useEffect` deps đủ và ổn định? Không đưa object/array literal vào deps? |
| **Re-render** | Zustand dùng selector? `useMemo` cho tính toán nặng? |
| **Danh sách lớn** | `key` ổn định (không dùng index nếu danh sách thay đổi thứ tự)? Cần ảo hoá không? |
| **Ảnh** | Có `loading="lazy"`? Có `onError` fallback? (NP-007) |
| **Ba trạng thái** | loading / error / empty đều được render? (R9) |
| **Bundle** | Route ít dùng có `React.lazy`? (NP-028) |

---

## 12.6 Lệnh tự kiểm tra quy tắc

Chạy trước khi báo hoàn thành (đây là lệnh đọc, không phải lệnh build — được phép chạy):

```bash
# R2 — env chỉ đọc ở config/env.ts
grep -rn "import.meta.env" src/ | grep -v "src/config/env.ts" | grep -v "vite-env.d.ts"

# R3 — không hex trong tsx / tailwind config
grep -rniE "#[0-9a-f]{3,8}\b" src/ --include="*.tsx" tailwind.config.js

# R4 — không import chéo feature
grep -rn "from '@/features/" src/features/

# R6 — đường dẫn API chỉ ở endpoints.ts
grep -rn "'/auth/\|'/movies/" src/ | grep -v "endpoints.ts"

# R7 — route chỉ ở paths.ts
grep -rn "to=\"/\|navigate('/" src/ | grep -v "paths.ts"

# R10 — không nút chết
grep -rn "preventDefault()" src/ --include="*.tsx"
grep -rn "onClick={() => {}}" src/

# NP-001 — không backdoor
grep -rn "DEV_BYPASS\|FAKE_ADMIN" src/

# Storage key chỉ ở config
grep -rn "'novaplay\." src/ | grep -v "storage-keys.ts"

# Không còn dead code đã biết
grep -rn "tokenUtils" src/
```

Tất cả phải trả về rỗng (hoặc chỉ trả về file được phép).

---

## 12.7 Định dạng commit

```
<type>(<scope>): <mô tả ngắn tiếng Việt>

<thân, nếu cần: vì sao, không phải cái gì>

Refs: NP-002, T-1.2
```

`type`: `feat` `fix` `refactor` `chore` `docs` `perf` `style` `test`
`scope`: `auth` `movies` `ui` `config` `routes` `docs` `build`

Ví dụ:
```
fix(auth): sửa race condition khi gia hạn token

Reset biến `refreshing` trong .finally() của chính promise thay vì ở nhánh
caller, để nhiều request 401 song song chỉ kích hoạt một lần refresh.
Trước đây với backend có rotation, lần refresh thứ hai làm người dùng bị
đăng xuất ngẫu nhiên.

Refs: NP-002, T-1.2
```

---

## 12.8 Trước khi báo "xong"

- [ ] Đã chạy hết lệnh tự kiểm ở §12.6, kết quả sạch
- [ ] Đã rà checklist runtime ở §12.5
- [ ] Đã đáp ứng đủ DoD của task trong [11-migration-plan.md](11-migration-plan.md)
- [ ] Đã cập nhật docs liên quan **trong cùng commit**
- [ ] Nếu fix bug → đã đánh dấu `✅ ĐÃ FIX (commit <hash>)` trong
      [09-known-issues.md](09-known-issues.md)
- [ ] Nếu xong task → đã tick checkbox trong [11-migration-plan.md](11-migration-plan.md)
- [ ] **Đã báo cho người dùng lệnh cần chạy để verify** (`npm run typecheck`,
      `npm run lint`, `npm run build`) — **không tự chạy**
- [ ] Nếu có phần chưa làm được → nói rõ phần nào và vì sao, **không** báo xong một nửa

---

## 12.9 Khi phát hiện vấn đề mới

Không im lặng bỏ qua (quy ước dự án). Quy trình:

1. Thêm mục mới vào [09-known-issues.md](09-known-issues.md) với ID kế tiếp (`NP-031`, …)
2. Ghi đủ: mức độ, nhánh, `file:dòng`, mô tả, cách tái hiện, hậu quả, cách sửa đề xuất, DoD
3. Thêm vào bảng tổng hợp đầu file và mục "Thứ tự xử lý đề xuất" cuối file
4. Nếu nằm ngoài phạm vi task đang làm → **báo cho người dùng, không tự ý sửa lan man**

---

## 12.10 Bảng tra nhanh

| Tôi cần… | Đọc |
|---|---|
| Biết dự án đang có gì | [01](01-project-overview.md) §1.7 |
| Tìm code của tính năng X | [02](02-branch-inventory.md) §2.5 |
| Hiểu màn hình ở `main` | [03](03-feature-ui-shell.md) |
| Hiểu luồng auth | [04](04-feature-auth.md) §4.1 |
| Hiểu module movies | [05](05-feature-movies.md) |
| Biết component nào dùng chung | [06](06-common-and-shared.md) |
| Biết đặt hằng số ở đâu | [07](07-configuration.md) §7.8 |
| Biết dùng màu/font/spacing nào | [08](08-design-system.md) |
| Tra bug NP-xxx | [09](09-known-issues.md) |
| Biết file mới đặt ở đâu | [10](10-target-architecture.md) §10.1 |
| Nhận task cụ thể | [11](11-migration-plan.md) |
