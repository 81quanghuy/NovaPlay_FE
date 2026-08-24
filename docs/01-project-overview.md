# 01 — Tổng quan dự án

## 1.1 Sản phẩm

**NovaPlay** (codename cũ trong codebase: `cinema-zone`) là website xem phim trực tuyến
tiếng Việt, giao diện tối (dark theme), lấy cảm hứng thị giác từ rophim10.org và Netflix.

Phạm vi nghiệp vụ đã từng xuất hiện trong các thế hệ code:
- Duyệt phim theo thể loại / quốc gia / diễn viên
- Phim lẻ, phim bộ (nhiều tập), phim sắp chiếu
- Xem online nhiều mức chất lượng (CAM → 4K), Vietsub / lồng tiếng
- Danh sách yêu thích (watchlist)
- Tài khoản: đăng ký, xác thực OTP email, đăng nhập, quên/đặt lại/đổi mật khẩu
- Phân quyền theo role (ADMIN / USER / MODERATOR)
- (Thế hệ cũ) Đặt vé + chọn ghế — đã bị bỏ

Ngôn ngữ UI: **tiếng Việt thuần**. Xem quy tắc microcopy ở [08-design-system.md](08-design-system.md).

---

## 1.2 Bốn thế hệ codebase

Repo này đã bị viết lại 4 lần. Hiểu lịch sử này là bắt buộc, vì code của các thế hệ
vẫn còn sống song song trên các nhánh khác nhau.

```
Gen 1  8046a51  Create React App scaffold                        (đã chết)
   │
Gen 2  687060a → 2a77c57  "cinema-zone": CRA→Vite, Keycloak,     → origin/backup_main
   │              Tailwind, booking/seat, profile
   │
Gen 3  b592cde  Claude Design handoff (project/ prototypes)
   │  33588fd  Rewrite từ đầu: Vite + React + TS, inline style   → main
   │  b5d91e0  chỉnh maxWidth/padding
   │  3f84d35  merge PR #1
   │
Gen 4  7d4bf16 → 627aa4f  Thêm Tailwind + auth + movies lên      → origin/claude/
              trên Gen 3, xoá scaffold Gen 3                        merge-login-logic-1l6po
```

**Điểm mấu chốt:** Gen 4 nhánh ra từ Gen 3 (`3f84d35`) và đã **xoá toàn bộ UI của Gen 3**
bằng 7 commit `chore: remove orphan scaffold ...` (HomeScreen, MovieDetailScreen, LoginScreen,
Footer, MovieCard, MovieRows, MovieSlider, data.ts). Nghĩa là giao diện đẹp ở `main`
hiện **không tồn tại** trên nhánh có logic.

---

## 1.3 Stack matrix theo nhánh

| Thư viện | `main` | `merge-login-logic` | `backup_main` |
|---|---|---|---|
| React | 18.3.1 | 18.3.1 | 18.2.0 |
| TypeScript | 5.5.3 | 5.5.3 | 5.x |
| Vite | 5.4.2 | 5.4.2 | 5.x |
| Router | ❌ hash tự chế | react-router-dom 6.28.1 | react-router-dom 6.22.0 |
| CSS | ❌ inline style | tailwindcss 3.4.17 + postcss + autoprefixer | tailwindcss + postcss |
| HTTP | ❌ không có | axios 1.7.9 | axios 1.6.7 |
| State | ❌ useState | zustand 5.0.2 (+ persist) | Context/hook thủ công |
| Form | ❌ không có | react-hook-form 7.54.2 + @hookform/resolvers 3.9.1 | thủ công |
| Validation | ❌ không có | zod 3.24.1 | regex thủ công (`constants/regex.js`) |
| Icon | ❌ SVG inline viết tay | lucide-react 0.469.0 | lucide-react 0.330.0 |
| Auth | ❌ form tĩnh | JWT tự quản lý + refresh token | Keycloak (`@react-keycloak/web`) |
| Lint | ❌ | ❌ | eslint + @typescript-eslint |
| Test | ❌ | ❌ | ❌ |

**Kết luận:** `merge-login-logic` là nhánh có nền tảng kỹ thuật tốt nhất → nên chọn làm base khi hợp nhất.

---

## 1.4 Lệnh chạy (giống nhau ở cả 3 nhánh)

```bash
npm install
npm run dev       # Vite dev server → http://localhost:5173
npm run build     # tsc (type-check) && vite build → dist/
npm run preview   # serve bản build
```

