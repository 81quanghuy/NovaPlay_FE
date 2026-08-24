# 13 — Plan thực thi chuẩn hóa hệ thống

File này là bản điều phối thực thi dựa trên toàn bộ bộ tài liệu đã scan. Mục tiêu là đưa
NovaPlay FE về **một nhánh, một kiến trúc, một nguồn sự thật**, dễ bảo trì và xử lý các lỗi
đã biết theo đúng mức độ ưu tiên.

---

## 13.1 Kết luận điều phối

### Base triển khai

Chọn `origin/claude/merge-login-logic-1l6po` làm base kỹ thuật.

Lý do:
- Có router thật, auth, axios, zustand, zod, react-hook-form, Tailwind và alias `@/`.
- Có sẵn module movies nhưng chưa route.
- Phù hợp với kiến trúc đích ở [10-target-architecture.md](10-target-architecture.md).

Không nên phát triển tiếp trực tiếp trên `main` vì `main` chỉ có UI đẹp nhưng thiếu router,
auth, API, state và config chuẩn. `main` chỉ dùng làm nguồn port giao diện.

### Nguồn tham chiếu theo nhánh

| Nhu cầu | Nguồn |
|---|---|
| Base app, router, auth, API, store, Tailwind | `origin/claude/merge-login-logic-1l6po` |
| Hero, card phim, row phim, Top 10, navbar, footer, login visual, movie detail visual | `main` |
| Regex, app config cũ, layout wrapper tham khảo | `origin/backup_main` |
| Design token gốc | `project/colors_and_type.css`, `project/README.md` |

---

## 13.2 Cổng quyết định trước khi hợp nhất lớn

Các quyết định này phải được chủ dự án chốt trước khi làm Phase 2 hoặc Phase 3 diện rộng.
Nếu chưa chốt, chỉ làm các task vá lỗi bảo mật độc lập.

| Mã | Quyết định | Giá trị đề xuất | Ảnh hưởng |
|---|---|---|---|
| D-01 | Auth backend là JWT hay Keycloak? | JWT nếu backend hiện tại khớp `mll` | Quyết định giữ hay bỏ module auth Gen 4 |
| D-02 | Refresh token lưu ở đâu? | Tạm giữ `localStorage`, roadmap sang cookie httpOnly | `NP-020`, auth security |
| D-03 | Duyệt phim có cần đăng nhập? | Không | Route guard cho `/movies`, `/movie/:id`, `/search` |
| D-04 | Xem phim có cần đăng nhập? | Có | Route guard cho `/watch/:id` |
| D-05 | Container chuẩn | `1440px` theo design gốc | Token layout, Tailwind config, responsive |
| D-06 | Nguồn ảnh | TMDB tạm thời, có fallback | Mock data, image fallback, CDN sau này |
| D-07 | Logo chính thức | Chưa có, cần cung cấp | `NP-029` |
| D-08 | Có i18n vi/en không? | Chưa làm, giữ tiếng Việt thuần | Copy, route, config |
| D-09 | Quy mô traffic dự kiến | Chưa rõ | Có cần React Query, cache sâu, code splitting sâu |

---

## 13.3 Thứ tự thực thi bắt buộc

### Track A — Vá lỗi chặn release

Làm ngay, không phụ thuộc quyết định sản phẩm.

| Thứ tự | Task | Bug | Kết quả cần có |
|---|---|---|---|
| A1 | T-1.1 | `NP-001` | Không còn backdoor admin hardcode |
| A2 | T-1.2 | `NP-002` | Refresh token không còn race condition |
| A3 | T-2.2 | `NP-021` | Hết phiên thì điều hướng về login rõ ràng |
| A4 | T-2.3 | `NP-027` | Render lỗi không làm trắng trang |

### Track B — Chuẩn hóa nền tảng bảo trì

Làm trước khi port UI hàng loạt.

| Thứ tự | Task | Bug | Kết quả cần có |
|---|---|---|---|
| B1 | T-1.4 | `NP-013`, config debt | Có `src/config/` là nguồn cấu hình duy nhất |
| B2 | T-1.3 | `NP-008`, `NP-025` | Có một nguồn design token duy nhất |
| B3 | T-1.5 | `NP-016` | Có lint, format, typecheck scripts |
| B4 | T-3.2 | `NP-015` | Common UI nằm ở `components/ui`, layout ở `components/layout` |

### Track C — Kích hoạt tính năng đã có

