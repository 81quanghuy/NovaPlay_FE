# 08 — Design System NovaPlay

Nguồn sự thật gốc: **`project/colors_and_type.css`** (229 dòng, 96 token) và
**`project/README.md`**. Mọi bản chép trong `src/` đều **thiếu** so với bản gốc.

---

## 8.1 🔴 Tình trạng phân mảnh token

| Nguồn | Số dòng | Số token | Thiếu gì |
|---|---|---|---|
| `project/colors_and_type.css` (**GỐC**) | 229 | **96** | — |
| `main:src/index.css` | 73 | 42 | spacing, radii, shadow, text scale, font-weight, line-height, tracking, gradient, poster size, `--np-q-cam` |
| `mll:src/styles/colors_and_type.css` | 67 | 34 | tất cả các mục trên **+ font stack + easing + duration + màu chất lượng** |
| `mll:tailwind.config.js` | 80 | — | Chép tay lại hex; có thêm shadow/radius/fontSize nhưng **không đồng bộ với CSS var** |

Thêm nữa: `--np-container` = **1440px** ở bản gốc, nhưng **1760px** ở `main:index.css`,
còn component `main` thì hardcode `1760` ở 7 chỗ. **Ba giá trị mâu thuẫn.** Xem NP-008.

**Việc cần làm:** chép nguyên `project/colors_and_type.css` → `src/styles/tokens.css`,
xoá 2 bản thiếu, cho Tailwind trỏ vào biến. Task **T-1.3** trong [11-migration-plan.md](11-migration-plan.md).

---

## 8.2 Màu

### Bề mặt (surfaces)
| Token | Giá trị | Dùng cho |
|---|---|---|
| `--np-bg` | `#07090f` | Nền trang, sâu nhất |
| `--np-bg-2` | `#0b0f17` | Vùng dưới navbar, nền hero |
| `--np-surface` | `#11151f` | Card, panel mặc định |
| `--np-surface-2` | `#181d2a` | Nổi lên: modal, hover, input |
| `--np-surface-3` | `#222a3a` | Cao nhất: tooltip, popover |
| `--np-overlay` | `rgba(7,9,15,0.78)` | Scrim đè lên ảnh |
| `--np-overlay-soft` | `rgba(7,9,15,0.40)` | Scrim nhẹ |
| `--np-glass` | `rgba(255,255,255,0.04)` | Chip kính mờ |

### Viền
| Token | Giá trị | Dùng cho |
|---|---|---|
| `--np-border` | `rgba(255,255,255,0.08)` | Mặc định, siêu mảnh |
| `--np-border-strong` | `rgba(255,255,255,0.16)` | Focus, divider quan trọng |
| `--np-border-accent` | `rgba(255,44,85,0.55)` | Ring focus của nút chính |

### Chữ
| Token | Giá trị | Dùng cho |
|---|---|---|
| `--np-fg` | `#ffffff` | Tiêu đề, nhấn mạnh |
| `--np-fg-1` | `#e8ecf3` | Body chính |
| `--np-fg-2` | `#a8b0c0` | Phụ, metadata |
| `--np-fg-3` | `#6b7385` | Mờ, caption |
| `--np-fg-disabled` | `#444a59` | Vô hiệu hoá |

### Thương hiệu & ngữ nghĩa
| Token | Giá trị | Quy tắc dùng |
|---|---|---|
| `--np-primary` | `#ff2c55` | CTA chính, brand mark, badge "hot" |
| `--np-primary-hover` | `#ff4d6f` | Hover |
| `--np-primary-press` | `#e01441` | Nhấn xuống |
| `--np-primary-soft` | `rgba(255,44,85,0.16)` | Nền pill nhạt |
| `--np-gold` | `#ffc83a` | **Chỉ** dùng cho sao rating / premium — **không** dùng cho CTA |
| `--np-cyan` | `#2ad4ff` | **Chỉ** trong UI player: chất lượng, link tải |
| `--np-success` | `#2ecc71` | |
| `--np-warning` | `#ffb020` | |
| `--np-danger` | `#ff4d4f` | |
| `--np-info` | `#5b8def` | |

### Màu chất lượng
| Token | Giá trị | Nhãn |
|---|---|---|
| `--np-q-4k` | `#ff8a00` | 4K (chữ trắng) |
| `--np-q-fhd` | `#2ad4ff` | FHD (chữ `#03222b`) |
| `--np-q-hd` | `#6b7385` | HD (chữ trắng) |
| `--np-q-cam` | `#ff4d4f` | CAM — **có ở bản gốc, thiếu ở cả 2 bản trong `src/`** |

> **Quy tắc màu bất di bất dịch** (từ `project/README.md`):
> 1. Chỉ **một** accent nóng (đỏ `#ff2c55`). Không thêm gradient tím/xanh.
> 2. Vàng luôn đi cùng icon sao rating. Không dùng vàng cho nút.
> 3. Cyan chỉ xuất hiện trong UI player.
> 4. Nền trang là màu đặc, **không** gradient nền, **không** texture/noise.
> 5. Shadow là đen sâu, không dùng colored shadow trừ `--np-shadow-glow`.

