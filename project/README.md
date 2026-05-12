# NovaPlay Design System

> Hệ thống thiết kế cho **NovaPlay** — ứng dụng xem phim streaming trực tuyến, giao diện tối (dark theme) lấy cảm hứng từ các nền tảng phim hiện đại như rophim10.org, Netflix.

---

## 🎬 Brand context

**NovaPlay** (codename: *cinema-zone* trong codebase) là website xem phim trực tuyến tiếng Việt, kho phim đa dạng thể loại, hỗ trợ phim lẻ / phim bộ / sắp chiếu. Người dùng có thể duyệt theo thể loại, quốc gia, diễn viên; lưu danh sách yêu thích; xem online với nhiều mức chất lượng (CAM → 4K).

Project hiện tại sử dụng:
- **Stack**: React 18 + TypeScript + Vite + TailwindCSS
- **Auth**: Keycloak (`@react-keycloak/web`)
- **Icons**: `lucide-react`
- **Routing**: `react-router-dom@6`

### Sources
- **Codebase**: `81quanghuy/NovaPlay_FE` (GitHub) — đã đọc qua `github_read_file` cho các file chính (`HomePage`, `MovieDetailPage`, `Navbar`, `MovieSlider`, `MovieGrid`, `Footer`, `LoginForm`, `mockMovies`).
- **Design reference**: rophim10.org — phong cách thẻ phim bo tròn lớn, badge thể loại đỏ ở góc, ngôi sao vàng IMDb-style ở góc trái, hero slider full-bleed có scrim gradient bốn cạnh.
- **Brand assets**: `public/logo192.png`, `public/logo512.png`, `public/favicon.ico` — bản gốc (placeholder PWA của CRA, rất nên thay).

### Products covered
NovaPlay là ứng dụng web đơn lẻ (responsive). UI kit duy nhất nằm trong `ui_kits/web/`, gồm các màn:
- **Home** (trang chủ): hero slider + grid phim mới / sắp chiếu
- **Movie Detail** (chi tiết phim): hero backdrop, metadata, tập, đề xuất
- **Login** (đăng nhập / đăng ký): modal-style với social auth

---

## 📐 Visual foundations

### Bảng màu (palette)

NovaPlay dùng bảng màu **tối cinematic** — nền gần đen có sắc lạnh, một accent đỏ cherry duy nhất, vàng cho rating, cyan cho thông tin player.

| Token | Hex | Vai trò |
|---|---|---|
| `--np-bg` | `#07090f` | Nền trang (sâu nhất) |
| `--np-bg-2` | `#0b0f17` | Vùng dưới navbar / nền hero |
| `--np-surface` | `#11151f` | Card mặc định, panel |
| `--np-surface-2` | `#181d2a` | Modal, hover state |
| `--np-surface-3` | `#222a3a` | Tooltip, dropdown |
| `--np-primary` | `#ff2c55` | CTA chính, brand mark, "hot" badge |
| `--np-gold` | `#ffc83a` | Rating sao, premium |
| `--np-cyan` | `#2ad4ff` | Info, badge FHD/HD |
| `--np-fg-1` | `#e8ecf3` | Body text chính |
| `--np-fg-2` | `#a8b0c0` | Meta, secondary |

**Quy tắc**:
- **Chỉ một accent màu nóng** (đỏ `#ff2c55`) cho hierarchy. Đừng pha thêm bluish-purple gradient.
- **Vàng `#ffc83a` luôn đi cùng ngôi sao rating** — không dùng cho CTA.
- **Cyan** chỉ xuất hiện trong UI player (chất lượng, link tải).

### Typography

- **Display**: `Manrope` 700/800 — cho H1/H2 lớn, tên phim trong hero
- **Body**: `Be Vietnam Pro` 400/500/600 — toàn bộ nội dung tiếng Việt (dấu mũ/ngã đẹp)
- **Mono**: `JetBrains Mono` — timestamps, mã code

> ⚠️ **Substitution flag**: Codebase gốc không khai báo font cụ thể (dùng default sans-serif của browser). Mình chọn **Be Vietnam Pro** vì là font Vietnamese-first, render dấu rất tốt; **Manrope** đi kèm cho display vì có hình thái tròn-hiện-đại hợp phong cách streaming. Nếu bạn muốn brand-specific font khác (ví dụ Inter, SF Pro, Sora) hãy cho mình biết.

Scale: 11 / 13 / 15 / 17 / 20 / 24 / 32 / 44 / 60 / 80 px.
Tracking âm (`-0.02em`) cho display lớn để chữ tight và cinematic hơn.

### Spacing & layout

Base 4 px. Spacing tokens: `1 / 2 / 3 / 4 / 5 / 6 / 8 / 10 / 12 / 16 / 20`.
- Container max-width **1440 px**, padding ngang 24 px (desktop) / 16 px (mobile)
- Navbar cao **64 px**, sticky-translucent với `backdrop-filter: blur(12px)` khi scroll
- Poster ratio **2:3** (200 × 300 px chuẩn), bo tròn `--np-radius-xl` (20 px)
- Hero height **560–760 px** tuỳ viewport