Chỉ bắt đầu sau khi chốt D-03 và D-04.

| Thứ tự | Task | Bug | Kết quả cần có |
|---|---|---|---|
| C1 | T-2.1 | `NP-005`, `NP-023` | Movies module có route thật |
| C2 | T-3.1 | `NP-024`, `NP-007` | Chỉ còn một type `Movie`, một nguồn data |
| C3 | Route cleanup | `NP-006`, `NP-014` | Không còn route state tự chế hoặc link chết |

### Track D — Hợp nhất UI

Làm tuần tự theo component để dễ review và dễ revert.

| Thứ tự | Task | Bug | Component/trang |
|---|---|---|---|
| D1 | T-3.3 | `NP-009`, `NP-014` | `MainLayout`, `Navbar` |
| D2 | T-3.4 | `NP-014`, `NP-007` | `MovieCard` |
| D3 | T-3.5 | `NP-003` | `HeroSlider` |
| D4 | T-3.6 | `NP-003` | `TopTen` |
| D5 | T-3.7 | `NP-009` | `MovieRow` |
| D6 | T-3.8 | `NP-004`, `NP-010`, `NP-011` | `MovieDetailPage` |
| D7 | T-3.9 | `NP-012` | `LoginPage` |
| D8 | T-3.10 | `NP-030`, `NP-014` | `Footer` |
| D9 | T-3.11 | `NP-019` | Responsive toàn app |

### Track E — Dọn nợ cuối

| Thứ tự | Việc | Bug | Kết quả cần có |
|---|---|---|---|
| E1 | Xóa hoặc hợp nhất `tokenUtils.ts` | `NP-022` | Không còn dead code JWT |
| E2 | Code splitting route ít dùng | `NP-028` | Bundle ban đầu nhỏ hơn |
| E3 | Thay favicon/logo | `NP-029` | Không còn placeholder CRA |
| E4 | Audit a11y | `NP-014` | Keyboard/focus/ARIA đạt mức cơ bản |

---

## 13.4 Kế hoạch commit đề xuất

Mỗi dòng dưới đây nên là một commit độc lập.

1. `fix(auth): tắt backdoor admin mặc định`
2. `fix(auth): sửa race condition khi refresh token`
3. `refactor(config): gom cấu hình ứng dụng vào src/config`
4. `style(tokens): chuẩn hóa design token NovaPlay`
5. `chore(tooling): thêm eslint prettier và script kiểm tra`
6. `refactor(ui): chuyển component dùng chung ra khỏi auth feature`
7. `feat(routes): đăng ký route movies và not found page`
8. `fix(auth): điều hướng khi phiên đăng nhập hết hạn`
9. `feat(feedback): thêm error boundary cho app và routes`
10. `refactor(movies): hợp nhất kiểu Movie và dữ liệu mock`
11. `feat(layout): thêm main layout và navbar hợp nhất`
12. `feat(movies): port poster card theo design mới`
13. `feat(movies): port hero slider và sửa vòng đời timer`
14. `feat(movies): port top ten và sửa wheel listener`
15. `feat(movies): hợp nhất movie row responsive`
16. `feat(movies): hợp nhất trang chi tiết phim`
17. `feat(auth): port giao diện đăng nhập`
18. `feat(layout): port footer và dùng năm động`
19. `fix(ui): hoàn thiện responsive toàn bộ màn hình`
20. `chore(cleanup): xóa dead code và audit link tương tác`

---

## 13.5 Definition of Done tổng

Hệ thống chỉ được xem là đã chuẩn hóa xong khi các điều kiện này được chứng minh bằng code
và lệnh kiểm tra.

### Kiến trúc

- [ ] Working tree dùng một base duy nhất, không còn phải chạy song song 2 app.
- [ ] `src/config/` là nơi duy nhất chứa env, feature flag, storage key, app constant, regex,
      nav/footer config.
- [ ] `src/styles/tokens.css` là nơi duy nhất định nghĩa `--np-*`.
- [ ] `features/*` không import chéo nhau.
- [ ] Component dùng chung nằm ở `components/ui` hoặc `components/layout`.
- [ ] Route path được khai báo ở `routes/paths.ts`.
- [ ] API endpoint được khai báo ở `lib/api/endpoints.ts`.

### Tính năng

