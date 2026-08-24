# TEST_INFRA — NovaPlay FE Comprehensive Test Infrastructure & Strategy

## 1. Test Philosophy

NovaPlay FE employs an **opaque-box, requirement-driven, contract-first test philosophy**:
- **Requirement-Driven**: Every single test case maps directly to authoritative specifications derived from `ORIGINAL_REQUEST.md`, `PROJECT.md`, and `API_DOCUMENTATION.md`.
- **Opaque-Box & Behavior-Oriented**: Tests evaluate observable state transitions, UI contracts, business rules, calculations, error envelopes, and API payloads rather than private implementation details.
- **Progressive Testability & Isolation**: Every test is self-contained, idempotent, cleans up its own state (stores, storages, mocks), and does not depend on execution order.
- **Fail-Fast & Zero False Positives**: Tests assert real domain logic without facade pass-throughs. If any contract breaks, the corresponding test fails with clear diagnostic assertion messages.

---

## 2. Test Architecture & Runner

### 2.1. Test Execution Engine
- **Engine**: Node.js Native Test Engine with `esbuild` on-the-fly bundling and TypeScript resolution (`@/*` alias mapping to `src/*`).
- **Runner**: `tests/runner.mjs` (invoked via `npm test` or `node tests/runner.mjs`).
- **Browser & Environment Polyfills**: Standard DOM mocks (`window`, `document`, `localStorage`, `sessionStorage`, `matchMedia`, `ResizeObserver`, `CustomEvent`, and HLS mocks) provided in `tests/helpers/setup.ts`.
- **Assertion Suite**: Complete `expect()` matcher suite (`toBe`, `toEqual`, `toThrow`, `toContain`, `toHaveLength`, `toMatch`, `toBeGreaterThan`, etc.) with spy/mock tracking (`fn()`, `spyOn()`).

### 2.2. Directory Structure
```
tests/
├── helpers/
│   ├── setup.ts              # Browser environment, DOM polyfills, and global mocks
│   ├── framework.ts          # describe, it, test, expect, fn, spyOn test primitives
│   └── mockData.ts           # Authoritative mock fixtures for movies, users, notifications, coupons
├── tier1-features/           # Tier 1: Feature Coverage (>=5 tests per feature for all 27 features)
│   ├── f01_ui_primitives.test.ts
│   ├── f02_route_navigation.test.ts
│   ├── f03_notification_center.test.ts
│   ├── f04_notification_drawer.test.ts
│   ├── f05_mark_notifications_read.test.ts
│   ├── f06_notification_navigation.test.ts
│   ├── f07_vip_pricing_tiers.test.ts
│   ├── f08_tier_comparison_matrix.test.ts
│   ├── f09_coupon_preview_calc.test.ts
│   ├── f10_coupon_redemption_checkout.test.ts
│   ├── f11_watchlist_grid.test.ts
│   ├── f12_watch_history_timeline.test.ts
│   ├── f13_user_profile_subscription.test.ts
│   ├── f14_edit_profile_info.test.ts
│   ├── f15_cloudflare_r2_avatar_upload.test.ts
│   ├── f16_admin_portal_layout.test.ts
│   ├── f17_admin_movies_catalog.test.ts
│   ├── f18_admin_movie_modal.test.ts
│   ├── f19_admin_series_episodes.test.ts
│   ├── f20_admin_genres_artists.test.ts
│   ├── f21_native_hls_player.test.ts
│   ├── f22_dynamic_resolution_selector.test.ts
│   ├── f23_cinematic_custom_controls.test.ts
│   ├── f24_keyboard_shortcuts_gestures.test.ts
│   ├── f25_watch_progress_autoresume.test.ts
│   ├── f26_watch_page_cinematic.test.ts
│   └── f27_e2e_regression_verification.test.ts
├── tier2-boundary-corner/    # Tier 2: Boundary & Corner Cases
│   ├── boundary_empty_states.test.ts
│   ├── boundary_invalid_inputs.test.ts
│   ├── boundary_max_limits.test.ts
│   ├── boundary_token_expirations.test.ts
│   └── boundary_network_fallbacks.test.ts
├── tier3-cross-feature/      # Tier 3: Cross-Feature Integration Workflows
│   ├── cross_notifications_to_movie.test.ts
│   ├── cross_coupon_to_vip_4k_streaming.test.ts
│   ├── cross_avatar_upload_to_profile.test.ts
│   ├── cross_auth_to_admin_cms.test.ts
│   └── cross_history_to_player_resume.test.ts
├── tier4-real-world-scenarios/ # Tier 4: Real-World User Journeys
│   ├── scenario_user_onboarding_and_browsing.test.ts
│   ├── scenario_vip_upgrade_with_coupon_flow.test.ts
│   ├── scenario_streaming_with_hls_and_history_resume.test.ts
│   ├── scenario_admin_movie_publishing_lifecycle.test.ts
│   └── scenario_session_expiration_and_recovery.test.ts
└── runner.mjs                # Unified Test Runner Harness
```

