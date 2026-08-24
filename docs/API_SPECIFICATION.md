# Tài Liệu Đặc Tả Toàn Diện Hệ Thống API Backend — NovaPlay Platform

> **Phiên bản:** 1.0.0  
> **Kiến trúc:** Microservices (Spring Boot 3.5 / 4.1 + Spring Cloud Gateway + Kafka + MongoDB + PostgreSQL + Redis + Cloudflare R2 / MinIO)  
> **Cổng vào duy nhất (Single Entrypoint):** `API Gateway` tại `http://localhost:8072` (Local Dev) hoặc `http://localhost` (K8s/Tilt)

---

## 📑 Mục Lục
1. [Kiến Trúc Tổng Quan & Luồng Dữ Liệu](#1-kiến-trúc-tổng-quan--luồng-dữ-liệu)
2. [Quy Chuẩn Chung & Định Dạng Envelope](#2-quy-chuẩn-chung--định-dạng-envelope)
3. [Danh Sách Chi Tiết API Theo Từng Service](#3-danh-sách-chi-tiết-api-theo-từng-service)
   - 3.1. [Auth Service (Identity, Token & OTP)](#31-auth-service-port-8000)
   - 3.2. [User Service (Profile, Favorites & Watch Progress)](#32-user-service-port-8700)
   - 3.3. [Movie Service (Catalog, Genres & Artists)](#33-movie-service-port-8600)
   - 3.4. [Streaming Service (HLS, Playback Token & Encryption Key)](#34-streaming-service-port-8200)
   - 3.5. [Media Service (Upload, Multipart & Video Manifests)](#35-media-service-port-8081)
   - 3.6. [Notification Service (In-App & Email Notifications)](#36-notification-service-port-8900)
   - 3.7. [Promotion Service (Coupons & Redemptions)](#37-promotion-service-port-8300)
   - 3.8. [Config Service (Dynamic Flags & System Parameters)](#38-config-service-port-8500)
   - 3.9. [Transcoding Worker (Background Pipeline)](#39-transcoding-worker-port-8400)
4. [Đề Xuất Màn Hình & Tính Năng Frontend Khai Thác Triệt Để Backend](#4-đề-xuất-màn-hình--tính-năng-frontend-khai-thác-triệt-để-backend)

---

## 1. Kiến Trúc Tổng Quan & Luồng Dữ Liệu

### 1.1. Sơ Đồ Cổng Vào (Gateway Routing)
Tất cả các yêu cầu từ Client (Web / Mobile) đều đi qua **API Gateway (Port 8072)**:
```
React Frontend (Vite)
       │ (HTTP Requests)
       ▼
API Gateway (:8072)
  ├── AuthenticationFilter: Kiểm tra JWT Token (RSA Public Key)
  ├── RateLimiter: Giới hạn tần suất gọi (Redis Token Bucket)
  ├── CircuitBreaker: Ngắt mạch khi service con gặp sự cố (Resilience4j)
  └── Đính kèm Header nội bộ: X-User-Email, X-User-Roles, X-Gateway-Auth
       │
       ├── /api/v1/auth/**          ──► auth-service (:8000) [PostgreSQL + Redis + Kafka]
       ├── /api/v1/users/**         ──► user-service (:8700) [MongoDB + Kafka]
       ├── /api/v1/movies/**        ──► movie-service (:8600) [MongoDB + Redis]
       ├── /api/v1/genres/**        ──► movie-service (:8600)
       ├── /api/v1/artists/**       ──► movie-service (:8600)
       ├── /api/v1/streaming/**     ──► streaming-service (:8200) [MongoDB + Redis]
       ├── /api/v1/media/**         ──► media-service (:8081) [MongoDB + Cloudflare R2]
       ├── /api/v1/notifications/** ──► notification-service (:8900) [MongoDB + Redis]
       ├── /api/v1/promotions/**    ──► promotion-service (:8300) [PostgreSQL + Kafka]
       └── /api/v1/config/**        ──► config-service (:8500) [MongoDB]
```

### 1.2. Bảng Ánh Xạ Cổng Service (Local Port Map)
| Service | Port | Công nghệ | Lưu trữ dữ liệu |
|---|---|---|---|
| **api-gateway** | 8072 | Gradle, Java 25, Spring Boot 4.1 | Redis |
| **auth-service** | 8000 | Gradle, Java 25, Spring Boot 4.1 | PostgreSQL (Supabase), Redis, Kafka |
| **user-service** | 8700 | Maven, Java 21, Spring Boot 3.5 | MongoDB (Atlas), Kafka |
| **movie-service** | 8600 | Maven, Java 21, Spring Boot 3.5 | MongoDB (Atlas), Redis |
| **streaming-service** | 8200 | Maven, Java 21, Spring Boot 3.5 | MongoDB (Atlas), Redis, Cloudflare R2 |
| **media-service** | 8081 | Maven, Java 21, Spring Boot 3.5 | MongoDB (Atlas), Kafka, Cloudflare R2 |
| **transcoding-worker**| 8400 | Maven, Java 21, FFmpeg | Kafka, Cloudflare R2 |
| **notification-service**| 8900 | Maven, Java 21, Spring Boot 3.5 | MongoDB (Atlas), Redis, Brevo SMTP |
| **promotion-service** | 8300 | Maven, Java 21, Spring Boot 3.5 | PostgreSQL, Kafka |
| **config-service** | 8500 | Maven, Java 21, Spring Boot 3.5 | MongoDB |

---

## 2. Quy Chuẩn Chung & Định Dạng Envelope

### 2.1. Envelope Phản Hồi Thành Công (`GenericResponse<T>`)
Hầu hết các endpoint REST API (ngoại trừ các endpoint HLS hoặc Feign nội bộ) đều trả về định dạng chuẩn:
```json
{
  "success": true,
  "message": "Thao tác thành công",
  "statusCode": 200,
  "result": { ... },
  "timestamp": "2026-08-24T23:30:00Z"
}
```

### 2.2. Phân Trang (`PageResponse<T>`)
Các endpoint có danh sách trả về cấu trúc:
```json
{
  "content": [ ... ],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8,
  "last": false
}
```

### 2.3. Envelope Phản Hồi Lỗi
```json
{
  "success": false,
  "message": "Tên đăng nhập hoặc mật khẩu không chính xác",
  "statusCode": 400,
  "timestamp": "2026-08-24T23:30:00Z"
}
```

---

## 3. Danh Sách Chi Tiết API Theo Từng Service

---

### 3.1. Auth Service (`/api/v1/auth`) — Port 8000

#### 1. Đăng ký tài khoản (`POST /api/v1/auth/register`)
- **Mô tả**: Đăng ký tài khoản người dùng mới. Hệ thống sẽ tự động sinh OTP kích hoạt và gửi email qua `notification-service`.
- **Yêu cầu đăng nhập**: Không (Công khai).
- **Request Body**:
  ```json
  {
    "username": "hoangminh",
    "email": "minh.hoang@example.com",
    "password": "Password@123",
    "fullName": "Nguyễn Hoàng Minh",
    "locale": "vi"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully. Check your email for OTP.",
    "statusCode": 201,
    "result": {
      "id": "usr_948fbc2e-...",
      "username": "hoangminh",
      "email": "minh.hoang@example.com",
      "fullName": "Nguyễn Hoàng Minh",
      "roles": ["ROLE_USER"],
      "enabled": false
    }
  }
  ```

#### 2. Xác thực OTP kích hoạt tài khoản (`POST /api/v1/auth/verify-otp`)
- **Request Body**:
  ```json
  {
    "email": "minh.hoang@example.com",
    "otp": "839201"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully. Account activated.",
    "statusCode": 200
  }
  ```

#### 3. Gửi lại OTP kích hoạt (`POST /api/v1/auth/resend-registration-otp`)
- **Request Body**:
  ```json
  {
    "email": "minh.hoang@example.com"
  }
  ```

#### 4. Đăng nhập (`POST /api/v1/auth/login`)
- **Request Body**:
  ```json
  {
    "usernameOrEmail": "minh.hoang@example.com",
    "password": "Password@123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "statusCode": 200,
    "result": {
      "accessToken": "eyJhbGciOiJSUzI1NiIs...",
      "refreshToken": "d8e3b4a2-...",
      "tokenType": "Bearer",
      "expiresIn": 86400,
      "user": {
        "id": "usr_948fbc2e-...",
        "username": "hoangminh",
        "email": "minh.hoang@example.com",
        "fullName": "Nguyễn Hoàng Minh",
        "roles": ["ROLE_USER"],
        "plan": "MEMBER"
      }
    }
  }
  ```

#### 5. Làm mới Access Token (`POST /api/v1/auth/refresh-token`)
- **Request Body**:
  ```json
  {
    "refreshToken": "d8e3b4a2-..."
  }
  ```

#### 6. Đăng xuất (`POST /api/v1/auth/logout`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "refreshToken": "d8e3b4a2-..."
  }
  ```
- **Response (204 No Content)**.

#### 7. Yêu cầu đặt lại mật khẩu (`POST /api/v1/auth/forgot-password`)
- **Request Body**:
  ```json
  {
    "email": "minh.hoang@example.com"
  }
  ```

#### 8. Đặt lại mật khẩu với OTP (`POST /api/v1/auth/reset-password`)
- **Request Body**:
  ```json
  {
    "email": "minh.hoang@example.com",
    "otp": "492018",
    "newPassword": "NewPassword@456"
  }
  ```

#### 9. Đổi mật khẩu (`POST /api/v1/auth/change-password`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "currentPassword": "Password@123",
    "newPassword": "NewPassword@456"
  }
  ```

#### 10. Lấy thông tin tài khoản hiện tại (`GET /api/v1/auth/me`)
- **Headers**: `Authorization: Bearer <accessToken>`

---

### 3.2. User Service (`/api/v1/users`) — Port 8700

#### 1. Lấy hồ sơ người dùng (`GET /api/v1/users/me`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "result": {
      "email": "minh.hoang@example.com",
      "fullName": "Nguyễn Hoàng Minh",
      "avatarUrl": "https://pub-r2.novaplay.vn/avatars/user123.jpg",
      "phoneNumber": "0987654321",
      "bio": "Mọt phim Christopher Nolan và Sci-Fi",
      "plan": "PRO",
      "createdAt": "2026-08-01T10:00:00Z"
    }
  }
  ```

#### 2. Cập nhật hồ sơ (`PUT /api/v1/users/me`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "fullName": "Hoàng Minh",
    "phoneNumber": "0987654321",
    "bio": "Yêu thích phim hành động và kinh dị",
    "avatarUrl": "https://pub-r2.novaplay.vn/avatars/new_avatar.jpg"
  }
  ```

#### 3. Yêu cầu tải lên Avatar (`POST /api/v1/users/avatar/request-upload`)
- **Mô tả**: Tạo Presigned PUT URL lên Cloudflare R2 để tải ảnh đại diện trực tiếp từ trình duyệt.
- **Request Body**:
  ```json
  {
    "fileName": "my_avatar.png",
    "contentType": "image/png",
    "fileSize": 204800
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "result": {
      "mediaId": "med_984321",
      "uploadUrl": "https://pub-r2.novaplay.vn/avatars/temp-upload?X-Amz-Signature=...",
      "publicUrl": "https://cdn.novaplay.vn/avatars/med_984321.png"
    }
  }
  ```

#### 4. [ADMIN] Cập nhật gói cước của người dùng (`PATCH /api/v1/users/{email}/plan`)
- **Headers**: `Authorization: Bearer <adminToken>`
- **Request Body**:
  ```json
  {
    "plan": "VIP_4K"
  }
  ```

#### 5. Cập nhật tiến độ xem phim (`PUT /api/v1/users/watch-progress`)
- **Mô tả**: Lưu mốc thời gian xem dở và % tiến độ.
- **Request Body**:
  ```json
  {
    "movieId": "inception-2010",
    "episode": 1,
    "positionSeconds": 3840,
    "durationSeconds": 8880,
    "progressPercent": 43
  }
  ```

#### 6. Lấy danh sách phim đang xem dở (`GET /api/v1/users/watch-progress?page=0&size=20`)
- **Response (200 OK)**: Danh sách phim xếp theo thời gian xem gần nhất (`lastWatchedAt desc`).

#### 7. Lấy vị trí resume cho 1 phim (`GET /api/v1/users/watch-progress/{movieId}`)

#### 8. Thêm phim vào Danh sách Yêu thích (`POST /api/v1/users/favorites`)
- **Request Body**:
  ```json
  {
    "movieId": "interstellar-2014"
  }
  ```

#### 9. Xóa phim khỏi Yêu thích (`DELETE /api/v1/users/favorites/{movieId}`)

#### 10. Lấy danh sách phim yêu thích (`GET /api/v1/users/favorites?page=0&size=20`)

#### 11. Kiểm tra phim có trong Yêu thích (`GET /api/v1/users/favorites/{movieId}/exists`)
- **Response**: `{ "success": true, "result": { "exists": true } }`

#### 12. Xóa toàn bộ danh sách Yêu thích (`DELETE /api/v1/users/favorites`)

---

### 3.3. Movie Service (`/api/v1/movies`, `/api/v1/genres`, `/api/v1/artists`) — Port 8600

#### 1. Duyệt catalog phim đã phát hành (`GET /api/v1/movies`)
- **Query Params**:
  - `page`: số trang (default: `0`)
  - `size`: số lượng item/trang (default: `20`)
  - `sort`: trường sắp xếp (`releaseDate`, `rating`, `title`, `views`)
  - `direction`: `asc` hoặc `desc` (default: `desc`)
  - `genreId`: lọc theo thể loại
  - `series`: `true` (phim bộ), `false` (phim lẻ)
  - `q`: từ khóa tìm kiếm
- **Response (200 OK)**: Trả về `PageResponse<MovieSummaryDTO>`.

#### 2. Chi tiết phim theo ID hoặc Slug (`GET /api/v1/movies/{idOrSlug}`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "result": {
      "id": "mov_inception",
      "slug": "inception-2010",
      "title": "Kẻ Đánh Cắp Giấc Mơ",
      "description": "Dom Cobb là một kẻ trộm bậc thầy...",
      "releaseDate": "2010-07-16",
      "durationInMinutes": 148,
      "posterUrl": "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
      "mediaId": "med_inc_source",
      "series": false,
      "status": "PUBLISHED",
      "minPlan": "MEMBER",
      "genres": [
        { "id": "gen_scifi", "name": "Khoa Học Viễn Tưởng", "slug": "khoa-hoc-vien-tuong" },
        { "id": "gen_action", "name": "Hành Động", "slug": "hanh-dong" }
      ],
      "cast": [
        { "artistId": "art_nolan", "fullName": "Christopher Nolan", "role": "Đạo diễn" },
        { "artistId": "art_leo", "fullName": "Leonardo DiCaprio", "role": "Dom Cobb" }
      ],
      "episodes": []
    }
  }
  ```

#### 3. [ADMIN] Quản lý phim mọi trạng thái (`GET /api/v1/movies/manage`)
- **Query Params**: `status` (`DRAFT`, `PUBLISHED`, `ARCHIVED`), `genreId`, `series`, `q`.

#### 4. [ADMIN] Tạo phim mới (`POST /api/v1/movies`)
- **Request Body**:
  ```json
  {
    "title": "Oppenheimer",
    "description": "Câu chuyện về cha đẻ bom nguyên tử J. Robert Oppenheimer...",
    "releaseDate": "2023-07-21",
    "durationInMinutes": 180,
    "posterUrl": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "mediaId": "med_opp_raw",
    "series": false,
    "minPlan": "MEMBER",
    "genreIds": ["gen_drama", "gen_history"],
    "cast": [
      { "artistId": "art_nolan", "role": "Đạo diễn" },
      { "artistId": "art_cillian", "role": "J. Robert Oppenheimer" }
    ]
  }
  ```

#### 5. [ADMIN] Cập nhật phim (`PUT /api/v1/movies/{id}`)

#### 6. [ADMIN] Đổi trạng thái xuất bản (`PATCH /api/v1/movies/{id}/status`)
- **Request Body**: `{ "status": "PUBLISHED" }`

#### 7. [ADMIN] Cập nhật danh sách tập phim bộ (`PUT /api/v1/movies/{id}/episodes`)
- **Request Body**:
  ```json
  {
    "episodes": [
      { "episodeNumber": 1, "title": "Tập 1: Bắt Đầu", "durationInMinutes": 55, "mediaId": "med_ep1" },
      { "episodeNumber": 2, "title": "Tập 2: Đột Phá", "durationInMinutes": 58, "mediaId": "med_ep2" }
    ]
  }
  ```

#### 8. [ADMIN] Xóa phim (`DELETE /api/v1/movies/{id}`)

#### 9. Quản lý Thể loại Phim (`/api/v1/genres`)
- `GET /api/v1/genres`: Lấy tất cả thể loại.
- `GET /api/v1/genres/{id}`: Chi tiết thể loại.
- `POST /api/v1/genres` [ADMIN]: Tạo thể loại `{ "name": "Kinh Dị" }`.
- `PUT /api/v1/genres/{id}` [ADMIN]: Cập nhật tên thể loại.
- `DELETE /api/v1/genres/{id}` [ADMIN]: Xóa thể loại (nếu không còn phim sử dụng).

#### 10. Quản lý Diễn viên & Đạo diễn (`/api/v1/artists`)
- `GET /api/v1/artists?q=Nolan&page=0&size=20`: Tìm kiếm nghệ sĩ.
- `GET /api/v1/artists/{id}`: Chi tiết nghệ sĩ.
- `POST /api/v1/artists` [ADMIN]: Tạo nghệ sĩ `{ "fullName": "Cillian Murphy", "avatarUrl": "..." }`.
- `PUT /api/v1/artists/{id}` [ADMIN]: Cập nhật nghệ sĩ.
- `DELETE /api/v1/artists/{id}` [ADMIN]: Xóa nghệ sĩ.

---

### 3.4. Streaming Service (`/api/v1/streaming`) — Port 8200

#### 1. Phân giải URL phát video (`GET /api/v1/streaming/{idOrSlug}/manifest`)
- **Mô tả**: Kiểm tra quyền gói cước (Entitlement) -> Tìm Video Manifest -> Sinh short-lived HMAC Playback Token `pt` (4h TTL) -> Trả về Master Playlist URL sẵn sàng cho trình phát VideoJS/Hls.js.
- **Query Params**: `episode` (với phim bộ).
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "result": {
      "manifestUrl": "/api/v1/streaming/hls/vman_9831412/master.m3u8?pt=eyJhbGciOiJIUzI1Ni...",
      "playbackToken": "eyJhbGciOiJIUzI1Ni...",
      "expiresAt": "2026-08-25T03:30:00Z",
      "movie": {
        "id": "mov_inception",
        "title": "Kẻ Đánh Cắp Giấc Mơ",
        "quality": "4K",
        "audioChannels": "5.1"
      }
    }
  }
  ```

#### 2. Ghi nhận lượt xem (`POST /api/v1/streaming/{idOrSlug}/view`)
- **Mô tả**: Tự động dedup lượt xem trùng lặp từ 1 người dùng trong khung giờ ngắn bằng Redis.

#### 3. Cập nhật tiến độ xem (`PUT /api/v1/streaming/{idOrSlug}/progress`)

#### 4. Danh sách phim đang xem dở (`GET /api/v1/streaming/continue-watching`)

#### 5. Phục vụ Master Playlist HLS (`GET /api/v1/streaming/hls/{manifestId}/master.m3u8?pt={token}`)
- **Mô tả**: Trả về file định dạng `application/vnd.apple.mpegurl` chứa danh sách độ phân giải (1080p, 720p, 480p, 4K) kèm khóa giải mã AES-128.

#### 6. Phục vụ Playlist Rendition HLS (`GET /api/v1/streaming/hls/{manifestId}/{label}.m3u8?pt={token}`)
- **Mô tả**: Viết lại các segment thành Presigned GET URL trỏ thẳng Cloudflare R2 để xem video với độ trễ cực thấp.

#### 7. Lấy khóa giải mã AES-128 (`GET /api/v1/streaming/hls/{manifestId}/key?pt={token}`)
- **Mô tả**: Giải mã khóa AES-128 trong bộ nhớ và gửi nhị phân cho player, tuyệt đối không cache để chống tải lậu video.

---

### 3.5. Media Service (`/api/v1/media`) — Port 8081

#### 1. Yêu cầu tải lên đơn tệp (`POST /api/v1/media/upload/request`)
- **Request Body**:
  ```json
  {
    "fileName": "sample_video.mp4",
    "contentType": "video/mp4",
    "fileSize": 104857600
  }
  ```
- **Response**: `{ "mediaId": "med_123", "uploadUrl": "https://...", "publicUrl": "https://..." }`

#### 2. Khởi tạo Multipart Upload Video dung lượng lớn (`POST /api/v1/media/upload/multipart/init`)
- **Request Body**:
  ```json
  {
    "fileName": "movie_4k_raw.mkv",
    "contentType": "video/x-matroska",
    "fileSize": 8589934592
  }
  ```
- **Response**:
  ```json
  {
    "mediaId": "med_raw_884",
    "uploadId": "upload_uuid_39102",
    "partSize": 10485760,
    "totalParts": 820
  }
  ```

#### 3. Lấy Presigned URL cho từng Part (`POST /api/v1/media/upload/multipart/part-url`)
- **Query Params**: `mediaId`, `uploadId`, `partNumber`.

#### 4. Hoàn tất Multipart Upload (`POST /api/v1/media/upload/multipart/complete`)
- **Mô tả**: Sau khi upload xong tất cả part, media-service sẽ bắn Kafka event `video-source-ready.v1` để `transcoding-worker` tiến hành nén HLS và mã hóa AES-128.
- **Request Body**:
  ```json
  {
    "mediaId": "med_raw_884",
    "uploadId": "upload_uuid_39102",
    "parts": [
      { "partNumber": 1, "eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"" }
    ]
  }
  ```

#### 5. Hủy Multipart Upload (`POST /api/v1/media/upload/multipart/abort`)

#### 6. Quản lý Media của người dùng (`GET /api/v1/media/me`, `GET /api/v1/media/{id}`, `DELETE /api/v1/media/{id}`)

#### 7. [ADMIN] Thử lại tác vụ Transcode bị lỗi (`POST /api/v1/media/video-manifests/{id}/retry`)

---

### 3.6. Notification Service (`/api/v1/notifications`) — Port 8900

#### 1. Lấy danh sách thông báo in-app (`GET /api/v1/notifications`)
- **Query Params**:
  - `page`: số trang (default: `0`)
  - `size`: số lượng (default: `20`)
  - `unreadOnly`: `true`/`false` (chỉ lấy thông báo chưa đọc)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "result": {
      "content": [
        {
          "id": "notif_884920",
          "title": "Phim Mới Cập Nhật: Oppenheimer (4K)",
          "content": "Tác phẩm bom tấn của Christopher Nolan đã chính thức có mặt trên NovaPlay.",
          "type": "NEW_MOVIE_RELEASE",
          "targetUrl": "/movies/oppenheimer",
          "read": false,
          "createdAt": "2026-08-24T20:15:00Z"
        },
        {
          "id": "notif_884919",
          "title": "Chào mừng bạn đến với NovaPlay VIP",
          "content": "Bạn vừa mở khóa tính năng xem phim 4K không giới hạn và âm thanh vòm Dolby Atmos.",
          "type": "ACCOUNT_UPGRADED",
          "targetUrl": "/profile",
          "read": true,
          "createdAt": "2026-08-20T14:30:00Z"
        }
      ],
      "totalElements": 2,
      "totalPages": 1
    }
  }
  ```

#### 2. Lấy số lượng thông báo chưa đọc (`GET /api/v1/notifications/unread-count`)
- **Response**: `{ "success": true, "result": { "unreadCount": 1 } }`

#### 3. Đánh dấu 1 thông báo đã đọc (`PATCH /api/v1/notifications/{id}/read`)

#### 4. Đánh dấu toàn bộ thông báo đã đọc (`PATCH /api/v1/notifications/read-all`)

---

### 3.7. Promotion Service (`/api/v1/promotions`) — Port 8300

#### 1. Kiểm tra & Tính thử giá giảm của mã ưu đãi (`GET /api/v1/promotions/coupons/{code}/validate`)
- **Query Params**: `planId` (ví dụ `VIP_PRO`), `amount` (số tiền gốc).
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "result": {
      "code": "NOVAVIP50",
      "discountType": "PERCENTAGE",
      "discountValue": 50,
      "originalAmount": 100000,
      "discountAmount": 50000,
      "finalAmount": 50000,
      "valid": true,
      "message": "Áp dụng thành công giảm giá 50%"
    }
  }
  ```

#### 2. Đổi mã ưu đãi khi thanh toán (`POST /api/v1/promotions/coupons/{code}/redeem`)
- **Request Body**:
  ```json
  {
    "planId": "VIP_PRO",
    "amount": 100000,
    "idempotencyKey": "idem_89410382910"
  }
  ```

#### 3. Lịch sử sử dụng mã ưu đãi của người dùng (`GET /api/v1/promotions/redemptions/me`)

#### 4. [ADMIN] Quản lý Coupon (`POST /api/v1/promotions/coupons`, `PUT`, `DELETE`)

---

### 3.8. Config Service (`/api/v1/config`) — Port 8500

#### 1. Lấy cờ tính năng & tham số động (`GET /api/v1/config/flags/{key}`)
- **Response**:
  ```json
  {
    "key": "ENABLE_4K_STREAMING",
    "value": "true"
  }
  ```

---

### 3.9. Transcoding Worker (Port 8400)
- **Cơ chế**: Worker chạy nền không nhận HTTP công khai từ ngoài, lắng nghe Kafka topic `video-source-ready.v1`.
- **Nhiệm vụ**:
  1. Tải file nguồn thô từ Cloudflare R2 / MinIO.
  2. Dùng `ffmpeg` / `ffprobe` trích xuất các luồng Video Ladder (1080p, 720p, 480p, 4K).
  3. Mã hóa từng file segment `.ts` bằng chuẩn mã hóa bảo mật AES-128.
  4. Đẩy lại các tệp `.m3u8` và `.ts` đã mã hóa lên Cloudflare R2.
  5. Gọi Feign Client tới `media-service` (`PATCH /api/v1/media/video-manifests/{id}/complete`) để kích hoạt phát sóng.

---

## 4. Đề Xuất Màn Hình & Tính Năng Frontend Khai Thác Triệt Để Backend

Dựa trên toàn bộ hệ thống API backend phong phú đã quét được, dưới đây là các màn hình / tính năng frontend được đề xuất xây dựng để tận dụng 100% sức mạnh hệ thống:

| STT | Màn hình / Tính năng đề xuất | Service Backend tương ứng | Giá trị người dùng & Trải nghiệm |
|---|---|---|---|
| 1 | **Trung Tâm Thông Báo (Notifications Popover & Page)** | `notification-service` | Xem thông báo phim mới, quà tặng, cập nhật tài khoản, đánh dấu đã đọc tức thì. |
| 2 | **Trang Nâng Cấp Gói VIP & Nhập Mã Giảm Giá (Pricing & Coupon)** | `promotion-service` + `user-service` | Cho phép người dùng chọn gói MEMBER / VIP_4K, nhập mã ưu đãi `NOVAVIP50` để giảm giá trực tiếp. |
| 3 | **Trang Danh Sách Yêu Thích & Lịch Sử Xem (My List & History)** | `user-service/favorites` + `watch-progress` | Quản lý toàn diện kho phim cá nhân của người dùng, đồng bộ xuyên suốt các thiết bị. |
| 4 | **Trình Phát HLS Trực Tiếp (VideoJS / Hls.js Player Integration)** | `streaming-service/hls` | Thay thế iframe YouTube bằng player HLS mượt mà chuẩn 4K, hỗ trợ đổi độ phân giải và giải mã khóa AES-128. |
| 5 | **Cổng Quản Trị Phim & Upload Video Dành Cho Admin (Admin Portal)** | `movie-service` + `media-service` | Giao diện cho Admin đăng tải phim, cắt tập series, khởi tạo multipart upload tệp dung lượng lớn lên Cloudflare R2. |
