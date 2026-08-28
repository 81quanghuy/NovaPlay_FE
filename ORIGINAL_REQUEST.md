# Original User Request

## 2026-08-24T17:01:16Z

Thiết kế, xây dựng và tích hợp trọn bộ các màn hình giao diện mới cho NovaPlay FE dựa trên tài liệu đặc tả Backend API (API_DOCUMENTATION.md) và tiêu chuẩn UI/UX điện ảnh cao cấp (Netflix, RoPhim VIP, Disney+, Bilibili).

Working directory: /home/ndqhuy/Project/personal/NovaPlay_FE
Integrity mode: demo

## Requirements

### R1. Trung Tâm Thông Báo (In-App Notification Center & Popover Drawer)
Xây dựng Drawer thông báo và trang `/notifications` phục vụ `notification-service`. Hỗ trợ hiển thị badge số lượng thông báo chưa đọc trên chuông Navbar, lọc theo tab "Tất cả" / "Chưa đọc", đánh dấu đã đọc từng thông báo và đánh dấu đã đọc tất cả, kèm nút điều hướng đến nội dung phim hoặc sự kiện liên quan.

### R2. Trang Gói Cước VIP & Đổi Mã Giảm Giá (VIP Pricing & Coupon Redemption)
Xây dựng trang `/pricing` (hoặc `/vip`) phục vụ `promotion-service` và `user-service`. Cung cấp bảng so sánh trực quan giữa các gói cước (MEMBER Miễn Phí, VIP Standard FHD, VIP 4K Ultra HD) với hiệu ứng kính phát sáng Cyan/Gold. Tích hợp ô nhập mã ưu đãi (validate preview số tiền được giảm theo thời gian thực) và nút xác nhận đổi mã/nâng cấp.

### R3. Trang Kho Phim Cá Nhân (My List / Watchlist & Watch History)
Xây dựng trang `/my-list` phục vụ `user-service` (Favorites & Watch Progress). Gồm 2 tab chuyển đổi: Tab "Danh Sách Yêu Thích" (lưới thẻ phim 3D tương tác) và Tab "Lịch Sử Xem Phim" (phân nhóm theo thời gian kèm thanh tiến độ % thời lượng xem dở), hỗ trợ thao tác xóa từng phim hoặc xóa toàn bộ.

### R4. Trang Hồ Sơ Cá Nhân & Tải Lên Avatar (User Profile & Account Settings)
Xây dựng trang `/profile` phục vụ `user-service` và `media-service`. Hiển thị thông tin người dùng, gói cước hiện tại, cho phép chỉnh sửa thông tin cá nhân (họ tên, số điện thoại, tiểu sử bio) và tải lên ảnh đại diện mới qua Cloudflare R2 presigned URL.

### R5. Cổng Quản Trị Phim Cho Admin (Admin Portal / CMS)
Xây dựng phân hệ quản trị tại `/admin/movies`, `/admin/genres`, `/admin/artists` phục vụ `movie-service` và `media-service`. Cho phép Admin quản lý danh sách phim (mọi trạng thái DRAFT/PUBLISHED), tạo mới/chỉnh sửa phim, cập nhật danh sách tập của series, quản lý danh mục Thể loại và Nghệ sĩ/Diễn viên.

### R6. Tích Hợp Trình Phát Video HLS Đa Độ Phân Giải (Native HLS Player Component)
Xây dựng component trình phát video HLS (`HlsPlayer.tsx`) trên nền tảng `hls.js` cho `WatchPage.tsx`, hỗ trợ chuyển đổi linh hoạt giữa các độ phân giải (Auto, 4K, 1080p, 720p, 480p) và tích hợp các điều khiển rạp chiếu phim chuyên nghiệp.

## Acceptance Criteria

### Verification & Quality Bar
- [ ] Tất cả các route mới (`/notifications`, `/pricing`, `/my-list`, `/profile`, `/admin/movies`, `/admin/genres`, `/admin/artists`) được khai báo đầy đủ trong `routes/paths.ts` và tích hợp vào `AppRouter.tsx`.
- [ ] Giao diện đồng nhất 100% với phong cách Cyber Cyan / Dark Glassmorphism, kế thừa các design token và component chuẩn (`tokens.css`, `bg-surface-2`, `shadow-glow`).
- [ ] Kiểm tra tĩnh `npm run lint` và `npm run typecheck` đạt 100% thành công, 0 lỗi TypeScript, 0 inline style tĩnh JSX và 0 mã hex hardcode trong thư mục `src/`.
- [ ] Mọi component mới đều có giao diện phản hồi mượt mà (responsive trên cả Mobile, Tablet và Desktop) kèm trạng thái Empty state và Loading Skeleton chỉn chu.