---

## 8.3 Typography

| Vai trò | Font | Trọng lượng dùng |
|---|---|---|
| Display (H1/H2, tên phim hero) | **Manrope** | 700 / 800 |
| Body (toàn bộ nội dung tiếng Việt) | **Be Vietnam Pro** | 400 / 500 / 600 |
| Mono (timestamp, mã) | **JetBrains Mono** | 400 / 500 |

> Be Vietnam Pro được chọn vì là font Vietnamese-first, render dấu mũ/ngã đẹp.

**Scale:** `11 / 13 / 15 / 17 / 20 / 24 / 32 / 44 / 60 / 80` px
(`--np-text-xs` → `--np-text-6xl`).

**Font weight:** 400 regular / 500 medium / 600 semibold / 700 bold / 800 extrabold.

**Line height:** `1.05` tight / `1.25` snug / `1.5` normal / `1.7` loose.

**Letter spacing:** `-0.02em` tight (dùng cho display lớn) / `0` / `0.04em` wide /
`0.08em` caps (nhãn viết hoa).

---

## 8.4 Spacing & layout

Base **4px**. Token: `0 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80` px.

| Token | Giá trị bản gốc | Ghi chú |
|---|---|---|
| `--np-container` | **1440px** | ⚠️ `main` đang dùng 1760px — cần chốt lại |
| `--np-nav-h` | 64px | |
| `--np-poster-w` | 200px | |
| `--np-poster-h` | 300px | tỉ lệ 2:3 |

- Padding ngang container: 24px (desktop) / 16px (mobile)
- Hero height: 560–760px tuỳ viewport
- Navbar sticky, translucent, `backdrop-filter: blur(12px)` khi cuộn

---

## 8.5 Bo góc

`4 / 6 / 10 / 14 / **20** / 28 / 999(pill)` px

- **20px** (`--np-radius-xl`) là **chữ ký thị giác** — dùng cho poster, hero, card chính.
- Nút CTA chính bo **pill**; nút phụ bo **10px**.

---