---

## 3. Feature Inventory Mapping (Tiers 1, 2, 3, 4)

| Feature # | Feature Name | Tier 1 (Unit & Functional) | Tier 2 (Boundaries) | Tier 3 (Cross-Feature) | Tier 4 (Real-World Scenarios) |
|---|---|---|---|---|---|
| **F1** | Shared UI Primitives | Drawer, Modal, Tabs, Badge, Switch, ConfirmDialog, Skeleton, EmptyState | Empty children, missing props, overflow containers | Modal inside drawer, tabs driving view switches | Component interaction during onboarding & settings |
| **F2** | Route & Navigation Wiring | PATHS constants, dynamic URLs, RoleGuard, PublicOnly, router tree | Invalid slugs, non-existent routes, 404/403 catch-all | Route transition triggering auth check & state sync | User navigation flow from Landing -> Login -> Movie -> Watch |
| **F3** | In-App Notification Center | `/notifications` page, tab filtering (All, Unread, System, Movie) | 0 notifications empty state, 1000+ items pagination | Mark as read sync with Navbar bell & unread badge | Browsing new release alerts and opening target movie |
| **F4** | Notification Popover Drawer | Navbar bell trigger, slide-over drawer, top 5 preview, unread counter | Empty drawer, rapidly clicking toggle, long titles | Bell badge decrement when drawer items marked read | Notification alert arriving during video streaming |
| **F5** | Mark Notifications Read | Single item mark read, bulk mark all as read, optimistic store update | Double clicking mark read, 404 notification ID | Notification read sync across tabs and views | Clearing all notifications before account logout |
| **F6** | Notification Navigation | Direct routing to `/movie/:id` or `/pricing`, auto-close drawer on click | Invalid or deleted target movie link | Navigating from promo notification directly to VIP checkout | User journey from notification to instant playback |
| **F7** | VIP Pricing Tiers Display | 3 tiers (Free Member, VIP FHD, VIP 4K), price formatting, glow style | Zero price, currency symbol formatting, missing plan info | Selecting plan passing state to checkout modal | Complete user subscription upgrade journey |
| **F8** | Tier Feature Comparison Matrix | Matrix rows (Resolution, Audio, Screens, Ad-free, Downloads) | Partial matrix configs, missing tier columns | Matrix comparison highlighting current active plan | User evaluating upgrade benefits and choosing VIP 4K |
| **F9** | Coupon Preview & Calculation | Percentage, fixed amount, max discount cap, min order validation | Expired coupon, negative amount, SQL injection strings | Coupon validation updating checkout modal total | Applying discount code `NOVAVIP50` during checkout |
| **F10** | Coupon Redemption & Checkout | Idempotent redemption, order summary, plan activation | Duplicate submit prevention, idempotency key collision | Successful redemption activating 4K streaming permissions | End-to-end checkout with promo code and auto-renewal |
| **F11** | My List / Watchlist Grid | 3D interactive movie cards, genre filters, one-click remove | Empty watchlist state, 100+ bookmarked movies | Add from MovieDetail -> verify on MyList -> remove | Curating personal library and filtering by Action/Sci-Fi |
| **F12** | Watch History Timeline | Timeline grouping (Today, This Week, Earlier), progress bars, resume | Corrupted progress percentage (<0, >100), empty history | Resume button launching player at saved timestamp | Multi-session continuous watching with automatic resume |
| **F13** | User Profile & Subscription Status | User details, active VIP badge, expiry countdown, account stats | Null bio/phone, expired subscription date handling | Profile reflecting newly upgraded VIP tier immediately | Viewing account status, active plan, and playback metrics |
| **F14** | Edit Profile Information | Full name, phone number, bio, Zod validation schema | Invalid VN phone formats, 1000+ char bio overflow | Profile update syncing with navbar user menu avatar & name | User updating personal info and verifying changes |
| **F15** | Cloudflare R2 Presigned Avatar Upload | Presigned PUT URL request, binary PUT to R2, public URL update | File size > 5MB, non-image MIME types, failed R2 upload | New avatar updating profile page and header dropdown | Complete avatar change flow with image upload |
| **F16** | Admin Portal Navigation & Layout | Admin layout, sidebar links, role security (`RoleGuard: ADMIN`) | Non-admin user 403 Forbidden redirect, mobile drawer | Admin accessing CMS without affecting client state | Admin logging in, managing catalog, and logging out |
| **F17** | Admin Movies Catalog Management | Paginated movie table, status badges (Draft/Published), search, delete | 0 search results, rapid page switching, delete confirmation | Status change from Draft to Published showing in catalog | Full movie catalog management and lifecycle auditing |
| **F18** | Admin Movie Create/Edit Modal | Form validation (title, slug, minPlan, genres, cast, poster) | Empty required fields, duplicate slugs, invalid dates | Creating movie -> appearing in public `/movies` list | Admin adding new blockbuster movie with full metadata |
| **F19** | Admin Series Episode Manager | Nested episode list editor (episode #, title, duration, mediaId) | Negative episode numbers, duplicate episode numbers | Series episode list powering WatchPage episode selector | Managing a 16-episode series season from CMS |
| **F20** | Admin Genres & Artists CMS | Genres & Artists CRUD, search, validation, deletion safeguards | Deleting genre with active movies linked (blocked) | Creating artist -> assigning to movie cast in modal | Admin expanding platform taxonomies and talent roster |
| **F21** | Native HLS Player Component | `HlsPlayer.tsx`, `hls.js` initialization, Safari native HLS fallback | Unsupported MSE browser, fatal network errors recovery | Manifest URL loaded with HMAC Playback Token `pt` | Streaming high-bitrate video with auto quality adaptation |
| **F22** | Dynamic Resolution Selector | Ladder levels (Auto ABR, 4K, 1080p, 720p, 480p), manual selection | Rendition switch during buffering, missing resolution ladder | Free tier locked to 720p; VIP tier unlocked for 4K | User switching from Auto to 4K Ultra HD on high-speed fiber |
| **F23** | Cinematic Custom Controls Overlay | Glassmorphic scrubber, volume slider, play HUD, PiP, Fullscreen | Dragging scrubber beyond duration, rapid volume changes | Controls auto-hiding after 3s inactivity; HUD on pause | Immersive movie watching with custom Cyber Cyan controls |
| **F24** | Keyboard Shortcuts & Gestures | Space/K, ArrowLeft/Right (10s), ArrowUp/Down, F, M, 0-9 seek | Keypress when typing in search input (ignored by player) | Shortcuts updating scrubber HUD and audio level smoothly | Power user navigating video playback via keyboard shortcuts |
| **F25** | Watch Progress Sync & Auto-Resume | Throttled progress sync (10s), auto-resume seek, >90% completed | Offline network during sync, resuming at 0s or end of file | Player sync saving to historyStore and backend API | User stopping at 42:15, returning next day, auto-resuming |
| **F26** | WatchPage Cinematic Overhaul | `/watch/:id`, server switcher, episode selector, Lights Off mode | Server 1 down -> auto fallback to Backup Server 2 | Episode selection resetting scrubber and progress sync | Binge-watching multiple episodes with Lights Off OLED mode |
| **F27** | E2E Regression & Adversarial Verification | Full regression suite, concurrency checks, memory leak prevention | Rapid navigation, token expiration race conditions | End-to-end token refresh during 4K streaming playback | Hardened user session maintaining uninterrupted stream |

---

## 4. Running the Test Suite

### 4.1. Commands
```bash
# Run the complete test suite (Tiers 1, 2, 3, 4)
npm test

# Direct runner execution with Node.js
node tests/runner.mjs

# Run specific tier
node tests/runner.mjs --tier=1
node tests/runner.mjs --tier=2
node tests/runner.mjs --tier=3
node tests/runner.mjs --tier=4
```

### 4.2. Output Format
The runner outputs:
- Per-file test pass/fail results with individual test execution durations.
- Colorized tier summaries with test counts.
- Complete final summary (Total Tests, Passed, Failed, Total Time).
- Standard exit code (`0` for all pass, `1` if any test fails).
