# NovaPlay FE — Tài liệu kỹ thuật

> Bộ tài liệu này được sinh ra từ một lần scan toàn bộ repository (cả 3 nhánh: `main`,
> `origin/claude/merge-login-logic-1l6po`, `origin/backup_main`) ngày **2026-08-24**.
> Mục tiêu: để bất kỳ AI agent hoặc developer nào cũng có thể nhận task và thực thi
> mà không cần scan lại từ đầu.

---

## ⚠️ Điều quan trọng nhất cần biết trước khi làm bất cứ việc gì

**Dự án hiện đang bị chẻ làm 3 phiên bản trên 3 nhánh git khác nhau. Không nhánh nào là bản đầy đủ.**

| Nhánh | Có gì | Thiếu gì |
|---|---|---|
| `main` (working tree) | UI đẹp, hoàn chỉnh về thị giác | Không router, không auth, không API, không state |
| `origin/claude/merge-login-logic-1l6po` | Auth đầy đủ + movies + router + tailwind | UI đơn giản, movies chưa được route |
| `origin/backup_main` | Bản CRA cũ: booking, profile, Keycloak | Đã bị bỏ, chỉ dùng để tham khảo |

Nếu bạn nhận task "sửa X" mà không thấy code của X trong working tree, **hãy kiểm tra
nhánh `merge-login-logic` trước khi kết luận là chưa có**. Xem [02-branch-inventory.md](02-branch-inventory.md).

---

## Thứ tự đọc khuyến nghị cho AI agent

### Nếu bạn nhận task sửa bug
1. [09-known-issues.md](09-known-issues.md) — tìm ID bug (NP-001 … NP-018)
2. [02-branch-inventory.md](02-branch-inventory.md) — xác định bug nằm ở nhánh nào
3. File feature tương ứng (03/04/05) để hiểu ngữ cảnh

### Nếu bạn nhận task thêm tính năng
1. [01-project-overview.md](01-project-overview.md)
2. [10-target-architecture.md](10-target-architecture.md) — cấu trúc thư mục phải tuân theo
3. [07-configuration.md](07-configuration.md) — hằng số/env phải đặt ở đâu
4. [08-design-system.md](08-design-system.md) — token màu/font/spacing phải dùng
5. [12-agent-playbook.md](12-agent-playbook.md) — quy tắc bắt buộc + checklist

### Nếu bạn nhận task hợp nhất / refactor
1. [13-execution-plan.md](13-execution-plan.md) — thứ tự thực thi, dependency gate, nhánh base
2. [11-migration-plan.md](11-migration-plan.md) — danh sách task chi tiết theo phase
3. [10-target-architecture.md](10-target-architecture.md)
4. [06-common-and-shared.md](06-common-and-shared.md)

---

## Danh mục tài liệu

| File | Nội dung |
|---|---|
| [01-project-overview.md](01-project-overview.md) | Bối cảnh sản phẩm, 4 thế hệ codebase, stack matrix, lệnh chạy |
| [02-branch-inventory.md](02-branch-inventory.md) | Chi tiết từng nhánh: file tree, LOC, commit history, cái gì nằm ở đâu |
| [03-feature-ui-shell.md](03-feature-ui-shell.md) | Nhánh `main`: từng màn hình, từng component, props, hành vi, phần chưa làm |
| [04-feature-auth.md](04-feature-auth.md) | Module auth: flow, endpoint, type, schema, hook, guard, UI primitives |
| [05-feature-movies.md](05-feature-movies.md) | Module movies: data model, 5 trang, component, watchlist store |
| [06-common-and-shared.md](06-common-and-shared.md) | Thành phần dùng chung, ai dùng gì, cái nào đang đặt sai chỗ |
| [07-configuration.md](07-configuration.md) | **Common setting nằm ở đâu** — env, hằng số, storage key, feature flag |
| [08-design-system.md](08-design-system.md) | Toàn bộ design token: màu, typography, spacing, radii, shadow, motion, tone of voice |
| [09-known-issues.md](09-known-issues.md) | **18 bug/rủi ro** có ID, mức độ, repro, cách fix, tiêu chí nghiệm thu |
| [10-target-architecture.md](10-target-architecture.md) | Cấu trúc thư mục đích + 10 quy tắc bất biến |
| [11-migration-plan.md](11-migration-plan.md) | Kế hoạch hợp nhất chia 6 phase, mỗi task có DoD cho agent |
| [12-agent-playbook.md](12-agent-playbook.md) | Convention code, quy tắc bắt buộc, checklist trước khi báo hoàn thành |
| [13-execution-plan.md](13-execution-plan.md) | Plan điều phối thực thi: thứ tự ưu tiên, quyết định cần chốt, DoD tổng |

---

## Quy ước ký hiệu trong bộ tài liệu

| Ký hiệu | Nghĩa |
|---|---|
| 🔴 | Nghiêm trọng — chặn release, có thể gây lỗ hổng bảo mật hoặc mất dữ liệu |
| 🟠 | Cao — gây lỗi runtime hoặc trải nghiệm hỏng cho user |
| 🟡 | Trung bình — nợ kỹ thuật, dead code, khó bảo trì |
| 🔵 | Thấp — cải thiện chất lượng, không gấp |
| `main:` | Đường dẫn file trên nhánh `main` (có trong working tree) |
| `mll:` | Đường dẫn file trên nhánh `origin/claude/merge-login-logic-1l6po` |
| `bak:` | Đường dẫn file trên nhánh `origin/backup_main` |

Để xem file trên nhánh khác mà không cần checkout:
```bash
git show origin/claude/merge-login-logic-1l6po:src/lib/api/client.ts
```

---

## Cập nhật tài liệu

Khi bạn hoàn thành một task làm thay đổi thực tế mô tả trong docs:
1. Cập nhật file docs tương ứng **trong cùng commit** với code.
2. Nếu fix bug, đánh dấu bug đó trong [09-known-issues.md](09-known-issues.md) thành `✅ ĐÃ FIX (commit <hash>)`.
3. Nếu hoàn thành một task trong [11-migration-plan.md](11-migration-plan.md), tick checkbox.