- [ ] Auth login/register/OTP/forgot/reset/change password vẫn hoạt động.
- [ ] Refresh token chỉ gọi một lần khi nhiều request 401 song song.
- [ ] Hết phiên đăng nhập thì tự về `/login` và có thông báo rõ ràng.
- [ ] Truy cập trực tiếp được `/movies`, `/movie/:id`, `/watch/:id`, `/search`, `/watchlist`.
- [ ] URL sai hiển thị `NotFoundPage`, không redirect im lặng về `/`.
- [ ] Watchlist hoạt động và không lệch key storage.
- [ ] Movie detail dùng metadata thật theo từng phim.
- [ ] Phim lẻ không hiện tab tập phim.
- [ ] Không tab nào render rỗng.

### UI và UX

- [ ] UI chính giữ chất lượng thị giác của nhánh `main`.
- [ ] Không còn nút/link chết; tính năng chưa làm phải disabled hoặc bị loại khỏi UI.
- [ ] Navbar search điều hướng tới `/search?q=...`.
- [ ] Hero slider dọn timer khi unmount, dừng khi hover, reset khi bấm dot.
- [ ] Wheel ngang không gây cảnh báo passive listener.
- [ ] Layout responsive ở mobile, tablet, desktop.
- [ ] Focus bằng bàn phím nhìn thấy được ở mọi control chính.

### Tooling

- [ ] Có `npm run typecheck`.
- [ ] Có `npm run lint`.
- [ ] Có `npm run format`.
- [ ] Không có lỗi lint/typecheck trước khi merge.

---

## 13.6 Lệnh kiểm tra bắt buộc trước khi merge

Theo [12-agent-playbook.md](12-agent-playbook.md), agent không tự chạy build/test nếu task yêu
cầu tuân thủ quy ước cũ; tuy nhiên người review phải chạy các lệnh này trước khi merge.

```bash
npm run typecheck
npm run lint
npm run build
```

Các lệnh audit kiến trúc:

```bash
grep -rn "import.meta.env" src/ | grep -v "src/config/env.ts" | grep -v "vite-env.d.ts"
grep -rniE "#[0-9a-f]{3,8}\b" src/ --include="*.tsx" tailwind.config.js
grep -rn "from '@/features/" src/features/
grep -rn "'/auth/\|'/movies/" src/ | grep -v "endpoints.ts"
grep -rn "to=\"/\|navigate('/" src/ | grep -v "paths.ts"
grep -rn "preventDefault()" src/ --include="*.tsx"
grep -rn "onClick={() => {}}" src/
grep -rn "DEV_BYPASS\|FAKE_ADMIN" src/
grep -rn "'novaplay\." src/ | grep -v "storage-keys.ts"
grep -rn "tokenUtils" src/
```

Kỳ vọng: các lệnh audit trả về rỗng hoặc chỉ trả về file được phép theo quy tắc ở
[10-target-architecture.md](10-target-architecture.md).

---

## 13.7 Rủi ro và cách kiểm soát

| Rủi ro | Cách kiểm soát |
|---|---|
| Port UI làm hỏng logic auth/movies | Giữ `mll` làm base, port từng component một |
| Quyết định auth JWT/Keycloak sai hướng | Chốt D-01 trước khi sửa sâu auth |
| Token design tiếp tục phân mảnh | Hoàn thành B2 trước Track D |
| Route guard đặt sai làm khóa nội dung công khai | Chốt D-03, D-04 trước C1 |
| Refactor quá rộng khó review | Một task một commit, bám DoD trong `11-migration-plan.md` |
| Lỗi chỉ xuất hiện runtime | Thêm ErrorBoundary, loading/error/empty state và test thủ công theo route |

---

## 13.8 Cách giao task cho agent

Prompt mẫu:

```text
Nhận task T-1.2 trong docs/11-migration-plan.md.
Trước khi sửa, đọc docs/09-known-issues.md mục NP-002 và docs/12-agent-playbook.md.
Chỉ sửa các file trong phạm vi task.
Sau khi xong, cập nhật docs liên quan và báo lệnh verify cần chạy.
```

Quy tắc giao việc:
- Một agent chỉ nhận một task `T-*` mỗi lần.
- Nếu task phụ thuộc quyết định trong [13.2](#132-cổng-quyết-định-trước-khi-hợp-nhất-lớn),
  phải chốt quyết định trước.
- Không giao task Track D trước khi Track B đủ ổn định.
- Nếu phát hiện lỗi mới, ghi thêm `NP-031+` vào [09-known-issues.md](09-known-issues.md)
  thay vì sửa lan man ngoài phạm vi.