### Backgrounds

- **Page**: solid dark `#07090f` — không gradient nền.
- **Hero**: full-bleed backdrop image + 4 lớp gradient scrim (top, bottom, trái, phải) đổ vào màu nền `#07090f` cho cảm giác imagery "fade vào trang". Đây là motif lặp lại của rophim/Netflix.
- **Card hover**: gradient đen từ dưới lên (`var(--np-grad-card-hover)`) tiết lộ metadata.
- **Không** dùng background patterns, hand-drawn illustrations, hay texture noise.

### Borders

- Mặc định: `1px solid rgba(255,255,255,0.08)` — siêu mảnh, gần như chỉ là phân cách.
- Strong: `rgba(255,255,255,0.16)` — focus state, divider quan trọng.
- Accent: `rgba(255,44,85,0.55)` — ring focus của primary button.

### Shadows

3 cấp + 2 special:
- `--np-shadow-sm` — pressed buttons, chips
- `--np-shadow-md` — cards floating
- `--np-shadow-lg` — modals, popovers
- `--np-shadow-poster` — drop shadow cho poster (multi-layer)
- `--np-shadow-glow` — red glow cho primary button hover

Vì nền tối, shadow màu **đen sâu**, không dùng colored shadow trừ glow.

### Radii

- 4 / 6 / 10 / 14 / **20** (poster) / 28 px + pill (999)
- Poster, hero, card chính dùng **20 px** — đây là chữ ký thị giác của rophim.
- Button bo **pill** cho CTA chính (Xem phim), `radius-md` (10 px) cho secondary.

### Motion

- Duration: 120 / 240 / 420 ms
- Easing: `cubic-bezier(.22,.61,.36,1)` (out) cho hầu hết — feels snappy
- Hover poster: **scale 1.05** trong 240 ms, sau 1 s hold mở mini-preview overlay
- Slider auto-advance: 5 s mỗi slide, transition `transform 300ms ease-out`
- Page enter: fade-in 240 ms (không slide)

### Hover & press states

| State | Treatment |
|---|---|
| Link hover | Đổi từ `--np-fg-2` → `--np-fg` (sáng lên) |
| Card hover | `scale(1.05)` + reveal gradient overlay + z-index lên cao |
| Primary button hover | Đỏ sáng hơn (`--np-primary-hover`) + glow shadow |
| Primary button press | `scale(0.97)` + đỏ đậm hơn (`--np-primary-press`) |
| Icon button hover | Background `rgba(255,255,255,0.06)`, không đổi màu icon |

### Transparency & blur

- Navbar khi scroll: `bg-rgba(11,15,23,0.85)` + `backdrop-filter: blur(12px)`
- Hero text panel: `bg-rgba(0,0,0,0.6)` + `backdrop-filter: blur(8px)` (gọi là "glass plate")
- Modal scrim: `bg-rgba(7,9,15,0.78)` (no blur — performance)

### Cards

Một card phim NovaPlay = poster image, radius 20 px, không border, shadow-poster. Hai badge nổi trên poster (top-left = rating sao vàng nền đen pill; top-right = thể loại chính nền đỏ pill). Title hiển thị **dưới poster** (không overlay khi idle), 2 dòng max, `--np-fw-semibold`. Khi hover, poster zoom + reveal overlay đen từ dưới có meta + 2 nút.

---

## ✍️ Content fundamentals

NovaPlay viết bằng **tiếng Việt thuần**, không trộn tiếng Anh trừ tên phim gốc và thuật ngữ thông dụng (FHD, 4K, IMDb).

### Tone & voice
- **Thân thiện, ngắn gọn, năng động** — như host kênh phim chứ không như báo. Câu trần thuật, ít dấu cảm thán.
- **Ngôi xưng**: không xưng hô "tôi/chúng tôi" trong UI; gọi user là **"bạn"** ở message thông báo và CTA. Ví dụ: *"Bạn có 2 bình luận mới"*, *"Chào mừng bạn quay lại"*.
- **Không emoji** trong UI thường. Chỉ chấp nhận emoji trong nội dung do user tạo (comment).
- **Casing**:
  - Section title: **Title Case** tiếng Việt — *"Phim Mới Cập Nhật"*, *"Phim Sắp Chiếu"*, *"Tất Cả Phim"* (mỗi từ viết hoa chữ đầu — đây là style đặc trưng codebase).
  - Body / meta: sentence case.
  - Button: Title Case ngắn — *"Xem Phim"*, *"Chi Tiết"*, *"Khám Phá Ngay"*.
  - Badge thể loại: Title Case — *"Hành Động"*, *"Khoa Học Viễn Tưởng"*.