Không có test framework. Chất lượng type được đảm bảo duy nhất bởi `tsc` trong bước `build`.
`tsconfig.json` bật `strict: true` nhưng **tắt** `noUnusedLocals` và `noUnusedParameters`.

> ⚠️ Chưa có `npm run lint` và `npm run format` ở nhánh hiện hành. Xem bug **NP-016**.

---

## 1.5 Backend

Backend **không nằm trong repo này**. Giao ước duy nhất được biết:

- Base URL cấu hình qua `VITE_API_URL`, mặc định `http://localhost:8080/api/v1`
- Danh sách endpoint: xem [04-feature-auth.md](04-feature-auth.md) §4.2
- Định dạng token: JWT, response bọc dạng snake_case (`access_token`, `refresh_token`,
  `token_type`, `expires_in`, `user_profile`) — **lệch với phần còn lại của API dùng camelCase**
  (`emailOrUsername`, `isEmailVerified`). Xem bug **NP-013**.

Thế hệ Gen 2 (`backup_main`) dùng **Keycloak** thay vì JWT tự quản lý:
```
VITE_KC_URL=http://localhost:7080
VITE_KC_REALM=novaplay
VITE_KC_CLIENT_ID=novaplay-keycloak
```
Nếu backend thật vẫn là Keycloak thì toàn bộ module auth ở Gen 4 sai hướng — **cần xác nhận với chủ dự án**.

---

## 1.6 Thư mục `project/` — nguồn thiết kế gốc

`project/` là bundle bàn giao từ Claude Design, **không được import vào code production**.

```
project/
  README.md                 ← đặc tả design system đầy đủ (nguồn sự thật thị giác)
  colors_and_type.css       ← toàn bộ CSS token gốc
  preview/*.html            ← 15 trang preview: màu, type, spacing, radii, shadow, motion, badge, button, input, icon, card
  ui_kits/web/*.jsx         ← prototype JSX gốc của Navbar, MovieCard, MovieSlider, MovieRows, MovieDetail, Login, Footer
  assets/, public/          ← favicon + logo (vẫn là placeholder mặc định của CRA, cần thay)
```

Khi cần biết "màu này/khoảng cách này đúng chưa", tra `project/README.md` và
`project/colors_and_type.css` — đã được tóm tắt lại trong [08-design-system.md](08-design-system.md).

---

## 1.7 Trạng thái tổng thể theo tính năng

| Tính năng | Trạng thái thật | Nhánh | Chi tiết |
|---|---|---|---|
| Trang chủ (UI) | ✅ Xong về thị giác, ❌ dữ liệu tĩnh | `main` | [03](03-feature-ui-shell.md) |
| Hero slider | ✅ Xong | `main` | [03](03-feature-ui-shell.md) |
| Top 10 | ✅ Xong | `main` | [03](03-feature-ui-shell.md) |
| Movie row | ⚠️ Xong nhưng bước dịch hardcode | `main` | NP-009 |
| Chi tiết phim (UI) | ⚠️ 2/4 tab rỗng, metadata hardcode | `main` | NP-010, NP-011 |
| Đăng nhập (UI) | ⚠️ Form tĩnh, không submit | `main` | NP-012 |
| Tìm kiếm (navbar) | ❌ Input trang trí | `main` | NP-014 |
| Đăng ký + OTP | ✅ Xong | `mll` | [04](04-feature-auth.md) |
| Đăng nhập (logic) | ✅ Xong | `mll` | [04](04-feature-auth.md) |
| Refresh token | ⚠️ Có race condition | `mll` | NP-002 |
| Quên/đặt lại mật khẩu | ✅ Xong | `mll` | [04](04-feature-auth.md) |
| Đổi mật khẩu | ✅ Xong | `mll` | [04](04-feature-auth.md) |
| Phân quyền role | ✅ Xong | `mll` | [04](04-feature-auth.md) |
| Khám phá phim (lọc/sort) | ⚠️ Code xong, **chưa route** | `mll` | NP-005 |
| Tìm kiếm phim | ⚠️ Code xong, **chưa route** | `mll` | NP-005 |
| Chi tiết phim (logic) | ⚠️ Code xong, **chưa route** | `mll` | NP-005 |
| Xem phim (YouTube) | ⚠️ Code xong, **chưa route** | `mll` | NP-005 |
| Watchlist | ⚠️ Code xong, **chưa route** | `mll` | NP-005 |
| Đặt vé / chọn ghế | ❌ Đã bỏ | `bak` | — |
| Trang cá nhân | ❌ Đã bỏ | `bak` | — |