## 8.6 Đổ bóng

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--np-shadow-sm` | `0 1px 2px rgba(0,0,0,.40)` | Nút nhấn, chip |
| `--np-shadow-md` | `0 8px 20px rgba(0,0,0,.45)` | Card nổi |
| `--np-shadow-lg` | `0 24px 48px rgba(0,0,0,.55)` | Modal, popover |
| `--np-shadow-poster` | `0 12px 32px rgba(0,0,0,.55), 0 2px 6px rgba(0,0,0,.40)` | Poster (2 lớp) |
| `--np-shadow-glow` | `0 0 32px rgba(255,44,85,.35)` | Hover nút chính |

---

## 8.7 Chuyển động

| Token | Giá trị |
|---|---|
| `--np-dur-fast` | 120ms |
| `--np-dur-base` | 240ms |
| `--np-dur-slow` | 420ms |
| `--np-ease-out` | `cubic-bezier(.22,.61,.36,1)` — mặc định, cảm giác snappy |
| `--np-ease-in-out` | `cubic-bezier(.65,.05,.36,1)` |
| `--np-ease-spring` | `cubic-bezier(.34,1.56,.64,1)` |

Đặc tả hành vi:
- Hover poster: `scale(1.05)` trong 240ms; giữ 1s → mở mini-preview overlay
  *(mini-preview chưa được implement ở bất kỳ nhánh nào)*
- Slider tự chuyển: **5s**/slide theo đặc tả — ⚠️ code `main` đang để **6500ms**
- Page enter: fade-in 240ms, **không** slide

---

## 8.8 Trạng thái tương tác

| Trạng thái | Xử lý |
|---|---|
| Link hover | `--np-fg-2` → `--np-fg` |
| Card hover | `scale(1.05)` + hiện gradient overlay + nâng z-index |
| Nút chính hover | `--np-primary-hover` + `--np-shadow-glow` |
| Nút chính press | `scale(0.97)` + `--np-primary-press` |
| Icon button hover | nền `rgba(255,255,255,0.06)`, **không** đổi màu icon |

Trong suốt & blur:
- Navbar khi cuộn: `rgba(11,15,23,0.85)` + `blur(12px)`
- Hero text panel ("glass plate"): `rgba(0,0,0,0.6)` + `blur(8px)`
- Modal scrim: `rgba(7,9,15,0.78)`, **không blur** (lý do: hiệu năng)

---

## 8.9 Gradient

| Token | Công dụng |
|---|---|
| `--np-grad-hero-bottom` | Scrim dọc, ảnh hero fade vào nền trang |
| `--np-grad-hero-left` | Scrim ngang, làm nền cho khối chữ bên trái |
| `--np-grad-card-hover` | Overlay đen từ dưới khi hover card |
| `--np-grad-brand` | `linear-gradient(135deg, #ff2c55, #ff6a3d)` — logo, thanh tiêu đề section |
| `--np-grad-gold` | `linear-gradient(135deg, #ffd56b, #ffae00)` |

---

## 8.10 Đặc tả card phim (chuẩn)

Một `PosterCard` NovaPlay đúng chuẩn gồm:
1. Ảnh poster tỉ lệ **2:3**, bo **20px**, **không viền**, `--np-shadow-poster`
2. Badge trái trên: sao vàng + điểm rating, nền đen pill
3. Badge phải trên: thể loại chính, nền đỏ pill *(⚠️ code hiện tại đang để badge **chất lượng** ở đây thay vì thể loại — lệch với đặc tả)*
4. Tiêu đề **dưới** poster (không overlay khi idle), tối đa **2 dòng**, `--np-fw-semibold`
   *(⚠️ code `main` đang clamp **1 dòng**)*
5. Hover: poster zoom + overlay đen từ dưới lên, hiện meta + 2 nút

---

## 8.11 Iconography

- Bộ icon: **`lucide-react`** (lucide.dev)
- Outline-only, stroke **2px**, không fill — **trừ** icon sao rating và icon play khi active
- Kích thước: **16 / 18 / 20 / 24** px
- Màu kế thừa `currentColor`
- ❌ **Không** dùng emoji thay icon. ❌ **Không** dùng unicode dingbats.

Icon thường dùng: `Search` `Menu` `X` `User` `ChevronDown` `Bell` `Check` `Clock`
`Star` `Play` `Info` `Heart` `Bookmark` `Share2` `Volume2` `Maximize` `SkipForward` `Eye`

> ⚠️ Nhánh `main` **không dùng lucide** — mọi icon là `<svg>` với `path d="..."` viết tay
> (Navbar, MovieSlider, MovieCard, MovieRows, LoginScreen). Khi hợp nhất, thay hết bằng
> lucide-react như nhánh `mll` đang làm.

**Brand mark:** logo hiện tại (`public/favicon.ico`, `logo192.png`, `logo512.png`) vẫn là
placeholder mặc định của Create React App. **Cần chủ dự án cung cấp logo chính thức.** Xem NP-029.

---

## 8.12 Content & tone of voice

Ngôn ngữ: **tiếng Việt thuần**. Chỉ giữ tiếng Anh cho tên phim gốc và thuật ngữ thông dụng
(FHD, 4K, IMDb).

- Giọng: **thân thiện, ngắn gọn, năng động** — như host kênh phim, không như báo chí.
  Câu trần thuật, ít dấu cảm thán.
- Xưng hô: **không** xưng "tôi/chúng tôi". Gọi người dùng là **"bạn"**.
- ❌ Không emoji trong UI (chỉ chấp nhận trong nội dung do user tạo, ví dụ bình luận).

### Quy tắc viết hoa
| Loại | Kiểu | Ví dụ |
|---|---|---|
| Tiêu đề section | **Title Case tiếng Việt** | "Phim Mới Cập Nhật", "Sắp Chiếu" |
| Nút | Title Case ngắn | "Xem Phim", "Chi Tiết", "Khám Phá Ngay" |
| Badge thể loại | Title Case | "Hành Động", "Khoa Học Viễn Tưởng" |
| Body / meta | sentence case | "Bạn có 2 bình luận mới" |

### Định dạng số liệu
| Loại | Định dạng | Ví dụ |
|---|---|---|
| Rating | 1 chữ số thập phân, luôn kèm sao vàng | `8.4` |
| Năm | 4 chữ số | `2023` |
| Thời lượng | số + `phút` (không dùng "min") | `141 phút` |
| Chất lượng | VIẾT HOA | `FHD`, `HD`, `4K`, `CAM`, `Vietsub` |

### Microcopy chuẩn (lấy từ codebase)
| Vị trí | Nội dung |
|---|---|
| Menu nav | "Chủ đề" / "Thể loại" / "Phim Lẻ" / "Phim Bộ" / "Quốc gia" / "Diễn Viên" |
| User pill khi chưa đăng nhập | "Thành viên" |
| Link xem thêm | "Xem tất cả" |
| CTA hero | "Xem Phim" / "Chi Tiết" |
| CTA hover card | "Xem ngay" / "Chi tiết" |
| Empty state thông báo | "Không có thông báo nào" |
| Loading | "Đang đăng nhập..." / "Đang khởi động..." |

---

## 8.13 Tài liệu preview có sẵn

`project/preview/` có 15 trang HTML minh hoạ trực quan từng phần của hệ thống —
mở trực tiếp trong trình duyệt khi cần đối chiếu:

```
color-brand.html   color-semantic.html   color-surface.html   color-text.html
type-display.html  type-body.html        type-scale.html
spacing.html       radii.html            shadows.html         motion.html
buttons.html       inputs.html           badges.html
movie-card.html    iconography.html
```

⚠️ `project/` là tài liệu tham chiếu. **Không import bất cứ thứ gì từ `project/` vào `src/`.**