### Microcopy examples (lấy từ codebase)
| UI surface | Copy |
|---|---|
| Nav menu | "Chủ đề" / "Thể loại" / "Phim Lẻ" / "Phim Bộ" / "Quốc gia" / "Diễn Viên" |
| User pill (anonymous) | "Thành viên" |
| Section header | "Phim Mới Cập Nhật" |
| Link xem tất cả | "Xem tất cả" |
| Hero CTA | "Xem Phim" / "Chi Tiết" |
| Card hover CTA | "Xem ngay" / "Chi tiết" |
| Empty state | "Không có thông báo nào" |
| Loading | "Đang đăng nhập..." |
| Login form labels | "Email" / "Mật khẩu" / "Đăng nhập" |
| Footer about | "NovaPlay là website xem phim trực tuyến với kho phim đồ sộ, đa dạng thể loại và cập nhật nhanh chóng." |

### Số liệu & ký hiệu
- Rating: 1 chữ số thập phân — `8.4` (luôn cùng icon sao vàng)
- Year: 4 chữ số — `2023`
- Duration: `141 phút` (số + "phút", không "min")
- Quality: ALL CAPS — `FHD`, `HD`, `4K`, `CAM`, `Vietsub`

---

## 🎨 Iconography

### Approach
Codebase dùng **`lucide-react`** ([lucide.dev](https://lucide.dev)) — bộ icon stroke nhẹ, outline-only, weight 2px, corner-rounded. Style này đồng bộ với phong cách "modern streaming" tối giản.

**Quy tắc**:
- **Outline-only**, stroke 2 px, không fill (trừ icon sao rating và icon play khi active)
- Kích thước chuẩn: **16 / 18 / 20 / 24 px**
- Màu kế thừa từ text (currentColor); icon button hover sáng lên đồng bộ với text
- **Không dùng emoji** thay icon
- **Không dùng unicode dingbats**

### Icons commonly used (từ codebase)
`Search` · `Menu` · `X` · `User` · `ChevronDown` · `Bell` · `Check` · `Clock` · `Star` · `Play` · `Info` · `Heart` · `Bookmark` · `Share2` · `Volume2` · `Maximize` · `SkipForward` · `Eye`

### CDN-loaded
UI kit nạp lucide qua CDN script:
```html
<script src="https://unpkg.com/lucide@latest"></script>
```
Sau đó dùng `<i data-lucide="play"></i>` rồi `lucide.createIcons()`.

### Brand mark
Logo NovaPlay (xem `assets/`) hiện là placeholder PWA của CRA — nên thay bằng wordmark + symbol thực tế. Trong UI kit mình mock một wordmark đơn giản: ô vuông đỏ bo + chữ "NovaPlay" Manrope ExtraBold.

> ⚠️ **Substitution flag**: Logo gốc trong project là logo React mặc định (`logo192.png` / `logo512.png`). Mình giữ trong `assets/` để có file vật lý, nhưng UI kit dùng logo SVG mới (vuông đỏ + wordmark). **Cần bạn cung cấp logo NovaPlay chính thức** để thay.

---

## 📂 Index

```
.
├── README.md                  ← bạn đang đọc
├── SKILL.md                   ← khai báo skill (cho Claude Code)
├── colors_and_type.css        ← CSS variables: màu, font, spacing, shadow, motion
├── assets/
│   ├── novaplay-logo-192.png  ← logo gốc (placeholder PWA)
│   ├── novaplay-logo-512.png
│   └── favicon.ico
├── preview/                   ← cards hiển thị trong tab Design System
│   ├── color-primary.html
│   ├── color-surface.html
│   ├── color-semantic.html
│   ├── type-display.html
│   ├── type-body.html
│   ├── type-scale.html
│   ├── spacing.html
│   ├── radii.html
│   ├── shadows.html
│   ├── motion.html
│   ├── badges.html
│   ├── buttons.html
│   ├── inputs.html
│   ├── movie-card.html
│   └── iconography.html
└── ui_kits/
    └── web/
        ├── README.md
        ├── index.html         ← demo click-through (Home → Detail → Login)
        ├── Home.jsx
        ├── MovieDetail.jsx
        ├── Login.jsx
        ├── Navbar.jsx
        ├── Footer.jsx
        ├── MovieCard.jsx
        ├── MovieSlider.jsx
        └── data.js            ← mock movies (rút gọn từ codebase)
```

---

## ⚠️ Caveats

- **Logo placeholder** — file `assets/novaplay-logo-*.png` là logo React mặc định. Cần thay.
- **Font substitution** — Be Vietnam Pro + Manrope là lựa chọn của mình, codebase không khai báo font cụ thể.
- **Không tạo redesign cho**: trang Profile, MovieGridPage, MovieWatchPage (Player), BookingPage — phạm vi user yêu cầu chỉ Home / Movie Detail / Login.
- **Mock data**: dùng poster TMDb URLs giống codebase gốc. Một số URL có thể chết.
