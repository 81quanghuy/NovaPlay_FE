# Project: NovaPlay FE Frontend Expansion

## Architecture

NovaPlay FE is a high-performance, cinematic video streaming web platform built with React 18, TypeScript, Vite, Tailwind CSS, Zustand, and hls.js, adhering to Cyber Cyan and Dark Glassmorphism design principles (inspired by Netflix, RoPhim VIP, Disney+, Bilibili).

```
                      ┌─────────────────────────────────┐
                      │    API Gateway (:8072 / :8080)  │
                      └────────────────┬────────────────┘
                                       │
        ┌───────────────┬──────────────┼──────────────┬───────────────┐
        ▼               ▼              ▼              ▼               ▼
 ┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
 │ auth-service ││ user-service ││movie-service ││streaming-srv ││notif/promo   │
 │   (:8000)    ││   (:8700)    ││   (:8600)    ││   (:8200)    ││(:8900/:8300) │
 └──────────────┘└──────────────┘└──────────────┘└──────────────┘└──────────────┘
                                       ▲
                                       │ (Axios Interceptors / Bearer Tokens / Error Envelopes)
 ┌─────────────────────────────────────┴────────────────────────────────────────┐
 │                              NovaPlay FE Client                              │
 │                                                                              │
 │ ┌──────────────────┐ ┌──────────────────┐ ┌────────────────────────────────┐ │
 │ │  Design System   │ │   Global State   │ │         Router & Guards        │ │
 │ │  (tokens.css,    │ │  (authStore,     │ │ (AppRouter, ProtectedRoute,    │ │
 │ │   UI atoms)      │ │   historyStore,  │ │  RoleGuard, PublicOnly)        │ │
 │ │                  │ │   notifStore)    │ │                                │ │
 │ └──────────────────┘ └──────────────────┘ └────────────────────────────────┘ │
 │ ┌──────────────────────────────────────────────────────────────────────────┐ │
 │ │                             Feature Modules                              │ │
 │ │  - features/notifications: NotificationDrawer, NotificationsPage         │ │
 │ │  - features/pricing: PricingPage, PlanCard, CouponSection                │ │
 │ │  - features/user: ProfilePage, MyListPage (Favorites, History), Avatar   │ │
 │ │  - features/admin: AdminLayout, Movies, Genres, Artists, Episodes CMS    │ │
 │ │  - features/player: HlsPlayer, Controls, Scrubber, Settings, WatchPage   │ │
 │ └──────────────────────────────────────────────────────────────────────────┘ │
 └──────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Inventory

Every feature mapped from API specifications and user requirements is inventoried below and assigned to a milestone.

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Shared UI Primitives | Reusable Drawer, Modal, Tabs, Badge, Skeleton, EmptyState, Switch, ConfirmDialog | M1 | Survey |
| 2 | Route & Navigation Wiring | Register `/notifications`, `/pricing`, `/my-list`, `/profile`, `/admin/*` in `paths.ts` and `routes/index.tsx`, update Navbar & User Menu | M1 | Survey |
| 3 | In-App Notification Center | Full `/notifications` page with tab filtering (All / Unread / System / Movie updates) | M2 | R1 |
| 4 | Notification Popover Drawer | Slide-over drawer opened from Navbar bell with unread badge and quick actions | M2 | R1 |
| 5 | Mark Notifications Read | Single mark as read and bulk "Mark all as read" API integration & real-time sync | M2 | R1 |
| 6 | Notification Navigation | Direct routing to target movie or subscription page on notification item click | M2 | R1 |
| 7 | VIP Pricing Tiers Display | `/pricing` page with 3 tiers (Free Member, VIP Standard FHD, VIP 4K Ultra HD) and Cyber Cyan/Gold glow | M3 | R2 |
| 8 | Tier Feature Comparison Matrix | Detailed feature comparison matrix (resolutions, screens, audio, downloads, ad-free) | M3 | R2 |
| 9 | Coupon Preview & Calculation | Promo code input with instant discount calculation, validation feedback, and savings display | M3 | R2 |
| 10 | Coupon Redemption & Checkout | Idempotent coupon redemption flow, order summary modal, and subscription activation | M3 | R2 |
| 11 | My List / Watchlist Grid | `/my-list` favorites tab with 3D interactive movie cards, genre filters, and one-click remove | M4 | R3 |
| 12 | Watch History Timeline | Watch history tab with timeline grouping (Today, This Week, Earlier), progress bars, resume button, and remove/clear | M4 | R3 |
| 13 | User Profile & Subscription Status | `/profile` page displaying user info, current VIP plan tier, expiry date, and account stats | M4 | R4 |
| 14 | Edit Profile Information | Form for updating full name, phone number, and bio with Zod validation | M4 | R4 |
| 15 | Cloudflare R2 Presigned Avatar Upload | Avatar upload modal requesting presigned URL from backend and executing direct binary PUT to Cloudflare R2 | M4 | R4 |
| 16 | Admin Portal Navigation & Layout | Dedicated `/admin` workspace with sidebar navigation, stats summary, and role security | M5 | R5 |
| 17 | Admin Movies Catalog Management | `/admin/movies` paginated table with status badges (Draft/Published/Archived), search, filters, and CRUD actions | M5 | R5 |
| 18 | Admin Movie Create/Edit Modal | Form with metadata (title, slug, description, release date, minPlan, genres, cast, poster) | M5 | R5 |
| 19 | Admin Series Episode Manager | Nested episode list editor for series (episode number, title, duration, mediaId/URL) | M5 | R5 |
| 20 | Admin Genres & Artists CMS | `/admin/genres` and `/admin/artists` CRUD management with search and validation | M5 | R5 |
| 21 | Native HLS Player Component | `HlsPlayer.tsx` with `hls.js` integration, MSE streaming, and native Safari HLS fallback | M6 | R6 |
| 22 | Dynamic Resolution Selector | Seamless quality ladder switching (Auto ABR, 4K Ultra HD, 1080p FHD, 720p HD, 480p SD) | M6 | R6 |
| 23 | Cinematic Custom Controls Overlay | Cyber Cyan glassmorphic timeline scrubber, volume slider, play/pause HUD, PiP, Fullscreen | M6 | R6 |
| 24 | Keyboard Shortcuts & Gestures | Space/K (play/pause), Arrows (seek/vol), F (fullscreen), M (mute), 0-9 (percent seek) | M6 | R6 |
| 25 | Watch Progress Sync & Auto-Resume | Real-time progress synchronization with backend, auto-resume prompt on return | M6 | R6 |
| 26 | WatchPage Cinematic Overhaul | Upgraded `/watch/:id` page with HlsPlayer, server switcher, episode selector, and Lights Off OLED mode | M6 | R6 |
| 27 | E2E Regression & Adversarial Verification | 100% pass across E2E test suite (Tiers 1-4) + Tier 5 adversarial coverage hardening | M7 | Acceptance |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core UI Atoms & Route Foundation | Reusable UI atoms (`Drawer`, `Modal`, `Tabs`, `Badge`, `Skeleton`, `EmptyState`, `Switch`, `ConfirmDialog`), routing paths in `paths.ts`, route definitions in `routes/index.tsx`, Navbar bell & user menu integration | none | DONE |
| M2 | Notification System & Drawer (R1) | Notification drawer, `/notifications` page, `notificationService.ts`, `notificationStore.ts`, unread count polling/refresh, filter tabs | M1 | IN_PROGRESS |
| M3 | VIP Pricing & Coupon Redemption (R2) | `/pricing` page, plan cards, feature comparison, promo code preview/validate/redeem flow, `pricingService.ts` | M1 | IN_PROGRESS |
| M4 | User Profile, My List & R2 Avatar (R3 + R4) | `/my-list` (Favorites grid, Watch history timeline, progress bars), `/profile` (User details, subscription card, edit form, Cloudflare R2 avatar upload modal), `userService.ts` | M1 | IN_PROGRESS |
| M5 | Admin CMS Portal (R5) | `AdminLayout.tsx`, `/admin/movies` (movie table, create/edit modal, episode manager), `/admin/genres`, `/admin/artists`, `adminService.ts` | M1 | IN_PROGRESS |
| M6 | Native HLS Player & WatchPage (R6) | `hls.js` package install, `HlsPlayer.tsx`, controls, scrubber, settings modal, shortcuts HUD, `streamingService.ts`, `/watch/:id` WatchPage upgrade | M1 | IN_PROGRESS |
| M7 | Final Milestone: Full E2E & Adversarial Hardening | Phase 1: 100% pass on E2E Test Suite (Tiers 1-4); Phase 2: Tier 5 Adversarial Coverage Hardening | M2, M3, M4, M5, M6 | PLANNED |

---

## Interface Contracts

### 1. Reusable UI Atoms Contract (`src/components/ui/`)
- `Drawer`: `{ isOpen: boolean; onClose: () => void; title?: ReactNode; position?: 'right' | 'left'; size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; children: ReactNode }`
- `Modal`: `{ isOpen: boolean; onClose: () => void; title?: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; children: ReactNode }`
- `Tabs`: `{ tabs: TabItem[]; activeTab: string; onChange: (id: string) => void; variant?: 'pills' | 'underline' | 'buttons'; size?: 'sm' | 'md' | 'lg' }`
- `Badge`: `{ variant?: 'primary' | 'gold' | 'cyan' | 'success' | 'warning' | 'danger' | 'surface' | 'ghost'; dot?: boolean; pulse?: boolean; children: ReactNode }`
- `Skeleton`: `{ variant?: 'text' | 'rect' | 'circle' | 'card' | 'poster' | 'avatar' | 'button'; count?: number }`
- `EmptyState`: `{ icon?: LucideIcon; title: string; description?: string; action?: EmptyStateAction; secondaryAction?: EmptyStateAction }`
- `Switch`: `{ checked: boolean; onChange: (checked: boolean) => void; label?: ReactNode; description?: ReactNode; disabled?: boolean }`
- `ConfirmDialog`: `{ isOpen: boolean; title: string; message: ReactNode; onConfirm: () => void; onCancel: () => void; confirmVariant?: 'danger' | 'primary' | 'warning'; loading?: boolean }`

### 2. Notification Service Contract (`src/features/notifications/`)
- `getNotifications(page, size, unreadOnly)` -> `Promise<PageResponse<NotificationDTO>>`
- `getUnreadCount()` -> `Promise<number>`
- `markAsRead(id)` -> `Promise<void>`
- `markAllAsRead()` -> `Promise<void>`

### 3. Pricing & Promotions Service Contract (`src/features/pricing/`)
- `validateCoupon(code, planId, amount)` -> `Promise<CouponValidationResult>`
- `redeemCoupon(code, payload)` -> `Promise<RedemptionResult>`
- `getMyRedemptions(page, size)` -> `Promise<RedemptionHistoryDTO[]>`

### 4. User Profile & Favorites Service Contract (`src/features/user/`)
- `getProfile()` -> `Promise<UserProfileDTO>`
- `updateProfile(data)` -> `Promise<UserProfileDTO>`
- `requestAvatarUpload(fileName, contentType, fileSize)` -> `Promise<{ mediaId: string; uploadUrl: string; publicUrl: string }>`
- `uploadAvatarBinary(uploadUrl: string, file: File)` -> `Promise<void>`
- `getFavorites(page, size)` -> `Promise<PageResponse<MovieSummaryDTO>>`
- `addFavorite(movieId)` -> `Promise<void>`
- `removeFavorite(movieId)` -> `Promise<void>`
- `getWatchProgressList(page, size)` -> `Promise<PageResponse<WatchProgressDTO>>`
- `updateWatchProgress(payload)` -> `Promise<void>`

### 5. Admin CMS Service Contract (`src/features/admin/`)
- `getManageMovies(params)` -> `Promise<PageResponse<AdminMovieDTO>>`
- `createMovie(data)` -> `Promise<AdminMovieDTO>`
- `updateMovie(id, data)` -> `Promise<AdminMovieDTO>`
- `changeMovieStatus(id, status)` -> `Promise<void>`
- `updateSeriesEpisodes(id, episodes)` -> `Promise<void>`
- `deleteMovie(id)` -> `Promise<void>`
- `getGenres()` / `createGenre(data)` / `updateGenre(id, data)` / `deleteGenre(id)`
- `getArtists(params)` / `createArtist(data)` / `updateArtist(id, data)` / `deleteArtist(id)`

### 6. Streaming & Player Service Contract (`src/features/movies/services/streamingService.ts`)
- `getManifest(idOrSlug, episode?)` -> `Promise<StreamingManifestDTO>`
- `recordView(idOrSlug)` -> `Promise<void>`
- `updateProgress(payload)` -> `Promise<void>`

---

## Code Layout & Exclusive Write Boundaries

| Module / Milestone | Exclusive Write Directory / Files |
|--------------------|-----------------------------------|
| Foundation (M1) | `src/components/ui/*`, `src/routes/paths.ts`, `src/routes/index.tsx`, `src/components/layout/Navbar.tsx` |
| Notifications (M2) | `src/features/notifications/*` |
| Pricing & VIP (M3) | `src/features/pricing/*` |
| User Profile & My List (M4) | `src/features/user/*` |
| Admin CMS Portal (M5) | `src/features/admin/*` |
| HLS Player & Streaming (M6) | `src/features/movies/components/player/*`, `src/features/movies/services/streamingService.ts`, `src/features/movies/pages/WatchPage.tsx` |
| E2E Testing Track | `tests/*`, `TEST_INFRA.md`, `TEST_READY.md` |
